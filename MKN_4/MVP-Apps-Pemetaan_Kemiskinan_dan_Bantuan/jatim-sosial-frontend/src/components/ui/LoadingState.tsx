import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingState.css';

const LoadingState: React.FC = () => {
  return (
    <div className="loading-state-wrapper">
      <Loader2 size={40} className="loading-spinner-icon" />
      <p className="loading-state-text">Memuat data...</p>
    </div>
  );
};

export default LoadingState;
