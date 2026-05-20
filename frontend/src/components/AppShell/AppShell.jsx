import React from 'react';
import './AppShell.css'; // Sẽ tạo sau

const AppShell = ({ children, health, onRetryHealth }) => {
  return (
    <div className="app-shell">
      {!health?.ok && (
        <div className="health-banner error">
          <span>⚠️ Backend chưa sẵn sàng hoặc không thể kết nối.</span>
          <button onClick={onRetryHealth}>Thử lại</button>
        </div>
      )}
      <header className="app-header">
        <div className="logo">AI Lesson Builder</div>
        <div className="status-indicators">
          <span className={`status-dot ${health?.ok ? 'online' : 'offline'}`}></span>
          <span className="status-text">{health?.ok ? 'Connected' : 'Disconnected'}</span>
          {health?.llmConfigured !== undefined && (
             <span className={`status-tag ${health.llmConfigured ? 'success' : 'warning'}`}>
               LLM: {health.llmConfigured ? 'Ready' : 'Not Configured'}
             </span>
          )}
        </div>
      </header>
      <div className="app-body">
        {children}
      </div>
    </div>
  );
};

export default AppShell;
