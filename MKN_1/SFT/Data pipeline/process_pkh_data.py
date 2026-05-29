import pandas as pd
import json
import os
import re

# ══════════════════════════════════════════════════════════════════════════════
#  user_respon — Konfigurasi mapping & nilai input
#  Ubah nilai di sini sesuai kebutuhan; tidak perlu menyentuh logika lain.
# ══════════════════════════════════════════════════════════════════════════════

user_respon = {

    # ── Identitas ─────────────────────────────────────────────────────────────
    "nik":                          "",   # Nomor Induk Kependudukan (string)
    "nama":                         "",   # Nama lengkap warga

    # ── Demografi ─────────────────────────────────────────────────────────────
    "umur":                         None, # Usia dalam tahun (integer)

    "hub_kepala": {
        1: "Kepala keluarga",
        2: "Istri/suami",
        3: "Anak",
        4: "Menantu",
        5: "Cucu",
        6: "Orangtua/mertua",
        7: "Pembantu/sopir",
    },
    "hub_kepala_default":           "Lainnya",

    "status_perkawinan": {
        1: "Belum kawin",
        2: "Kawin",
        3: "Cerai hidup",
        4: "Cerai mati",
    },
    "status_perkawinan_default":    "Tidak diketahui",

    # ── Ekonomi ───────────────────────────────────────────────────────────────
    "desil_nasional":               None, # 1–10 (integer)
    "jumlah_anggota_keluarga":      None, # Jumlah orang dalam KK (integer)

    # ── Hunian ────────────────────────────────────────────────────────────────
    "id_status_penguasaan_bangunan": {
        1: "Milik sendiri",
        2: "Kontrak/sewa",
        3: "Bebas sewa",
        4: "Dinas",
    },
    "id_status_penguasaan_bangunan_default": "Lainnya",

    "luas_lantai_bangunan":         None, # Luas dalam m2 (float)

    # ── Gizi & Kesehatan ──────────────────────────────────────────────────────
    "id_kondisi_gizi": {
        1: "Kurang Gizi(Wasting)",
        2: "Kerdil(Stunting)",
        3: "Tidak ada catatan",
        8: "Tidak diketahui",
    },
    "id_kondisi_gizi_default":      "Tidak diketahui",

    "id_penyakit_menahun": {
        1:  "Tidak ada",
        2:  "Hipertensi (darah tinggi)",
        3:  "Rematik",
        4:  "Asma",
        5:  "Masalah jantung",
        6:  "Diabetes (kencing manis)",
        7:  "Tuberkulosis (TBC)",
        8:  "Stroke",
        9:  "Kanker atau tumor ganas",
        10: "Gagal ginjal",
        11: "Heamophilia",
        12: "HIV/AIDS",
        13: "Kolesterol tinggi",
        14: "Sirosis hati",
        15: "Thalasemia",
        16: "Leukimia",
        17: "Alzheimer",
    },
    "id_penyakit_menahun_default":  "Tidak diketahui",

    # ── Hambatan Fungsi / Disabilitas ─────────────────────────────────────────
    "hambatan": {
        1: "Ya, sama sekali tidak bisa",
        2: "Ya, banyak kesulitan dan membutuhkan bantuan",
        3: "Ya, sedikit kesulitan, tapi tidak membutuhkan bantuan",
    },
    "hambatan_default":             "Tidak mengalami kesulitan",

    # Kolom hambatan — nilai diisi saat runtime dari CSV (None = ambil dari row)
    "id_penglihatan":                   None,
    "id_pendengaran":                   None,
    "id_berjalan_atau_naik_tangga":     None,
    "id_menggunakan_tangan_jari":       None,
    "id_belajar_kemampuan_intelektual": None,
    "id_pengendalian_perilaku":         None,
    "id_berbicara_komunikasi":          None,
    "id_mengurus_diri":                 None,
    "id_mengingat_berkonsentrasi":      None,
    "id_kesedihan_depresi":             None,

    # ── Usaha / Ekonomi Produktif ─────────────────────────────────────────────
    "id_kepemilikan_izin_usaha": {
        # isi sesuai kode referensi yang dipakai
    },
    "id_kepemilikan_izin_usaha_default": "Tidak diketahui",

    "jumlah_jenis_usaha":           None,

    "id_omset_usaha_utama": {
        1: "< 5 juta (ultra mikro)",
        2: "5 juta -< 15 juta (ultra mikro)",
        3: "15 juta -< 25 juta (ultra mikro)",
        4: "25 juta -< 167 juta (mikro)",
        5: "167 juta -< 1.250 juta (kecil)",
        6: "1.250 -< 4.167 juta (menengah)",
        7: ">= 4.167 juta (besar)",
    },
    "id_omset_usaha_utama_default": "Tidak diketahui",

    # ── Status DTSEN & Lokasi ─────────────────────────────────────────────────
    # Nilai string langsung dari CSV: "DTSEN AKTIF", "DTSEN AKTIF - ASESMEN MENINGGAL", "DTSEN NONAKTIF"
    "status_dtsen":                 None,
    "provinsi":                     "Jawa Timur",  # nilai tetap, tidak diambil dari CSV
    "kabupaten_kota":               "",
    "kecamatan":                    "",
    "kelurahan_desa":               "",

    # ── Skor & Eligibilitas ───────────────────────────────────────────────────
    "skor_pkh_plus":                None,
    "skor_aspd":                    None,
    "eligible_aspd":                None,
    "eligible_pkh_plus":            None,
}

# ── Ekstrak mapping dari user_respon ke variabel yang dipakai logika ──────────
MAP_HUB_KEPALA              = user_respon["hub_kepala"]
MAP_HUB_KEPALA_DEFAULT      = user_respon["hub_kepala_default"]

