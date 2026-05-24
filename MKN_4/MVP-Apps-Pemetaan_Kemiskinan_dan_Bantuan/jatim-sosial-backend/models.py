import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, SmallInteger, JSON, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database import Base


# --- TABEL 1: USER (UNTUK LOGIN) ---
class User(Base):
    __tablename__ = "user"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

# --- TABEL 2: KELUARGA (DATA ASESMEN SOSIAL) ---
class Keluarga(Base):
    __tablename__ = "keluarga"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    no_kk = Column(String(100), unique=True, nullable=False)

    kode_provinsi = Column(Integer)
    provinsi = Column(String(100))

    kode_kabupaten_kota = Column(Integer)
    kabupaten_kota = Column(String(100))

    kode_kecamatan = Column(Integer)
    kecamatan = Column(String(100))

    kode_kelurahan_desa = Column(Integer)
    kelurahan_desa = Column(String(100))

    alamat = Column(Text)

    nama_kepala_keluarga = Column(String(255))

    id_status_keberadaan_keluarga = Column(Integer)

    jumlah_anggota_keluarga = Column(Integer)

    id_status_penguasaan_bangunan = Column(Integer)
    id_lantai_terluas = Column(Integer)
    luas_lantai_bangunan = Column(Integer)

    id_dinding_terluas = Column(Integer)
    id_atap_terluas = Column(Integer)

    id_sumber_airminum = Column(Integer)
    id_sumberpenerangan = Column(Integer)

    id_bb_utama = Column(Integer)

    id_fasilitas_bab = Column(Integer)
    id_jenis_kloset = Column(Integer)
    id_pembuangan_tinja = Column(Integer)

    kepemilikan_aset = Column(Integer)

    aset_bergerak_tabung_gas = Column(Integer)
    aset_bergerak_lemari_es = Column(Integer)
    aset_bergerak_ac = Column(Integer)
    aset_bergerak_pemanas_air = Column(Integer)
    aset_bergerak_telepon_rumah = Column(Integer)
    aset_bergerak_tv_datar = Column(Integer)
    aset_bergerak_emas_perhiasan = Column(Integer)
    aset_bergerak_komputer_laptop_tablet = Column(Integer)
    aset_bergerak_sepeda_motor = Column(Integer)
    aset_bergerak_sepeda = Column(Integer)
    aset_bergerak_mobil = Column(Integer)
    aset_bergerak_perahu = Column(Integer)
    aset_bergerak_kapal_perahu_motor = Column(Integer)
    aset_bergerak_smartphone = Column(Integer)

    lahan_tempat_lain = Column(Integer)
    rumah_tempat_lain = Column(Integer)

    jml_sapi = Column(Integer)
    jml_kerbau = Column(Integer)
    jml_kuda = Column(Integer)
    jml_babi = Column(Integer)
    jml_kambing_domba = Column(Integer)

    status_dtsen = Column(String(100))
    cut_off = Column(String(50))
    desil_nasional = Column(Integer)

    kpm_jawara = Column(Integer)
    putri_jawara = Column(Integer)
    aspd = Column(Integer)
    eks_ppks_jawara = Column(Integer)
    ppks_jawara = Column(Integer)

    kemiskinan_ekstrem = Column(Integer)
    pkh_plus = Column(Integer)

    bansos = Column(Text)

    foto_rumah = Column(Text)
    foto_rumah_tampak_dalam = Column(Text)

