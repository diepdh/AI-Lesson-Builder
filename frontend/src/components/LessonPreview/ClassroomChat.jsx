import React, { useState, useEffect, useRef } from 'react';
import { chatApi } from '../../api/chat.api';
import { voiceApi } from '../../api/voice.api';
import VoiceButton from './VoiceButton';
import './ClassroomChat.css';

const ClassroomChat = ({ lessonId, currentSlideId, classroomMode }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Clean up TTS on unmount or slide change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSlideId]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (text) => {
    const message = text || inputText;
    if (!message.trim()) return;

    const userMsg = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await chatApi.chat({
        lessonId,
        currentSlideId,
        message,
        mode: classroomMode?.mode,
        chatHistory: messages.slice(-5).map(m => ({ role: m.role, content: m.text }))
      });

      if (response.ok) {
        const assistantMsg = { role: 'assistant', text: response.reply };
        setMessages(prev => [...prev, assistantMsg]);
        if (response.speak) {
          speak(response.reply);
        }
      } else {
        setMessages(prev => [...prev, { role: 'system', text: 'Lỗi: ' + response.error, isError: true }]);
      }
    } catch (error) {
      console.error('Chat failed:', error);
      setMessages(prev => [...prev, { role: 'system', text: 'Không thể kết nối đến máy chủ.', isError: true }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscript = async (transcript) => {
    const userMsg = { role: 'user', text: transcript };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const response = await voiceApi.chat(transcript, {
        lessonId,
        currentSlideId,
        mode: classroomMode?.mode,
        chatHistory: messages.slice(-5).map(m => ({ role: m.role, content: m.text }))
      });

      if (response.ok) {
        const assistantMsg = { role: 'assistant', text: response.reply };
        setMessages(prev => [...prev, assistantMsg]);
        if (response.speak) {
          speak(response.reply);
        }
      } else {
        setMessages(prev => [...prev, { role: 'system', text: 'Lỗi: ' + response.error, isError: true }]);
      }
    } catch (error) {
      console.error('Voice chat failed:', error);
      setMessages(prev => [...prev, { role: 'system', text: 'Không thể kết nối đến máy chủ.', isError: true }]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="classroom-chat-collapsed">
        <button className="toggle-chat-btn open" onClick={() => setIsOpen(true)}>
          💬 Hỏi cô giáo trợ giảng
        </button>
      </div>
    );
  }

  return (
    <div className="classroom-chat">
      <div className="chat-header">
        <span>👩‍🏫 Trợ giảng AI</span>
        <button className="toggle-chat-btn close" onClick={() => setIsOpen(false)}>➖</button>
      </div>
      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="empty-chat-msg">Các em có câu hỏi gì cho cô không?</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-bubble ${msg.role} ${msg.isError ? 'error' : ''}`}>
            {msg.role === 'assistant' && <span className="avatar">👩‍🏫</span>}
            <div className="bubble-text">{msg.text}</div>
          </div>
        ))}
        {isProcessing && (
          <div className="message-bubble assistant loading">
            <span className="avatar">👩‍🏫</span>
            <div className="bubble-text">...</div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Hỏi cô giáo AI..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isProcessing}
        />
        <button className="send-btn" onClick={() => handleSendMessage()} disabled={isProcessing || !inputText.trim()}>
          ✈️
        </button>
        <VoiceButton 
          onTranscript={handleVoiceTranscript} 
          isProcessing={isProcessing} 
        />
      </div>
    </div>
  );
};

export default ClassroomChat;
