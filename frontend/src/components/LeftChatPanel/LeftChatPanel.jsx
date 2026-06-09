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

  const handleSendPrompt = async (payload) => {
    const incoming = typeof payload === 'string' ? { text: payload } : (payload || {});
    const message = incoming.text || promptText;
    const intent = incoming.intent || null;
    if (!message.trim()) return;

    setError(null);
    const userMsg = { role: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setPromptText('');
    setIsProcessing(true);

    try {
      const chatHistory = [...messages, userMsg]
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.text
        }));
      const response = await authoringApi.chat(message, currentSlideId, chatHistory, intent);

      if (response.ok) {
        const assistantMsg = {
          role: 'assistant',
          text: response.assistantMessage,
          changeSummary: response.changeSummary
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (response.updatedLesson) {
          onLessonUpdate(response.updatedLesson);
        }
      } else {
        const detailText = response.details ? ` (${response.details})` : '';
        const errorMsg = response.status === 502 || response.error?.includes('LLM')
          ? 'AI đang gặp lỗi, vui lòng thử lại.'
          : 'Rất tiếc, em gặp lỗi khi xử lý yêu cầu: ' + (response.error || 'Lỗi không xác định');
        const errorMsgWithDetails = errorMsg + detailText;

        setMessages((prev) => [...prev, {
          role: 'assistant',
          text: errorMsgWithDetails,
          isError: true
        }]);
        setError(errorMsgWithDetails);
      }
    } catch (err) {
      console.error('Authoring chat failed:', err);
      const systemError = 'AI đang gặp lỗi, vui lòng thử lại.';
      setMessages((prev) => [...prev, {
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

  const handleQuickAction = (action) => {
    if (!action) return;
    handleSendPrompt({ text: action.prompt, intent: action.intent });
  };

  const quickActions = [
    {
      label: 'Chọn hình',
      icon: '+',
      intent: 'add_image_choice_checkpoint_current_slide',
      prompt: 'Tạo 1 checkpoint dạng image_choice: học sinh chọn hình đúng cho slide hiện tại.'
    },
    {
      label: 'Sắp xếp hình',
      icon: '^',
      intent: 'add_image_ordering_checkpoint_current_slide',
      prompt: 'Tạo 1 checkpoint dạng image_ordering: học sinh sắp xếp các hình theo đúng thứ tự cho slide hiện tại.'
    },
    {
      label: 'Thêm checkpoint',
      icon: '+',
      intent: 'add_checkpoint_current_slide',
      prompt: 'Thêm 1 checkpoint trắc nghiệm cho slide hiện tại.'
    },
    {
      label: 'Sửa lời thoại',
      icon: 'S',
      intent: 'rewrite_script_current_slide',
      prompt: 'Viết lại lời thoại slide hiện tại cho rõ ràng, dễ hiểu, sinh động.'
    },
    {
      label: 'Tạo câu hỏi',
      icon: '?',
      intent: 'add_open_question_current_slide',
      prompt: 'Thêm 1 câu hỏi tự luận ngắn cho slide hiện tại.'
    },
    {
      label: 'Cải thiện nội dung',
      icon: '*',
      intent: 'improve_content_current_slide',
      prompt: 'Cải thiện nội dung slide hiện tại nhưng giữ đúng ý chính.'
    }
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
            <div className="avatar">AI</div>
            <div className="bubble-content">...</div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            className="action-btn"
            onClick={() => handleQuickAction(action)}
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
