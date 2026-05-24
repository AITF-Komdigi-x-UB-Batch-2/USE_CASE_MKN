import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Download, 
  RefreshCw, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Validasi.css';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

interface ValidasiProps {
  onLogout?: () => void;
}

type VerificationStatus = 'perlu_tindakan' | 'menunggu' | 'selesai' | 'ditolak';

interface MockData {
  id: string;
  idKasus: string;
  tanggal: string;
  nama: string;
  nik: string;
  prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
  skor: number;
  jenisBantuan: string;
  statusDtks: string;
  desil?: number;
  statusTab: VerificationStatus;
}

const initialMockData: MockData[] = [
  { id: '1', idKasus: '#KS-09412', tanggal: '12 Okt 2023, 09:15', nama: 'Budi Santoso', nik: '3578012300094xxx', prioritas: 'Tinggi', skor: 94, jenisBantuan: 'PKH - Ibu Hamil', statusDtks: 'Terdata', desil: 1, statusTab: 'perlu_tindakan' },
  { id: '2', idKasus: '#KS-09413', tanggal: '12 Okt 2023, 10:45', nama: 'Siti Aminah', nik: '3571025500112xxx', prioritas: 'Sedang', skor: 65, jenisBantuan: 'BPNT', statusDtks: 'Terdata', desil: 2, statusTab: 'perlu_tindakan' },
  { id: '3', idKasus: '#KS-09415', tanggal: '13 Okt 2023, 08:30', nama: 'Agus Setiawan', nik: '3515041101900xxx', prioritas: 'Rendah', skor: 21, jenisBantuan: 'BST', statusDtks: 'Belum Terdata', statusTab: 'perlu_tindakan' },
  { id: '4', idKasus: '#KS-09418', tanggal: '13 Okt 2023, 14:20', nama: 'Dewi Lestari', nik: '3578056001000xxx', prioritas: 'Tinggi', skor: 88, jenisBantuan: 'PKH - Lansia', statusDtks: 'Terdata', desil: 1, statusTab: 'perlu_tindakan' },
];

