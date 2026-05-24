import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  // Clamp percent between 0 and 100
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  let statusClass = 'progress-awal'; // 0-30
  if (clampedPercent > 30 && clampedPercent <= 70) {
    statusClass = 'progress-berjalan';
  } else if (clampedPercent > 70) {
    statusClass = 'progress-selesai';
  }

  return (
    <div className="progress-bar-container w-full max-w-xs flex items-center gap-3">
      <div className="progress-bar-track flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
        <div 
          className={`progress-fill h-full rounded-full transition-all duration-500 ease-out ${statusClass}`}
          style={{ width: `${clampedPercent}%` }}
        ></div>
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{clampedPercent}%</span>
    </div>
  );
};

export default ProgressBar;
