import React, { useState, useEffect, useRef } from 'react';
import './VoiceButton.css';

const VoiceButton = ({ onTranscript, isProcessing }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'error'
  const [errorMsg, setErrorMsg] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('error');
      setErrorMsg('Hãy dùng Chrome hoặc nhập bằng bàn phím.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setStatus('listening');
      setErrorMsg(null);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setStatus('processing');
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setStatus('error');
        setErrorMsg(`Lỗi: ${event.error}. Hãy thử lại.`);
      } else {
        setStatus('idle');
      }
    };

    recognition.onend = () => {
      if (status === 'listening') {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;
  }, [onTranscript, status]);

  // Update status based on parent's isProcessing
  useEffect(() => {
    if (isProcessing) {
      setStatus('processing');
    } else if (status === 'processing') {
      setStatus('idle');
    }
  }, [isProcessing]);

  const toggleListening = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setStatus('error');
        setErrorMsg('Không thể khởi động microphone.');
      }
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'listening':
        return { icon: '🎤', text: 'Đang nghe...' };
      case 'processing':
        return { icon: '⏳', text: 'Đang xử lý...' };
      case 'error':
        return { icon: '⚠️', text: 'Lỗi voice' };
      default:
        return { icon: '🎙️', text: 'Nói với cô' };
    }
  };

  const content = getButtonContent();

  return (
    <div className="voice-button-wrapper">
      <button 
        className={`voice-btn ${status}`} 
        onClick={toggleListening}
        disabled={status === 'processing' || errorMsg?.includes('Chrome')}
        title={errorMsg || (status === 'listening' ? 'Nhấn để dừng' : 'Nhấn để nói')}
      >
        <span className={`voice-icon ${status === 'listening' ? 'listening' : ''}`}>{content.icon}</span>
        <span className="voice-text">{content.text}</span>
      </button>
      {status === 'error' && errorMsg && (
        <div className="voice-tooltip">{errorMsg}</div>
      )}
    </div>
  );
};

export default VoiceButton;
