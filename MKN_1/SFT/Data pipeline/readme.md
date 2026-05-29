# Pipeline Data Penerima Manfaat PKH Plus & ASPD

Dokumen ini menjelaskan struktur data dan logika pemrosesan yang diimplementasikan dalam skrip [process_pkh_data.py]untuk menghasilkan dataset percakapan (SFT - *Supervised Fine-Tuning*) bagi AI Auditor Dinas Sosial Provinsi Jawa Timur.

---

## 📌 Deskripsi Umum Skrip `process_pkh_data.py`

[process_pkh_data.py] berfungsi untuk:
1. **Memuat Data Mentah**: Membaca dataset CSV dari `data/raw/df_merged_v3.csv` yang berisi profil sosial-ekonomi warga Jawa Timur.
2. **Transformasi & Dekoding**: Mengubah kode kategorik/numerik dari CSV ke dalam representasi teks deskriptif yang mudah dipahami manusia dan model bahasa.
3. **Analisis Berbasis Aturan (Rule-Based Reasoning)**: Menghasilkan analisis terstruktur per dimensi kesejahteraan (demografi, ekonomi, hunian, kesehatan/gizi, disabilitas) serta melakukan sintesis kelayakan bantuan.
4. **Penyusunan Format Percakapan (SFT)**: Membentuk struktur data percakapan 3-turn (*System, User, Assistant*) berbasis ChatML.
5. **Balancing & Oversampling**: Menyeimbangkan jumlah sampel penerima manfaat PKH Plus, ASPD, dan kategori non-eligible (negatif) untuk mencegah bias.
6. **Sanitasi & Validasi**: Membersihkan karakter ilegal dan token ChatML serta memastikan output asisten berupa objek JSON yang valid.
7. **Pemisahan Dataset**: Membagi dataset menjadi Train, Validation, dan Evaluation set dengan rasio 80:10:10 ke dalam file format JSON Lines (.jsonl).

---

## 📂 Struktur Direktori Data

```text
data/
├── raw/
│   └── df_merged_v3.csv        # Dataset mentah dari hasil penggabungan/integrasi
├── processed/
│   ├── train_pkh.jsonl         # Dataset latih (80% data valid)
│   ├── val_pkh.jsonl           # Dataset validasi (10% data valid)
│   └── eval_pkh.jsonl          # Dataset evaluasi/pengujian (10% data valid)
└── readme.md                   # Dokumen panduan ini (file ini)
```

---

## ⚙️ Logika Pemrosesan & Pemetaan (Decoding)

### 1. Dekoding Kode Referensi
Skrip melakukan pemetaan nilai integer dari kolom CSV menggunakan kamus `user_respon` ke dalam bentuk string deskriptif agar model dapat mencerna arti dari kode-kode tersebut:
* **Hubungan Keluarga (`hub_kepala`)**: `1` ➔ "Kepala keluarga", `2` ➔ "Istri/suami", dsb.
* **Status Perkawinan (`status_perkawinan`)**: `1` ➔ "Belum kawin", `2` ➔ "Kawin", `3` ➔ "Cerai hidup", `4` ➔ "Cerai mati".
* **Penguasaan Bangunan (`penguasaan_bangunan`)**: `1` ➔ "Milik sendiri", `2` ➔ "Kontrak/sewa", dsb.
* **Kondisi Gizi (`kondisi_gizi`)**: `1` ➔ "Kurang Gizi(Wasting)", `2` ➔ "Kerdil(Stunting)", `3` ➔ "Tidak ada catatan".
* **Penyakit Menahun (`penyakit_menahun`)**: Kode `1` s.d. `17` dipetakan ke nama penyakit (Hipertensi, Rematik, Asma, Tuberkulosis, Stroke, Kanker, dsb.).
* **Hambatan/Disabilitas (`hambatan`)**: Kode `1` ("Ya, sama sekali tidak bisa"), `2` ("Ya, banyak kesulitan dan membutuhkan bantuan"), atau `3` ("Ya, sedikit kesulitan, tapi tidak membutuhkan bantuan").

