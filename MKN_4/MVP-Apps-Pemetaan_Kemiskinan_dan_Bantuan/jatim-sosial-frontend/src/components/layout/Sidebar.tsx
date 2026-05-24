import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ClipboardList, 
  BookOpen, 
  Settings, 
  LogOut 
} from 'lucide-react';
import logoJatim from '../../assets/Lambang_Provinsi_Jawa_Timur.svg';

interface SidebarProps {
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logoJatim} alt="Logo Provinsi Jawa Timur" className="sidebar-logo" />
        <div className="sidebar-title">
          <h3>Pemetaan Kemiskinan dan Bantuan</h3>
          <p>DISKOMINFO JATIM</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={activePath === '/dashboard' ? 'active' : ''} onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </li>
          <li className={activePath === '/analisis-baru' ? 'active' : ''} onClick={() => navigate('/analisis-baru')}>
            <PlusCircle size={20} /> <span>Import Data</span>
          </li>
          <li className={activePath === '/manajemen-bantuan' ? 'active' : ''} onClick={() => navigate('/manajemen-bantuan')}>
            <ClipboardList size={20} /> <span>Manajemen Bantuan</span>
          </li>
          <li className={activePath === '/basis-pengetahuan' ? 'active' : ''} onClick={() => navigate('/basis-pengetahuan')}>
            <BookOpen size={20} /> <span>Basis Pengetahuan</span>
          </li>
          <li className={activePath === '/pengaturan' ? 'active' : ''} onClick={() => navigate('/pengaturan')}>
            <Settings size={20} /> <span>Pengaturan</span>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
