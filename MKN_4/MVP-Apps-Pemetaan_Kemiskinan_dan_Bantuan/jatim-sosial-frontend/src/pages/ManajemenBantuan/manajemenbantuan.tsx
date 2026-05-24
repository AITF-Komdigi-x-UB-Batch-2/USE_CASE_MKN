import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Search,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FileBarChart,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';
import TimelineModal, { type TimelineEvent } from '../../components/ui/TimelineModal';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import { type Tahap, type AnalisisOutput, mockData } from '../../data/mockData';
import { rawKeluargaData } from '../../data/dataKeluarga';
import './ManajemenBantuan.css';

/* ─── Types ──────────────────────────────── */

export interface DataRow extends AnalisisOutput {
  nama: string;
  nik: string;
  wilayah: string;
  kecamatan: string;
  desil: number;
}

const joinedData: DataRow[] = mockData.map((output) => {
  const keluarga = rawKeluargaData.find(k => k.id_keluarga === output.id_keluarga);
  return {
    ...output,
    nama: keluarga ? keluarga.nama_kepala_keluarga : 'Data Tidak Ditemukan',
    nik: keluarga ? keluarga.nik_kepala_keluarga : '-',
    wilayah: keluarga ? keluarga.nama_kabupaten_kota : '-',
    kecamatan: keluarga ? keluarga.nama_kecamatan : '-',
    desil: keluarga ? keluarga.desil_kesejahteraan : 0,
  };
});

interface ManajemenBantuanProps {
  onLogout?: () => void;
}

type TabKey = 'semua' | Tahap;
type SortKey = 'id' | 'nama' | 'wilayah' | 'desil' | 'tahap' | 'bantuan' | 'perubahanDesil';

/* ─── Helpers ────────────────────────────── */

const TABS: { key: TabKey; label: string; dotColor: string }[] = [
  { key: 'semua', label: 'Semua', dotColor: '#6b7280' },
  { key: 'analisis', label: 'Analisis', dotColor: '#3b82f6' },
  { key: 'validasi', label: 'Perlu Validasi', dotColor: '#f97316' },
  { key: 'aktif', label: 'Bantuan Aktif', dotColor: '#14b8a6' },
  { key: 'evaluasi', label: 'Evaluasi', dotColor: '#22c55e' },
  { key: 'selesai', label: 'Selesai', dotColor: '#a855f7' },
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
    case 'selesai': return 'mb-badge-selesai';
  }
};

const getStageBadgeLabel = (tahap: Tahap) => {
  switch (tahap) {
    case 'analisis': return 'Analisis';
    case 'validasi': return 'Validasi';
    case 'aktif': return 'Aktif';
    case 'evaluasi': return 'Evaluasi';
    case 'selesai': return 'Selesai';
  }
};

