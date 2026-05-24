import json
import boto3
from fastapi import FastAPI, Request, File, UploadFile, Form
import uvicorn
import asyncio
import random
import json
import boto3
from dotenv import load_dotenv
from fastapi import FastAPI, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Load environment variables
load_dotenv()

# PYDANTIC RESPONSE SCHEMAS
class JalurSosialResponse(BaseModel):
    status: str
    rekomendasi_bantuan: List[str]
    justifikasi_dokumen: str


class VisualValidatorResponse(BaseModel):
    is_match: bool
    reasoning: str

# INISIALISASI FASTAPI
app = FastAPI(
    title="Mock AI Server",
    version="3.0",
    description="Server AI Jatim Sosial — Mengintegrasikan AWS Bedrock Gemma-3 dengan fallback otomatis."
)

# ENDPOINT TIM 1 & 3: JALUR SOSIAL (ANALISIS + RAG DENGAN GEMMA 3)
@app.post(
    "/api/ai/jalur-sosial",
    tags=["Tim 1 & 3 - Jalur Sosial"],
    summary="Analisis sosial ekonomi + RAG rekomendasi bantuan",
    response_model=JalurSosialResponse
)
async def mock_jalur_sosial(data_warga: dict = Body(...)):
    nomor_kk = data_warga.get("nomor_kartu_keluarga", "UNKNOWN")
    
    # Ambil kredensial AWS dari environment secara aman (tanpa hardcode string rahasia)
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION", "us-east-1")


    # Jalankan pemanggilan Bedrock secara asinkron di thread pool agar tidak memblokir event loop FastAPI
    loop = asyncio.get_event_loop()
    
    def panggil_bedrock_sosial():
        try:
            client = boto3.client(
                "bedrock-runtime",
                region_name=aws_region,
                aws_access_key_id=aws_access_key,
                aws_secret_access_key=aws_secret_key
            )
            
            prompt_system = (
                "Anda adalah ahli analisis sosial ekonomi dan sistem bantuan sosial pemerintah Provinsi Jawa Timur.\n"
                "Tugas Anda adalah menganalisis data profil keluarga yang diberikan untuk menentukan kelayakan dan jenis bantuan yang tepat sasaran.\n"
                "Tentukan:\n"
                "1. Status tingkat kemiskinan (pilih salah satu dari: 'Sangat Miskin', 'Rentan Miskin', atau 'Mampu').\n"
                "2. Rekomendasi bantuan sosial yang sesuai dari daftar berikut: 'Program Keluarga Harapan (PKH)', 'Bantuan Pangan Non Tunai (BPNT)', 'Bantuan Rutilahu (Rumah Tidak Layak Huni)', atau 'Monitoring dan Advokasi Sosial'.\n"
                "3. Justifikasi/alasan ilmiah terperinci mengapa mereka layak atau tidak layak menerima bantuan tersebut berdasarkan kondisi lantai, dinding, kepemilikan aset motor/kulkas/tv, dll.\n\n"
                "Format respon Anda HARUS berupa JSON valid dengan struktur kunci berikut:\n"
                "{\n"
                '  "status": "Sangat Miskin / Rentan Miskin / Mampu",\n'
                '  "rekomendasi_bantuan": ["Nama Bantuan 1", "Nama Bantuan 2"],\n'
                '  "justifikasi_dokumen": "Tuliskan 2-3 kalimat analisis objektif mengapa bantuan ini direkomendasikan berdasarkan aset dan kondisi tempat tinggal mereka."\n'
                "}\n\n"
                "Kembalikan HANYA objek JSON di atas tanpa tambahan teks pembuka, penutup, atau pembungkus markdown (```json)."
            )

            prompt_user = f"Berikut data profil keluarga untuk kartu keluarga {nomor_kk}:\n{json.dumps(data_warga, indent=2)}"
            
            payload = {
                "messages": [
                    {"role": "system", "content": prompt_system},
                    {"role": "user", "content": prompt_user}
                ],
                "response_format": {
                    "type": "json_object"
                },
                "temperature": 0.3,
                "max_tokens": 1024
            }

            response = client.invoke_model(
                modelId="google.gemma-3-4b-it",
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )

            response_body = json.loads(response.get("body").read())
            teks_jawaban = response_body["choices"][0]["message"]["content"]
            
            # Sanitasi jika AI bandel menyertakan markdown block
            if teks_jawaban.strip().startswith("```"):
                teks_jawaban = teks_jawaban.strip().strip("```json").strip("```").strip()
                
            return json.loads(teks_jawaban)
        except Exception as e:
            print(f"[AWS Bedrock Sosial Error] {e}")
            return None

    # Panggil bedrock
    hasil_ai = await loop.run_in_executor(None, panggil_bedrock_sosial)

    # MEKANISME FALLBACK: Menggunakan logic aturan statis jika AWS Bedrock mati/error
    if hasil_ai is None or not isinstance(hasil_ai, dict):
        print("[Fallback] Mengaktifkan analisis rule-based statis cadangan.")
        await asyncio.sleep(1.0)
        
        luas_lantai = data_warga.get("luas_lantai", 0)
        punya_motor = data_warga.get("aset_bergerak_sepeda_motor", False)
        punya_kulkas = data_warga.get("aset_bergerak_lemari_es", False)
        punya_tv = data_warga.get("aset_bergerak_tv_datar", False)

        rekomendasi = []
        justifikasi = []
        
        # Aturan 1: Sangat miskin
        if not punya_motor and not punya_kulkas and not punya_tv:
            rekomendasi.append("Program Keluarga Harapan (PKH)")
            justifikasi.append("Keluarga terdeteksi sangat miskin - tidak memiliki aset motor, kulkas, atau TV")
        
        # Aturan 2: Rumah dengan luas lantai kecil
        if luas_lantai > 0 and luas_lantai < 20:
            rekomendasi.append("Bantuan Rutilahu (Rumah Tidak Layak Huni)")
            justifikasi.append(f"Luas lantai hanya {luas_lantai} m² (< 20 m²) - tidak memenuhi standar layak huni")
        
        # Aturan 3: Rentan miskin
        if (punya_motor or punya_kulkas) and not punya_tv:
            rekomendasi.append("Bantuan Pangan Non Tunai (BPNT)")
            justifikasi.append("Keluarga tergolong rentan miskin - diberikan dukungan pangan")
        
        if not rekomendasi:
            rekomendasi = ["Monitoring dan Advokasi Sosial"]
            justifikasi.append("Keluarga tergolong mampu secara kepemilikan aset - diberikan monitoring berkala")

        alasan_lengkap = " | ".join(justifikasi) if justifikasi else "Analisis sosial ekonomi selesai"
        
        return {
            "status": "success",
            "rekomendasi_bantuan": rekomendasi,
            "justifikasi_dokumen": f"KK: {nomor_kk} → {alasan_lengkap} (Menggunakan Analisis Cadangan)"
        }

    # Kembalikan respon dari AI sesungguhnya
    return {
        "status": hasil_ai.get("status", "success"),
        "rekomendasi_bantuan": hasil_ai.get("rekomendasi_bantuan", ["Monitoring Sosial"]),
        "justifikasi_dokumen": f"KK: {nomor_kk} → {hasil_ai.get('justifikasi_dokumen', 'Analisis AI selesai.')}"
    }