MAP_STATUS_PERKAWINAN       = user_respon["status_perkawinan"]
MAP_STATUS_PERKAWINAN_DEFAULT = user_respon["status_perkawinan_default"]

MAP_PENGUASAAN_BANGUNAN     = user_respon["id_status_penguasaan_bangunan"]
MAP_PENGUASAAN_BANGUNAN_DEFAULT = user_respon["id_status_penguasaan_bangunan_default"]

MAP_KONDISI_GIZI            = user_respon["id_kondisi_gizi"]
MAP_KONDISI_GIZI_DEFAULT    = user_respon["id_kondisi_gizi_default"]

MAP_HAMBATAN                = user_respon["hambatan"]
MAP_HAMBATAN_DEFAULT        = user_respon["hambatan_default"]

MAP_PENYAKIT_MENAHUN        = user_respon["id_penyakit_menahun"]
MAP_PENYAKIT_MENAHUN_DEFAULT = user_respon["id_penyakit_menahun_default"]

MAP_KEPEMILIKAN_IZIN_USAHA  = user_respon["id_kepemilikan_izin_usaha"]
MAP_KEPEMILIKAN_IZIN_USAHA_DEFAULT = user_respon["id_kepemilikan_izin_usaha_default"]

MAP_OMSET_USAHA             = user_respon["id_omset_usaha_utama"]
MAP_OMSET_USAHA_DEFAULT     = user_respon["id_omset_usaha_utama_default"]

HAMBATAN_BERAT  = {"Ya, sama sekali tidak bisa", "Ya, banyak kesulitan dan membutuhkan bantuan"}
HAMBATAN_SEDANG = {"Ya, sedikit kesulitan, tapi tidak membutuhkan bantuan"}
GIZI_BERMASALAH = {"Kurang Gizi(Wasting)", "Kerdil(Stunting)"}
PENYAKIT_TIDAK_ADA = {"Tidak ada", "Tidak diketahui"}


# ══════════════════════════════════════════════════════════════════════════════
#  HELPER DECODE
# ══════════════════════════════════════════════════════════════════════════════

def decode(mapping: dict, default: str, val) -> str:
    try:
        key = int(val)
    except (ValueError, TypeError):
        return default
    return mapping.get(key, default)


def hambatan_level(val) -> int:
    """Kembalikan level hambatan 1–5, atau 0 jika tidak diketahui."""
    try:
        v = int(val)
        return v if 1 <= v <= 5 else 0
    except (ValueError, TypeError):
        return 0


# ══════════════════════════════════════════════════════════════════════════════
#  REASONING BUILDER
# ══════════════════════════════════════════════════════════════════════════════

