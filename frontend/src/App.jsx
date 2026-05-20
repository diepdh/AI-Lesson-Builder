import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell/AppShell';
import LessonPlayer from './components/LessonPreview/LessonPlayer';
import LeftChatPanel from './components/LeftChatPanel/LeftChatPanel';
import { lessonApi } from './api/lesson.api';
import './styles.css';

function App() {
  const [health, setHealth] = useState({ ok: true });
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [authoringMessages, setAuthoringMessages] = useState([
    { role: 'assistant', text: 'Chào thầy/cô! Em là trợ lý AI giúp chỉnh sửa bài giảng. Thầy/cô muốn em giúp gì ạ?' }
  ]);
  const [currentSlideId, setCurrentSlideId] = useState(null);
  const [error, setError] = useState(null);

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
  };

  return (
    <AppShell health={health} onRetryHealth={checkHealth}>
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
              />
            ) : (
              <div className="json-viewer">
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
