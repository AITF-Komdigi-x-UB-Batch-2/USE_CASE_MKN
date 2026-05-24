import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Search,
  Download,
  Plus,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FileBarChart,
} from 'lucide-react';
import TimelineModal, { type TimelineEvent } from '../../components/ui/TimelineModal';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import './ManajemenBantuan.css';

/* ─── Types ──────────────────────────────── */

interface ManajemenBantuanProps {
  onLogout?: () => void;
}

type Tahap = 'analisis' | 'validasi' | 'aktif' | 'evaluasi';
type TabKey = 'semua' | Tahap;

interface DataRow {
  id: string;
  idLabel: string;
  tanggal: string;
  nama: string;
  nik: string;
  wilayah: string;
  kecamatan: string;
  desil: number;
  tahap: Tahap;
  bantuan?: string;
  desilSebelum?: number;
  desilSesudah?: number;
  timeline?: TimelineEvent[];
}

/* ─── Mock Data ──────────────────────────── */

const timelineAktif: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '10 Feb 2024, 08:30', isComplete: true },
  { status: 'Diproses', timestamp: '18 Feb 2024, 11:20', isComplete: true, notes: 'Sedang diverifikasi oleh dinas terkait.' },
  { status: 'Disalurkan', timestamp: '', isComplete: false },
  { status: 'Selesai', timestamp: '', isComplete: false },
];

const timelineSelesai: TimelineEvent[] = [
  { status: 'Disetujui', timestamp: '01 Nov 2023, 09:00', isComplete: true },
  { status: 'Diproses', timestamp: '05 Nov 2023, 14:30', isComplete: true },
  { status: 'Disalurkan', timestamp: '12 Nov 2023, 10:15', isComplete: true },
  { status: 'Selesai', timestamp: '15 Nov 2023, 16:00', isComplete: true },
];

const mockData: DataRow[] = [
  // Analisis
  { id: '1', idLabel: '#AN-20231001', tanggal: '12 Okt 2023', nama: 'Budi Santoso', nik: '3578012300094001', wilayah: 'Surabaya', kecamatan: 'Genteng', desil: 1, tahap: 'analisis' },
  { id: '2', idLabel: '#AN-20231002', tanggal: '14 Okt 2023', nama: 'Siti Aminah', nik: '3578012300094005', wilayah: 'Sidoarjo', kecamatan: 'Gedangan', desil: 4, tahap: 'analisis' },
  { id: '3', idLabel: '#AN-20231003', tanggal: '15 Okt 2023', nama: 'Agus Riyadi', nik: '3578012300094009', wilayah: 'Surabaya', kecamatan: 'Wonokromo', desil: 9, tahap: 'analisis' },
  // Validasi
  { id: '4', idLabel: '#KS-09412', tanggal: '12 Okt 2023', nama: 'Dewi Lestari', nik: '3578056001000012', wilayah: 'Surabaya', kecamatan: 'Sawahan', desil: 1, tahap: 'validasi', bantuan: 'PKH' },
  { id: '5', idLabel: '#KS-09413', tanggal: '13 Okt 2023', nama: 'Agus Setiawan', nik: '3515041101900015', wilayah: 'Gresik', kecamatan: 'Kebomas', desil: 2, tahap: 'validasi', bantuan: 'BPNT' },
  { id: '6', idLabel: '#KS-09415', tanggal: '14 Okt 2023', nama: 'Rina Wulandari', nik: '3578022201890018', wilayah: 'Sidoarjo', kecamatan: 'Waru', desil: 3, tahap: 'validasi', bantuan: 'BST' },
  // Bantuan Aktif
  { id: '7', idLabel: '#BTN-PKH-8821', tanggal: '10 Feb 2024', nama: 'M. Nurul Huda', nik: '3578034502780020', wilayah: 'Gresik', kecamatan: 'Kebomas', desil: 1, tahap: 'aktif', bantuan: 'PKH', timeline: timelineAktif },
  { id: '8', idLabel: '#BTN-BPT-8822', tanggal: '15 Jan 2024', nama: 'Lilik Handayani', nik: '3578045603670023', wilayah: 'Malang', kecamatan: 'Lowokwaru', desil: 2, tahap: 'aktif', bantuan: 'BPNT', timeline: timelineSelesai },
  { id: '9', idLabel: '#BTN-BLT-8823', tanggal: '20 Feb 2024', nama: 'Wahyu Pratama', nik: '3578015504550026', wilayah: 'Surabaya', kecamatan: 'Tambaksari', desil: 3, tahap: 'aktif', bantuan: 'BLT BBM', timeline: timelineAktif },
  // Evaluasi
  { id: '10', idLabel: '#EV-40101', tanggal: '01 Mar 2024', nama: 'Sri Mulyani', nik: '3578027708430030', wilayah: 'Surabaya', kecamatan: 'Genteng', desil: 2, tahap: 'evaluasi', bantuan: 'PKH', desilSebelum: 1, desilSesudah: 3 },
  { id: '11', idLabel: '#EV-40102', tanggal: '05 Mar 2024', nama: 'Joko Widodo', nik: '3578038809320033', wilayah: 'Sidoarjo', kecamatan: 'Gedangan', desil: 4, tahap: 'evaluasi', bantuan: 'BPNT', desilSebelum: 2, desilSesudah: 5 },
  { id: '12', idLabel: '#EV-40103', tanggal: '10 Mar 2024', nama: 'Endang Susilowati', nik: '3578049910210036', wilayah: 'Malang', kecamatan: 'Klojen', desil: 3, tahap: 'evaluasi', bantuan: 'BST', desilSebelum: 3, desilSesudah: 3 },
];

