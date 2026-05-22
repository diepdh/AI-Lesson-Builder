import React, { useState } from 'react';
import { lessonApi } from '../../api/lesson.api';
import './SetupScreen.css';

const SetupScreen = ({ onLessonInitialized, onCancel }) => {
  const [folders, setFolders] = useState({
    slideFolder: 'C:\\Users\\dohuy\\Downloads\\01. Documents\\Xtech\\bai-giang-ai3\\bai-giang-ai\\slides',
    audioFolder: 'C:\\Users\\dohuy\\Downloads\\01. Documents\\Xtech\\bai-giang-ai3\\bai-giang-ai\\audio',
    videoFolder: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFolders(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folders.slideFolder) {
      setError('Vui lòng nhập thư mục chứa ảnh slide.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await lessonApi.initLesson(folders);
      if (response.ok) {
        onLessonInitialized(response.lesson);
      } else {
        setError(response.error || 'Có lỗi xảy ra khi dựng bài học.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <h1>🛠️ Khởi tạo bài học</h1>
        <p>Vui lòng nhập đường dẫn tuyệt đối tới các thư mục chứa tài nguyên trên máy tính của bạn.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Thư mục Slides (Ảnh):</label>
            <input
              type="text"
              name="slideFolder"
              value={folders.slideFolder}
              onChange={handleChange}
              placeholder="C:\Path\To\Slides"
              required
            />
          </div>

          <div className="form-group">
            <label>Thư mục Audio:</label>
            <input
              type="text"
              name="audioFolder"
              value={folders.audioFolder}
              onChange={handleChange}
              placeholder="C:\Path\To\Audio"
            />
          </div>

          <div className="form-group">
            <label>Thư mục Video (Tùy chọn):</label>
            <input
              type="text"
              name="videoFolder"
              value={folders.videoFolder}
              onChange={handleChange}
              placeholder="C:\Path\To\Video"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="init-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : '🚀 Dựng bài'}
          </button>
        </form>

        <div className="setup-help">
          <small>
            Mẹo: Các tệp tin trong thư mục nên được đánh số hoặc đặt tên theo thứ tự (ví dụ: slide-01.jpg, slide-02.jpg...) để hệ thống ghép cặp chính xác.
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
