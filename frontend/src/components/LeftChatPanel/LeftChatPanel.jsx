import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import PromptInput from './PromptInput';
import { authoringApi } from '../../api/authoring.api';

const LeftChatPanel = ({ messages, setMessages, onLessonUpdate, currentSlideId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendPrompt = async (text) => {
    const message = text || promptText;
    if (!message.trim()) return;

    setError(null);
    const userMsg = { role: 'user', text: message };
    setMessages(prev => [...prev, userMsg]);
    setPromptText('');
    setIsProcessing(true);

    try {
      const chatHistory = [...messages, userMsg]
        .slice(-10)
        .map(msg => ({
          role: msg.role,
          content: msg.text
        }));
      const response = await authoringApi.chat(message, currentSlideId, chatHistory);

      if (response.ok) {
        const assistantMsg = { 
          role: 'assistant', 
          text: response.assistantMessage,
          changeSummary: response.changeSummary
        };
        setMessages(prev => [...prev, assistantMsg]);
        
        if (response.updatedLesson) {
          onLessonUpdate(response.updatedLesson);
        }
      } else {
        const detailText = response.details ? ` (${response.details})` : '';
        const errorMsg = response.status === 502 || response.error?.includes('LLM') 
          ? "AI đang gặp lỗi, vui lòng thử lại." 
          : 'Rất tiếc, em gặp lỗi khi xử lý yêu cầu: ' + (response.error || "Lỗi không xác định");
        const errorMsgWithDetails = errorMsg + detailText;

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: errorMsgWithDetails,
          isError: true 
        }]);
        setError(errorMsgWithDetails);
      }
    } catch (err) {
      console.error('Authoring chat failed:', err);
      const systemError = "AI đang gặp lỗi, vui lòng thử lại.";
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: systemError,
        isError: true 
      }]);
      setError(systemError);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (presetPrompt) => {
    setPromptText(presetPrompt);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const quickActions = [
    { label: 'Thêm checkpoint', icon: '➕', prompt: 'Hãy thêm một câu hỏi trắc nghiệm phù hợp cho slide này.' },
    { label: 'Sửa lời thoại', icon: '📝', prompt: 'Hãy viết lại kịch bản giảng bài của slide này cho sinh động hơn.' },
    { label: 'Tạo câu hỏi', icon: '❓', prompt: 'Hãy tạo một câu hỏi tự luận để kiểm tra hiểu bài.' },
    { label: 'Cải thiện nội dung', icon: '✨', prompt: 'Hãy rà soát và cải thiện nội dung của toàn bộ bài giảng.' }
  ];

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h3>Authoring AI</h3>
      </div>
      
      <div className="chat-history" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}
        {isProcessing && (
          <div className="chat-bubble assistant loading">
            <div className="avatar">👩‍🏫</div>
            <div className="bubble-content">...</div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <button 
            key={idx} 
            className="action-btn"
            onClick={() => handleQuickAction(action.prompt)}
            disabled={isProcessing}
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      <PromptInput 
        inputRef={inputRef}
        value={promptText}
        onChange={setPromptText}
        onSend={handleSendPrompt} 
        disabled={isProcessing} 
      />
    </div>
  );
};

export default LeftChatPanel;