# ENDPOINT TIM 2: VISUAL VALIDATOR (VALIDASI FOTO DENGAN GEMMA 3)
@app.post(
    "/api/ai/visual-validator",
    tags=["Tim 2 - Visual Validator"],
    summary="Validasi kesesuaian foto rumah dengan data sosial ekonomi",
    response_model=VisualValidatorResponse
)
async def mock_visual_validator(payload: dict = Body(...)):
    image_url = payload.get("image_url", "")
    konteks = payload.get("konteks_rumah", {})
    
    jenis_lantai = konteks.get("jenis_lantai_terluas", "unknown")
    jenis_dinding = konteks.get("jenis_dinding_terluas", "unknown")
    jenis_atap = konteks.get("jenis_atap_terluas", "unknown")

    # Ambil random kecocokan (75% True, 25% False) untuk simulasi
    is_match = random.choice([True, True, True, False])

    # Kredensial AWS Bedrock secara aman dari environment
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    aws_region = os.getenv("AWS_REGION", "us-east-1")


    loop = asyncio.get_event_loop()

    def panggil_bedrock_visual():
        try:
            client = boto3.client(
                "bedrock-runtime",
                region_name=aws_region,
                aws_access_key_id=aws_access_key,
                aws_secret_access_key=aws_secret_key
            )
            
            prompt_system = (
                "Anda adalah AI asisten validator foto rumah untuk program bantuan sosial Provinsi Jawa Timur.\n"
                "Tugas Anda adalah menulis teks pertanggungjawaban/justifikasi validasi visual yang terdengar sangat analitis dan meyakinkan.\n\n"
                f"Tingkat kesesuaian foto yang ditentukan oleh sistem: {'COCOK / SESUAI' if is_match else 'TIDAK COCOK / ADA INKONSISTENSI'}.\n"
                f"Data Profil Rumah Warga:\n"
                f"- Lantai: {jenis_lantai}\n"
                f"- Dinding: {jenis_dinding}\n"
                f"- Atap: {jenis_atap}\n\n"
                "Tuliskan 1 paragraf pendek (2-3 kalimat saja) yang menjustifikasi status kesesuaian visual tersebut dengan membandingkan profil material di atas. "
                "Gunakan bahasa Indonesia yang profesional, tegas, dan ilmiah seolah Anda menganalisis citra visual foto secara mendalam."
            )

            payload = {
                "messages": [
                    {"role": "user", "content": prompt_system}
                ],
                "temperature": 0.7,
                "max_tokens": 256
            }

            response = client.invoke_model(
                modelId="google.gemma-3-4b-it",
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )

            response_body = json.loads(response.get("body").read())
            teks_jawaban = response_body["choices"][0]["message"]["content"]
            return teks_jawaban.strip()
        except Exception as e:
            print(f"[AWS Bedrock Visual Error] {e}")
            return None

    # Jalankan pemanggilan Bedrock secara asinkron
    alasan_dinamis = await loop.run_in_executor(None, panggil_bedrock_visual)

    # MEKANISME FALLBACK: Gunakan text rule-based jika Bedrock gagal
    if not alasan_dinamis:
        await asyncio.sleep(1.0)
        if is_match:
            alasan_dinamis = (
                f"Foto SESUAI dengan data profil. "
                f"Kondisi visual rumah konsisten: lantai={jenis_lantai}, "
                f"dinding={jenis_dinding}, atap={jenis_atap}. "
                f"Status: TERVERIFIKASI"
            )
        else:
            alasan_dinamis = (
                f"Foto TIDAK SESUAI dengan data profil. "
                f"Terdapat inkonsistensi antara foto dan data sosial ekonomi yang tercatat. "
                f"Rekomendasi: Perlu verifikasi ulang lapangan."
            )

    return {
        "is_match": is_match,
        "reasoning": alasan_dinamis
    }


# HEALTH CHECK
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "Mock AI Server is running and Bedrock integrated..."}


if __name__ == "__main__":
    print("Menjalankan Server AI Jatim Sosial di Port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)