/* ─── Helpers ────────────────────────────── */

const TABS: { key: TabKey; label: string; dotColor: string }[] = [
  { key: 'semua', label: 'Semua', dotColor: '#6b7280' },
  { key: 'analisis', label: 'Analisis', dotColor: '#3b82f6' },
  { key: 'validasi', label: 'Perlu Validasi', dotColor: '#f97316' },
  { key: 'aktif', label: 'Bantuan Aktif', dotColor: '#14b8a6' },
  { key: 'evaluasi', label: 'Evaluasi', dotColor: '#22c55e' },
];

const getDesilColor = (desil: number) => {
  if (desil <= 3) return 'red';
  if (desil <= 6) return 'orange';
  return 'green';
};

const getStageBadgeClass = (tahap: Tahap) => {
  switch (tahap) {
    case 'analisis': return 'mb-badge-analisis';
    case 'validasi': return 'mb-badge-validasi';
    case 'aktif': return 'mb-badge-aktif';
    case 'evaluasi': return 'mb-badge-evaluasi';
  }
};

const getStageBadgeLabel = (tahap: Tahap) => {
  switch (tahap) {
    case 'analisis': return 'Analisis';
    case 'validasi': return 'Validasi';
    case 'aktif': return 'Aktif';
    case 'evaluasi': return 'Evaluasi';
  }
};

const getEmptyMessage = (tab: TabKey) => {
  switch (tab) {
    case 'semua': return 'Belum ada data bantuan untuk ditampilkan.';
    case 'analisis': return 'Tidak ada riwayat analisis pada periode ini.';
    case 'validasi': return 'Tidak ada permohonan yang menunggu validasi.';
    case 'aktif': return 'Tidak ada bantuan aktif saat ini.';
    case 'evaluasi': return 'Belum ada data evaluasi tersedia.';
  }
};

/* ─── Component ──────────────────────────── */

