import React from 'react';
import './CompletionOverlay.css';

const CompletionOverlay = ({ onRestart }) => {
  return (
    <div className="completion-overlay">
      <div className="completion-card">
        <div className="completion-icon">🎉</div>
        <h2>Chúc mừng cả lớp!</h2>
        <p>Chúng mình đã hoàn thành bài học hôm nay rồi.</p>
        <button className="restart-btn" onClick={onRestart}>Học lại từ đầu</button>
      </div>
    </div>
  );
};

export default CompletionOverlay;
