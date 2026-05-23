import React, { useState } from 'react';
import { lessonApi } from '../../api/lesson.api';
import './SetupScreen.css';

const SetupScreen = ({ onLessonInitialized, onCancel }) => {
  const [folders, setFolders] = useState({
    slideFolder: 'C:\\Users\\dohuy\\Downloads\\01. Documents\\Xtech\\bai-giang-ai3\\bai-giang-ai\\slides',
    audioFolder: 'C:\\Users\\dohuy\\Downloads\\01. Documents\\Xtech\\bai-giang-ai3\\bai-giang-ai\\audio',
    videoFolder: ''
  });
  const [enrichConfig, setEnrichConfig] = useState({
    enabled: true,
    targetLearner: 'Học sinh lớp 3',
    learningObjectivesText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusText, setStatusText] = useState('');

  const handleFolderChange = (e) => {
    const { name, value } = e.target;
    setFolders((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnrichChange = (e) => {
    const { name, type, checked, value } = e.target;
    setEnrichConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const parseObjectives = (text) => {
    return String(text || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folders.slideFolder) {
      setError('Vui lòng nhập thư mục chứa ảnh slide.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusText('Đang dựng bài học...');

    try {
      const initResponse = await lessonApi.initLesson(folders);
      if (!initResponse.ok) {
        setError(initResponse.error || 'Có lỗi xảy ra khi dựng bài học.');
        return;
      }

      let lesson = initResponse.lesson;

      if (enrichConfig.enabled) {
        setStatusText('Đang làm giàu nội dung bằng AI...');
        const enrichResponse = await lessonApi.enrichLesson({
          scope: 'missing',
          targetLearner: enrichConfig.targetLearner,
          learningObjectives: parseObjectives(enrichConfig.learningObjectivesText)
        });

        if (enrichResponse.ok && enrichResponse.lesson) {
          lesson = enrichResponse.lesson;
        } else {
          const enrichError = enrichResponse.error || 'Làm giàu nội dung chưa thành công.';
          setError(`Đã dựng bài học nhưng AI chưa làm giàu xong: ${enrichError}`);
        }
      }

      onLessonInitialized(lesson);
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
      console.error(err);
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1>Khởi tạo bài học</h1>
        <p>Nhập đường dẫn thư mục media và tùy chọn làm giàu nội dung để AI hiểu bài học tốt hơn.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Thư mục Slides (Ảnh)</label>
            <input
              type="text"
              name="slideFolder"
              value={folders.slideFolder}
              onChange={handleFolderChange}
              placeholder="C:\\Path\\To\\Slides"
              required
            />
          </div>

          <div className="form-group">
            <label>Thư mục Audio</label>
            <input
              type="text"
              name="audioFolder"
              value={folders.audioFolder}
              onChange={handleFolderChange}
              placeholder="C:\\Path\\To\\Audio"
            />
          </div>

          <div className="form-group">
            <label>Thư mục Video (tùy chọn)</label>
            <input
              type="text"
              name="videoFolder"
              value={folders.videoFolder}
              onChange={handleFolderChange}
              placeholder="C:\\Path\\To\\Video"
            />
          </div>

          <div className="form-group enrich-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enabled"
                checked={enrichConfig.enabled}
                onChange={handleEnrichChange}
              />
              <span>Tự động làm giàu nội dung bằng AI sau khi dựng bài</span>
            </label>
          </div>

          {enrichConfig.enabled && (
            <>
              <div className="form-group">
                <label>Đối tượng học</label>
                <input
                  type="text"
                  name="targetLearner"
                  value={enrichConfig.targetLearner}
                  onChange={handleEnrichChange}
                  placeholder="Ví dụ: Học sinh lớp 3"
                />
              </div>

              <div className="form-group">
                <label>Mục tiêu học tập (mỗi dòng một mục tiêu)</label>
                <textarea
                  name="learningObjectivesText"
                  value={enrichConfig.learningObjectivesText}
                  onChange={handleEnrichChange}
                  placeholder={'Ví dụ:\nHiểu khái niệm AI cơ bản\nNhận biết ví dụ AI trong đời sống'}
                  rows={4}
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
          {statusText && <div className="status-message">{statusText}</div>}

          <button type="submit" className="init-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Dựng bài'}
          </button>
        </form>

        <div className="setup-help">
          <small>
            Mẹo: đặt tên file theo thứ tự (ví dụ: slide-01.jpg, audio-01.mp3) để hệ thống ghép cặp chính xác.
          </small>
        </div>

        {onCancel && (
          <button type="button" className="cancel-setup-btn" onClick={onCancel}>
            Quay lại bài hiện tại
          </button>
        )}
      </div>
    </div>
  );
};

export default SetupScreen;