const ManajemenBantuan: React.FC<ManajemenBantuanProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<TabKey>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterWilayah, setFilterWilayah] = useState('Semua');
  const [filterBantuan, setFilterBantuan] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataRow[]>(mockData);

  // Timeline modal
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEvent[] | null>(null);

  // Simulate loading on filter/tab change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab, searchTerm, filterStatus, filterWilayah, filterBantuan]);

  // Counts per tab (before search/filter)
  const tabCounts = useMemo(() => ({
    semua: data.length,
    analisis: data.filter(d => d.tahap === 'analisis').length,
    validasi: data.filter(d => d.tahap === 'validasi').length,
    aktif: data.filter(d => d.tahap === 'aktif').length,
    evaluasi: data.filter(d => d.tahap === 'evaluasi').length,
  }), [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = data;

    // Tab filter
    if (activeTab !== 'semua') {
      result = result.filter(d => d.tahap === activeTab);
    }

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.nama.toLowerCase().includes(lower) ||
        d.nik.includes(lower) ||
        d.idLabel.toLowerCase().includes(lower)
      );
    }

    // Status filter (maps to tahap)
    if (filterStatus !== 'Semua') {
      const mapping: Record<string, Tahap> = {
        'Analisis': 'analisis',
        'Validasi': 'validasi',
        'Aktif': 'aktif',
        'Evaluasi': 'evaluasi',
      };
      if (mapping[filterStatus]) {
        result = result.filter(d => d.tahap === mapping[filterStatus]);
      }
    }

    // Wilayah filter
    if (filterWilayah !== 'Semua') {
      result = result.filter(d => d.wilayah === filterWilayah);
    }

    // Bantuan filter
    if (filterBantuan !== 'Semua') {
      result = result.filter(d => d.bantuan === filterBantuan);
    }

    return result;
  }, [data, activeTab, searchTerm, filterStatus, filterWilayah, filterBantuan]);

  // Actions
  const handleApprove = (id: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, tahap: 'aktif' as Tahap, bantuan: d.bantuan || 'PKH', timeline: timelineAktif } : d));
  };

  const handleReject = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('Semua');
    setFilterWilayah('Semua');
    setFilterBantuan('Semua');
  };

  // Determine what columns to show
  const showDesil = activeTab !== 'aktif';
  const showBantuan = activeTab !== 'analisis';
  const showStageBadge = activeTab === 'semua';
  const showDesilChange = activeTab === 'evaluasi';

  const colCount = 4
    + (showDesil ? 1 : 0)
    + (showStageBadge ? 1 : 0)
    + (showBantuan ? 1 : 0)
    + (showDesilChange ? 1 : 0)
    + 1; // aksi

  return (
    <AdminLayout title="Manajemen Bantuan" onLogout={onLogout}>
      <div className="mb-page-wrapper">

        {/* ── Header ────────────────────────── */}
        <div className="mb-header">
          <div className="mb-title-area">
            <h3>Manajemen Bantuan</h3>
            <p>Kelola seluruh siklus bantuan mulai dari analisis hingga evaluasi dalam satu halaman terpusat.</p>
          </div>
          <div className="mb-actions">
            <button className="mb-btn-secondary">
              <Download size={16} /> Ekspor Data
            </button>
            <button className="mb-btn-primary" onClick={() => navigate('/analisis-baru')}>
              <Plus size={16} /> Analisis Baru
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ────────────────── */}
        <div className="mb-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`mb-tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              disabled={isLoading}
            >
              <span className="mb-tab-dot" style={{ backgroundColor: tab.dotColor }} />
              {tab.label}
              <span className="mb-tab-count">{tabCounts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* ── Filter & Search ───────────────── */}
        <div className="mb-filter-bar">
          <div className="mb-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Cari Nama / NIK / ID Analisis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-filter-group">
            <label>STATUS</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Status</option>
              <option value="Analisis">Analisis</option>
              <option value="Validasi">Validasi</option>
              <option value="Aktif">Aktif</option>
              <option value="Evaluasi">Evaluasi</option>
            </select>
          </div>

          <div className="mb-filter-group">
            <label>WILAYAH</label>
            <select value={filterWilayah} onChange={e => setFilterWilayah(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Wilayah</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Sidoarjo">Sidoarjo</option>
              <option value="Gresik">Gresik</option>
              <option value="Malang">Malang</option>
            </select>
          </div>

          <div className="mb-filter-group">
            <label>JENIS BANTUAN</label>
            <select value={filterBantuan} onChange={e => setFilterBantuan(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Jenis</option>
              <option value="PKH">PKH</option>
              <option value="BPNT">BPNT</option>
              <option value="BST">BST</option>
              <option value="BLT BBM">BLT BBM</option>
            </select>
          </div>

          <button className="mb-btn-reset" onClick={resetFilters} disabled={isLoading}>
            Reset Filter
          </button>
        </div>

        {/* ── Data Table ────────────────────── */}
        <div className="mb-table-card">
          <div className="mb-table-responsive">
            <table className="mb-table">
              <thead>
                <tr>
                  <th>ID / TANGGAL</th>
                  <th>NAMA PENERIMA</th>
                  <th>WILAYAH</th>
                  {showDesil && <th>DESIL</th>}
                  {showStageBadge && <th>STATUS TAHAP</th>}
                  {showBantuan && <th>BANTUAN</th>}
                  {showDesilChange && <th>PERUBAHAN DESIL</th>}
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={colCount} style={{ padding: 0 }}>
                      <LoadingState />
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} style={{ padding: 0 }}>
                      <EmptyState
                        title="Tidak ada data pada tahap ini"
                        description={getEmptyMessage(activeTab)}
                        onReset={resetFilters}
                      />
                    </td>
                  </tr>
                ) : (
                  filteredData.map(row => (
                    <tr key={row.id}>
                      {/* ID / Tanggal */}
                      <td>
                        <a
                          href="#"
                          className="mb-cell-link"
                          onClick={e => { e.preventDefault(); navigate('/detail-hasil'); }}
                        >
                          {row.idLabel}
                        </a>
                        <div className="mb-cell-secondary">{row.tanggal}</div>
                      </td>

                      {/* Nama */}
                      <td>
                        <div className="mb-cell-primary">{row.nama}</div>
                        <div className="mb-cell-secondary">NIK: {row.nik}</div>
                      </td>

                      {/* Wilayah */}
                      <td>
                        <div className="mb-cell-primary">{row.wilayah}</div>
                        <div className="mb-cell-secondary">{row.kecamatan}</div>
                      </td>

                      {/* Desil */}
                      {showDesil && (
                        <td>
                          <div className="mb-desil-info">
                            <span className={`mb-desil-label ${getDesilColor(row.desil)}`}>
                              DESIL {row.desil}
                            </span>
                            <div className="mb-progress-bar">
                              <div
                                className={`mb-progress-fill ${getDesilColor(row.desil)}`}
                                style={{ width: `${row.desil * 10}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Stage Badge (only on Semua tab) */}
                      {showStageBadge && (
                        <td>
                          <span className={`mb-stage-badge ${getStageBadgeClass(row.tahap)}`}>
                            <span className="mb-badge-dot" />
                            {getStageBadgeLabel(row.tahap)}
                          </span>
                        </td>
                      )}

                      {/* Bantuan */}
                      {showBantuan && (
                        <td style={{ fontWeight: 500 }}>
                          {row.bantuan || '—'}
                        </td>
                      )}

                      {/* Desil Change (Evaluasi only) */}
                      {showDesilChange && (
                        <td>
                          {row.desilSebelum !== undefined && row.desilSesudah !== undefined ? (
                            <div className="mb-desil-change">
                              <span>Desil {row.desilSebelum}</span>
                              <ArrowRight size={14} className="mb-desil-arrow" />
                              <span>Desil {row.desilSesudah}</span>
                              {row.desilSesudah > row.desilSebelum ? (
                                <span className="mb-desil-improved">↑ Naik</span>
                              ) : row.desilSesudah < row.desilSebelum ? (
                                <span className="mb-desil-declined">↓ Turun</span>
                              ) : (
                                <span className="mb-desil-unchanged">= Tetap</span>
                              )}
                            </div>
                          ) : '—'}
                        </td>
                      )}

                      {/* Actions */}
                      <td>
                        <div className="mb-action-cell">
                          <button
                            className="mb-btn-icon"
                            title="Lihat Detail"
                            onClick={() => navigate('/detail-hasil')}
                          >
                            <Eye size={18} />
                          </button>

                          {/* Validasi-specific */}
                          {row.tahap === 'validasi' && (
                            <>
                              <button className="mb-btn-approve" onClick={() => handleApprove(row.id)}>
                                Setujui
                              </button>
                              <button className="mb-btn-reject" onClick={() => handleReject(row.id)}>
                                Tolak
                              </button>
                            </>
                          )}

                          {/* Aktif-specific */}
                          {row.tahap === 'aktif' && row.timeline && (
                            <button className="mb-btn-timeline" onClick={() => setSelectedTimeline(row.timeline!)}>
                              <Clock size={14} /> Timeline
                            </button>
                          )}

                          {/* Evaluasi-specific */}
                          {row.tahap === 'evaluasi' && (
                            <button className="mb-btn-review" onClick={() => navigate('/detail-hasil')}>
                              <FileBarChart size={14} /> Review
                            </button>
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
          {!isLoading && filteredData.length > 0 && (
            <div className="mb-pagination">
              <div className="mb-pagination-info">
                Menampilkan <strong>1–{filteredData.length}</strong> dari <strong>{filteredData.length}</strong> data
              </div>
              <div className="mb-pagination-controls">
                <button className="mb-page-btn"><ChevronLeft size={16} /></button>
                <button className="mb-page-btn active">1</button>
                <button className="mb-page-btn"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Timeline Modal (reused from StatusBantuan) */}
      <TimelineModal
        isOpen={!!selectedTimeline}
        timelineData={selectedTimeline || []}
        onClose={() => setSelectedTimeline(null)}
      />

    </AdminLayout>
  );
};

export default ManajemenBantuan;
