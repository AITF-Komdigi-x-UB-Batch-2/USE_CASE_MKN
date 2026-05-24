# Asisten Jatim Sosial — MVP Application

> AI-powered poverty mapping, welfare classification, and social intervention recommender
> for East Java (Jawa Timur).
> Built under the **DISKOMINFO JATIM** use case — AITF 2026 Program.

---

## 🎯 Project Purpose

This is the MVP frontend for the **"Model AI Pemetaan Risiko & Penetapan Sasaran"** system.
It integrates three AI models into a single unified interface for government field officers
and social welfare analysts to:

1. **Assess family welfare levels** — Model 1 (LLM: classification & reasoning)
2. **Analyze physical housing conditions** — Model 2 (VLM: visual analysis of Rutilahu)
3. **Receive intervention & policy recommendations** — Model 3 (LLM + RAG: recommender)
4. **Monitor and evaluate welfare changes** — Quarterly data refresh cycle with automatic re-evaluation

### Primary Users

| Role | Tanggung Jawab |
|------|----------------|
| **Petugas Lapangan** | Input data lapangan, verifikasi kondisi fisik, validasi manual |
| **Analis Data Sosial** | Review klasifikasi AI, evaluasi perubahan desil, laporan wilayah |
| **Admin DISKOMINFO** | Manajemen user, konfigurasi sistem, oversight siklus refresh data |

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS      |
| Backend      | FastAPI (Python)                    |
| Database     | PostgreSQL                          |
| Vector DB    | ChromaDB                            |
| Scheduler    | APScheduler (dalam FastAPI)         |
| CI/CD        | GitHub Actions + Docker             |
| Deployment   | Docker Compose (containerized)      |

---

## 🔄 Quarterly Data Refresh Cycle (Core Business Logic)

Setiap **3 bulan sekali**, sistem secara otomatis melakukan sinkronisasi data terbaru
dari sumber eksternal (DTSEN/REGSOSEK). Proses ini mencakup deteksi perubahan kondisi
keluarga dan evaluasi ulang kelayakan bantuan sosial.

### Alur Refresh (Automated)

```
[Scheduler Triggered — Every 3 Months]
        │
        ▼
1. Fetch updated data from external source (DTSEN/REGSOSEK API or batch import)
        │
        ▼
2. Compare new socioeconomic data vs. existing data per family
        │
        ▼
3. Detect changed families → flag for re-evaluation
   (Changes: income, employment, assets, bansos status, dll.)
        │
        ▼
4. For each changed family:
   a. Run Model 1 → get new desil classification
   b. Compare new_desil vs. previous_desil
   c. If |delta| >= 2 desil → mark as "Perubahan Signifikan"
   d. If |delta| = 1 desil  → mark as "Perubahan Minor"
   e. Store result in `desil_change_events` table
        │
        ▼
5. Determine evaluation action based on change direction:
   ┌──────────────────────────────────────────────────────────────┐
   │ Desil NAIK (e.g., 2 → 6): Kondisi membaik                   │
   │  → Evaluasi kelayakan bantuan yang sedang diterima           │
   │  → Rekomendasikan penghentian/pengurangan program            │
   │  → Status: "Perlu Evaluasi Penghentian Bantuan"              │
   ├──────────────────────────────────────────────────────────────┤
   │ Desil TURUN (e.g., 5 → 2): Kondisi memburuk                 │
   │  → Run Model 3 ulang dengan konteks baru                     │
   │  → Rekomendasikan penambahan/eskalasi program                │
   │  → Status: "Perlu Evaluasi Penambahan Bantuan"               │
   ├──────────────────────────────────────────────────────────────┤
   │ Desil TETAP: Tidak ada perubahan signifikan                  │
   │  → Update `last_refreshed_at`, tidak trigger evaluasi        │
   └──────────────────────────────────────────────────────────────┘
        │
        ▼
6. Create notifications for assigned petugas/analis per wilayah
        │
        ▼
7. Update `data_refresh_cycles` with cycle summary & stats
```

### Trigger Mechanism

- **Otomatis**: APScheduler menjalankan job setiap kuartal (Januari, April, Juli, Oktober — tanggal 1, jam 01:00 WIB)
- **Manual**: Admin dapat men-trigger refresh manual dari halaman `/admin/refresh`
- **Partial**: Admin dapat refresh satu kabupaten/kota spesifik saja

---

## 🗄 Database Schema (Supabase / PostgreSQL)

### Core Tables

**`users`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
email               text UNIQUE NOT NULL
full_name           text NOT NULL
role                text NOT NULL        -- 'petugas' | 'analis' | 'admin'
wilayah_assignment  text                 -- kabupaten/kota yang menjadi tanggung jawab
is_active           boolean DEFAULT true
created_at          timestamptz DEFAULT now()
```

**`families`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
nik_kk              text UNIQUE NOT NULL
nama_kk             text NOT NULL
provinsi            text
kabupaten           text NOT NULL
kecamatan           text NOT NULL
kelurahan           text NOT NULL
rt                  text
rw                  text
jumlah_anggota      integer
jenis_kelamin_kk    text            -- 'L' | 'P'
usia_kk             integer
created_by          uuid REFERENCES users(id)
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
last_refreshed_at   timestamptz    -- last time quarterly sync updated this record
```