const Validasi: React.FC<ValidasiProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<MockData[]>(initialMockData);
  const [activeTab, setActiveTab] = useState<VerificationStatus>('perlu_tindakan');

  // Filter states
  const [filterPrioritas, setFilterPrioritas] = useState('Semua Prioritas');
  const [filterJenis, setFilterJenis] = useState('Semua Jenis');
  const [filterKabupaten, setFilterKabupaten] = useState('Semua Wilayah');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab, filterPrioritas, filterJenis, filterKabupaten]);

  const handleAction = (id: string, action: 'setuju' | 'tolak') => {
    setData(prevData => prevData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          statusTab: action === 'setuju' ? 'selesai' : 'ditolak'
        };
      }
      return item;
    }));
  };

  const getFilteredData = () => {
    let result = data.filter(item => item.statusTab === activeTab);
    
    if (filterPrioritas !== 'Semua Prioritas') {
        result = result.filter(item => item.prioritas === filterPrioritas);
    }
    
    return result;
  };

  const currentData = getFilteredData();

  const renderPrioritasBadge = (prioritas: string, skor: number) => {
    let colorClass = '';
    let dotColor = '';
    if (prioritas === 'Tinggi') {
      colorClass = 'badge-prioritas-tinggi';
      dotColor = '#dc2626';
    } else if (prioritas === 'Sedang') {
      colorClass = 'badge-prioritas-sedang';
      dotColor = '#d97706';
    } else {
      colorClass = 'badge-prioritas-rendah';
      dotColor = '#4b5563';
    }

    return (
      <div className={`badge-prioritas ${colorClass}`}>
        <span className="dot-indicator" style={{ backgroundColor: dotColor }}></span>
        {prioritas} ({skor}%)
      </div>
    );
  };

  const renderDtksBadge = (status: string, desil?: number) => {
    if (status === 'Terdata') {
      return <div className="badge-dtks-terdata">{status} (Desil {desil})</div>;
    }
    return <div className="badge-dtks-belum">{status}</div>;
  };

  return (
    <AdminLayout title="Antrean Validasi" onLogout={onLogout}>
      <div className="validasi-page-wrapper">
        
        {/* Header Section */}
        <div className="validasi-header">
          <div className="validasi-title-area">
            <h3>Antrean Validasi</h3>
            <p>Sistem Pendukung Keputusan Validasi Bantuan Sosial Provinsi Jawa Timur.</p>
          </div>
          <div className="validasi-actions">
            <button className="btn-secondary" disabled={isLoading}>
              <Download size={16} /> Ekspor Data
            </button>
            <button className="btn-primary" disabled={isLoading}>
              <RefreshCw size={16} /> Sinkronisasi DTKS
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="validasi-tabs">
          <button 
            className={`tab-item ${activeTab === 'perlu_tindakan' ? 'active' : ''}`}
            onClick={() => setActiveTab('perlu_tindakan')}
            disabled={isLoading}
          >
            <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', marginRight: '8px'}}></span>
            Perlu Tindakan
          </button>
          <button 
            className={`tab-item ${activeTab === 'menunggu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menunggu')}
            disabled={isLoading}
          >
            <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308', marginRight: '8px'}}></span>
            Menunggu Verifikasi
          </button>
          <button 
            className={`tab-item ${activeTab === 'selesai' ? 'active' : ''}`}
            onClick={() => setActiveTab('selesai')}
            disabled={isLoading}
          >
            <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', marginRight: '8px'}}></span>
            Selesai
          </button>
          <button 
            className={`tab-item ${activeTab === 'ditolak' ? 'active' : ''}`}
            onClick={() => setActiveTab('ditolak')}
            disabled={isLoading}
          >
            <span style={{display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6b7280', marginRight: '8px'}}></span>
            Ditolak
          </button>
        </div>

        {/* Filter Section */}
        <div className="filter-panel">
          <div className="filter-group">
            <label>PRIORITAS</label>
            <select value={filterPrioritas} onChange={(e) => setFilterPrioritas(e.target.value)} disabled={isLoading}>
              <option value="Semua Prioritas">Semua Prioritas</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>
          <div className="filter-group">
            <label>JENIS BANTUAN</label>
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} disabled={isLoading}>
              <option value="Semua Jenis">Semua Jenis</option>
              <option value="PKH - Ibu Hamil">PKH - Ibu Hamil</option>
              <option value="BPNT">BPNT</option>
              <option value="BST">BST</option>
            </select>
          </div>
          <div className="filter-group">
            <label>KABUPATEN/KOTA</label>
            <select value={filterKabupaten} onChange={(e) => setFilterKabupaten(e.target.value)} disabled={isLoading}>
              <option value="Semua Wilayah">Semua Wilayah</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Sidoarjo">Sidoarjo</option>
            </select>
          </div>
          <button className="btn-reset-filter" disabled={isLoading} onClick={() => {
            setFilterPrioritas('Semua Prioritas');
            setFilterJenis('Semua Jenis');
            setFilterKabupaten('Semua Wilayah');
          }}>
            Atur Ulang Filter
          </button>
        </div>

        {/* Table Section */}
        <div className="table-card-validasi">
          <div className="table-responsive">
            <table className="validasi-table">
              <thead>
                <tr>
                  <th>ID KASUS & TANGGAL</th>
                  <th>PEMOHON</th>
                  <th>SKOR PRIORITAS</th>
                  <th>JENIS BANTUAN</th>
                  <th>STATUS DTKS</th>
                  <th>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <LoadingState />
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <EmptyState onReset={() => {
                        setFilterPrioritas('Semua Prioritas');
                        setFilterJenis('Semua Jenis');
                        setFilterKabupaten('Semua Wilayah');
                      }} />
                    </td>
                  </tr>
                ) : (
                  currentData.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <a href="#" className="link-id-kasus" onClick={(e) => {
                            e.preventDefault();
                            navigate('/detail-hasil');
                        }}>
                          {row.idKasus}
                        </a>
                        <div className="sub-text">{row.tanggal}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-gray-900">{row.nama}</div>
                        <div className="sub-text">NIK: {row.nik}</div>
                      </td>
                      <td>
                        {renderPrioritasBadge(row.prioritas, row.skor)}
                      </td>
                      <td className="text-gray-700 font-medium">{row.jenisBantuan}</td>
                      <td>
                        {renderDtksBadge(row.statusDtks, row.desil)}
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="btn-icon-view" 
                            title="Lihat Detail"
                            onClick={() => navigate('/detail-hasil')}
                          >
                            <Eye size={18} />
                          </button>
                          {activeTab === 'perlu_tindakan' && (
                            <>
                              <button className="btn-action btn-setuju" onClick={() => handleAction(row.id, 'setuju')}>
                                Setujui
                              </button>
                              <button className="btn-action btn-tolak" onClick={() => handleAction(row.id, 'tolak')}>
                                Tolak
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-wrapper">
            <div className="pagination-info">
              Menampilkan <span className="font-semibold">{currentData.length > 0 ? '1' : '0'} - {currentData.length}</span> dari <span className="font-semibold">{activeTab === 'perlu_tindakan' ? (currentData.length === 0 ? '0' : '24') : currentData.length}</span> permohonan
            </div>
            <div className="pagination-controls">
              <button className="btn-page"><ChevronLeft size={16} /></button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <span className="page-dots">...</span>
              <button className="btn-page"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Validasi;
