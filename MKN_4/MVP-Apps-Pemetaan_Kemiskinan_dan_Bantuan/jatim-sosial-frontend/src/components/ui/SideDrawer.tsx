import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './SideDrawer.css';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = '400px'
}) => {
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setRender(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setRender(false);
  };

  if (!render) return null;

  return (
    <div className={`drawer-backdrop ${isOpen ? 'open' : 'closing'}`} onAnimationEnd={handleAnimationEnd}>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div 
        className={`drawer-panel ${isOpen ? 'open' : 'closing'}`}
        style={{ width }}
      >
        <div className="drawer-header">
          <h4>{title}</h4>
          <button className="btn-close-drawer" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="drawer-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
