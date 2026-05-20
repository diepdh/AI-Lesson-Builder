import React from 'react';

const ChatMessage = ({ message }) => {
  const { role, text, changeSummary, isError } = message;

  return (
    <div className={`chat-bubble ${role} ${isError ? 'error' : ''}`}>
      {role === 'assistant' && <div className="avatar">👩‍🏫</div>}
      <div className="bubble-content">
        <p className="message-text">{text}</p>
        
        {changeSummary && (
          <div className="change-summary">
            <div className="summary-header">✍️ Thay đổi:</div>
            <p className="summary-text">{changeSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