# --- TABEL 3: KELUARGA_HISTORY
class KeluargaHistory(Base):
    __tablename__ = "keluarga history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    no_kk = Column(String(100), unique=True, nullable=False)

    kode_provinsi = Column(Integer)
    provinsi = Column(String(100))

    kode_kabupaten_kota = Column(Integer)
    kabupaten_kota = Column(String(100))

    kode_kecamatan = Column(Integer)
    kecamatan = Column(String(100))

    kode_kelurahan_desa = Column(Integer)
    kelurahan_desa = Column(String(100))

    alamat = Column(Text)

    nama_kepala_keluarga = Column(String(255))

    id_status_keberadaan_keluarga = Column(Integer)

    jumlah_anggota_keluarga = Column(Integer)

    id_status_penguasaan_bangunan = Column(Integer)
    id_lantai_terluas = Column(Integer)
    luas_lantai_bangunan = Column(Integer)

    id_dinding_terluas = Column(Integer)
    id_atap_terluas = Column(Integer)

    id_sumber_airminum = Column(Integer)
    id_sumberpenerangan = Column(Integer)

    id_bb_utama = Column(Integer)

    id_fasilitas_bab = Column(Integer)
    id_jenis_kloset = Column(Integer)
    id_pembuangan_tinja = Column(Integer)

    kepemilikan_aset = Column(Integer)

    aset_bergerak_tabung_gas = Column(Integer)
    aset_bergerak_lemari_es = Column(Integer)
    aset_bergerak_ac = Column(Integer)
    aset_bergerak_pemanas_air = Column(Integer)
    aset_bergerak_telepon_rumah = Column(Integer)
    aset_bergerak_tv_datar = Column(Integer)
    aset_bergerak_emas_perhiasan = Column(Integer)
    aset_bergerak_komputer_laptop_tablet = Column(Integer)
    aset_bergerak_sepeda_motor = Column(Integer)
    aset_bergerak_sepeda = Column(Integer)
    aset_bergerak_mobil = Column(Integer)
    aset_bergerak_perahu = Column(Integer)
    aset_bergerak_kapal_perahu_motor = Column(Integer)
    aset_bergerak_smartphone = Column(Integer)

    lahan_tempat_lain = Column(Integer)
    rumah_tempat_lain = Column(Integer)

    jml_sapi = Column(Integer)
    jml_kerbau = Column(Integer)
    jml_kuda = Column(Integer)
    jml_babi = Column(Integer)
    jml_kambing_domba = Column(Integer)

    status_dtsen = Column(String(100))
    cut_off = Column(String(50))
    desil_nasional = Column(Integer)

    kpm_jawara = Column(Integer)
    putri_jawara = Column(Integer)
    aspd = Column(Integer)
    eks_ppks_jawara = Column(Integer)
    ppks_jawara = Column(Integer)

    kemiskinan_ekstrem = Column(Integer)
    pkh_plus = Column(Integer)

    bansos = Column(Text)

    foto_rumah = Column(Text)
    foto_rumah_tampak_dalam = Column(Text)

# --- TABEL 4: PERHITUNGAN (HASIL AI) ---
class Perhitungan(Base):
    __tablename__ = "perhitungan"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    keluarga_id = Column(UUID(as_uuid=True), ForeignKey("keluarga.id"), nullable=False, index=True)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    periode_asesmen = Column(String(10), nullable=True)
    diasesmen_pada  = Column(DateTime, default=datetime.utcnow)
    foto_id_digunakan          = Column(UUID(as_uuid=True), ForeignKey("foto.id"), nullable=True)
    reasoning_tim2             = Column(Text, nullable=True)
    ada_ketidaksesuaian_visual = Column(Boolean, nullable=True)
    reasoning_tim1   = Column(Text, nullable=True)
    desil_kemiskinan = Column(String(5), nullable=True)
    skor_prioritas   = Column(Integer, nullable=True)
    reasoning_tim3      = Column(Text, nullable=True)
    rekomendasi_bantuan = Column(JSONB, nullable=True)
    status_validasi = Column(String(20), default="Menunggu", nullable=False)
    catatan_petugas = Column(String(500), nullable=True)

# --- TABEL 5: FOTO RUMAH (MENGHUBUNGKAN KELUARGA DENGAN FOTO) ---
class Foto(Base):
    __tablename__ = "foto"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    keluarga_id = Column(
        UUID(as_uuid=True), ForeignKey("keluarga.id"), nullable=False, index=True
    )
    url_foto       = Column(String(500), nullable=False)
    periode        = Column(String(10), nullable=True, index=True)
    sumber         = Column(String(20), default="dtsen", nullable=False)
    nama_file_asli = Column(String(200), nullable=True)
    diunggah_pada  = Column(DateTime, default=datetime.utcnow, nullable=False)
