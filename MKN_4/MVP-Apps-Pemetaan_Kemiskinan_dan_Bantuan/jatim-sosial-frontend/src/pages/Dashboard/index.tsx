import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Users,
  CheckCircle,
  ClipboardList
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import './Dashboard.css';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <AdminLayout title="Dashboard Monitoring" onLogout={onLogout}>
      <div className="system-overview-header">
        <div>
          <h3 className="section-title">Ikhtisar Sistem</h3>
          <p className="section-subtitle">Status terkini bantuan sosial di Provinsi Jawa Timur</p>
        </div>
        <button className="new-analysis-btn" onClick={() => navigate('/analisis-baru')}>
          <PlusCircle size={18} /> Mulai Analisis Baru
        </button>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Keluarga<br/>Dianalisis</span>
            <Users className="stat-icon blue" size={24} />
          </div>
          <div className="stat-value">1.240</div>
          <div className="stat-desc empty"></div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Antrean Validasi</span>
            <ClipboardList className="stat-icon yellow" size={24} />
          </div>
          <div className="stat-value">45</div>
          <div className="stat-desc">Memerlukan perhatian segera</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Kasus Disetujui</span>
            <CheckCircle className="stat-icon green" size={24} />
          </div>
          <div className="stat-value">1.080</div>
          <div className="stat-desc">Telah diverifikasi sistem</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Kasus Prioritas Tinggi</span>
            <span className="stat-icon red" style={{ fontSize: '24px', lineHeight: 1 }}>*</span>
          </div>
          <div className="stat-value">115</div>
          <div className="stat-desc">Kerentanan tingkat tinggi</div>
        </div>
      </div>

      <div className="analysis-region-section">
        <div className="section-header-flex">
          <div>
            <h4 className="section-title">Analisis per Wilayah</h4>
            <p className="section-subtitle">Distribusi kasus berdasarkan Kabupaten/Kota</p>
          </div>
          <div className="chart-toggles" style={{display: 'flex', gap: '8px'}}>
            <button className="toggle-btn" onClick={() => navigate('/manajemen-bantuan')} style={{padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', backgroundColor: '#fff', color: '#374151', transition: 'all 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor='#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor='#fff'}>
              Lihat Detail
            </button>
            <button className="toggle-btn active" onClick={() => console.log('view regional analysis')}>Mingguan</button>
            <button className="toggle-btn" onClick={() => console.log('view monthly')}>Bulanan</button>
          </div>
        </div>

        <div className="progress-bars">
          {[
            { name: 'Surabaya', value: 450, width: '90%' },
            { name: 'Sidoarjo', value: 320, width: '64%' },
            { name: 'Gresik', value: 210, width: '42%' },
            { name: 'Malang', value: 185, width: '37%' }
          ].map((item, idx) => (
            <div key={idx} className="progress-item">
              <div className="progress-info">
                <span className="city-name">{item.name}</span>
                <span className="case-count">{item.value} Kasus</span>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: item.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-analysis-section">
        <div className="section-header">
          <h4 className="section-title">Analisis Terbaru</h4>
          <p className="section-subtitle">Data keluarga yang baru saja selesai dianalisis oleh sistem</p>
        </div>
        
        <div className="table-responsive">
          <table className="analysis-table">
            <thead>
              <tr>
                <th>NAMA RT / KELUARGA</th>
                <th>DESIL</th>
                <th>TINGKAT KERENTANAN</th>
                <th>PROGRAM REKOMENDASI</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="family-info">
                    <strong>Agus Suharyanto</strong>
                    <span>Wonokromo, Surabaya</span>
                  </div>
                </td>
                <td><span className="badge desil">Desil 1</span></td>
                <td><span className="badge tingkat red">Tinggi</span></td>
                <td>PKH, BPNT</td>
                <td><span className="status green"><span className="dot"></span> Terverifikasi</span></td>
                <td><a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate('/detail-hasil'); }}>Lihat<br/>Detail</a></td>
              </tr>
              <tr>
                <td>
                  <div className="family-info">
                    <strong>Siti Aminah</strong>
                    <span>Gedangan, Sidoarjo</span>
                  </div>
                </td>
                <td><span className="badge desil">Desil 2</span></td>
                <td><span className="badge tingkat yellow">Menengah</span></td>
                <td>BPNT</td>
                <td><span className="status orange"><span className="dot"></span> Menunggu Validasi</span></td>
                <td><a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate('/detail-hasil'); }}>Lihat<br/>Detail</a></td>
              </tr>
              <tr>
                <td>
                  <div className="family-info">
                    <strong>M. Nurul Huda</strong>
                    <span>Kebomas, Gresik</span>
                  </div>
                </td>
                <td><span className="badge desil">Desil 1</span></td>
                <td><span className="badge tingkat red">Tinggi</span></td>
                <td>PKH, Rutilahu</td>
                <td><span className="status green"><span className="dot"></span> Terverifikasi</span></td>
                <td><a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate('/detail-hasil'); }}>Lihat<br/>Detail</a></td>
              </tr>
              <tr>
                <td>
                  <div className="family-info">
                    <strong>Lilik Handayani</strong>
                    <span>Lowokwaru, Malang</span>
                  </div>
                </td>
                <td><span className="badge desil">Desil 3</span></td>
                <td><span className="badge tingkat blue">Rendah</span></td>
                <td>Beasiswa Pendidikan</td>
                <td><span className="status green"><span className="dot"></span> Terverifikasi</span></td>
                <td><a href="#" className="action-link" onClick={(e) => { e.preventDefault(); navigate('/detail-hasil'); }}>Lihat<br/>Detail</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Menampilkan 4 dari 1.240 keluarga</span>
          <div className="pagination-controls">
            <button className="pagination-btn">Sebelumnya</button>
            <button className="pagination-btn">Selanjutnya</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
