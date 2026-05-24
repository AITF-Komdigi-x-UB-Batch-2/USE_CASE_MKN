import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Search,
  Download,
  Plus,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  History
} from 'lucide-react';
import LoadingState from '../../components/ui/LoadingState';
import './Riwayat.css';

interface RiwayatProps {
  onLogout?: () => void;
}

const mockData = [
  {
    no: '#AN-20231001',
    nama: 'Budi Santoso',
    nik: '3578010203040001',
    desa: 'Genteng Kulon',
    kecamatan: 'Genteng',
    tanggal: '12 Okt 2023',
    desil: 1,
    status: 'Layak Bantu',
  },
  {
    no: '#AN-20231002',
    nama: 'Siti Aminah',
    nik: '3578010203040005',
    desa: 'Alun-alun Contong',
    kecamatan: 'Bubutan',
    tanggal: '14 Okt 2023',
    desil: 4,
    status: 'Proses',
  },
  {
    no: '#AN-20231003',
    nama: 'Agus Riyadi',
    nik: '3578010203040009',
    desa: 'Sawunggaling',
    kecamatan: 'Wonokromo',
    tanggal: '15 Okt 2023',
    desil: 9,
    status: 'Tidak Layak',
  },
  {
    no: '#AN-20231004',
    nama: 'Laila Sari',
    nik: '3578010203040012',
    desa: 'Kedungdoro',
    kecamatan: 'Tegalsari',
    tanggal: '16 Okt 2023',
    desil: 2,
    status: 'Layak Bantu',
  },
  {
    no: '#AN-20231005',
    nama: 'Eko Prasetyo',
    nik: '3578010203040025',
    desa: 'Peneleh',
    kecamatan: 'Genteng',
    tanggal: '18 Okt 2023',
    desil: 3,
    status: 'Proses',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Layak Bantu':
      return <span className="status-badge status-layak">Layak Bantu</span>;
    case 'Proses':
      return <span className="status-badge status-proses">Proses</span>;
    case 'Tidak Layak':
      return <span className="status-badge status-tidak-layak">Tidak Layak</span>;
    default:
      return <span className="status-badge">{status}</span>;
  }
};

const getDesilColor = (desil: number) => {
  if (desil <= 3) return 'progress-red';
  if (desil <= 6) return 'progress-orange';
  return 'progress-green';
};