**`socioeconomic_data`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
family_id           uuid REFERENCES families(id) ON DELETE CASCADE
snapshot_date       date NOT NULL           -- tanggal data ini diambil/diinput
education           text                    -- 'SD' | 'SMP' | 'SMA' | 'D3' | 'S1' | 'Tidak Sekolah'
employment_status   text                    -- 'bekerja' | 'tidak_bekerja' | 'wirausaha' | 'petani'
income_source       text
income_range        text                    -- '<500rb' | '500rb-1jt' | '1jt-2jt' | '>2jt'
assets              jsonb                   -- ["motor", "TV", "kulkas", ...]
access_water        boolean
access_sanitation   boolean
access_electricity  boolean
current_bansos      jsonb                   -- ["PKH", "BPNT", "PIP", ...]
stunting_status     boolean DEFAULT false
is_current          boolean DEFAULT true    -- only one record per family is "current"
source              text DEFAULT 'manual'   -- 'manual' | 'dtsen_sync' | 'regsosek_sync'
created_at          timestamptz DEFAULT now()
```
> Ketika quarterly refresh memperbarui data, record lama di-set `is_current = false`,
> lalu record baru diinsert dengan `is_current = true`. Ini menjaga riwayat data sosek.

**`assessments`**
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
family_id       uuid REFERENCES families(id)
assessed_by     uuid REFERENCES users(id)
assessment_type text DEFAULT 'initial'       -- 'initial' | 'quarterly_eval' | 'manual_reeval'
trigger_reason  text                         -- 'new_family' | 'desil_change' | 'manual_request'
status          text DEFAULT 'pending'       -- 'pending' | 'completed' | 'needs_review' | 'validated'
assessed_at     timestamptz DEFAULT now()
```

**`model1_results`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id       uuid REFERENCES assessments(id)
desil               integer NOT NULL     -- 1–10
vulnerability_score float
classification_label text
reasoning           jsonb
risk_tags           jsonb
generated_at        timestamptz DEFAULT now()
```

**`model2_results`**
```sql
id                      uuid PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id           uuid REFERENCES assessments(id)
overall_classification  text        -- 'Layak Huni' | 'Tidak Layak Huni' | 'Perlu Perbaikan'
per_image_results       jsonb
generated_at            timestamptz DEFAULT now()
```

**`model3_results`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id       uuid REFERENCES assessments(id)
recommendations     jsonb
evaluation_mode     text DEFAULT 'initial'   -- 'initial' | 'penambahan' | 'penghentian'
generated_at        timestamptz DEFAULT now()
regenerated         boolean DEFAULT false
regeneration_notes  text        -- catatan petugas yang menjadi konteks re-generate
```

**`house_images`**
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id   uuid REFERENCES assessments(id)
storage_path    text NOT NULL
public_url      text
uploaded_at     timestamptz DEFAULT now()
```

**`validations`**
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
assessment_id   uuid REFERENCES assessments(id) UNIQUE
validated_by    uuid REFERENCES users(id)
status          text DEFAULT 'pending'    -- 'pending' | 'approved' | 'rejected'
notes           text
override_desil  integer                   -- nullable; jika petugas override hasil AI
validated_at    timestamptz
```

---

### Quarterly Refresh Tables

**`data_refresh_cycles`**
```sql
id                          uuid PRIMARY KEY DEFAULT gen_random_uuid()
cycle_quarter               text NOT NULL           -- e.g., 'Q1-2026', 'Q2-2026'
triggered_by                uuid REFERENCES users(id)  -- null if auto-triggered
trigger_type                text DEFAULT 'auto'     -- 'auto' | 'manual'
wilayah_scope               text DEFAULT 'all'      -- kabupaten name or 'all'
status                      text DEFAULT 'running'  -- 'running' | 'completed' | 'failed'
total_families_checked      integer DEFAULT 0
total_changed               integer DEFAULT 0
total_evaluations_created   integer DEFAULT 0
started_at                  timestamptz DEFAULT now()
completed_at                timestamptz
summary_report              jsonb                   -- stats per kabupaten
```

**`desil_change_events`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
family_id           uuid REFERENCES families(id)
refresh_cycle_id    uuid REFERENCES data_refresh_cycles(id)
previous_desil      integer NOT NULL
new_desil           integer NOT NULL
delta               integer             -- new_desil - previous_desil (computed)
change_direction    text                -- 'naik' | 'turun' | 'tetap' (computed)
significance        text                -- 'signifikan' (|delta|>=2) | 'minor' (|delta|=1) | 'tetap'
evaluation_action   text                -- 'evaluasi_penghentian' | 'evaluasi_penambahan' | 'none'
evaluation_status   text DEFAULT 'pending'  -- 'pending' | 'completed' | 'dismissed'
dismissed_reason    text                -- opsional, jika dismissed
detected_at         timestamptz DEFAULT now()
```

**`notifications`**
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
recipient_id        uuid REFERENCES users(id)
type                text    -- 'desil_change' | 'validation_needed' | 'refresh_complete' | 'system'
title               text NOT NULL
message             text NOT NULL
related_family_id   uuid REFERENCES families(id)
related_event_id    uuid            -- FK ke desil_change_events atau lainnya
is_read             boolean DEFAULT false
created_at          timestamptz DEFAULT now()
```

---

## 🗂 Application Pages & Routes

### Struktur Navigasi Sidebar

```
┌─────────────────────────┐
│  🏛 Asisten Jatim Sosial │
├─────────────────────────┤
│  📊 Dashboard            │  /dashboard
│  👨👩👧 Data Keluarga       │  /assessment
│  ✅ Validasi             │  /validasi
│  🔄 Evaluasi Perubahan   │  /evaluasi          ← QUARTERLY FEATURE
│  🏠 Analisis Rumah       │  /rutilahu
│  📋 Kebijakan            │  /kebijakan
│  🔔 Notifikasi           │  /notifikasi        ← QUARTERLY FEATURE
├─────────────────────────┤
│  ⚙️ Admin (admin only)   │  /admin
└─────────────────────────┘
```

---

### Referensi Endpoint & Flow Lengkap
Silakan merujuk pada direktori spesifik atau dokumentasi komponen untuk detail API Integration dan User Flows sesuai spesifikasinya.
