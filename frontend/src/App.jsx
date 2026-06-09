import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell/AppShell';
import LessonPlayer from './components/LessonPreview/LessonPlayer';
import LeftChatPanel from './components/LeftChatPanel/LeftChatPanel';
import SetupScreen from './components/SetupScreen/SetupScreen';
import { lessonApi } from './api/lesson.api';
import './styles.css';

const createInitialAuthoringMessages = () => [
  { role: 'assistant', text: 'Chào thầy/cô! Em là trợ lý AI giúp chỉnh sửa bài giảng. Thầy/cô muốn em giúp gì ạ?' }
];

function App() {
  const [health, setHealth] = useState({ ok: true });
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [authoringMessages, setAuthoringMessages] = useState(createInitialAuthoringMessages);
  const [currentSlideId, setCurrentSlideId] = useState(null);
  const [error, setError] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  const checkHealth = async () => {
    try {
      const data = await lessonApi.getHealth();
      setHealth(data);
      if (!data.ok) {
        setError("Không kết nối được backend localhost. Vui lòng kiểm tra server.");
      } else {
        setError(null);
      }
      return data.ok;
    } catch (err) {
      setHealth({ ok: false });
      setError("Không kết nối được backend localhost. Vui lòng kiểm tra server.");
      return false;
    }
  };

  const loadLesson = async () => {
    setLoading(true);
    try {
      const data = await lessonApi.getLesson();
      if (data.ok) {
        setLesson(data.lesson);
        if (data.lesson.slides?.length > 0) {
          setCurrentSlideId(data.lesson.slides[0].id);
        }
      } else if (data.error === 'Lesson file not found') {
        // Lesson not created yet, this is normal for first-time setup
        setLesson(null);
        setError(null);
      } else {
        setError("Không thể tải bài học. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Lỗi kết nối khi tải bài học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isOk = await checkHealth();
      if (isOk) {
        loadLesson();
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLessonUpdate = (updatedLesson) => {
    setLesson(updatedLesson);
    setShowSetup(false);
    setActiveTab('preview');
    if (updatedLesson?.slides?.length > 0) {
      setCurrentSlideId(updatedLesson.slides[0].id);
    }
  };

  const resetAuthoringChat = () => {
    setAuthoringMessages(createInitialAuthoringMessages());
  };

  const handleLessonInitialized = (updatedLesson) => {
    resetAuthoringChat();
    handleLessonUpdate(updatedLesson);
  };

  const handleExport = async () => {
    try {
      const res = await lessonApi.exportWebapp();
      if (res.ok) {
        const msg = res.zip ? `Export thành công: ${res.zip}` : 'Export thành công.';
        alert(msg);
      } else {
        alert('Export thất bại: ' + (res.error || JSON.stringify(res)));
      }
    } catch (err) {
      alert('Lỗi khi gọi export: ' + err.message);
    }
  };

  const handleCreateNewLesson = () => {
    setError(null);
    resetAuthoringChat();
    setShowSetup(true);
  };

  const handleDownloadLesson = () => {
    if (!lesson) return;

    const blob = new Blob([JSON.stringify(lesson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lesson.lessonId || 'lesson'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSlideQuestion = async (slideId, enabled) => {
    if (!lesson || !slideId) return;

    const updatedLesson = {
      ...lesson,
      slides: (lesson.slides || []).map((slide) => {
        if (slide.id !== slideId) return slide;
        return {
          ...slide,
          questionEnabled: enabled
        };
      })
    };

    setLesson(updatedLesson);

    const response = await lessonApi.updateLesson(updatedLesson);
    if (!response.ok) {
      setError('Không thể cập nhật trạng thái câu hỏi cho slide.');
      setLesson(lesson);
      return;
    }

    if (response.lesson) {
      setLesson(response.lesson);
    }
  };

  const renderQuestionAudit = () => {
    if (!lesson?.slides?.length) return null;
    return (
      <div className="question-audit">
        <h4>Trạng thái câu hỏi theo slide</h4>
        <div className="audit-grid">
          {lesson.slides.map((slide) => {
            const hasCheckpoint = Boolean(slide.checkpoint);
            const questionEnabled = hasCheckpoint ? slide.questionEnabled !== false : false;
            return (
              <div key={slide.id} className="audit-item">
                <div className="audit-title">{slide.id} - {slide.title}</div>
                <div className={`audit-tag ${hasCheckpoint ? 'has-cp' : 'no-cp'}`}>
                  {hasCheckpoint ? 'Có checkpoint' : 'Không có checkpoint'}
                </div>
                {hasCheckpoint && (
                  <div className={`audit-tag ${questionEnabled ? 'enabled' : 'disabled'}`}>
                    questionEnabled: {String(questionEnabled)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!loading && !error && (!lesson || showSetup)) {
    return (
      <AppShell health={health} onRetryHealth={checkHealth} onCreateNewLesson={lesson ? handleCreateNewLesson : null}>
        <SetupScreen
          onLessonInitialized={handleLessonInitialized}
          onCancel={lesson ? () => setShowSetup(false) : null}
        />
      </AppShell>
    );
  }

  return (
    <AppShell health={health} onRetryHealth={checkHealth} onCreateNewLesson={handleCreateNewLesson} onExport={handleExport}>
      <LeftChatPanel 
        messages={authoringMessages}
        setMessages={setAuthoringMessages}
        onLessonUpdate={handleLessonUpdate}
        currentSlideId={currentSlideId}
      />
      
      <div className="right-panel">
        <div className="panel-header">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </button>
            <button 
              className={`tab ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              JSON
            </button>
          </div>
          <div className="panel-actions">
            <button className="secondary-action" onClick={handleDownloadLesson} disabled={!lesson}>
              Tải JSON
            </button>
          </div>
        </div>
        <div className="panel-content">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Đang tải bài học...</p>
            </div>
          ) : error ? (
            <div className="error-display">
              <div className="error-icon">⚠️</div>
              <p className="error-text">{error}</p>
              <button className="retry-btn" onClick={() => { setError(null); loadLesson(); }}>Thử lại</button>
            </div>
          ) : lesson ? (
            activeTab === 'preview' ? (
              <LessonPlayer 
                lesson={lesson} 
                onSlideChange={(id) => setCurrentSlideId(id)}
                onToggleSlideQuestion={handleToggleSlideQuestion}
              />
            ) : (
              <div className="json-viewer">
                {renderQuestionAudit()}
                <pre>{JSON.stringify(lesson, null, 2)}</pre>
              </div>
            )
          ) : (
            <div className="error-msg">Dữ liệu bài học trống.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default App;
