import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  onLogout
}) => {
  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />
      <div className="main-wrapper">
        <Header title={title} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