const Riwayat: React.FC<RiwayatProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [kecFilter, setKecFilter] = useState('Semua Kecamatan');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(mockData);

  const handleFilterChange = () => {
    setIsLoading(true);
    // Simulate API call for filtering
    setTimeout(() => {
      let result = mockData;
      if (statusFilter !== 'Semua Status') {
        result = result.filter(item => item.status === statusFilter);
      }
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        result = result.filter(item => 
          item.nama.toLowerCase().includes(lowerSearch) || 
          item.nik.toLowerCase().includes(lowerSearch)
        );
      }
      // Assuming mock data has only a few specific kecamatans...
      setFilteredData(result);
      setIsLoading(false);
    }, 500);
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [searchTerm, statusFilter, kecFilter]);

  return (
    <AdminLayout title="Riwayat Analisis" onLogout={onLogout}>
      <div className="riwayat-page-wrapper">
        
        {/* Header Section */}
        <div className="riwayat-header">
          <div className="riwayat-title-area">
            <h3>Riwayat Analisis</h3>
            <p>Kelola dan tinjau riwayat keputusan dukungan sosial rumah tangga.</p>
          </div>
          <div className="riwayat-actions">
            <button className="btn-secondary">
              <Download size={16} /> Ekspor Laporan
            </button>
            <button className="btn-primary" onClick={() => navigate('/analisis-baru')}>
              <Plus size={16} /> Analisis Baru
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-card">
          <div className="filter-group">
            <label>PENCARIAN</label>
            <div className="input-with-icon">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Nama KRT / NIK" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-group">
            <label>STATUS ANALISIS</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Semua Status">Semua Status</option>
              <option value="Layak Bantu">Layak Bantu</option>
              <option value="Proses">Proses</option>
              <option value="Tidak Layak">Tidak Layak</option>
            </select>
          </div>

          <div className="filter-group">
            <label>KECAMATAN</label>
            <select value={kecFilter} onChange={(e) => setKecFilter(e.target.value)}>
              <option value="Semua Kecamatan">Semua Kecamatan</option>
              <option value="Genteng">Genteng</option>
              <option value="Bubutan">Bubutan</option>
              <option value="Wonokromo">Wonokromo</option>
              <option value="Tegalsari">Tegalsari</option>
            </select>
          </div>

          <div className="filter-group">
            <label>PERIODE</label>
            <div className="input-with-icon">
              <input type="date" placeholder="mm/dd/yyyy" />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="riwayat-table">
              <thead>
                <tr>
                  <th>NO. ANALISIS</th>
                  <th>KEPALA RUMAH TANGGA</th>
                  <th>KECAMATAN / DESA</th>
                  <th>TANGGAL INPUT</th>
                  <th>DESIL KESEJAHTERAAN</th>
                  <th>STATUS</th>
                  <th className="text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 0 }}>
                      <LoadingState />
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <p className="text-gray-500">Tidak ada data ditemukan.</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr key={index} className="table-row">
                      <td>
                        <a href="#" className="link-no-analisis" onClick={(e) => {
                          e.preventDefault();
                          navigate('/detail-hasil');
                        }}>
                          {row.no}
                        </a>
                      </td>
                      <td>
                        <div className="font-medium text-gray-900">{row.nama}</div>
                        <div className="text-sm text-gray-500">NIK: {row.nik}</div>
                      </td>
                      <td>
                        <div className="font-medium text-gray-900">{row.kecamatan}</div>
                        <div className="text-sm text-gray-500">{row.desa}</div>
                      </td>
                      <td className="text-gray-700">{row.tanggal}</td>
                      <td>
                        <div className="desil-info">
                          <span className={`desil-label ${getDesilColor(row.desil).replace('progress-', 'text-')}`}>
                            DESIL {row.desil}
                          </span>
                          <div className="progress-bar-container-sm">
                            <div 
                              className={`progress-bar-fill ${getDesilColor(row.desil)}`} 
                              style={{ width: `${row.desil * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon" 
                            title="Lihat Detail"
                            onClick={() => navigate('/detail-hasil')}
                          >
                            <Eye size={18} />
                          </button>
                          <button className="btn-icon" title="Opsi Lainnya">
                            <MoreVertical size={18} />
                          </button>
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
              Menampilkan <span className="font-semibold">1-{filteredData.length}</span> dari <span className="font-semibold">1,248</span> data
            </div>
            <div className="pagination-controls">
              <button className="btn-page"><ChevronLeft size={16} /></button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <span className="page-dots">...</span>
              <button className="btn-page">250</button>
              <button className="btn-page"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards-row">
          <div className="summary-card-bottom blue-card">
            <div className="card-icon blue-icon">
              <ClipboardList size={24} color="#1d4ed8" />
            </div>
            <div className="card-content">
              <span className="card-label blue-text">TOTAL LAYAK BANTU</span>
              <span className="card-value">842</span>
            </div>
          </div>
          
          <div className="summary-card-bottom orange-card">
            <div className="card-icon orange-icon">
              <Clock size={24} color="#b45309" />
            </div>
            <div className="card-content">
              <span className="card-label orange-text">SEDANG DITINJAU</span>
              <span className="card-value">156</span>
            </div>
          </div>

          <div className="summary-card-bottom gray-card">
            <div className="card-icon gray-icon">
              <History size={24} color="#4b5563" />
            </div>
            <div className="card-content">
              <span className="card-label gray-text">BULAN INI</span>
              <span className="card-value">250</span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Riwayat;
