import React from 'react';
import { X, CheckCircle, Clock, CircleDot, FileText } from 'lucide-react';
import './TimelineModal.css';

export interface TimelineEvent {
  status: 'Disetujui' | 'Diproses' | 'Disalurkan' | 'Selesai';
  timestamp: string;
  isComplete: boolean;
  notes?: string;
}

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timelineData: TimelineEvent[];
  title?: string;
}

const getStatusIcon = (status: string, isComplete: boolean) => {
  if (!isComplete) return <CircleDot size={20} className="text-gray-300" />;
  switch (status) {
    case 'Disetujui': return <FileText size={20} className="text-blue-500" />;
    case 'Diproses': return <Clock size={20} className="text-yellow-500" />;
    case 'Disalurkan': return <CheckCircle size={20} className="text-indigo-500" />;
    case 'Selesai': return <CheckCircle size={20} className="text-green-500" />;
    default: return <CheckCircle size={20} className="text-gray-500" />;
  }
};

const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose, timelineData, title = "Timeline Proses Bantuan" }) => {
  if (!isOpen) return null;

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tm-header">
          <h4 className="font-semibold text-lg">{title}</h4>
          <button className="tm-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="tm-body">
          <div className="tm-timeline">
            {timelineData.map((ev, idx) => (
              <div key={idx} className={`tm-item ${ev.isComplete ? 'complete' : 'pending'}`}>
                <div className="tm-icon-wrapper">
                  {getStatusIcon(ev.status, ev.isComplete)}
                </div>
                {idx !== timelineData.length - 1 && <div className={`tm-line ${ev.isComplete ? 'line-complete' : ''}`}></div>}
                <div className="tm-content">
                  <h5 className={`font-semibold ${ev.isComplete ? 'text-gray-900' : 'text-gray-400'}`}>{ev.status}</h5>
                  {ev.timestamp && <p className="text-xs text-gray-500 mt-1">{ev.timestamp}</p>}
                  {ev.notes && <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">{ev.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="tm-footer">
          <button className="btn-secondary w-full" onClick={onClose}>Tutup Panel</button>
        </div>
      </div>
    </div>
  );
};

export default TimelineModal;
