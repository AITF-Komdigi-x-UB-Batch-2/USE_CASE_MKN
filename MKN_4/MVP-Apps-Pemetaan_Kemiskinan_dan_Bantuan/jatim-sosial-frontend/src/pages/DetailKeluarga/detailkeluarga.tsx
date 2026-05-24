import React from 'react';
import { useParams } from 'react-router-dom';
import { rawKeluargaData } from '../../data/dataKeluarga';
import AdminLayout from '../../components/layout/AdminLayout';
import { MapPin, FileText, Home, Monitor, Leaf, ShieldCheck } from 'lucide-react';
import './DetailKeluarga.css';

interface DetailKeluargaProps {
  onLogout?: () => void;
}

const DetailKeluarga: React.FC<DetailKeluargaProps> = ({ onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const data = rawKeluargaData.find(k => k.id_keluarga === id) || rawKeluargaData[0];

  const desilColor = data.desil_kesejahteraan <= 3 ? '#ef4444' : data.desil_kesejahteraan <= 6 ? '#f97316' : '#22c55e';

  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="dk-info-row">
      <span className="dk-info-label">{label}</span>
      <span className="dk-info-value">{value ?? '—'}</span>
    </div>
  );

  const SectionCard = ({
    icon, title, color, children
  }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) => (
    <div className="dk-card">
      <div className="dk-card-header">
        <div className={`dk-card-icon icon-${color}`}>{icon}</div>
        <h4 className="dk-card-title">{title}</h4>
      </div>
      <div className="dk-card-body">{children}</div>
    </div>
  );

  const AsetItem = ({ label, jumlah }: { label: string; jumlah: number }) => (
    <div className={`dk-aset-item ${jumlah > 0 ? 'has-aset' : 'no-aset'}`}>
      <span className="dk-aset-label">{label}</span>
      <span className="dk-aset-count">{jumlah > 0 ? jumlah : '—'}</span>
    </div>
  );

  return (
    <AdminLayout title="Detail Keluarga" onLogout={onLogout}>
      <div className="detail-keluarga-wrapper">

        {/* Page Header */}
        <div className="dk-header">
          <div>
            <h2 className="dk-title">Detail Keluarga</h2>
            <p className="dk-subtitle">Data lengkap keluarga untuk keperluan analisis bantuan sosial</p>
          </div>
          <div className="dk-id-badge">
            <span className="dk-id-label">ID Keluarga</span>
            <span className="dk-id-value">{data.id_keluarga}</span>
          </div>
        </div>

        {/* Hero Info Strip */}
        <div className="dk-hero-strip">
          <div className="dk-hero-item">
            <span className="dk-hero-label">Nama Kepala Keluarga</span>
            <span className="dk-hero-value">{data.nama_kepala_keluarga}</span>
          </div>
          <div className="dk-hero-divider" />
          <div className="dk-hero-item">
            <span className="dk-hero-label">NIK</span>
            <span className="dk-hero-value">{data.nik_kepala_keluarga}</span>
          </div>
          <div className="dk-hero-divider" />
          <div className="dk-hero-item">
            <span className="dk-hero-label">No. KK</span>
            <span className="dk-hero-value">{data.nomor_kk}</span>
          </div>
          <div className="dk-hero-divider" />
          <div className="dk-hero-item">
            <span className="dk-hero-label">Desil Kesejahteraan</span>
            <span className="dk-hero-desil" style={{ color: desilColor, borderColor: desilColor }}>
              Desil {data.desil_kesejahteraan}
            </span>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="dk-grid">

          {/* Wilayah */}
          <SectionCard icon={<MapPin size={18} />} title="Informasi Wilayah" color="blue">
            <InfoRow label="Provinsi" value={data.nama_provinsi} />
            <InfoRow label="Kabupaten/Kota" value={data.nama_kabupaten_kota} />
            <InfoRow label="Kecamatan" value={data.nama_kecamatan} />
            <InfoRow label="Kelurahan/Desa" value={data.nama_kelurahan_desa} />
            <InfoRow label="Alamat Domisili" value={data.alamat_domisili} />
          </SectionCard>

          {/* Identitas */}
          <SectionCard icon={<FileText size={18} />} title="Identitas & Bantuan" color="purple">
            <InfoRow label="Jumlah Anggota" value={`${data.jumlah_anggota_keluarga} orang`} />
            <InfoRow label="ID Pelanggan PLN" value={data.id_pelanggan_pln || '—'} />
            <InfoRow label="Bantuan Iuran Nasional" value={data.penerima_bantuan_iuran_nasional} />
            <InfoRow label="Bantuan Iuran Pemda" value={data.penerima_bantuan_iuran_pemda} />
          </SectionCard>

          {/* Kondisi Rumah */}
          <SectionCard icon={<Home size={18} />} title="Kondisi Perumahan" color="green">
            <InfoRow label="Status Kepemilikan" value={data.status_kepemilikan_rumah} />
            <InfoRow label="Luas Lantai" value={`${data.luas_lantai} m²`} />
            <InfoRow label="Jenis Lantai" value={data.jenis_lantai} />
            <InfoRow label="Jenis Dinding" value={data.jenis_dinding} />
            <InfoRow label="Jenis Atap" value={data.jenis_atap} />
          </SectionCard>

          {/* Utilitas */}
          <SectionCard icon={<Monitor size={18} />} title="Utilitas & Sanitasi" color="orange">
            <InfoRow label="Sumber Air Minum" value={data.sumber_air_minum} />
            <InfoRow label="Sumber Penerangan" value={data.sumber_penerangan} />
            <InfoRow label="Daya Listrik" value={data.daya_listrik} />
            <InfoRow label="Bahan Bakar Masak" value={data.bahan_bakar_memasak} />
            <InfoRow label="Fasilitas BAB" value={data.fasilitas_bab} />
            <InfoRow label="Jenis Kloset" value={data.jenis_kloset} />
            <InfoRow label="Pembuangan Tinja" value={data.pembuangan_akhir_tinja} />
          </SectionCard>

          {/* Kepemilikan Aset */}
          <SectionCard icon={<ShieldCheck size={18} />} title="Kepemilikan Aset Bergerak" color="blue">
            <div className="dk-aset-grid">
              <AsetItem label="Tabung Gas" jumlah={data.tabung_gas} />
              <AsetItem label="Kulkas" jumlah={data.kulkas} />
              <AsetItem label="AC" jumlah={data.ac} />
              <AsetItem label="Water Heater" jumlah={data.water_heater} />
              <AsetItem label="TV" jumlah={data.tv} />
              <AsetItem label="Emas" jumlah={data.emas} />
              <AsetItem label="Komputer/Laptop" jumlah={data.komputer_laptop_tablet} />
              <AsetItem label="Sepeda Motor" jumlah={data.sepeda_motor} />
              <AsetItem label="Sepeda" jumlah={data.sepeda} />
              <AsetItem label="Mobil" jumlah={data.mobil} />
              <AsetItem label="Perahu" jumlah={data.perahu} />
              <AsetItem label="Kapal Motor" jumlah={data.kapal_motor} />
              <AsetItem label="Smartphone" jumlah={data.smartphone} />
              <AsetItem label="Telepon Rumah" jumlah={data.telepon_rumah} />
              <AsetItem label="Lahan Lain" jumlah={data.lahan_lain} />
              <AsetItem label="Rumah Lain" jumlah={data.rumah_lain} />
            </div>
          </SectionCard>

          {/* Ternak */}
          <SectionCard icon={<Leaf size={18} />} title="Kepemilikan Ternak" color="green">
            <div className="dk-aset-grid">
              <AsetItem label="Sapi" jumlah={data.jumlah_sapi} />
              <AsetItem label="Kerbau" jumlah={data.jumlah_kerbau} />
              <AsetItem label="Kuda" jumlah={data.jumlah_kuda} />
              <AsetItem label="Babi" jumlah={data.jumlah_babi} />
              <AsetItem label="Kambing/Domba" jumlah={data.jumlah_kambing_domba} />
            </div>
          </SectionCard>

        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailKeluarga;