---

## 📋 Kriteria Kelayakan Bantuan Sosial

### A. PKH Plus (Program Keluarga Harapan Plus) Jawa Timur
PKH Plus adalah program bantuan sosial bersyarat dari Pemerintah Provinsi Jawa Timur. Kriteria penentu kelayakannya:
1. **Lansia**: Berusia **70 tahun ke atas** (`umur >= 70`).
2. **Kondisi Ekonomi**: Terdaftar dalam DTSEN dengan status sosial ekonomi **Desil 1 s.d. Desil 4** (`desil_nasional <= 4`).
3. **Administrasi**: Memiliki identitas kependudukan (**NIK**) Jawa Timur yang valid.
4. **Batas Kuota KK**: Maksimal 1 lansia penerima manfaat dalam satu KK.

*Faktor Risiko Pendukung (Memperkuat Profil Kelayakan)*: 
Kondisi gizi buruk, penyakit menahun, disabilitas berat, luas hunian sempit (< 36 m² untuk keluarga inti), dan jumlah anggota keluarga besar (>= 5 orang).

### B. ASPD (Asistensi Sosial Penyandang Disabilitas) Jawa Timur
ASPD adalah program bantuan spesifik bagi penyandang disabilitas berat di Jawa Timur. Kriteria kelayakannya:
1. **Administrasi**: Memiliki identitas kependudukan (**NIK**) Jawa Timur.
2. **Usia**: Berusia **6 bulan s.d. 60 tahun** (`0 <= umur <= 60`).
3. **Disabilitas/Kesehatan**: Memiliki **hambatan fungsi berat** (kategori 1 atau 2 pada salah satu dari 10 dimensi fungsi) ATAU menderita **penyakit menahun**.
4. **Prioritas Desil**: Prioritas utama diberikan untuk desil 1–5. Desil 6–10 diperbolehkan namun memerlukan verifikasi lapangan lanjutan oleh pendamping disabilitas dan Dinas Sosial.

---

## 📊 Distribusi Penyeimbangan Data (Sampling)
Untuk menjamin performa model saat mengenali kasus positif dan negatif secara seimbang, skrip melakukan pemfilteran dan sampling data dengan target:
* **ASPD Layak (Positif)**: Target 2.500 sampel (`eligible_aspd == 1`).
* **PKH Plus Layak (Positif)**: Target 2.500 sampel (`eligible_pkh_plus == 1` & `eligible_aspd == 0`).
* **Kategori Negatif (Tidak Layak Keduanya)**: Target 5.000 sampel (`eligible_pkh_plus == 0` & `eligible_aspd == 0`).

Total dataset gabungan berukuran **10.000 records** (opsi *replace=True* diaktifkan untuk melakukan *oversampling* jika jumlah populasi asli di bawah target).

---

## 💬 Format Data SFT (JSONL)

Setiap baris pada file hasil pemrosesan `.jsonl` memiliki format ChatML terstruktur yang terdiri dari tiga peran (*roles*):

### 1. Pesan Sistem (`system`)
Mengatur persona model sebagai **AI Auditor resmi Dinas Sosial Provinsi Jawa Timur** dan menetapkan kerangka analisis wajib (Profil, Demografi, Ekonomi, Hunian, Kesehatan/Gizi, Disabilitas, Sintesis Kelayakan) serta format output berupa JSON valid.

### 2. Pesan Pengguna (`user`)
Menyediakan ringkasan profil warga (Nama, NIK, Umur, Hubungan KK, Kondisi Hunian, Gizi, Penyakit Menahun, 10 Dimensi Hambatan Fungsi, Wilayah, serta Skor Prioritas Bantuan).

