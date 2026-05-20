import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      <div className="progress-text">Trang {current} / {total}</div>
    </div>
  );
};

export default ProgressBar;
