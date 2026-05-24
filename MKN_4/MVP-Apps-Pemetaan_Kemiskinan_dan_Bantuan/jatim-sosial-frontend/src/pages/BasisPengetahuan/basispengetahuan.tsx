import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  Search, 
  ChevronRight, 
  FileText, 
  Download, 
  Eye, 
  History, 
  Paperclip,
  Sparkles
} from 'lucide-react';
import SideDrawer from '../../components/ui/SideDrawer';
import './BasisPengetahuan.css';

interface BasisPengetahuanProps {
  onLogout?: () => void;
}

interface PolicyDocument {
  id: string;
  title: string;
  description: string;
  kategori: string;
  kategoriColorClass: string;
  tanggal: string;
  status: 'Berlaku' | 'Draft';
  masaBerlaku: string;
  unit: string;
  size: string;
  aiSummary: string;
}

const mockDocuments: PolicyDocument[] = [
  {
    id: '1',
    title: 'SK Gubernur No. 45/2023',
    description: 'Penetapan Penerima Bantuan Sosial PKH Tahap IV',
    kategori: 'SK GUBERNUR',
    kategoriColorClass: 'kategori-sk',
    tanggal: '12 Okt 2023',
    status: 'Berlaku',
    masaBerlaku: 'S/D Dicabut',
    unit: 'Dinas Sosial',
    size: '1.2 MB',
    aiSummary: 'Dokumen ini menetapkan daftar resmi penerima bantuan sosial Program Keluarga Harapan (PKH) untuk tahap IV tahun 2023 sesuai kriteria kelayakan yang telah divaildasi.',
  },
  {
    id: '2',
    title: 'PERGUB No. 112/2023',
    description: 'Pedoman Pelaksanaan Jatim Sosial Care',
    kategori: 'PERGUB',
    kategoriColorClass: 'kategori-pergub',
    tanggal: '05 Nov 2023',
    status: 'Berlaku',
    masaBerlaku: 'S/D Dicabut',
    unit: 'Dinas Sosial',
    size: '4.2 MB',
    aiSummary: 'Dokumen ini mengatur tentang skema distribusi bantuan pangan dan kesehatan bagi keluarga rentan di wilayah Jawa Timur, mencakup kriteria seleksi, metode penyaluran digital, dan sistem monitoring berbasis data geotagging.',
  },
  {
    id: '3',
    title: 'Instruksi Gubernur No. 8/2023',
    description: 'Percepatan Verifikasi Data Kemiskinan Ekstrem',
    kategori: 'INGUB',
    kategoriColorClass: 'kategori-ingub',
    tanggal: '20 Des 2023',
    status: 'Berlaku',
    masaBerlaku: 'S/D Dicabut',
    unit: 'BAPPEDA',
    size: '2.5 MB',
    aiSummary: 'Instruksi Guberur ini mewajibkan seluruh pemerintah kota dan kabupaten di Jawa Timur untuk mempercepat proses verifikasi data penduduk miskin ekstrem.',
  },
  {
    id: '4',
    title: 'SE Sekdaprov No. 400/12/2024',
    description: 'Mekanisme Pelaporan Bansos Berbasis Aplikasi',
    kategori: 'SURAT EDARAN',
    kategoriColorClass: 'kategori-se',
    tanggal: '15 Jan 2024',
    status: 'Draft',
    masaBerlaku: 'Menunggu Pengesahan',
    unit: 'Sekretariat Daerah',
    size: '0.8 MB',
    aiSummary: 'Surat edaran ini memuat panduan penggunaan aplikasi pelaporan penyaluran bantuan sosial bagi perangkat desa agar proses rekapitulasi data menjadi realtime.',
  }
];

const jenisProgramFilters = ['Semua', 'PKH', 'BPNT', 'BLT BBM', 'Disabilitas'];
const jenisRegulasiFilters = ['Peraturan Gubernur', 'SK Gubernur', 'Instruksi Gubernur', 'Surat Edaran'];

