import React from 'react';
import { Archive } from 'lucide-react';
import './EmptyState.css';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Tidak ada data untuk ditampilkan", 
  description = "Belum ada permohonan pada kategori ini atau sesuai filter yang dipilih.",
  onReset 
}) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">
        <Archive size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {onReset && (
        <button className="empty-state-btn" onClick={onReset}>
          Reset Filter
        </button>
      )}
    </div>
  );
};

export default EmptyState;
