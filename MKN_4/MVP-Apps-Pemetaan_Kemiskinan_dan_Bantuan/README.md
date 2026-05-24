# 🏛️ MVP Sistem Pemetaan Kemiskinan & Bantuan Sosial (Jatim Sosial)

Selamat datang di repositori utama proyek **Pemetaan Kemiskinan dan Distribusi Bantuan Sosial** Provinsi Jawa Timur (MVP Kelompok 4). 

Proyek ini telah dikontainerisasi menggunakan **Docker** dan **Docker Compose** agar semua layanan dapat dijalankan dengan satu perintah tunggal. Seluruh orchestrator docker dan file konfigurasi utama sekarang berada di tingkat luar (root) agar memudahkan manajemen deployment.

---

## 🗺️ Arsitektur Sistem & Pemetaan Port

Sistem ini terdiri dari 5 layanan utama yang saling terhubung di dalam jaringan internal Docker:

| Layanan | Teknologi | Port Internal | Port Host | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | React 19 + Vite + Nginx | `80` | `80` | Aplikasi web client (dashboard panel admin Jatim Sosial) |
| **`backend`** | FastAPI (Python 3.10) | `8000` | `8000` | REST API utama pengolah data keluarga dan integrasi data |
| **`mock_ai`** | FastAPI (Python 3.10) | `8001` | `8001` | Mock AI Server (simulasi analisis sosial & visual tim 1, 2, 3) |
| **`db`** | PostgreSQL 15 | `5432` | `5435` | Database transaksional relasional utama |
| **`minio`** | MinIO Object Storage | `9000` & `9001` | `9000` & `9001` | Storage tipe S3 untuk penyimpanan foto rumah warga |

---

## 📂 Struktur Direktori Setelah Reorganisasi

Semua file konfigurasi Docker dan variabel lingkungan ditarik keluar ke root folder demi kemudahan navigasi:

```
.
├── docker-compose.yml         # [BARU] Konfigurasi utama multi-container
├── .env                       # [BARU] Pengaturan variabel lingkungan global (Master)
├── README.md                  # [BARU] Panduan operasional sistem
├── jatim-sosial-backend/      # Folder Backend (FastAPI)
│   ├── Dockerfile             # [BARU] Resep build backend image
│   ├── .dockerignore          # [BARU] Mengabaikan cache & venv
│   ├── main.py                # Kode API Utama
│   └── mock_ai.py             # Simulasi AI Server
└── jatim-sosial-frontend/     # Folder Frontend (React + Vite)
    ├── Dockerfile             # [BARU] Resep multi-stage build (Node -> Nginx)
    ├── nginx.conf             # [BARU] Penanganan SPA routing fallback di Nginx
    ├── .dockerignore          # [BARU] Mengabaikan node_modules & build lokal
    └── src/                   # Sumber kode dashboard frontend
```

---

## 🛠️ Langkah-Langkah Menjalankan Aplikasi

### 1. Prasyarat (Prerequisites)
Pastikan perangkat Anda sudah menginstal:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (termasuk Docker Compose)

### 2. Konfigurasi Variabel Lingkungan (.env)
Buka file `.env` di direktori utama (root) untuk mengatur konfigurasi default jika diperlukan. Secara bawaan, variabel berikut sudah terkonfigurasi dengan aman:
*   `POSTGRES_PASSWORD`: Kata sandi untuk akses database PostgreSQL 
*   `MINIO_ROOT_PASSWORD`: Kata sandi root console MinIO 
*   `JWT_SECRET_KEY`: Kunci enkripsi token login admin 

### 3. Build & Jalankan Container
Buka terminal / command prompt pada folder utama ini dan jalankan perintah:

```bash
# Build dan jalankan seluruh container di background
docker compose up --build -d
```

Docker akan mengunduh image yang diperlukan, membangun file statis React, menyiapkan database PostgreSQL, menginisialisasi MinIO, dan menyalakan server FastAPI.

### 4. Memverifikasi Layanan
Setelah proses build selesai, periksa status container:
```bash
docker compose ps
```
Semua container (`mkn_frontend`, `mkn_backend`, `mkn_mock_ai`, `mkn_db`, `mkn_minio`) harus berstatus `Up` (Running).

---

## 🌐 Akses Tautan Layanan

Setelah semua kontainer menyala, Anda dapat mengakses layanan melalui web browser di alamat berikut:

*   **Dashboard Frontend**: [http://localhost](http://localhost) (Port default HTTP `80`)
*   **Dokumentasi Swagger API Backend**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Dokumentasi Swagger Mock AI Server**: [http://localhost:8001/docs](http://localhost:8001/docs)
*   **Console Admin MinIO**: [http://localhost:9001](http://localhost:9001) (Username: `admin_minio` | Password: `passwordminio`)

---

## 🛑 Mematikan dan Menghapus Containers

Untuk menghentikan semua container yang sedang berjalan tanpa menghapus volume data (database dan file foto tetap aman):
```bash
docker compose down
```

Untuk menghentikan serta menghapus database dan media penyimpanan (data dibersihkan total):
```bash
docker compose down -v
```

---

## ⚙️ Integrasi Teknis & Dependensi

1.  **Migrasi Database**: Backend FastAPI telah diprogram untuk secara otomatis membuat tabel yang diperlukan (`models.Base.metadata.create_all(bind=engine)`) saat backend mendeteksi koneksi database berhasil pertama kali. Anda tidak perlu menjalankan skrip SQL secara manual.
2.  **Inisialisasi Bucket MinIO**: Saat startup, backend secara otomatis membuat bucket `"foto-rumah-warga"` di MinIO jika belum ada, sehingga proses upload foto oleh Tim 2 berjalan mulus tanpa konfigurasi awal manual.
3.  **Konektivitas Antar-Container**: Semua host URL dikonfigurasi dinamis berdasarkan nama service Docker internal. Backend berkomunikasi ke PostgreSQL lewat host `db:5432` dan ke MinIO lewat `minio:9000`.
