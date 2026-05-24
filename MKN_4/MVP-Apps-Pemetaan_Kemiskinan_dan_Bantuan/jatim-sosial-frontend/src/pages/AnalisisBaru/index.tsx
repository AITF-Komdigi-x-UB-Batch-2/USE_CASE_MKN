import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  CheckCircle, 
  UploadCloud, 
  FileText, 
  Users, 
  Home, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import './AnalisisBaru.css';

interface AnalisisBaruProps {
  onLogout?: () => void;
}

const AnalisisBaru: React.FC<AnalisisBaruProps> = ({ onLogout }) => {
  const [inputMode, setInputMode] = useState<'manual' | 'import'>('manual');
  const [statusRumah, setStatusRumah] = useState('Milik Sendiri');
  const navigate = useNavigate();

  return (
    <AdminLayout title="Analisis Baru" onLogout={onLogout}>
      <div className="analisis-page-wrapper">
        
        {/* Header and Mode Selector */}
        <div className="analisis-page-header">
          <div>
            <h3 className="section-title">Input Data Analisis Baru</h3>
            <p className="section-subtitle">Lengkapi formulir dengan data yang valid untuk penilaian AI kelayakan bantuan sosial.</p>
          </div>
          <div className="mode-selector">
            <button 
              className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
              onClick={() => setInputMode('manual')}
            >
              <FileText size={16} /> Input Manual
            </button>
            <button 
              className={`mode-btn ${inputMode === 'import' ? 'active' : ''}`}
              onClick={() => setInputMode('import')}
            >
              <UploadCloud size={16} /> Import File
            </button>
          </div>
        </div>

        {/* Main Content Split Layout */}
        <div className="analisis-content-split">
          
          {/* Left Column: Input Section */}
          <div className="analisis-left-col">
            {inputMode === 'manual' && (
              <div className="form-cards-grid">
                {/* Identitas Keluarga */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper blue">
                      <FileText size={18} />
                    </div>
                    <h4>Identitas Keluarga</h4>
                  </div>
                  <div className="form-card-body">
                    <div className="form-group">
                      <label>Nama Kepala Keluarga</label>
                      <input type="text" placeholder="Contoh: Ahmad Subagyo" />
                    </div>
                    <div className="form-group">
                      <label>Nomor Induk Kependudukan (NIK)</label>
                      <input type="text" placeholder="16 digit NIK" />
                    </div>
                    <div className="form-group">
                      <label>Alamat Lengkap</label>
                      <textarea placeholder="Jl. Raya No. 123..."></textarea>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Kabupaten/Kota</label>
                        <select defaultValue="Surabaya">
                          <option value="Surabaya">Surabaya</option>
                          <option value="Sidoarjo">Sidoarjo</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Kecamatan</label>
                        <select defaultValue="Sukolilo">
                          <option value="Sukolilo">Sukolilo</option>
                          <option value="Wonokromo">Wonokromo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unggah Foto Rumah */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper default">
                      <Home size={18} />
                    </div>
                    <h4>Unggah Foto Rumah</h4>
                  </div>
                  <div className="form-card-body">
                    <div className="upload-dropzone">
                      <UploadCloud size={32} className="upload-icon" />
                      <h5>Klik untuk unggah foto</h5>
                      <p>JPG, PNG (Maks. 5MB)</p>
                    </div>
                    <div className="info-box clear">
                      <AlertCircle size={14} />
                      <span>AI akan memproses visual bangunan untuk verifikasi kondisi aset hunian secara otomatis.</span>
                    </div>
                  </div>
                </div>

                {/* Demografi Keluarga */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper default">
                      <Users size={18} />
                    </div>
                    <h4>Demografi Keluarga</h4>
                  </div>
                  <div className="form-card-body">
                    <div className="form-group">
                      <label>Jumlah Anggota Keluarga</label>
                      <input type="number" defaultValue={1} />
                    </div>
                    <div className="form-row three-cols">
                      <div className="form-group">
                        <label>Anak-anak</label>
                        <input type="number" defaultValue={0} />
                      </div>
                      <div className="form-group">
                        <label>Lansia</label>
                        <input type="number" defaultValue={0} />
                      </div>
                      <div className="form-group">
                        <label>Disabilitas</label>
                        <input type="number" defaultValue={0} />
                      </div>
                    </div>
                    <div className="info-box blue">
                      <strong>Informasi:</strong> Data demografi digunakan untuk menentukan skor prioritas kerentanan.
                    </div>
                  </div>
                </div>

                {/* Kondisi Ekonomi */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper default">
                      <Briefcase size={18} />
                    </div>
                    <h4>Kondisi Ekonomi</h4>
                  </div>
                  <div className="form-card-body">
                    <div className="form-group">
                      <label>Tingkat Pendidikan Terakhir (Kepala Kel.)</label>
                      <select defaultValue="Tidak Sekolah">
                        <option value="Tidak Sekolah">Tidak Sekolah</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status Pekerjaan Utama</label>
                      <select defaultValue="Tidak Bekerja">
                        <option value="Tidak Bekerja">Tidak Bekerja</option>
                        <option value="Buruh Lepas">Buruh Lepas</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Estimasi Penghasilan Bulanan</label>
                      <div className="input-with-prefix">
                        <span className="prefix">Rp</span>
                        <input type="text" defaultValue="0" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aset & Hunian */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper default">
                      <Home size={18} />
                    </div>
                    <h4>Aset & Hunian</h4>
                  </div>
                  <div className="form-card-body">
                    <div className="form-group">
                      <label>Status Kepemilikan Rumah</label>
                      <div className="button-group">
                        <button type="button" className={statusRumah === 'Milik Sendiri' ? 'active' : ''} onClick={() => setStatusRumah('Milik Sendiri')}>Milik Sendiri</button>
                        <button type="button" className={statusRumah === 'Sewa' ? 'active' : ''} onClick={() => setStatusRumah('Sewa')}>Sewa</button>
                        <button type="button" className={statusRumah === 'Menumpang' ? 'active' : ''} onClick={() => setStatusRumah('Menumpang')}>Menumpang</button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Jenis Bangunan Terluas</label>
                      <select defaultValue="Permanen (Tembok/Semen)">
                        <option value="Permanen (Tembok/Semen)">Permanen (Tembok/Semen)</option>
                        <option value="Semi Permanen">Semi Permanen</option>
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Akses Air Minum</label>
                        <select defaultValue="PDAM / Ledeng">
                          <option value="PDAM / Ledeng">PDAM / Ledeng</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Daya Listrik (VA)</label>
                        <select defaultValue="450 VA">
                          <option value="450 VA">450 VA</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Riwayat Bantuan */}
                <div className="form-card">
                  <div className="form-card-header">
                    <div className="icon-wrapper default">
                      <ShieldCheck size={18} />
                    </div>
                    <h4>Riwayat Bantuan</h4>
                  </div>
                  <div className="form-card-body">
                    <p className="card-desc">Pilih program bantuan yang pernah/sedang diterima keluarga ini.</p>
                    <div className="checkbox-grid">
                      <label className="checkbox-box"><input type="checkbox"/> PKH</label>
                      <label className="checkbox-box"><input type="checkbox"/> BPNT / Sembako</label>
                      <label className="checkbox-box"><input type="checkbox"/> BLT Dana Desa</label>
                      <label className="checkbox-box"><input type="checkbox"/> PBI JK (KIS)</label>
                      <label className="checkbox-box"><input type="checkbox"/> KIP / PIP</label>
                      <label className="checkbox-box"><input type="checkbox"/> Belum Ada</label>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {inputMode === 'import' && (
              <div className="import-container">
                <div className="upload-dropzone large">
                  <UploadCloud size={48} className="upload-icon" />
                  <h4>Unggah File Data Excel/CSV</h4>
                  <p>Tarik & lepaskan file di sini, atau klik untuk memilih file</p>
                  <button className="browse-btn">Pilih File</button>
                </div>
                <div className="info-box blue mt-4">
                  <strong>Catatan:</strong> Pastikan format kolom sesuai dengan template standar sistem untuk menghindari kegagalan analisis.
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="bottom-action-bar">
        <div className="action-status">
          <CheckCircle size={20} className="text-green" />
          <span>LENGKAPI DATA UNTUK PROSES ANALISIS AI</span>
        </div>
        <button className="process-submit-btn" onClick={() => navigate('/detail-hasil')}>
          <BrainCircuit size={18} />
          Proses Analisis AI
        </button>
      </div>
    </AdminLayout>
  );
};

export default AnalisisBaru;
