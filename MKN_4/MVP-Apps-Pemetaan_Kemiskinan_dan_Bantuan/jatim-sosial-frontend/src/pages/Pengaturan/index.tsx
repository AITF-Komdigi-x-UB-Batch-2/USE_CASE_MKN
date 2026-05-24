import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  UserPlus, 
  Filter, 
  Download,
  Users,
  Network,
  ChevronRight,
  X
} from 'lucide-react';
import './Pengaturan.css';

interface PengaturanProps {
  onLogout?: () => void;
}

type Role = 'ANALYST' | 'PETUGAS' | 'ADMIN';
type Status = 'Aktif' | 'Nonaktif';

interface User {
  id: string;
  name: string;
  initials: string;
  role: Role;
  email: string;
  status: Status;
}

const initialUsers: User[] = [
  { id: 'u1', name: 'Budi Santoso', initials: 'BS', role: 'ANALYST', email: 'budi@jatimprov.go.id', status: 'Aktif' },
  { id: 'u2', name: 'Siti Aminah', initials: 'SA', role: 'PETUGAS', email: 'siti@jatimprov.go.id', status: 'Aktif' },
  { id: 'u3', name: 'Dewi Lestari', initials: 'DL', role: 'PETUGAS', email: 'dewi@jatimprov.go.id', status: 'Aktif' },
  { id: 'u4', name: 'Rahmat Hidayat', initials: 'RH', role: 'ADMIN', email: 'admin@jatimprov.go.id', status: 'Aktif' },
];

interface Department {
  id: string;
  name: string;
  abbrev: string;
  icon: string;
  syncTime?: string;
  syncStatus: 'Synced' | 'Pending' | 'Error';
}

const mockDepartments: Department[] = [
  { id: 'd1', name: 'Dinas Sosial', abbrev: 'DINSOS', icon: 'building-library', syncStatus: 'Synced', syncTime: '2 hours ago' },
  { id: 'd2', name: 'Dinas Kesehatan', abbrev: 'DINKES', icon: 'shield-check', syncStatus: 'Synced', syncTime: '1 day ago' },
  { id: 'd3', name: 'Dinas Pendidikan', abbrev: 'DIKNAS', icon: 'academic-cap', syncStatus: 'Pending' },
];

const Pengaturan: React.FC<PengaturanProps> = ({ onLogout }) => {
  const [users] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  


  const openModalNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openModalEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeClass = (role: Role) => {
    switch(role) {
      case 'ANALYST': return 'badge-role-analyst';
      case 'PETUGAS': return 'badge-role-petugas';
      case 'ADMIN': return 'badge-role-admin';
      default: return '';
    }
  };

  return (
    <AdminLayout title="Pengaturan Sistem" onLogout={onLogout}>
      <div className="pengaturan-page-wrapper">
        
        {/* Header Section */}
        <div className="pengaturan-header">
          <div className="pengaturan-title-area">
            <h3>Pengaturan Sistem</h3>
            <p>Kelola aksesibilitas personil dan konfigurasi parameter pendukung keputusan AI.</p>
          </div>
          <button className="btn-primary" onClick={openModalNewUser}>
            <UserPlus size={16} /> Tambah Pengguna Baru
          </button>
        </div>

        {/* User Management Details */}
        <div className="settings-card">
          <div className="settings-card-header flex-between">
            <div className="flex-center gap-2">
              <Users size={18} className="text-blue-600" />
              <h4 className="font-semibold text-gray-800 m-0">Daftar Pengguna Aktif</h4>
            </div>
            <div className="flex-center gap-3 text-gray-500">
              <Filter size={16} className="cursor-pointer hover:text-gray-800 transition" />
              <Download size={16} className="cursor-pointer hover:text-gray-800 transition" />
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>NAMA PENGGUNA</th>
                  <th>ROLE</th>
                  <th>ALAMAT EMAIL</th>
                  <th>STATUS</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="avatar-circle">{user.initials}</div>
                        <span className="font-semibold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span>
                    </td>
                    <td className="text-gray-500">{user.email}</td>
                    <td>
                      <div className="status-indicator">
                        <span className={`dot ${user.status === 'Aktif' ? 'green' : 'gray'}`}></span>
                        <span className={user.status === 'Aktif' ? 'text-green-600 font-medium' : 'text-gray-500 font-medium'}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-link-edit" onClick={() => openModalEditUser(user)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-wrapper border-t border-gray-200">
            <div className="pagination-info">
              Menampilkan {users.length} dari 12 pengguna
            </div>
            <div className="pagination-controls">
              <button className="btn-page-text">Previous</button>
              <button className="btn-page active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page-text">Next</button>
            </div>
          </div>
        </div>

        {/* Department Metadata */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="flex-center gap-2">
              <Network size={18} className="text-blue-600" />
              <h4 className="font-semibold text-gray-800 m-0">Department Metadata</h4>
            </div>
          </div>
          <div className="dept-list-container">
            {mockDepartments.map((dept) => (
              <div key={dept.id} className="dept-list-item">
                <div className="dept-icon-box">
                  <div className="icon-placeholder bg-gray-100 rounded flex-center w-10 h-10">
                    <Network size={20} className="text-gray-500" />
                  </div>
                </div>
                <div className="dept-info flex-1">
                  <div className="font-semibold text-gray-900">{dept.name} ({dept.abbrev})</div>
                  <div className="text-sm text-gray-500 flex gap-1 items-center">
                    {dept.syncStatus === 'Synced' ? (
                      <>Last Synced: {dept.syncTime}</>
                    ) : (
                      <>Sync Status: <span className="text-orange-500 font-medium ml-1">Pending</span></>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Modal User Config */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h4>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h4>
              <button className="btn-close-modal" onClick={closeModal}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" className="config-input w-full" defaultValue={editingUser?.name || ''} placeholder="Masukkan nama..." />
              </div>
              <div className="form-group mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" className="config-input w-full" defaultValue={editingUser?.email || ''} placeholder="email@jatimprov.go.id" />
              </div>
              <div className="form-group mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select className="config-input w-full" defaultValue={editingUser?.role || 'PETUGAS'}>
                  <option value="ANALYST">ANALYST</option>
                  <option value="PETUGAS">PETUGAS</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {editingUser && (
                <div className="form-group mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select className="config-input w-full" defaultValue={editingUser.status}>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Batal</button>
              <button className="btn-primary" onClick={closeModal}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Pengaturan;
