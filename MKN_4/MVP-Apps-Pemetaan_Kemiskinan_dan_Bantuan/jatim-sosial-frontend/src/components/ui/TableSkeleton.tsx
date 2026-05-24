import React from 'react';
import './TableSkeleton.css';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 4, columns = 6 }) => {
  return (
    <table className="skeleton-table w-full">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, cIndex) => (
            <th key={cIndex}>
              <div className="skeleton-box header"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rIndex) => (
          <tr key={rIndex}>
            {Array.from({ length: columns }).map((_, cIndex) => (
              <td key={cIndex}>
                <div className={`skeleton-box line-${Math.floor(Math.random() * 3) + 1}`}></div>
                {cIndex < 2 && <div className="skeleton-box line-sub"></div>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