def build_reasoning(row_decoded: dict, eligible_pkh: int, eligible_aspd: int) -> dict:
    """
    Menghasilkan dict reasoning terstruktur per dimensi untuk kedua program.
    row_decoded: semua kolom sudah dalam bentuk nilai yang sudah di-decode/hitung.
    """
    r = row_decoded  # shorthand

    parts = {}

    # ── 1. Profil & Demografi ────────────────────────────────────────────────
    demo = []
    umur = r["umur"]
    if umur < 18:
        demo.append(
            f"Warga berusia {umur} tahun termasuk kelompok anak/remaja, belum mandiri secara ekonomi "
            f"dan rentan terhadap deprivasi gizi serta putus sekolah."
        )
    elif umur <= 30:
        demo.append(
            f"Usia {umur} tahun adalah usia produktif muda. Pada desil ekonomi rendah, "
            f"kelompok ini rawan pengangguran dan kemiskinan struktural."
        )
    elif umur <= 59:
        demo.append(
            f"Usia {umur} tahun merupakan usia produktif utama yang menentukan "
            f"ketahanan ekonomi rumah tangga jangka panjang."
        )
    else:
        demo.append(
            f"Warga berusia {umur} tahun masuk kategori lansia, umumnya tidak lagi produktif "
            f"secara ekonomi dan memiliki kerentanan kesehatan tinggi."
        )

    hub = r["hub_kepala"]
    if hub in ("Kepala keluarga", "Istri/suami"):
        demo.append(
            f"Posisi sebagai '{hub}' menunjukkan peran sentral; kondisi ekonominya "
            f"berdampak langsung pada seluruh anggota keluarga."
        )
    elif hub == "Orangtua/mertua":
        demo.append(
            "Sebagai orangtua/mertua, warga kemungkinan besar adalah lansia yang "
            "bergantung pada anggota keluarga lain dan menambah beban tanggungan."
        )

    nikah = r["status_perkawinan"]
    if nikah in ("Cerai hidup", "Cerai mati"):
        demo.append(
            f"Status perkawinan '{nikah}' meningkatkan risiko single-parent atau "
            f"kehilangan pencari nafkah, yang memperburuk kondisi ekonomi rumah tangga."
        )

    jml = r["jumlah_anggota_keluarga"]
    if jml >= 5:
        demo.append(
            f"Jumlah anggota keluarga {jml} orang tergolong besar, meningkatkan "
            f"beban tanggungan dan tekanan pengeluaran rumah tangga."
        )

    parts["demografi"] = " ".join(demo)

    # ── 2. Ekonomi ──────────────────────────────────────────────────────────
    eco = []
    desil = r["desil_nasional"]
    if desil <= 2:
        eco.append(
            f"Desil nasional {desil} menempatkan warga pada 20% termiskin Indonesia — "
            f"masuk kategori miskin ekstrem dan menjadi target utama program sosial."
        )
    elif desil <= 4:
        eco.append(
            f"Desil {desil} menunjukkan posisi kuartil bawah kedua — rentan miskin "
            f"dengan risiko jatuh ke kemiskinan saat terjadi guncangan ekonomi."
        )
    elif desil <= 6:
        eco.append(
            f"Desil {desil} berada di kisaran menengah-bawah, belum sepenuhnya sejahtera."
        )
    else:
        eco.append(
            f"Desil {desil} mengindikasikan kondisi ekonomi relatif lebih baik "
            f"dibanding kelompok rentan."
        )

    parts["ekonomi"] = " ".join(eco)

    # ── 3. Infrastruktur & Hunian ────────────────────────────────────────────
    infra = []
    penguasaan = r["penguasaan_bangunan"]
    if penguasaan == "Kontrak/sewa":
        infra.append(
            "Status hunian kontrak/sewa mencerminkan ketidakstabilan tempat tinggal "
            "dan beban pengeluaran tambahan."
        )
    elif penguasaan in ("Bebas sewa", "Dinas"):
        infra.append(
            f"Hunian '{penguasaan}' bersifat non-permanen dari sisi kepemilikan, "
            f"mengindikasikan ketergantungan pada pihak lain."
        )

    luas = r["luas_lantai_bangunan"]
    if luas < 20:
        infra.append(
            f"Luas bangunan {luas} m2 sangat sempit, mengindikasikan kepadatan huni "
            f"tinggi yang berdampak pada sanitasi dan kualitas hidup."
        )
    elif luas < 36:
        infra.append(
            f"Luas {luas} m2 masih di bawah standar hunian layak (36 m2 untuk keluarga inti)."
        )
    else:
        infra.append(
            f"Luas {luas} m2 sudah memenuhi standar minimum hunian layak."
        )

    parts["infrastruktur_hunian"] = " ".join(infra)

    # ── 4. Kesehatan & Gizi ──────────────────────────────────────────────────
    kes = []
    gizi = r["kondisi_gizi"]
    penyakit = r["penyakit_menahun"]
    ada_penyakit = penyakit not in PENYAKIT_TIDAK_ADA

    if gizi in GIZI_BERMASALAH:
        kes.append(
            f"Kondisi gizi '{gizi}' merupakan indikator deprivasi pangan yang serius "
            f"dan berkorelasi kuat dengan kemiskinan multidimensi."
        )

    if ada_penyakit:
        kes.append(
            f"Warga tercatat menderita penyakit menahun: {penyakit}. "
            f"Kondisi ini meningkatkan beban pengeluaran kesehatan rumah tangga "
            f"secara signifikan dan mengurangi kapasitas ekonomi produktif."
        )

    parts["kesehatan_gizi"] = " ".join(kes) if kes else "Tidak ditemukan indikator kesehatan yang signifikan."

    # ── 5. Disabilitas & Fungsi ──────────────────────────────────────────────
    dis_fields = {
        "penglihatan":                   r["penglihatan"],
        "pendengaran":                   r["pendengaran"],
        "berjalan/naik tangga":          r["berjalan_naik_tangga"],
        "menggunakan tangan/jari":       r["menggunakan_tangan_jari"],
        "belajar/kemampuan intelektual": r["belajar_intelektual"],
        "pengendalian perilaku":         r["pengendalian_perilaku"],
        "berbicara/komunikasi":          r["berbicara_komunikasi"],
        "mengurus diri":                 r["mengurus_diri"],
        "mengingat/berkonsentrasi":      r["mengingat_berkonsentrasi"],
        "kesedihan/depresi":             r["kesedihan_depresi"],
    }

    hambatan_berat  = [k for k, v in dis_fields.items() if v in HAMBATAN_BERAT]
    hambatan_sedang = [k for k, v in dis_fields.items() if v in HAMBATAN_SEDANG]

    dis_parts = []
    if hambatan_berat:
        dis_parts.append(
            f"Terdapat {len(hambatan_berat)} dimensi fungsi dengan hambatan berat/tidak bisa: "
            f"{', '.join(hambatan_berat)}. Kondisi ini secara substantif mengurangi kemampuan "
            f"warga untuk bekerja dan mandiri secara ekonomi."
        )
    if hambatan_sedang:
        dis_parts.append(
            f"Hambatan sedang ditemukan pada: {', '.join(hambatan_sedang)}, "
            f"yang perlu mendapat perhatian intervensi rehabilitatif."
        )
    if not hambatan_berat and not hambatan_sedang:
        dis_parts.append("Tidak ditemukan hambatan fungsi yang signifikan.")

    parts["disabilitas_fungsi"] = " ".join(dis_parts)

    # ── 6. Sintesis PKH Plus ─────────────────────────────────────────────────
    # Ketentuan resmi PKH Plus Jawa Timur:
    #   a) Lansia >= 70 tahun (seorang diri atau dalam KK penerima PKH Kemensos)
    #   b) Terdaftar DTSEN desil 1, 2, 3, atau 4
    #   c) WNI ber-NIK/KTP/KK wilayah Jawa Timur (proxy: NIK tersedia)
    #   d) Jika >1 lansia dalam satu KK, hanya satu yang memperoleh bantuan

    kriteria_pkh = {
        "a_lansia_70":    umur >= 70,
        "b_desil_1_4":    desil <= 4,
        "c_memiliki_nik": bool(r.get("nik", "").strip()),
    }
    label_terpenuhi_pkh = {
        "a_lansia_70":    f"usia {umur} tahun memenuhi syarat lansia 70 tahun ke atas",
        "b_desil_1_4":    f"desil {desil} masuk rentang desil 1-4 DTSEN",
        "c_memiliki_nik": "memiliki NIK/identitas kependudukan yang valid",
    }
    label_tidak_pkh = {
        "a_lansia_70":    f"usia {umur} tahun belum memenuhi batas minimum 70 tahun",
        "b_desil_1_4":    f"desil {desil} berada di luar rentang desil 1-4 yang dipersyaratkan",
        "c_memiliki_nik": "NIK/identitas kependudukan tidak tersedia atau tidak valid",
    }

    terpenuhi_pkh   = [k for k, v in kriteria_pkh.items() if v]
    tidak_terpenuhi = [k for k, v in kriteria_pkh.items() if not v]

    # Faktor pendukung (bukan kriteria wajib, memperkuat profil)
    faktor_risiko = []
    if gizi in GIZI_BERMASALAH:  faktor_risiko.append("masalah gizi")
    if ada_penyakit:             faktor_risiko.append(f"penyakit menahun ({penyakit})")
    if hambatan_berat:           faktor_risiko.append(f"disabilitas berat ({len(hambatan_berat)} dimensi)")
    if luas < 36:                faktor_risiko.append("luas hunian di bawah standar")
    if jml >= 5:                 faktor_risiko.append("jumlah anggota keluarga besar")

    if eligible_pkh == 1:
        terpenuhi_str = "; ".join(label_terpenuhi_pkh[k] for k in terpenuhi_pkh)
        pendukung_str = (
            f" Diperkuat oleh faktor tambahan: {', '.join(faktor_risiko)}."
            if faktor_risiko else ""
        )
        sintesis_pkh = (
            f"Warga MEMENUHI seluruh kriteria PKH Plus Jawa Timur. "
            f"Kriteria terpenuhi: {terpenuhi_str}.{pendukung_str} "
            f"Intervensi PKH Plus dinilai tepat sasaran untuk profil ini."
        )
    else:
        tidak_str = "; ".join(label_tidak_pkh[k] for k in tidak_terpenuhi)
        sintesis_pkh = (
            f"Warga TIDAK MEMENUHI kriteria PKH Plus Jawa Timur. "
            f"Kriteria tidak terpenuhi: {tidak_str}. "
            f"{'Meskipun terdapat faktor risiko tambahan (' + ', '.join(faktor_risiko) + '), ' if faktor_risiko else ''}"
            f"kegagalan memenuhi kriteria wajib di atas menjadi dasar penolakan eligibilitas."
        )
    parts["sintesis_pkh_plus"] = sintesis_pkh

    # ── 7. Sintesis ASPD ─────────────────────────────────────────────────────
    # Ketentuan resmi ASPD Jawa Timur:
    #   1. Penduduk Jawa Timur (proxy: NIK tersedia)
    #   2. Usia 6 bulan s.d. 60 tahun (integer: 0-60)
    #   3. Penyandang disabilitas / bed ridden / bergantung bantuan orang lain
    #      (proxy: hambatan berat >= 1 dimensi ATAU penyakit menahun)
    #   4. Prioritas desil 1-5; desil 6-10 perlu verifikasi lapangan

    ada_hambatan_signifikan = len(hambatan_berat) >= 1 or ada_penyakit

    kriteria_aspd = {
        "k1_nik":            bool(r.get("nik", "").strip()),
        "k2_usia":           0 <= umur <= 60,
        "k3_disabilitas":    ada_hambatan_signifikan,
        "k4_desil_prioritas": desil <= 5,
    }
    label_terpenuhi_aspd = {
        "k1_nik":            "memiliki identitas kependudukan Jawa Timur (NIK valid)",
        "k2_usia":           f"usia {umur} tahun dalam rentang 6 bulan - 60 tahun",
        "k3_disabilitas":    (
            f"terdapat hambatan berat pada {len(hambatan_berat)} dimensi fungsi"
            + (f" dan penyakit menahun ({penyakit})" if ada_penyakit else "")
        ),
        "k4_desil_prioritas": f"desil {desil} masuk prioritas utama (desil 1-5)",
    }
    label_tidak_aspd = {
        "k1_nik":            "NIK/identitas kependudukan tidak tersedia",
        "k2_usia":           f"usia {umur} tahun di luar rentang 6 bulan - 60 tahun yang dipersyaratkan",
        "k3_disabilitas":    "tidak ditemukan hambatan fungsi berat atau penyakit menahun yang memenuhi threshold",
        "k4_desil_prioritas": (
            f"desil {desil} berada di luar prioritas utama (desil 6-10), "
            f"memerlukan verifikasi lapangan oleh pendamping disabilitas dan Dinsos setempat"
        ),
    }

    terpenuhi_aspd    = [k for k, v in kriteria_aspd.items() if v]
    tidak_terpenuhi_a = [k for k, v in kriteria_aspd.items() if not v]

    faktor_aspd = []
    if hambatan_berat:  faktor_aspd.append(f"hambatan berat: {', '.join(hambatan_berat)}")
    if hambatan_sedang: faktor_aspd.append(f"hambatan sedang: {', '.join(hambatan_sedang)}")
    if ada_penyakit:    faktor_aspd.append(f"penyakit menahun ({penyakit})")
    if gizi in GIZI_BERMASALAH: faktor_aspd.append(f"kondisi gizi ({gizi})")

    if eligible_aspd == 1:
        catatan_verifikasi = (
            f" Catatan: karena desil {desil} berada di rentang 6-10, eligibilitas ini "
            f"perlu dikonfirmasi melalui verifikasi lapangan oleh pendamping disabilitas "
            f"dan Dinsos kabupaten/kota setempat."
            if desil > 5 else ""
        )
        terpenuhi_a_str = "; ".join(label_terpenuhi_aspd[k] for k in terpenuhi_aspd)
        sintesis_aspd = (
            f"Warga MEMENUHI kriteria ASPD Jawa Timur. "
            f"Kriteria terpenuhi: {terpenuhi_a_str}. "
            f"Faktor disabilitas/kesehatan yang tercatat: {', '.join(faktor_aspd) if faktor_aspd else 'teridentifikasi dari profil'}. "
            f"Program ASPD dinilai sesuai untuk mendukung kemandirian dan rehabilitasi sosial warga ini."
            f"{catatan_verifikasi}"
        )
    else:
        tidak_a_str = "; ".join(label_tidak_aspd[k] for k in tidak_terpenuhi_a)
        sintesis_aspd = (
            f"Warga TIDAK MEMENUHI kriteria ASPD Jawa Timur. "
            f"Kriteria tidak terpenuhi: {tidak_a_str}. "
            f"{'Meskipun tercatat: ' + ', '.join(faktor_aspd) + ', ' if faktor_aspd else ''}"
            f"kegagalan memenuhi kriteria wajib menjadi dasar penolakan eligibilitas."
        )
    parts["sintesis_aspd"] = sintesis_aspd

    return parts, faktor_risiko, faktor_aspd