### 3. Pesan Asisten (`assistant`)
Respons asisten berupa **satu objek JSON valid** tanpa format markdown. Contoh skema JSON-nya adalah:

```json
{
  "laporan_evaluasi": {
    "profil_warga": {
      "nik": "351xxxxxxxxxxxxx",
      "nama": "NAMA WARGA",
      "umur": 72,
      "hubungan_kepala_keluarga": "Kepala keluarga",
      "status_perkawinan": "Cerai mati",
      "jumlah_anggota_keluarga": 1,
      "status_dtsen": "DTSEN AKTIF",
      "wilayah": {
        "provinsi": "Jawa Timur",
        "kabupaten_kota": "KABUPATEN GRESIK",
        "kecamatan": "KECAMATAN BENJENG",
        "kelurahan_desa": "DESA METATU"
      }
    },
    "analisis": {
      "demografi": "Warga berusia 72 tahun masuk kategori lansia...",
      "ekonomi": "Desil nasional 2 menempatkan warga pada 20% termiskin...",
      "infrastruktur_hunian": "Luas bangunan 16 m2 sangat sempit...",
      "kesehatan_gizi": "Warga tercatat menderita penyakit menahun: Hipertensi...",
      "disabilitas_fungsi": "Tidak ditemukan hambatan fungsi yang signifikan.",
      "sintesis_pkh_plus": "Warga MEMENUHI seluruh kriteria PKH Plus Jawa Timur...",
      "sintesis_aspd": "Warga TIDAK MEMENUHI kriteria ASPD Jawa Timur karena usia..."
    },
    "parameter": {
      "desil_nasional": 2,
      "penguasaan_bangunan": "Milik sendiri",
      "luas_bangunan_m2": 16.0,
      "kondisi_gizi": "Tidak ada catatan",
      "penyakit_menahun": "Hipertensi (darah tinggi)",
      "usaha": {
        "kepemilikan_izin_usaha": "Tidak diketahui",
        "jumlah_jenis_usaha": 0,
        "omset_usaha_utama": "Tidak diketahui"
      },
      "disabilitas": {
        "penglihatan": "Tidak mengalami kesulitan",
        "pendengaran": "Tidak mengalami kesulitan",
        "berjalan_naik_tangga": "Tidak mengalami kesulitan",
        "menggunakan_tangan_jari": "Tidak mengalami kesulitan",
        "belajar_intelektual": "Tidak mengalami kesulitan",
        "pengendalian_perilaku": "Tidak mengalami kesulitan",
        "berbicara_komunikasi": "Tidak mengalami kesulitan",
        "mengurus_diri": "Tidak mengalami kesulitan",
        "mengingat_berkonsentrasi": "Tidak mengalami kesulitan",
        "kesedihan_depresi": "Tidak mengalami kesulitan"
      },
      "faktor_risiko_pkh": ["penyakit menahun (Hipertensi (darah tinggi))", "luas hunian di bawah standar"],
      "faktor_risiko_aspd": ["penyakit menahun (Hipertensi (darah tinggi))"]
    },
    "skor": {
      "skor_pkh_plus": 0.8875,
      "skor_aspd": 0.4215
    },
    "kesimpulan": {
      "pkh_plus": {
        "status_kelayakan": "LAYAK",
        "urgensi_intervensi": "Sangat Tinggi (Utama)",
        "label": 1
      },
      "aspd": {
        "status_kelayakan": "TIDAK LAYAK",
        "urgensi_intervensi": "Tidak Ada (Tidak Memenuhi Syarat)",
        "label": 0
      }
    }
  }
}
```

---

## 🚀 Cara Menjalankan Skrip Pemrosesan

Untuk menjalankan pemrosesan data, buka terminal pada direktori root proyek dan jalankan perintah berikut:

```powershell
python "Data pipeline/process_pkh_data.py"
```

### Prasyarat
Pastikan dependensi berikut sudah terpasang di *environment* Python Anda:
```bash
pip install pandas
```
