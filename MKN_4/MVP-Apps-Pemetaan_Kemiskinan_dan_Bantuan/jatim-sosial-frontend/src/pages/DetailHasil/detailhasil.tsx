import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { rawKeluargaData } from '../../data/dataKeluarga';
import { mockData } from '../../data/mockData';
import AdminLayout from '../../components/layout/AdminLayout';
import { SummaryCard } from '../../components/cards/SummaryCard';
import { RecommendationCard } from '../../components/cards/RecommendationCard';
import {
  Download,
  BarChart2,
  CheckCircle,
  BrainCircuit,
  Home,
  FileText,
  RefreshCw,
  ShieldCheck,
  User,
  Clock,
  ThumbsUp,
  Award,
  ArrowRight,
  Info
} from 'lucide-react';
import './DetailHasil.css';

interface DetailHasilProps {
  onLogout?: () => void;
}

const DetailHasil: React.FC<DetailHasilProps> = ({ onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTahap = location.state?.tahap || 'analisis';
  const desil = location.state?.desil || 1;
  const bantuanDariState = location.state?.bantuan || ['PKH'];
  const namaKeluarga = location.state?.nama || 'Bpk. Lailatur Coder';
  const nik = location.state?.nik || '35780120010002';
  const wilayah = location.state?.wilayah || 'Surabaya';
  const kecamatan = location.state?.kecamatan || 'Wonokromo';
  const tanggal = location.state?.tanggal || '24 Okt 2023';
  const aiReasoning = location.state?.aiReasoning || 'Jumlah anggota keluarga yang besar mengindikasikan beban ketergantungan tinggi yang menekan kapasitas ekonomi rumah tangga. Kepemilikan aset terbatas menunjukkan akumulasi kekayaan yang masih rendah.';

  const rawData = rawKeluargaData.find(k => k.id_keluarga === location.state?.id_keluarga) || rawKeluargaData[0];

  const familyId = location.state?.id_keluarga || id || 'FAM-001';
  const matchingMock = mockData.find(m => m.id_keluarga === familyId) || mockData[0];
  const skorKesejahteraan = location.state?.skorKesejahteraan !== undefined ? location.state.skorKesejahteraan : (matchingMock?.skorKesejahteraan || 0.15);

  const demografiText = `Keluarga ini berlokasi di Kecamatan ${rawData.nama_kecamatan}, ${rawData.nama_kabupaten_kota}, Provinsi ${rawData.nama_provinsi}. Terdiri dari ${rawData.jumlah_anggota_keluarga} orang anggota keluarga.`;
  const perumahanText = `Mereka menempati rumah berstatus ${rawData.status_kepemilikan_rumah} dengan luas lantai ${rawData.luas_lantai} meter persegi. Jenis lantai: ${rawData.jenis_lantai}; dinding: ${rawData.jenis_dinding}; atap: ${rawData.jenis_atap}. Sumber air minum utama dari ${rawData.sumber_air_minum}. Penerangan utama menggunakan ${rawData.sumber_penerangan}. Bahan bakar utama untuk memasak adalah ${rawData.bahan_bakar_memasak}. Fasilitas BAB: ${rawData.fasilitas_bab}.`;

  const hasAsetBergerak = rawData.tabung_gas || rawData.kulkas || rawData.ac || rawData.tv || rawData.sepeda_motor || rawData.sepeda || rawData.mobil || rawData.smartphone;
  const movingAssets = [
    rawData.tabung_gas ? 'Tabung Gas' : '',
    rawData.kulkas ? 'Kulkas' : '',
    rawData.ac ? 'AC' : '',
    rawData.tv ? 'TV' : '',
    rawData.sepeda_motor ? 'Sepeda Motor' : '',
    rawData.sepeda ? 'Sepeda' : '',
    rawData.mobil ? 'Mobil' : '',
    rawData.smartphone ? 'Smartphone' : ''
  ].filter(Boolean).join(', ');

  const asetText = `Aset bergerak yang dimiliki: ${hasAsetBergerak ? movingAssets : 'tidak ada'}. ${rawData.rumah_lain ? 'Memiliki rumah di tempat lain.' : 'Tidak memiliki rumah di tempat lain.'} ${rawData.lahan_lain ? 'Memiliki lahan lain.' : ''} Tidak memiliki hewan ternak berskala besar.`;

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    currentTahap !== 'analisis' ? bantuanDariState : []
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const isFinalized = currentTahap !== 'analisis';
  const [successMsg, setSuccessMsg] = useState('');

  const recommendations: any[] = [
    {
      id: 'PKH',
      title: 'PKH (Program Keluarga Harapan)',
      match: 98,
      desc: 'Bantuan tunai bersyarat untuk keluarga rentan dengan komponen kesehatan, pendidikan, atau kesejahteraan sosial.',
      reason: 'reason tim 1 2',
      isReceived: false
    },
    {
      id: 'BPNT',
      title: 'BPNT (Bantuan Pangan Non Tunai)',
      match: 88,
      desc: 'Bantuan sosial pangan yang disalurkan secara non tunai setiap bulan kepada Keluarga Penerima Manfaat.',
      reason: 'reason tim 1 2',
      isReceived: false
    },
    {
      id: 'BST',
      title: 'BST (Bantuan Sosial Tunai)',
      match: 75,
      desc: 'Bantuan berupa uang yang diberikan kepada keluarga miskin, tidak mampu, dan/atau rentan.',
      reason: 'reason tim 1 2',
      isReceived: false
    },
    {
      id: 'BLT BBM',
      title: 'BLT BBM',
      match: 65,
      desc: 'Bantuan Langsung Tunai kompensasi subsidi BBM untuk menjaga daya beli masyarakat.',
      reason: 'reason tim 1 2',
      isReceived: false
    }
  ];

  const handleToggleProgram = (id: string) => {
    if (isFinalized) return;

    setSelectedPrograms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConfirmAssistance = () => {
    if (selectedPrograms.length === 0) return;

    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setSuccessMsg('Pengajuan Bantuan Berhasil Disimpan!');
      setTimeout(() => navigate('/manajemen-bantuan'), 1500);
    }, 1500);
  };

  const handleActionReturn = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => navigate('/manajemen-bantuan'), 1500);
  };

  return (
    <AdminLayout title="Detail Analisis" onLogout={onLogout}>
      <div className="detail-page-wrapper">

        {/* Header Options */}
        <div className="detail-page-header flex-between">
          <div>
            <h2 className="title-family">
              Keluarga {namaKeluarga}
              <span className="badge-ai-verified">VERIFIKASI AI</span>
            </h2>
            <p className="subtitle-family">ID / NIK: {nik} • Kecamatan {kecamatan}, {wilayah} • Data per {tanggal}</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline">
              <Download size={16} /> Export PDF
            </button>
            <button className="btn-primary" onClick={() => navigate(`/detail-keluarga/${id || 1}`)}>
              <User size={16} /> Lihat Data Keluarga
            </button>
          </div>
        </div>

        {/* Success Notification */}
        {successMsg && (
          <div className="notification-toast success">
            <CheckCircle size={20} />
            {successMsg}
          </div>
        )}

        {/* Content Layout */}
        <div className="detail-content-layout">

          {/* Left Column (Main Analysis Data) */}
          <div className="detail-main-col">

            {/* Summary Cards */}
            <div className="summary-cards-container w-full">
              <SummaryCard
                label="DESIL KESEJAHTERAAN"
                icon={<BarChart2 size={16} className="text-blue" />}
                value={desil}
                maxValue="/ 10"
                desc="Klasifikasi tingkat kesejahteraan nasional"
              />
              <SummaryCard
                label="SKOR DESIL (KERENTANAN)"
                icon={<BrainCircuit size={16} className="text-purple" />}
                value={skorKesejahteraan.toFixed(3)}
                progress={{
                  value: skorKesejahteraan * 100,
                  colorClass: desil <= 3 ? 'red' : (desil <= 6 ? 'orange' : 'green')
                }}
                desc="Skor probabilitas kemiskinan model AI (0 s.d 1.0)"
              />
            </div>

            {/* AI Reasoning Section */}
            <div className="detail-card-section">
              <div className="detail-card-header">
                <BrainCircuit size={18} className="text-blue" />
                <h4>AI Reasoning & Analisis Kontekstual</h4>
              </div>
              <div className="detail-card-body">
                {/* 1. Analisis Kondisi */}
                <div className="analisis-kondisi-section">
                  <ul className="reasoning-list" style={{ marginBottom: '24px' }}>
                    <li style={{ alignItems: 'flex-start' }}>
                      <CheckCircle size={18} className="icon-tick text-blue" style={{ marginTop: '2px' }} />
                      <div>
                        <strong>Demografi & Lokasi:</strong>
                        <p style={{ lineHeight: '1.6', marginTop: '6px' }}>{demografiText}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Anggota: {rawData.jumlah_anggota_keluarga} Orang</span>
                          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Kec: {rawData.nama_kecamatan}</span>
                          <span style={{ fontSize: '12px', background: '#eff6ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>PBI: {rawData.penerima_bantuan_iuran_nasional === 'YA' ? 'Ya (Nasional)' : 'Tidak'}</span>
                        </div>
                      </div>
                    </li>
                    <li style={{ alignItems: 'flex-start' }}>
                      <CheckCircle size={18} className="icon-tick text-blue" style={{ marginTop: '2px' }} />
                      <div>
                        <strong>Kondisi Perumahan:</strong>
                        <p style={{ lineHeight: '1.6', marginTop: '6px' }}>{perumahanText}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Status: {rawData.status_kepemilikan_rumah}</span>
                          <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Sanitasi: {rawData.fasilitas_bab}</span>
                          <span style={{ fontSize: '12px', background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Listrik: {rawData.daya_listrik}</span>
                        </div>
                      </div>
                    </li>
                    <li style={{ alignItems: 'flex-start' }}>
                      <CheckCircle size={18} className="icon-tick text-blue" style={{ marginTop: '2px' }} />
                      <div>
                        <strong>Kepemilikan Aset & Ternak:</strong>
                        <p style={{ lineHeight: '1.6', marginTop: '6px' }}>{asetText}</p>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                          {hasAsetBergerak ? (
                            <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Aset: Ada ({movingAssets.split(',').length})</span>
                          ) : (
                            <span style={{ fontSize: '12px', background: '#fef2f2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Aset: Tidak Ada</span>
                          )}
                          <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#065f46', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>Rumah Lain: {rawData.rumah_lain ? 'Ya' : 'Tidak'}</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* 2. Reasoning */}
                <div className="reasoning-narasi-section" style={{ backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '10px', marginTop: 0 }}>Reasoning:</h5>
                  <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.7', margin: 0, textAlign: 'justify' }}>
                    {aiReasoning}
                  </p>

                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                      Bantuan: {bantuanDariState && bantuanDariState.length > 0 ? bantuanDariState.join(', ') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Analysis Section */}
            <div className="detail-card-section">
              <div className="detail-card-header">
                <Home size={18} className="text-blue" />
                <h4>Analisis Visual Hunian (Computer Vision)</h4>
              </div>
              <div className="detail-card-body">
                {/* Foto Centered */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <div className="visual-image-wrapper" style={{ width: '60%', maxWidth: '500px' }}>
                    <div className="placeholder-image">
                      <Home size={48} className="text-gray-400" />
                      <span className="img-caption">Foto Survey Lapangan - 12 Okt 2023</span>
                    </div>
                  </div>
                </div>

                {/* Tabel Komparasi */}
                <div className="visual-analysis-grid" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr', gap: '16px', alignItems: 'start' }}>
                  {/* Kolom 1: Data Survey */}
                  <div className="visual-conditions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: '4px' }}>DATA DTSEN</div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Atap: <strong style={{ color: '#334155' }}>Seng</strong></span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Dinding: <strong style={{ color: '#334155' }}>Tembok</strong></span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Lantai: <strong style={{ color: '#334155' }}>Keramik</strong></span>
                    </div>
                  </div>

                  {/* Kolom 2: Deteksi Comvis */}
                  <div className="visual-conditions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: '4px' }}>PREDIKSI COMVIS</div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Atap: <strong style={{ color: '#334155' }}>Genteng</strong></span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Dinding: <strong style={{ color: '#334155' }}>Tembok</strong></span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px' }}>
                      <span style={{ fontSize: '12px' }}>Lantai: <strong style={{ color: '#334155' }}>Granit/Marmer</strong></span>
                    </div>
                  </div>

                  {/* Kolom 3: Status Komparasi */}
                  <div className="visual-conditions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: '4px', textAlign: 'left' }}>STATUS</div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px', justifyContent: 'flex-start', backgroundColor: '#EF4444', border: 'none' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>Tidak Cocok</span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px', justifyContent: 'flex-start', backgroundColor: '#10B981', border: 'none' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>Cocok</span>
                    </div>
                    <div className="condition-item" style={{ margin: 0, padding: '10px', justifyContent: 'flex-start', backgroundColor: '#EF4444', border: 'none' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>Tidak Cocok</span>
                    </div>
                  </div>
                </div>

                <div className="visual-explanation" style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#1e40af', fontWeight: 600 }}>
                    <Info size={18} />
                    <span>Penjelasan Analisis:</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6', margin: 0, textAlign: 'justify' }}>
                    Berdasarkan hasil klasifikasi dan proses validasi terhadap data DTSEN, terdapat satu komponen yang sesuai dengan data referensi dan dua komponen yang tidak sesuai. Hasil klasifikasi menunjukkan bahwa atap menggunakan genteng, yang ditandai dengan pola susunan berulang dan bentuk khas material genteng pada bagian atas bangunan, sehingga tidak sesuai dengan data DTSEN yang menyebutkan seng. Pada bagian dinding, hasil klasifikasi menunjukkan material tembok, terlihat dari permukaan dinding yang bertekstur plester, sehingga sesuai dengan data DTSEN. Sementara itu, pada bagian lantai interior, hasil klasifikasi menunjukkan material granit/marmer, ditandai dengan permukaan yang halus, mengilap, dan memiliki pola khas batu alam, sehingga tidak sesuai dengan data DTSEN yang menyebutkan keramik.
                  </p>
                </div>
              </div>
            </div>

            {/* Assistance History Section */}
            <div className="detail-card-section">
              <div className="detail-card-header">
                <FileText size={18} className="text-blue" />
                <h4>Riwayat Bantuan Sebelumnya</h4>
              </div>
              <div className="detail-card-body">
                <div className="history-tags">
                  <span className="history-tag completed">
                    <CheckCircle size={14} /> BPNT (Selesai 2022)
                  </span>
                  <span className="history-tag active">
                    <RefreshCw size={14} /> BST (Sedang Berjalan)
                  </span>
                </div>
              </div>
            </div>

            {/* Smart Recommendations Section */}
            <div className="recommendations-container">
              <h3 className="section-title-large">Rekomendasi Program Bantuan</h3>
              <div className="recommendation-cards-grid">
                {recommendations.map(rec => (
                  <RecommendationCard
                    key={rec.id}
                    data={rec}
                    isSelected={selectedPrograms.includes(rec.id)}
                    isLocked={isFinalized}
                    onToggle={handleToggleProgram}
                  />
                ))}
              </div>
            </div>

            {/* Selected Assistance Confirmation Area */}
            {selectedPrograms.length > 0 && (
              <div className={`selected-assistance-section ${isFinalized ? 'finalized' : ''}`}>
                <div className="flex-between max-w-full">
                  <div>
                    <h4>{isFinalized ? 'Bantuan yang Akan Diterima (Disetujui)' : 'Bantuan yang Akan Diterima'}</h4>
                    <p>Program yang dipilih: {selectedPrograms.map(id => recommendations.find(r => r.id === id)?.title).join(', ')}</p>
                  </div>
                  {!isFinalized && (
                    <button
                      className={`btn-confirm-assistance ${isConfirming ? 'loading' : ''}`}
                      onClick={handleConfirmAssistance}
                      disabled={isConfirming}
                    >
                      {isConfirming ? 'Memproses...' : 'Konfirmasi Bantuan'}
                    </button>
                  )}
                  {isFinalized && (
                    <span className="badge-final"><CheckCircle size={16} /> Final Decision</span>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Dynamic Panel based on Tahap) */}
          <div className="detail-side-col">

            {/* PANEL: ANALISIS */}
            {currentTahap === 'analisis' && (
              <div className="validation-panel">
                <div className="panel-header">
                  <ShieldCheck size={18} className="text-blue" />
                  <h4>Validasi Petugas</h4>
                </div>
                <div className="panel-body">
                  <div className="form-group">
                    <label>Catatan Validasi</label>
                    <textarea
                      placeholder="Tambahkan observasi lapangan..."
                      rows={5}
                    ></textarea>
                  </div>
                  <div className="panel-actions" style={{ flexDirection: 'column' }}>
                    <button
                      className="btn-action approve w-full"
                      style={{ justifyContent: 'center' }}
                      onClick={handleConfirmAssistance}
                      disabled={selectedPrograms.length === 0 || isConfirming}
                    >
                      <CheckCircle size={18} /> {isConfirming ? 'Memproses...' : 'Kirim ke Tahap Validasi'}
                    </button>
                    {selectedPrograms.length === 0 && (
                      <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                        Pilih minimal satu program terlebih dahulu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: VALIDASI */}
            {currentTahap === 'validasi' && (
              <div className="validation-panel">
                <div className="panel-header">
                  <ShieldCheck size={18} className="text-orange" />
                  <h4>Validasi Supervisor</h4>
                </div>
                <div className="panel-body">
                  <div className="mb-4">
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>DIBUAT OLEH (PETUGAS)</label>
                    <p style={{ fontSize: '14px', background: '#f3f4f6', padding: '10px', borderRadius: '6px' }}>Keluarga layak mendapatkan PKH mengingat beban tanggungan lansia dan anak sangat berat.</p>
                  </div>
                  <div className="form-group">
                    <label>Catatan Validasi / Alasan Penolakan</label>
                    <textarea
                      placeholder="Masukkan alasan jika ingin mengembalikan..."
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="panel-actions" style={{ flexDirection: 'column' }}>
                    <button className="btn-action approve w-full" style={{ justifyContent: 'center' }} onClick={() => handleActionReturn('Pengajuan Disetujui!')}>
                      <ThumbsUp size={18} /> Setujui Bantuan
                    </button>
                    <button className="btn-action reject w-full" style={{ justifyContent: 'center', backgroundColor: '#fff1f2', color: '#be123c', border: '1px solid #fda4af' }} onClick={() => handleActionReturn('Data dikembalikan ke fase Analisis')}>
                      <RefreshCw size={18} /> Tolak & Kembalikan ke Analisis
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: AKTIF */}
            {currentTahap === 'aktif' && (
              <div className="validation-panel">
                <div className="panel-header" style={{ backgroundColor: '#f0fdfa' }}>
                  <Award size={18} className="text-teal" style={{ color: '#0d9488' }} />
                  <h4 style={{ color: '#0d9488' }}>Bantuan Aktif</h4>
                </div>
                <div className="panel-body">
                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#374151' }}>
                    Keluarga ini sedang terdaftar secara aktif sebagai penerima Bantuan Sosial. Dana rutin disalurkan pada minggu pertama setiap bulannya.
                  </p>
                  <button className="btn-action w-full" style={{ justifyContent: 'center', marginTop: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Clock size={18} /> Lihat Log Penyaluran
                  </button>
                </div>
              </div>
            )}

            {/* PANEL: EVALUASI */}
            {currentTahap === 'evaluasi' && (
              <div className="validation-panel">
                <div className="panel-header" style={{ backgroundColor: '#f0fdf4' }}>
                  <BarChart2 size={18} className="text-green" style={{ color: '#16a34a' }} />
                  <h4 style={{ color: '#16a34a' }}>Hasil Evaluasi Berkala</h4>
                </div>
                <div className="panel-body">
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                    <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Kondisi Mengalami Perbaikan
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '15px', fontWeight: 700 }}>
                      <span style={{ color: '#6b7280' }}>Desil 1</span>
                      <ArrowRight size={16} />
                      <span style={{ color: '#16a34a' }}>Desil 4</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tindakan Evaluasi</label>
                  </div>
                  <div className="panel-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                    <button className="btn-action approve w-full" style={{ justifyContent: 'center', backgroundColor: '#f3e8ff', color: '#7e22ce', border: '1px solid #d8b4fe' }} onClick={() => handleActionReturn('Keluarga telah Lulus/Selesai!')}>
                      <Award size={18} /> Keluarga Lulus (Selesai Bantuan)
                    </button>
                    <button className="btn-action w-full" style={{ justifyContent: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} onClick={() => handleActionReturn('Bantuan dilanjutkan')}>
                      <RefreshCw size={18} /> Lanjutkan Bantuan
                    </button>
                    <button className="btn-action w-full" style={{ justifyContent: 'center', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c' }} onClick={() => handleActionReturn('Sistem akan merestart rekomendasi bantuan')}>
                      <FileText size={18} /> Ubah Jenis Bantuan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: SELESAI */}
            {currentTahap === 'selesai' && (
              <div className="validation-panel">
                <div className="panel-header" style={{ backgroundColor: '#f3e8ff' }}>
                  <Award size={18} className="text-purple" style={{ color: '#7e22ce' }} />
                  <h4 style={{ color: '#7e22ce' }}>Riwayat Selesai</h4>
                </div>
                <div className="panel-body">
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircle size={48} color="#a855f7" style={{ margin: '0 auto 12px' }} />
                    <h5 style={{ fontSize: '16px', margin: '0 0 8px' }}>Program Berakhir</h5>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                      Bantuan untuk keluarga ini telah <strong>Selesai (Lulus)</strong> pada 20 Maret 2024 dikarenakan kondisi ekonomi yang sudah membaik.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailHasil;
