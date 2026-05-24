import React from 'react';

interface SummaryCardProps {
  label: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  maxValue?: string;
  progress?: {
    value: number; // percentage
    colorClass: string; // e.g. "orange", "green"
  };
  desc?: string;
}

const getColorIndicator = (numValue: number): string => {
  // Untuk nilai desil (1-10)
  if (numValue >= 8) return 'green';
  if (numValue >= 5) return 'orange';
  return 'red';
};

const parseNumericValue = (value: React.ReactNode): number | null => {
  if (typeof value === 'string') {
    const numMatch = value.match(/^(\d+(?:\.\d+)?)$/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }
  } else if (typeof value === 'number') {
    return value;
  }
  return null;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  icon,
  value=0,
  maxValue,
  progress,
  desc
}) => {
  const numericValue = parseNumericValue(value);
  const hasNumericValue = numericValue !== null && numericValue !== undefined;
  const showBar = hasNumericValue || progress;
  const barPercentage = progress ? progress.value : (numericValue !== null ? (numericValue / 10) * 100 : 0);
  const colorClass = progress?.colorClass ?? (hasNumericValue ? getColorIndicator(numericValue) : 'gray');

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <span className="label">{label}</span>
        {icon}
      </div>
      <div className={`summary-card-value ${showBar ? 'with-progress' : ''}`}>
        {showBar ? (
          <>
            <div className="progress-bar-container">
              <div 
                className={`progress-bar ${colorClass}`} 
                style={{ width: `${Math.min(barPercentage, 100)}%` }}
              ></div>
            </div>
            <span className="percent-val">
              {value}
              {maxValue && <span className="max-num" style={{ marginLeft: '4px', fontSize: '0.75em' }}>{maxValue}</span>}
            </span>
          </>
        ) : (
          <>
            <span className="big-num">{value}</span>
            {maxValue && <span className="max-num">{maxValue}</span>}
          </>
        )}
      </div>
      {desc && <p className="summary-desc">{desc}</p>}
    </div>
  );
};
