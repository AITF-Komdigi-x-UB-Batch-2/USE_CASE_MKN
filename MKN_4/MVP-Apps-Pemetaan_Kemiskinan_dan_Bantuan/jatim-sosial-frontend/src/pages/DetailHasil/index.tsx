import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { SummaryCard } from '../../components/cards/SummaryCard';
import { RecommendationCard } from '../../components/cards/RecommendationCard';
import type { RecommendationData } from '../../components/cards/RecommendationCard';
import { 
  Download, 
  Share2, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle,
  BrainCircuit,
  Home,
  FileText,
  RefreshCw,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import './DetailHasil.css';

interface DetailHasilProps {
  onLogout?: () => void;
}

const DetailHasil: React.FC<DetailHasilProps> = ({ onLogout }) => {
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const recommendations: RecommendationData[] = [
    {
      id: 'pkh',
      title: 'PKH (Program Keluarga Harapan)',
      priority: 'HIGH',
      match: 98,
      desc: 'Bantuan tunai bersyarat untuk keluarga rentan dengan komponen kesehatan, pendidikan, atau kesejahteraan sosial.',
      estimate: 'Rp 1.200.000 / Tahap',
      isReceived: false
    },
    {
      id: 'rutilahu',
      title: 'Rutilahu (Rumah Tidak Layak Huni)',
      priority: 'MEDIUM',
      match: 85,
      desc: 'Bantuan perbaikan rumah tidak layak huni untuk meningkatkan kualitas hunian.',
      estimate: 'Perbaikan Atap & Lantai',
      isReceived: true
    },
    {
      id: 'bpjs',
      title: 'BPJS PBI (Penerima Bantuan Iuran)',
      priority: 'LOW',
      match: 72,
      desc: 'Bantuan iuran jaminan kesehatan nasional bagi fakir miskin dan orang tidak mampu.',
      estimate: 'Iuran Kelas 3 Gratis',
      isReceived: false
    }
  ];

  const handleToggleProgram = (id: string, isReceived: boolean) => {
    if (isFinalized) return;
    // Don't allow selecting program if already received (or just show a warning, but for now prevent it if strictly disabled)
    // Actually we can allow the user to select, but let's show a warning if they select a received one.
    // For simplicity, we disable the already received ones in the UI.

    if (isReceived) return;

    setSelectedPrograms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleConfirmAssistance = () => {
    if (selectedPrograms.length === 0) return;
    
    setIsConfirming(true);
    // Simulate API Call
    setTimeout(() => {
      setIsConfirming(false);
      setIsFinalized(true);
      setSuccessMsg('Rekomendasi Bantuan Berhasil Disimpan!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1500);
  };

  return (
    <AdminLayout title="Detail Analisis Page" onLogout={onLogout}>
      <div className="detail-page-wrapper">
        
        {/* Header Options */}
        <div className="detail-page-header flex-between">
          <div>
            <h2 className="title-family">
              Keluarga Bpk. Lailatur Coder
              <span className="badge-ai-verified">VERIFIKASI AI</span>
            </h2>
            <p className="subtitle-family">ID DTKS: 35780120010002 • Kelurahan Wonokromo, Surabaya • Data per 24 Okt 2023</p>
          </div>
          <div className="header-actions">
            <button className="btn-outline">
              <Download size={16} /> Export PDF
            </button>
            <button className="btn-primary">
              <Share2 size={16} /> Bagikan Laporan
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
            <div className="summary-cards-container">
              <SummaryCard 
                label="DESIL KESEJAHTERAAN" 
                icon={<BarChart2 size={16} className="text-blue" />} 
                value="1" 
                maxValue="/ 10" 
              />
              <SummaryCard 
                label="TINGKAT KERENTANAN" 
                icon={<AlertTriangle size={16} className="text-orange" />} 
                value="85%" 
                progress={{ value: 85, colorClass: "orange" }}
                desc="Risiko tinggi terhadap guncangan ekonomi"
              />
              <SummaryCard 
                label="CONFIDENCE SCORE" 
                icon={<CheckCircle size={16} className="text-green" />} 
                value="92%" 
                progress={{ value: 92, colorClass: "green" }}
                desc="Akurasi klasifikasi berdasarkan konsistensi data"
              />
            </div>

            {/* AI Reasoning Section */}
            <div className="detail-card-section">
              <div className="detail-card-header">
                <BrainCircuit size={18} className="text-blue" />
                <h4>AI Reasoning & Analisis Kontekstual</h4>
              </div>
              <div className="detail-card-body">
                <ul className="reasoning-list">
                  <li>
                    <CheckCircle size={18} className="icon-tick text-green" />
                    <div>
                      <strong>Diskrepansi Aset & Pendapatan</strong>
                      <p>Ditemukan ketidaksesuaian antara pendapatan yang dilaporkan (Rp 1.2jt) dengan rata-rata pengeluaran bulanan listrik (Rp 450rb).</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle size={18} className="icon-tick text-green" />
                    <div>
                      <strong>Kondisi Demografi Rentan</strong>
                      <p>Terdapat 2 lansia dan 1 anak usia sekolah tanpa tanggungan kepala keluarga yang tetap.</p>
                    </div>
                  </li>
                  <li>
                    <CheckCircle size={18} className="icon-tick text-green" />
                    <div>
                      <strong>Analisis Spasial</strong>
                      <p>Lokasi hunian berada di kawasan kumuh padat penduduk dengan akses sanitasi komunal.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Visual Analysis Section */}
            <div className="detail-card-section">
              <div className="detail-card-header">
                <Home size={18} className="text-blue" />
                <h4>Analisis Visual Hunian (Computer Vision)</h4>
              </div>
              <div className="detail-card-body visual-analysis-grid">
                <div className="visual-image-wrapper">
                  <div className="placeholder-image">
                    <Home size={48} className="text-gray-400" />
                    <span className="img-caption">Foto Survey Lapangan - 12 Okt 2023</span>
                  </div>
                </div>
                <div className="visual-conditions">
                  <h5>DETECTED CONDITIONS:</h5>
                  <div className="condition-item">
                    <span>Material Dinding: Papan/Kayu</span>
                    <span className="match-badge">98% Match</span>
                  </div>
                  <div className="condition-item">
                    <span>Kondisi Atap: Rusak Ringan</span>
                    <span className="match-badge">84% Match</span>
                  </div>
                  <div className="condition-item">
                    <span>Jenis Lantai: Semen/Tanah</span>
                    <span className="match-badge">95% Match</span>
                  </div>
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
                    <CheckCircle size={14} /> BPJS PBI (Selesai 2022)
                  </span>
                  <span className="history-tag active">
                    <RefreshCw size={14} /> Rutilahu (Sedang Berjalan)
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
                    <span className="badge-final"><CheckCircle size={16}/> Final Decision</span>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Validation Panel) */}
          <div className="detail-side-col">
            <div className="validation-panel">
              <div className="panel-header">
                <ShieldCheck size={18} className="text-blue" />
                <h4>Validasi Petugas</h4>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label>Catatan Validasi</label>
                  <textarea 
                    placeholder="Tambahkan observasi lapangan atau alasan keputusan..."
                    rows={8}
                  ></textarea>
                </div>

                <div className="panel-actions">
                  <button className="btn-action approve">
                    <CheckCircle size={18} /> Setujui Rekomendasi
                  </button>
                  <button className="btn-action reanalyze">
                    <RefreshCw size={18} /> Buat Ulang
                  </button>
                  <button className="btn-action reject">
                    <XCircle size={18} /> Tolak
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailHasil;
