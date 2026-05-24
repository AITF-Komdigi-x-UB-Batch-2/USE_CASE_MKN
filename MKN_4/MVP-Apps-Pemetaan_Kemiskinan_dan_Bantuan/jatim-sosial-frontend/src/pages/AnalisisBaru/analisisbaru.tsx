import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  CheckCircle, 
  UploadCloud,
  FileSpreadsheet,
  Info,
  Download,
  Loader
} from 'lucide-react';
import './AnalisisBaru.css';
import { useState } from 'react';

interface AnalisisBaruProps {
  onLogout?: () => void;
}

const AnalisisBaru: React.FC<AnalisisBaruProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setUploadError('File terlalu besar. Maksimal 10MB.');
        return;
      }
      setUploadedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadError('Pilih file terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // const response = await fetch('http://localhost:8000/api/import', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error('Upload gagal');
      // }
      // Navigasi ke ManajemenBantuan setelah upload berhasil
      navigate('/manajemen-bantuan');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Terjadi kesalahan saat upload');
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Import Data" onLogout={onLogout}>
      <div className="analisis-page-wrapper">
        
        {/* Header */}
        <div className="analisis-page-header">
          <div>
            <h3 className="section-title">Import Data untuk Analisis</h3>
            <p className="section-subtitle">Unggah file Excel atau CSV yang berisi data keluarga untuk diproses oleh sistem AI.</p>
          </div>
        </div>

        {/* Import Content */}
        <div className="analisis-content-split">
          <div className="analisis-left-col">
            <div className="import-container">

              {/* Upload Dropzone */}
              <div className="upload-dropzone large">
                <div className="upload-icon-wrapper">
                  <UploadCloud size={52} className="upload-icon" />
                </div>
                <h4>Unggah File Data Excel / CSV</h4>
                <p>Tarik &amp; lepaskan file di sini, atau klik tombol di bawah untuk memilih file dari perangkat Anda.</p>
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".xlsx,.xls,.csv" 
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="browse-btn">
                  <FileSpreadsheet size={16} /> Pilih File
                </label>
                <span className="upload-hint">Format yang didukung: .xlsx, .xls, .csv — Maks. 10MB</span>
                {uploadedFile && (
                  <p style={{ marginTop: '10px', color: '#10b981', fontWeight: 'bold' }}>
                    ✓ File dipilih: {uploadedFile.name}
                  </p>
                )}
              </div>

              {/* Template Download */}
              <div className="template-download-card">
                <div className="template-icon-wrap">
                  <Download size={20} color="#2563eb" />
                </div>
                <div className="template-info">
                  <strong>Unduh Template Standar</strong>
                  <p>Pastikan file Anda mengikuti format kolom yang telah ditentukan sistem agar proses analisis berjalan optimal.</p>
                </div>
                <button className="template-btn">
                  Unduh Template
                </button>
              </div>

              {/* Info Box */}
              <div className="info-box blue">
                <Info size={15} />
                <span>
                  <strong>Catatan:</strong> Pastikan setiap baris mewakili satu keluarga dan semua kolom wajib telah diisi sebelum mengunggah file. Data yang tidak lengkap akan dilewati secara otomatis oleh sistem.
                </span>
              </div>

              {uploadError && (
                <div className="info-box" style={{ borderColor: '#ef4444', backgroundColor: '#fee2e2' }}>
                  <Info size={15} style={{ color: '#ef4444' }} />
                  <span style={{ color: '#991b1b' }}>
                    <strong>Kesalahan:</strong> {uploadError}
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar">
        <div className="action-status">
          {isLoading ? (
            <>
              <Loader size={20} className="text-blue" style={{ animation: 'spin 1s linear infinite' }} />
              <span>MEMPROSES UPLOAD...</span>
            </>
          ) : uploadedFile ? (
            <>
              <CheckCircle size={20} className="text-green" />
              <span>SIAP UNTUK UNGGAH</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} className="text-green" />
              <span>UNGGAH FILE UNTUK MEMULAI PROSES ANALISIS AI</span>
            </>
          )}
        </div>
        {uploadedFile && (
          <button 
            onClick={handleUpload}
            disabled={isLoading}
            style={{
              padding: '10px 24px',
              backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? <Loader size={18} /> : null}
            {isLoading ? 'Uploading...' : 'Upload & Lanjut'}
          </button>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalisisBaru;