const getEmptyMessage = (tab: TabKey) => {
  switch (tab) {
    case 'semua': return 'Belum ada data bantuan untuk ditampilkan.';
    case 'analisis': return 'Tidak ada riwayat analisis pada periode ini.';
    case 'validasi': return 'Tidak ada permohonan yang menunggu validasi.';
    case 'aktif': return 'Tidak ada bantuan aktif saat ini.';
    case 'evaluasi': return 'Belum ada data evaluasi tersedia.';
    case 'selesai': return 'Tidak ada riwayat program bantuan yang telah selesai.';
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
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataRow[]>(joinedData);

  // Timeline modal
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEvent[] | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

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
    selesai: data.filter(d => d.tahap === 'selesai').length,
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
        'Selesai': 'selesai',
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
      result = result.filter(d => d.bantuan && d.bantuan.includes(filterBantuan));
    }

    // Sort ascending by skorKesejahteraan to show lowest welfare first
    result.sort((a, b) => a.skorKesejahteraan - b.skorKesejahteraan);

    // Generic Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let valA: any = a[sortConfig.key as keyof DataRow];
        let valB: any = b[sortConfig.key as keyof DataRow];

        const tahapOrder: Record<string, number> = {
          'analisis': 1,
          'validasi': 2,
          'aktif': 3,
          'evaluasi': 4,
          'selesai': 5
        };

        if (sortConfig.key === 'id') {
          valA = a.idLabel;
          valB = b.idLabel;
        } else if (sortConfig.key === 'bantuan') {
          valA = a.bantuan ? a.bantuan.join(', ') : '';
          valB = b.bantuan ? b.bantuan.join(', ') : '';
        } else if (sortConfig.key === 'perubahanDesil') {
          valA = (a.desilSesudah ?? 0) - (a.desilSebelum ?? 0);
          valB = (b.desilSesudah ?? 0) - (b.desilSebelum ?? 0);
        } else if (sortConfig.key === 'tahap') {
          valA = tahapOrder[a.tahap] || 99;
          valB = tahapOrder[b.tahap] || 99;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortConfig.direction === 'asc' 
            ? (valA > valB ? 1 : valA < valB ? -1 : 0)
            : (valB > valA ? 1 : valB < valA ? -1 : 0);
        }
      });
    }

    return result;
  }, [data, activeTab, searchTerm, filterStatus, filterWilayah, filterBantuan, sortConfig]);

  // Actions
  const handleAnalisis = (id: string) => {
    setAnalyzingId(id);
    setTimeout(() => {
      setData(prev => prev.map(d => d.id_keluarga === id ? { ...d, tahap: 'validasi' as Tahap } : d));
      setAnalyzingId(null);
    }, 2000);
  };



  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('Semua');
    setFilterWilayah('Semua');
    setFilterBantuan('Semua');
    setSortConfig(null);
  };

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortHeader = (label: string, sortKey: SortKey) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <th 
        className="mb-th-sortable" 
        onClick={() => handleSort(sortKey)}
        title={`Klik untuk mengurutkan berdasarkan ${label.toLowerCase()}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {label}
          <span className={`mb-sort-icon ${isActive ? 'active' : ''}`}>
            {isActive && sortConfig.direction === 'asc' ? (
              <ChevronUp size={14} />
            ) : isActive && sortConfig.direction === 'desc' ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
          </span>
        </div>
      </th>
    );
  };

  // Determine what columns to show
  const showDesil = activeTab !== 'aktif';
  const showBantuan = activeTab !== 'analisis';
  const showStageBadge = true;
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
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div className="mb-filter-group">
            <label>WILAYAH</label>
            <select value={filterWilayah} onChange={e => setFilterWilayah(e.target.value)} disabled={isLoading}>
              <option value="Semua">Semua Wilayah</option>
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
                  {renderSortHeader('ID / TANGGAL', 'id')}
                  {renderSortHeader('NAMA PENERIMA', 'nama')}
                  {renderSortHeader('WILAYAH', 'wilayah')}
                  {showDesil && renderSortHeader('DESIL', 'desil')}
                  {showStageBadge && renderSortHeader('STATUS TAHAP', 'tahap')}
                  {showBantuan && renderSortHeader('BANTUAN', 'bantuan')}
                  {showDesilChange && renderSortHeader('PERUBAHAN DESIL', 'perubahanDesil')}
                  <th style={{ textAlign: 'center' }}>AKSI</th>
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
                    <tr 
                      key={row.id_keluarga}
                      onClick={() => navigate(`/detail-hasil/${row.id_keluarga}`, { state: row })}
                      className="mb-clickable-row"
                    >
                      {/* ID / Tanggal */}
                      <td>
                        <div className="mb-cell-link" style={{ display: 'inline-block' }}>
                          {row.idLabel}
                        </div>
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
                          <span className={`mb-desil-label ${getDesilColor(row.desil)}`}>
                            DESIL {row.desil}
                          </span>
                          <div className="mb-cell-secondary" style={{ marginTop: '4px', fontSize: '11px', fontWeight: 500 }}>
                            Skor: {row.skorKesejahteraan.toFixed(3)}
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
                          {row.bantuan && row.bantuan.length > 0 ? (
                            <div className="mb-bantuan-container">
                              {row.bantuan.slice(0, 2).join(', ')}
                              {row.bantuan.length > 2 && (
                                <span className="mb-bantuan-more">
                                  +{row.bantuan.length - 2} lainnya
                                </span>
                              )}
                              {row.bantuan.length > 2 && (
                                <div className="mb-bantuan-tooltip">
                                  {row.bantuan.join(', ')}
                                </div>
                              )}
                            </div>
                          ) : (
                            '—'
                          )}
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
                      <td style={{ textAlign: 'center' }}>
                        <div className="mb-action-cell" style={{ justifyContent: 'center', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* Analisis-specific */}
                          {row.tahap === 'analisis' && (
                            <button
                              className="mb-btn-analisis"
                              disabled={analyzingId === row.id_keluarga}
                              onClick={(e) => { e.stopPropagation(); handleAnalisis(row.id_keluarga); }}
                            >
                              {analyzingId === row.id_keluarga ? (
                                <><Loader2 size={14} className="mb-spin" /> Menganalisis...</>
                              ) : (
                                <><BrainCircuit size={14} /> Analisis</>
                              )}
                            </button>
                          )}

                          {/* Validasi-specific */}
                          {row.tahap === 'validasi' && (
                            <button className="mb-btn-validasi" onClick={(e) => { e.stopPropagation(); navigate(`/detail-hasil/${row.id_keluarga}`, { state: row }); }}>
                              <ShieldCheck size={14} /> Validasi
                            </button>
                          )}

                          {/* Aktif-specific */}
                          {row.tahap === 'aktif' && row.timeline && (
                            <button className="mb-btn-timeline" onClick={(e) => { e.stopPropagation(); setSelectedTimeline(row.timeline!); }}>
                              <Clock size={14} /> Timeline
                            </button>
                          )}

                          {/* Evaluasi-specific */}
                          {row.tahap === 'evaluasi' && (
                            <button className="mb-btn-review" onClick={(e) => { e.stopPropagation(); navigate(`/detail-hasil/${row.id_keluarga}`, { state: row }); }}>
                              <FileBarChart size={14} /> Review
                            </button>
                          )}

                          {/* Selesai-specific */}
                          {row.tahap === 'selesai' && (
                            <button className="mb-btn-history" onClick={(e) => { e.stopPropagation(); navigate(`/detail-hasil/${row.id_keluarga}`, { state: row }); }}>
                              <CheckCircle size={14} /> Riwayat
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
