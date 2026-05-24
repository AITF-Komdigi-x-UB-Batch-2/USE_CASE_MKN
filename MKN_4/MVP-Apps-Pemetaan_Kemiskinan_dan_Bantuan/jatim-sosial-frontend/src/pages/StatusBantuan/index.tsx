import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { Search, Eye, Clock, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import TimelineModal, { type TimelineEvent } from '../../components/ui/TimelineModal';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import './StatusBantuan.css';

interface StatusBantuanProps {
  onLogout?: () => void;
}

type BantuanStatus = 'Aktif' | 'Selesai' | 'Tertunda';

interface BantuanData {
  id: string;
  idBantuan: string;
  nama: string;
  nik: string;
  jenis: string;
  tanggalMulai: string;
  progress: number;
  status: BantuanStatus;
  timeline: TimelineEvent[];
}

const mockTimelineDataSelesai: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '01 Nov 2023, 09:00', isComplete: true },
  { status: 'Diproses', timestamp: '05 Nov 2023, 14:30', isComplete: true },
  { status: 'Disalurkan', timestamp: '12 Nov 2023, 10:15', isComplete: true },
  { status: 'Selesai', timestamp: '15 Nov 2023, 16:00', isComplete: true }
];

const mockTimelineDataBerjalan: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '10 Feb 2024, 08:30', isComplete: true },
  { status: 'Diproses', timestamp: '18 Feb 2024, 11:20', isComplete: true, notes: 'Sedang diverifikasi oleh dinas terkait.' },
  { status: 'Disalurkan', timestamp: '', isComplete: false },
  { status: 'Selesai', timestamp: '', isComplete: false }
];

const mockData: BantuanData[] = [
  { id: '1', idBantuan: '#BTN-PKH-8821', nama: 'Budi Santoso', nik: '3578012300094xxx', jenis: 'PKH', tanggalMulai: '10 Feb 2024', progress: 50, status: 'Aktif', timeline: mockTimelineDataBerjalan },
  { id: '2', idBantuan: '#BTN-BPT-8822', nama: 'Siti Aminah', nik: '3571025500112xxx', jenis: 'BPNT', tanggalMulai: '15 Jan 2024', progress: 100, status: 'Selesai', timeline: mockTimelineDataSelesai },
  { id: '3', idBantuan: '#BTN-BLT-8823', nama: 'Agus Setiawan', nik: '3515041101900xxx', jenis: 'BLT BBM', tanggalMulai: '20 Feb 2024', progress: 20, status: 'Aktif', timeline: mockTimelineDataBerjalan },
  { id: '4', idBantuan: '#BTN-BST-8824', nama: 'Dewi Lestari', nik: '3578056001000xxx', jenis: 'BST', tanggalMulai: '05 Mar 2024', progress: 0, status: 'Tertunda', timeline: [
    { status: 'Disetujui', timestamp: '05 Mar 2024, 09:00', isComplete: true },
    { status: 'Diproses', timestamp: '', isComplete: false, notes: 'Menunggu kelengkapan dokumen administrasi.' },
    { status: 'Disalurkan', timestamp: '', isComplete: false },
    { status: 'Selesai', timestamp: '', isComplete: false }
  ]},
];

const StatusBantuan: React.FC<StatusBantuanProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [data] = useState<BantuanData[]>(mockData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Timeline Modal State
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEvent[] | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchQuery, filterJenis, filterStatus]);

  const filteredData = data.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) || item.nik.includes(searchQuery);
    const matchesJenis = filterJenis === 'Semua' || item.jenis === filterJenis;
    const matchesStatus = filterStatus === 'Semua' || item.status === filterStatus;
    return matchesSearch && matchesJenis && matchesStatus;
  });

  const countStatus = (status: BantuanStatus) => data.filter(d => d.status === status).length;

  const getStatusBadgeClass = (status: BantuanStatus) => {
    switch(status) {
      case 'Aktif': return 'sb-badge-aktif';
      case 'Selesai': return 'sb-badge-selesai';
      case 'Tertunda': return 'sb-badge-tertunda';
      default: return '';
    }
  };

  return (
    <AdminLayout title="Status Bantuan" onLogout={onLogout}>
      <div className="status-bantuan-wrapper">
        
        <div className="sb-header">
          <div>
            <h3>Status Bantuan</h3>
            <p>Monitor progres penyaluran bantuan sosial rumah tangga secara real-time.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="sb-summary-grid">
          <div className="sb-summary-card">
            <div className="sb-summary-icon blue"><Activity size={24} /></div>
            <div className="sb-summary-content">
              <span className="sb-summary-title">Total Bantuan Aktif</span>
              <span className="sb-summary-value text-blue-600">{countStatus('Aktif')}</span>
            </div>
          </div>
          <div className="sb-summary-card">
            <div className="sb-summary-icon green"><CheckCircle size={24} /></div>
            <div className="sb-summary-content">
              <span className="sb-summary-title">Bantuan Selesai</span>
              <span className="sb-summary-value text-green-600">{countStatus('Selesai')}</span>
            </div>
          </div>
          <div className="sb-summary-card">
            <div className="sb-summary-icon red"><AlertCircle size={24} /></div>
            <div className="sb-summary-content">
              <span className="sb-summary-title">Bantuan Tertunda</span>
              <span className="sb-summary-value text-red-600">{countStatus('Tertunda')}</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sb-filter-bar">
          <div className="sb-search-box">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari Nama / NIK..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="sb-filter-group">
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Jenis Bantuan</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BLT BBM">BLT BBM</option>
              <option value="BST">BST</option>
            </select>
          </div>
          <div className="sb-filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Tertunda">Tertunda</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="sb-table-card">
          <div className="table-responsive">
            <table className="sb-table">
              <thead>
                <tr>
                  <th>ID BANTUAN</th>
                  <th>PEMOHON / PENERIMA</th>
                  <th>JENIS</th>
                  <th>TANGGAL MULAI</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <LoadingState />
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <EmptyState 
                        title="Belum ada bantuan berjalan" 
                        description="Tidak ditemukan entri bantuan yang sesuai dengan pencarian atau filter Anda." 
                        onReset={() => {
                          setSearchQuery('');
                          setFilterJenis('Semua');
                          setFilterStatus('Semua');
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredData.map(row => (
                    <tr key={row.id}>
                      <td className="font-semibold text-gray-800">{row.idBantuan}</td>
                      <td>
                        <div className="font-semibold text-gray-900">{row.nama}</div>
                        <div className="text-xs text-gray-500">NIK: {row.nik}</div>
                      </td>
                      <td className="font-medium text-gray-700">{row.jenis}</td>
                      <td className="text-sm text-gray-600">{row.tanggalMulai}</td>
                      <td>
                        <span className={`sb-badge ${getStatusBadgeClass(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div className="sb-action-flex">
                          <button className="sb-btn-icon" title="Lihat Detail" onClick={() => navigate('/detail-hasil')}>
                            <Eye size={18} />
                          </button>
                          <button className="sb-btn-timeline" onClick={() => setSelectedTimeline(row.timeline)}>
                            <Clock size={16} /> Timeline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <TimelineModal 
        isOpen={!!selectedTimeline} 
        timelineData={selectedTimeline || []} 
        onClose={() => setSelectedTimeline(null)} 
      />

    </AdminLayout>
  );
};

export default StatusBantuan;
