import React from 'react';

interface HeaderProps {
  title?: string;
  userName?: string;
  userRole?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Dashboard Monitoring", 
  userName = "User", 
  userRole = "ROLE" 
}) => {
  return (
    <header className="header">
      <h2>{title}</h2>
      <div className="user-profile">
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="user-role">{userRole}</span>
        </div>
        <div className="user-avatar"></div>
      </div>
    </header>
  );
};

export default Header;