# ══════════════════════════════════════════════════════════════════════════════
#  SANITIZER & VALIDATOR
# ══════════════════════════════════════════════════════════════════════════════

CHATML_TOKENS = [
    "<|im_start|>", "<|im_end|>", "<|endoftext|>",
    "<|im_sep|>", "<|fim_prefix|>", "<|fim_middle|>",
    "<|fim_suffix|>", "<|file_sep|>",
]

def sanitize_text(text: str) -> str:
    for token in CHATML_TOKENS:
        text = text.replace(token, "")
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    return text.strip()

def sanitize_record(record: dict) -> dict:
    for msg in record["messages"]:
        msg["content"] = sanitize_text(msg["content"])
    return record

def validate_record(record: dict) -> tuple:
    msgs = record.get("messages", [])
    if len(msgs) != 3:
        return False, f"jumlah messages bukan 3 (dapat {len(msgs)})"
    if [m["role"] for m in msgs] != ["system", "user", "assistant"]:
        return False, "urutan roles salah"
    for msg in msgs:
        if not msg["content"].strip():
            return False, f"content kosong pada role '{msg['role']}'"
        for token in CHATML_TOKENS:
            if token in msg["content"]:
                return False, f"ChatML token bocor di role '{msg['role']}'"
    try:
        parsed = json.loads(msgs[2]["content"])
        if "laporan_evaluasi" not in parsed:
            return False, "assistant content tidak punya key 'laporan_evaluasi'"
    except json.JSONDecodeError as e:
        return False, f"assistant content bukan JSON valid: {e}"
    return True, ""


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

