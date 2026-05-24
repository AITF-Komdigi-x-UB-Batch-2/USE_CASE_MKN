import React from 'react';
import { ShieldCheck, Home, Briefcase, AlertTriangle, Check } from 'lucide-react';

export interface RecommendationData {
  id: string;
  title: string;
  match: number;
  desc: string;
  reason?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  estimate?: string;
  isReceived: boolean;
}
  
interface RecommendationCardProps {
  data: RecommendationData;
  isSelected?: boolean;
  isLocked?: boolean;
  onToggle?: (id: string, isReceived: boolean) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  data,
  isSelected = false,
  isLocked = false,
  onToggle
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'pkh': return <Briefcase size={20} className="text-blue" />;
      case 'rutilahu': return <Home size={20} className="text-orange" />;
      default: return <ShieldCheck size={20} className="text-cyan" />;
    }
  };

  return (
    <div
      className={`rec-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
      onClick={() => onToggle && onToggle(data.id, data.isReceived)}
    >
      {/* Checkbox Area */}
      <div className="rec-checkbox">
        {isSelected ? <Check size={16} className="text-white" /> : null}
      </div>

      <div className="rec-card-header flex-between">
        <div className="rec-icon">
          {getIcon(data.id)}
        </div>
        {data.priority && (
          <span className={`priority-badge ${data.priority.toLowerCase()}`}>
            {data.priority}
          </span>
        )}
      </div>

      <div className="flex-between mb-2">
        <h4 className="rec-title">{data.title}</h4>
        <span className="match-text">{data.match}% Cocok</span>
      </div>

      {data.isReceived && (
        <div className="received-warning">
          <AlertTriangle size={14} />
          Sudah Menerima Program Ini
        </div>
      )}

      <p className="rec-desc">{data.desc}</p>

      {(data.estimate || data.reason) && (
        <div className="rec-estimate">
          {data.estimate ? `Estimasi: ${data.estimate}` : `Alasan: ${data.reason}`}
        </div>
      )}
    </div>
  );
};

