import React from 'react';

const PromptInput = ({ onSend, disabled, value, onChange, inputRef }) => {
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
  };

  return (
    <div className="prompt-area">
      <textarea 
        ref={inputRef}
        placeholder="Nhập yêu cầu chỉnh sửa bài giảng..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={disabled}
      />
      <button 
        className="send-btn" 
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
      >
        {disabled ? '⏳' : 'Gửi'}
      </button>
    </div>
  );
};

export default PromptInput;