def create_conversational_data():
    input_file   = 'data/raw/df_merged_v3.csv'
    train_output = 'data/processed/train_pkh.jsonl'
    val_output   = 'data/processed/val_pkh.jsonl'
    eval_output  = 'data/processed/eval_pkh.jsonl'

    os.makedirs('data/processed', exist_ok=True)

    columns_to_load = [
        'nik', 'nama', 'tanggal_lahir', 'id_hub_kepala_keluarga', 'id_status_perkawinan',
        'desil_nasional', 'jumlah_anggota_keluarga',
        'id_status_penguasaan_bangunan', 'id_kondisi_gizi',
        'id_penglihatan', 'id_pendengaran',
        'id_berjalan_atau_naik_tangga', 'id_menggunakan_tangan_jari',
        'id_belajar_kemampuan_intelektual', 'id_pengendalian_perilaku',
        'id_berbicara_komunikasi', 'id_mengurus_diri',
        'id_mengingat_berkonsentrasi', 'id_kesedihan_depresi',
        'id_penyakit_menahun', 'luas_lantai_bangunan',
        'status_dtsen', 'kabupaten_kota', 'kecamatan', 'kelurahan_desa',
        'id_kepemilikan_izin_usaha', 'jumlah_jenis_usaha', 'id_omset_usaha_utama',
        'skor_pkh_plus', 'skor_aspd',
        'eligible_pkh_plus', 'eligible_aspd',
    ]

    print("Loading data...")
    try:
        df = pd.read_csv(input_file, usecols=columns_to_load, low_memory=False)
    except Exception as e:
        print(f"Error reading {input_file}: {e}")
        return

    print(f"Original shape: {df.shape}")

    # ── Coerce numerics ──────────────────────────────────────────────────────
    int_cols = [
        'tanggal_lahir', 'id_hub_kepala_keluarga', 'id_status_perkawinan', 'desil_nasional',
        'jumlah_anggota_keluarga', 'id_status_penguasaan_bangunan',
        'id_kondisi_gizi', 'id_penglihatan', 'id_pendengaran',
        'id_berjalan_atau_naik_tangga', 'id_menggunakan_tangan_jari',
        'id_belajar_kemampuan_intelektual', 'id_pengendalian_perilaku',
        'id_berbicara_komunikasi', 'id_mengurus_diri',
        'id_mengingat_berkonsentrasi', 'id_kesedihan_depresi',
        'id_penyakit_menahun', 'eligible_pkh_plus', 'eligible_aspd',
        'id_kepemilikan_izin_usaha', 'jumlah_jenis_usaha', 'id_omset_usaha_utama',
    ]
    float_cols = ['luas_lantai_bangunan', 'skor_pkh_plus', 'skor_aspd']

    for c in int_cols:
        df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0).astype(int)
    for c in float_cols:
        df[c] = pd.to_numeric(df[c], errors='coerce').fillna(0.0)

    df['nik']            = df['nik'].fillna('').astype(str)
    df['nama']           = df['nama'].fillna('Tidak Diketahui').astype(str)
    df['status_dtsen']   = df['status_dtsen'].fillna('').astype(str)
    df['kabupaten_kota'] = df['kabupaten_kota'].fillna('').astype(str)
    df['kecamatan']      = df['kecamatan'].fillna('').astype(str)
    df['kelurahan_desa'] = df['kelurahan_desa'].fillna('').astype(str)

    # ── Over sampling ────────────
    print("Sampling data...")

    df_aspd = df[df['eligible_aspd'] == 1]
    df_pkh  = df[(df['eligible_pkh_plus'] == 1) & (df['eligible_aspd'] == 0)]
    df_neg  = df[(df['eligible_pkh_plus'] == 0) & (df['eligible_aspd'] == 0)]

    print(f"Data Asli -> ASPD: {len(df_aspd)}, PKH+: {len(df_pkh)}, Negatif: {len(df_neg)}")

    n_pos_target = 2500  # 2500 ASPD + 2500 PKH = 5000 Positif
    n_neg_target = 5000  # 5000 Negatif

    df_aspd_s = df_aspd.sample(n=n_pos_target, random_state=42, replace=True)
    df_pkh_s  = df_pkh.sample(n=min(n_pos_target, len(df_pkh)), random_state=42, replace=len(df_pkh) < n_pos_target)
    df_neg_s  = df_neg.sample(n=min(n_neg_target, len(df_neg)), random_state=42, replace=len(df_neg) < n_neg_target)

    df_balanced = pd.concat([df_aspd_s, df_pkh_s, df_neg_s]).sample(frac=1, random_state=42).reset_index(drop=True)
    print(f"Balanced shape: {df_balanced.shape}")

    # ── System Prompt ────────────────────────────────────────────────────────
    system_prompt = (
        "Anda adalah AI Auditor resmi Dinas Sosial Provinsi Jawa Timur yang bertugas melakukan verifikasi "
        "dan validasi kelayakan penerima manfaat dua program bantuan sosial:\n"
        "1. PKH Plus — Program Keluarga Harapan Plus, menyasar keluarga dengan kerentanan sosial-ekonomi berlapis "
        "(kemiskinan ekstrem, hunian tidak layak, masalah gizi, dan penyakit menahun).\n"
        "2. ASPD — Asistensi Sosial Penyandang Disabilitas, menyasar individu dengan hambatan fungsi fisik/mental "
        "signifikan yang mengurangi kemandirian dan kapasitas ekonomi.\n\n"

        "TUGAS ANDA:\n"
        "Untuk setiap profil warga, susun laporan evaluasi kelayakan yang sistematis dan dapat dipertanggungjawabkan "
        "secara administratif sesuai standar Kementerian Sosial RI.\n\n"

        "KERANGKA ANALISIS WAJIB (jalankan berurutan):\n"
        "1. PROFIL WARGA — Identifikasi identitas, posisi dalam keluarga, dan konteks sosial dasar.\n"
        "2. DEMOGRAFI — Nilai kelompok usia, status perkawinan, jumlah tanggungan, dan risiko sosial yang melekat.\n"
        "3. EKONOMI — Interpretasikan desil nasional: 1-2=miskin ekstrem, 3-4=rentan, 5-6=hampir miskin, "
        "7-10=tidak miskin.\n"
        "4. INFRASTRUKTUR & HUNIAN — Nilai penguasaan bangunan dan luas lantai terhadap standar 36 m2 keluarga inti.\n"
        "5. KESEHATAN & GIZI — Evaluasi kondisi gizi dan penyakit menahun sebagai proxy beban ekonomi kesehatan.\n"
        "6. DISABILITAS & FUNGSI — Nilai 10 dimensi fungsi (penglihatan, pendengaran, mobilitas, tangan/jari, "
        "intelektual, perilaku, komunikasi, perawatan diri, memori/konsentrasi, kesedihan/depresi). "
        "Hambatan berat/total pada 1+ dimensi adalah indikator utama ASPD.\n"
        "7. SINTESIS — Agregasikan temuan, identifikasi co-occurring deprivation, dan berikan justifikasi "
        "LAYAK/TIDAK LAYAK untuk masing-masing program secara terpisah berdasarkan kriteria resmi berikut:\n"
        "   PKH Plus: (a) lansia >= 70 tahun, (b) desil 1-4 DTSEN, (c) memiliki NIK Jawa Timur.\n"
        "   ASPD: (1) NIK Jawa Timur, (2) usia 6 bulan - 60 tahun, (3) penyandang disabilitas/bed ridden, "
        "(4) prioritas desil 1-5; desil 6-10 wajib verifikasi lapangan.\n\n"

        "FORMAT OUTPUT:\n"
        "Seluruh respons WAJIB berupa satu objek JSON valid tanpa teks tambahan, tanpa markdown, tanpa komentar. "
        "Ikuti skema 'laporan_evaluasi' yang mencakup: profil_warga, analisis (per dimensi), skor, dan kesimpulan "
        "(untuk pkh_plus dan aspd masing-masing dengan status_kelayakan, urgensi, dan label)."
    )

    # ── Format Records ───────────────────────────────────────────────────────
    records = []
    print("Formatting records with reasoning...")

    for _, row in df_balanced.iterrows():

        # Decode semua kolom
        rd = {
            "nik":                     str(row['nik']),
            "nama":                    str(row['nama']),
            "umur":                    2026 - int(row['tanggal_lahir']),
            "hub_kepala":              decode(MAP_HUB_KEPALA,           MAP_HUB_KEPALA_DEFAULT,           row['id_hub_kepala_keluarga']),
            "status_perkawinan":       decode(MAP_STATUS_PERKAWINAN,     MAP_STATUS_PERKAWINAN_DEFAULT,     row['id_status_perkawinan']),
            "desil_nasional":          int(row['desil_nasional']),
            "jumlah_anggota_keluarga": int(row['jumlah_anggota_keluarga']),
            "penguasaan_bangunan":     decode(MAP_PENGUASAAN_BANGUNAN,   MAP_PENGUASAAN_BANGUNAN_DEFAULT,   row['id_status_penguasaan_bangunan']),
            "kondisi_gizi":            decode(MAP_KONDISI_GIZI,          MAP_KONDISI_GIZI_DEFAULT,          row['id_kondisi_gizi']),
            "penglihatan":             decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_penglihatan']),
            "pendengaran":             decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_pendengaran']),
            "berjalan_naik_tangga":    decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_berjalan_atau_naik_tangga']),
            "menggunakan_tangan_jari": decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_menggunakan_tangan_jari']),
            "belajar_intelektual":     decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_belajar_kemampuan_intelektual']),
            "pengendalian_perilaku":   decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_pengendalian_perilaku']),
            "berbicara_komunikasi":    decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_berbicara_komunikasi']),
            "mengurus_diri":           decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_mengurus_diri']),
            "mengingat_berkonsentrasi":decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_mengingat_berkonsentrasi']),
            "kesedihan_depresi":       decode(MAP_HAMBATAN,              MAP_HAMBATAN_DEFAULT,              row['id_kesedihan_depresi']),
            "penyakit_menahun":        decode(MAP_PENYAKIT_MENAHUN,      MAP_PENYAKIT_MENAHUN_DEFAULT,      row['id_penyakit_menahun']),
            "luas_lantai_bangunan":    float(row['luas_lantai_bangunan']),
            "status_dtsen":            str(row['status_dtsen']),
            "provinsi":                user_respon["provinsi"],
            "kabupaten_kota":          str(row['kabupaten_kota']),
            "kecamatan":               str(row['kecamatan']),
            "kelurahan_desa":          str(row['kelurahan_desa']),
            "kepemilikan_izin_usaha":  decode(MAP_KEPEMILIKAN_IZIN_USAHA, MAP_KEPEMILIKAN_IZIN_USAHA_DEFAULT, row['id_kepemilikan_izin_usaha']),
            "jumlah_jenis_usaha":      int(row['jumlah_jenis_usaha']),
            "omset_usaha_utama":       decode(MAP_OMSET_USAHA,            MAP_OMSET_USAHA_DEFAULT,            row['id_omset_usaha_utama']),
        }

        eligible_pkh  = int(row['eligible_pkh_plus'])
        eligible_aspd = int(row['eligible_aspd'])
        skor_pkh      = round(float(row['skor_pkh_plus']), 4)
        skor_aspd_val = round(float(row['skor_aspd']),     4)

        # Urgensi PKH Plus
        if eligible_pkh == 1:
            if skor_pkh >= 0.85:   urgensi_pkh = "Sangat Tinggi (Utama)"
            elif skor_pkh >= 0.70: urgensi_pkh = "Tinggi"
            else:                  urgensi_pkh = "Sedang"
        else:
            urgensi_pkh = "Tidak Ada (Tidak Memenuhi Syarat)"

        # Urgensi ASPD
        if eligible_aspd == 1:
            if skor_aspd_val >= 0.85:   urgensi_aspd = "Sangat Tinggi (Utama)"
            elif skor_aspd_val >= 0.70: urgensi_aspd = "Tinggi"
            else:                       urgensi_aspd = "Sedang"
        else:
            urgensi_aspd = "Tidak Ada (Tidak Memenuhi Syarat)"

        # Build reasoning
        reasoning_parts, faktor_pkh, faktor_aspd = build_reasoning(rd, eligible_pkh, eligible_aspd)

        # ── User Prompt ──────────────────────────────────────────────────────
        user_prompt = (
            f"Profil Warga:\n"
            f"- NIK              : {rd['nik']}\n"
            f"- Nama             : {rd['nama']}\n"
            f"- Umur             : {rd['umur']} tahun\n"
            f"- Hub. Kepala KK   : {rd['hub_kepala']}\n"
            f"- Status Perkawinan: {rd['status_perkawinan']}\n"
            f"- Desil Nasional   : {rd['desil_nasional']}\n"
            f"- Jml. Anggota KK  : {rd['jumlah_anggota_keluarga']} orang\n"
            f"- Penguasaan Bgn.  : {rd['penguasaan_bangunan']}\n"
            f"- Luas Bangunan    : {rd['luas_lantai_bangunan']} m2\n"
            f"- Kondisi Gizi     : {rd['kondisi_gizi']}\n"
            f"- Penyakit Menahun : {rd['penyakit_menahun']}\n"
            f"- Penglihatan      : {rd['penglihatan']}\n"
            f"- Pendengaran      : {rd['pendengaran']}\n"
            f"- Berjalan/Tangga  : {rd['berjalan_naik_tangga']}\n"
            f"- Tangan/Jari      : {rd['menggunakan_tangan_jari']}\n"
            f"- Belajar/Intelektual: {rd['belajar_intelektual']}\n"
            f"- Pengendalian Perilaku: {rd['pengendalian_perilaku']}\n"
            f"- Bicara/Komunikasi: {rd['berbicara_komunikasi']}\n"
            f"- Mengurus Diri    : {rd['mengurus_diri']}\n"
            f"- Memori/Konsentrasi: {rd['mengingat_berkonsentrasi']}\n"
            f"- Kesedihan/Depresi: {rd['kesedihan_depresi']}\n"
            f"- Status DTSEN     : {rd['status_dtsen']}\n"
            f"- Wilayah          : {rd['kelurahan_desa']}, Kec. {rd['kecamatan']}, {rd['kabupaten_kota']}, {rd['provinsi']}\n"
            f"- Izin Usaha       : {rd['kepemilikan_izin_usaha']}\n"
            f"- Jml. Jenis Usaha : {rd['jumlah_jenis_usaha']}\n"
            f"- Omset Usaha Utama: {rd['omset_usaha_utama']}\n\n"
            f"Skor Prioritas Bantuan (semakin mendekati 1.0 = semakin prioritas):\n"
            f"- Skor PKH Plus    : {skor_pkh} "
            f"({'prioritas tinggi' if skor_pkh >= 0.70 else 'prioritas sedang' if skor_pkh >= 0.50 else 'prioritas rendah'})\n"
            f"- Skor ASPD        : {skor_aspd_val} "
            f"({'prioritas tinggi' if skor_aspd_val >= 0.70 else 'prioritas sedang' if skor_aspd_val >= 0.50 else 'prioritas rendah'})\n\n"
            f"Tolong buatkan laporan evaluasi kelayakan untuk program PKH Plus dan ASPD."
        )

        # ── Assistant Response (JSON) ─────────────────────────────────────────
        response_obj = {
            "laporan_evaluasi": {
                "profil_warga": {
                    "nik":                     rd["nik"],
                    "nama":                    rd["nama"],
                    "umur":                    rd["umur"],
                    "hubungan_kepala_keluarga":rd["hub_kepala"],
                    "status_perkawinan":       rd["status_perkawinan"],
                    "jumlah_anggota_keluarga": rd["jumlah_anggota_keluarga"],
                    "status_dtsen":            rd["status_dtsen"],
                    "wilayah": {
                        "provinsi":        rd["provinsi"],
                        "kabupaten_kota":  rd["kabupaten_kota"],
                        "kecamatan":       rd["kecamatan"],
                        "kelurahan_desa":  rd["kelurahan_desa"],
                    },
                },
                "analisis": {
                    "demografi":           reasoning_parts["demografi"],
                    "ekonomi":             reasoning_parts["ekonomi"],
                    "infrastruktur_hunian":reasoning_parts["infrastruktur_hunian"],
                    "kesehatan_gizi":      reasoning_parts["kesehatan_gizi"],
                    "disabilitas_fungsi":  reasoning_parts["disabilitas_fungsi"],
                    "sintesis_pkh_plus":   reasoning_parts["sintesis_pkh_plus"],
                    "sintesis_aspd":       reasoning_parts["sintesis_aspd"],
                },
                "parameter": {
                    "desil_nasional":      rd["desil_nasional"],
                    "penguasaan_bangunan": rd["penguasaan_bangunan"],
                    "luas_bangunan_m2":    rd["luas_lantai_bangunan"],
                    "kondisi_gizi":        rd["kondisi_gizi"],
                    "penyakit_menahun":    rd["penyakit_menahun"],
                    "usaha": {
                        "kepemilikan_izin_usaha": rd["kepemilikan_izin_usaha"],
                        "jumlah_jenis_usaha":     rd["jumlah_jenis_usaha"],
                        "omset_usaha_utama":      rd["omset_usaha_utama"],
                    },
                    "disabilitas": {
                        "penglihatan":             rd["penglihatan"],
                        "pendengaran":             rd["pendengaran"],
                        "berjalan_naik_tangga":    rd["berjalan_naik_tangga"],
                        "menggunakan_tangan_jari": rd["menggunakan_tangan_jari"],
                        "belajar_intelektual":     rd["belajar_intelektual"],
                        "pengendalian_perilaku":   rd["pengendalian_perilaku"],
                        "berbicara_komunikasi":    rd["berbicara_komunikasi"],
                        "mengurus_diri":           rd["mengurus_diri"],
                        "mengingat_berkonsentrasi":rd["mengingat_berkonsentrasi"],
                        "kesedihan_depresi":       rd["kesedihan_depresi"],
                    },
                    "faktor_risiko_pkh":  faktor_pkh,
                    "faktor_risiko_aspd": faktor_aspd,
                },
                "skor": {
                    "skor_pkh_plus": skor_pkh,
                    "skor_aspd":     skor_aspd_val,
                },
                "kesimpulan": {
                    "pkh_plus": {
                        "status_kelayakan":   "LAYAK" if eligible_pkh == 1 else "TIDAK LAYAK",
                        "urgensi_intervensi": urgensi_pkh,
                        "label":              eligible_pkh,
                    },
                    "aspd": {
                        "status_kelayakan":   "LAYAK" if eligible_aspd == 1 else "TIDAK LAYAK",
                        "urgensi_intervensi": urgensi_aspd,
                        "label":              eligible_aspd,
                    },
                },
            }
        }

        assistant_response = json.dumps(response_obj, ensure_ascii=True)

        records.append({
            "messages": [
                {"role": "system",    "content": system_prompt},
                {"role": "user",      "content": user_prompt},
                {"role": "assistant", "content": assistant_response},
            ]
        })

    # ── Sanitize & Validate ──────────────────────────────────────────────────
    print("Sanitizing and validating records...")
    clean_records, skipped = [], 0
    for i, rec in enumerate(records):
        rec = sanitize_record(rec)
        ok, reason = validate_record(rec)
        if ok:
            clean_records.append(rec)
        else:
            skipped += 1
            print(f"  [SKIP] record #{i}: {reason}")

    print(f"Valid   : {len(clean_records)} records")
    print(f"Skipped : {skipped} records")

    if not clean_records:
        print("ERROR: Tidak ada record valid. Proses dibatalkan.")
        return

    # ── Train/Val/Eval Split 80:10:10 ────────────────────────────────────────
    total_size = len(clean_records)
    train_size = int(total_size * 0.8)
    val_size   = int(total_size * 0.1)

    train_records = clean_records[:train_size]
    val_records   = clean_records[train_size:train_size + val_size]
    eval_records  = clean_records[train_size + val_size:]

    def write_jsonl(filepath, data):
        with open(filepath, 'w', encoding='utf-8') as f:
            for item in data:
                f.write(json.dumps(item, ensure_ascii=True) + '\n')

    print("Exporting JSONL files...")
    write_jsonl(train_output, train_records)
    write_jsonl(val_output,   val_records)
    write_jsonl(eval_output,  eval_records)

    print(f"Train : {len(train_records)} records -> {train_output}")
    print(f"Val   : {len(val_records)} records -> {val_output}")
    print(f"Eval  : {len(eval_records)} records -> {eval_output}")
    print("Done.")


if __name__ == "__main__":
    create_conversational_data()