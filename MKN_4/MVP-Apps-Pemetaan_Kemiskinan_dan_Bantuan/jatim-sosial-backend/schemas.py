from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

# Schema untuk response
class KeluargaResponse(BaseModel):
    id: UUID
    kode_provinsi: str
    provinsi: str
    kode_kabupaten_kota: str
    kabupaten_kota: str
    kode_kecamatan: str
    kecamatan: str
    kode_kelurahan_desa: str
    kelurahan_desa: str
    alamat: str
    nomor_kartu_keluarga: str
    jumlah_anggota_keluarga: int
    nama_anggota_keluarga: str
    pbi_nas: bool
    pbi_pemda: bool
    id_pelanggan_pln: Optional[str] = None
    status_kepemilikan_rumah: int
    jenis_lantai_terluas: int
    luas_lantai: int
    jenis_dinding_terluas: int
    jenis_atap_terluas: int
    sumber_air_minum_utama: int
    sumber_penerangan_utama: int
    daya_terpasang: int
    bahan_bakar_utama_memasak: int
    fasilitas_bab: int
    jenis_kloset: int
    pembuangan_akhir_tinja: int
    kepemilikan_aset: bool
    aset_bergerak_tabung_gas: bool
    aset_bergerak_lemari_es: bool
    aset_bergerak_ac: bool
    aset_bergerak_pemanas_air: bool
    aset_bergerak_telepon_rumah: bool
    aset_bergerak_tv_datar: bool
    aset_bergerak_emas_perhiasan: bool
    aset_bergerak_komputer_laptop_tablet: bool
    aset_bergerak_sepeda_motor: bool
    aset_bergerak_sepeda: bool
    aset_bergerak_mobil: bool
    aset_bergerak_perahu: bool
    aset_bergerak_kapal_perahu_motor: bool
    aset_bergerak_smartphone: bool
    aset_tidak_bergerak_lahan_lainnya: bool
    aset_tidak_bergerak_rumah_lainnya: bool
    jumlah_ternak_sapi: int
    jumlah_ternak_kerbau: int
    jumlah_ternak_kuda: int
    jumlah_ternak_babi: int
    jumlah_ternak_kambing_domba: int
    skor: Optional[int] = None
    desil_nasional: Optional[int] = None

    class Config:
        from_attributes = True

# Schema tabel perhitungan (hasil AI)
class PerhitunganResponse(BaseModel):
    id: UUID
    keluarga_id: UUID
    rekomendasi_bantuan: Optional[str] = None
    keterangan_tambahan: Optional[str] = None
    kondisi_rumah: Optional[str] = None
    foto_url: Optional[str] = None
    status_validasi: Optional[str] = None

    class Config:
        from_attributes = True

# Schema request
class TriggerAsesmenRequest(BaseModel):
    keluarga_id: UUID

class UserCreate(BaseModel):
    email: str = Field(..., example="admin@dinsos.go.id")
    username: str = Field(..., example="admin_jatim")
    password: str = Field(..., example="admin123")