const BasisPengetahuan: React.FC<BasisPengetahuanProps> = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProgram, setActiveProgram] = useState<string>('Semua');
  const [activeRegulasi, setActiveRegulasi] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<PolicyDocument | null>(null);
  
  const toggleRegulasi = (rg: string) => {
    setActiveRegulasi(prev => 
      prev.includes(rg) ? prev.filter(item => item !== rg) : [...prev, rg]
    );
  };

  return (
    <AdminLayout title="Basis Pengetahuan" onLogout={onLogout}>
      <div className={`bp-page-wrapper ${selectedDoc ? 'panel-open' : ''}`}>
        
        {/* Main Content Area */}
        <div className="bp-main-content">
          <div className="bp-header">
            <h3>Basis Pengetahuan</h3>
            <p>Pusat repositori kebijakan dan regulasi bantuan sosial Pemerintah Provinsi Jawa Timur.</p>
          </div>

          {/* Search Box */}
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Cari dokumen, regulasi, atau kata kunci kebijakan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="filter-chips-section">
            <div className="filter-row">
              <span className="filter-label">JENIS PROGRAM:</span>
              <div className="chips-container">
                {jenisProgramFilters.map(prog => (
                  <button 
                    key={prog} 
                    className={`chip ${activeProgram === prog ? 'active' : ''}`}
                    onClick={() => setActiveProgram(prog)}
                  >
                    {prog}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-row">
              <span className="filter-label">JENIS REGULASI:</span>
              <div className="chips-container">
                {jenisRegulasiFilters.map(reg => (
                  <button 
                    key={reg} 
                    className={`chip ${activeRegulasi.includes(reg) ? 'active' : ''}`}
                    onClick={() => toggleRegulasi(reg)}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table List */}
          <div className="bp-table-card">
            <table className="bp-table">
              <thead>
                <tr>
                  <th>NAMA DOKUMEN</th>
                  <th>KATEGORI</th>
                  <th>TANGGAL TERBIT</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockDocuments.map((doc) => (
                  <tr 
                    key={doc.id} 
                    className={selectedDoc?.id === doc.id ? 'active-row' : ''}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <td>
                      <div className="doc-title-cell">
                        <FileText size={20} className="doc-icon-blue" />
                        <div>
                          <div className="doc-title-text">{doc.title}</div>
                          <div className="doc-desc-text">{doc.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`kategori-badge ${doc.kategoriColorClass}`}>
                        {doc.kategori}
                      </span>
                    </td>
                    <td className="doc-date-text">{doc.tanggal}</td>
                    <td>
                      <div className="status-indicator">
                        <span className={`dot ${doc.status === 'Berlaku' ? 'green' : 'gray'}`}></span>
                        <span className={doc.status === 'Berlaku' ? 'status-green' : 'status-gray'}>{doc.status}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <ChevronRight size={18} className="text-gray-400" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="bp-pagination">
              <span className="pagination-text">Menampilkan 1-4 dari 60 dokumen</span>
              <div className="pagination-actions">
                <button className="btn-page-sm"><ChevronLeft size={16} /></button>
                <button className="btn-page-sm"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Panel / Drawer */}
        <SideDrawer 
          isOpen={!!selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          title="Detail Kebijakan"
          width="400px"
        >
          {selectedDoc && (
            <>
              {/* Document Identity Card */}
              <div className="doc-identity-card">
                <FileText size={48} className="doc-icon-large" />
                <h3 className="doc-id-title">{selectedDoc.title}</h3>
                <p className="doc-id-desc">{selectedDoc.description}</p>
              </div>

              <button className="btn-download-pdf">
                <Download size={18} /> Unduh Dokumen (PDF)
              </button>

              {/* Action List */}
              <div className="panel-action-list">
                <button className="action-list-item active-blue">
                  <div className="icon-wrap"><Eye size={18} /></div>
                  <span>Pratinjau Ringkasan</span>
                </button>
                <button className="action-list-item">
                  <div className="icon-wrap"><History size={18} /></div>
                  <span>Riwayat Perubahan</span>
                </button>
                <button className="action-list-item">
                  <div className="icon-wrap"><Paperclip size={18} /></div>
                  <span>Lampiran (3)</span>
                </button>
              </div>

              {/* Information Grid */}
              <div className="info-main-label">INFORMASI UTAMA</div>
              <div className="info-grid">
                <div className="info-grid-item">
                  <span className="info-item-label">DITERBITKAN</span>
                  <span className="info-item-value">{selectedDoc.tanggal}</span>
                </div>
                <div className="info-grid-item">
                  <span className="info-item-label">MASA BERLAKU</span>
                  <span className="info-item-value">{selectedDoc.masaBerlaku}</span>
                </div>
                <div className="info-grid-item">
                  <span className="info-item-label">UNIT PENGUSUL</span>
                  <span className="info-item-value">{selectedDoc.unit}</span>
                </div>
                <div className="info-grid-item">
                  <span className="info-item-label">UKURAN FILE</span>
                  <span className="info-item-value">{selectedDoc.size}</span>
                </div>
              </div>

              {/* AI Summary Card */}
              <div className="ai-summary-card">
                <div className="ai-summary-header">
                  <Sparkles size={16} className="ai-sparkle-icon" />
                  <span>AI RINGKASAN CEPAT</span>
                </div>
                <p className="ai-summary-text">
                  {selectedDoc.aiSummary}
                </p>
              </div>
            </>
          )}
        </SideDrawer>

      </div>
    </AdminLayout>
  );
};

// Quick fix for missing ChevronLeft inside component
const ChevronLeft = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

export default BasisPengetahuan;
