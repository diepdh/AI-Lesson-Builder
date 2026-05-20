import React, { useState, useEffect } from 'react';
import SlideViewer from './SlideViewer';
import AudioPlayer from './AudioPlayer';
import ProgressBar from './ProgressBar';
import CompletionOverlay from './CompletionOverlay';
import CheckpointBox from './CheckpointBox';
import ClassroomChat from './ClassroomChat';
import './LessonPlayer.css';

const LessonPlayer = ({ lesson, onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [passedCheckpoints, setPassedCheckpoints] = useState(new Set());
  const [reviewState, setReviewState] = useState(null); // { originalIndex, checkpointId }

  const slides = lesson?.slides || [];
  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  useEffect(() => {
    // Reset player if lesson changes
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowCheckpoint(false);
    setPassedCheckpoints(new Set());
    setReviewState(null);
  }, [lesson?.lessonId]);

  // Báo cáo slide hiện tại ra ngoài để AI biết ngữ cảnh slide khi chat authoring
  useEffect(() => {
    if (currentSlide && onSlideChange) {
      onSlideChange(currentSlide.id);
    }
  }, [currentIndex, currentSlide, onSlideChange]);

  // Tự động hiện checkpoint nếu slide có checkpoint và chưa pass
  useEffect(() => {
    if (currentSlide?.checkpoint && !passedCheckpoints.has(currentSlide.checkpoint.id)) {
      setShowCheckpoint(true);
    } else {
      setShowCheckpoint(false);
    }
  }, [currentIndex, passedCheckpoints, currentSlide]);

  const handleNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowCheckpoint(false);
    setPassedCheckpoints(new Set());
    setReviewState(null);
  };

  const handleCorrect = (checkpointId) => {
    setPassedCheckpoints(prev => new Set([...prev, checkpointId]));
    setReviewState(null);
    // Sau khi pass, Next button sẽ được enabled tự động qua useEffect
  };

  const handleReview = (reviewSlideId, checkpointId) => {
    const reviewIndex = slides.findIndex(s => s.id === reviewSlideId);
    if (reviewIndex !== -1) {
      setReviewState({ originalIndex: currentIndex, checkpointId });
      setCurrentIndex(reviewIndex);
    }
  };

  const handleBackToCheckpoint = () => {
    if (reviewState) {
      setCurrentIndex(reviewState.originalIndex);
    }
  };

  const isNextDisabled = currentSlide?.checkpoint && !passedCheckpoints.has(currentSlide.checkpoint.id);

  if (!lesson) return <div className="player-empty">Đang tải bài học...</div>;

  return (
    <div className="lesson-player">
      <ProgressBar current={currentIndex + 1} total={totalSlides} />
      
      {reviewState && (
        <div className="review-banner">
          <span>📖 Đang ôn tập kiến thức...</span>
          <button className="back-to-cp-btn" onClick={handleBackToCheckpoint}>
            Quay lại câu hỏi ↩️
          </button>
        </div>
      )}

      <div className={`player-content ${showCheckpoint ? 'blurred' : ''}`}>
        <div className="slide-area">
          <SlideViewer slide={currentSlide} />
        </div>
        
        {showCheckpoint && currentSlide?.checkpoint && (
          <CheckpointBox 
            checkpoint={currentSlide.checkpoint}
            lessonId={lesson.lessonId}
            slideId={currentSlide.id}
            knowledgePoint={currentSlide.knowledgePoint}
            answerMode={lesson.classroomMode?.mode || 'teacher_led_shared_answer'}
            onCorrect={handleCorrect}
            onReview={handleReview}
          />
        )}

        {!showCheckpoint && (
          <ClassroomChat 
            lessonId={lesson.lessonId} 
            currentSlideId={currentSlide?.id}
            classroomMode={lesson.classroomMode}
          />
        )}
      </div>

      <div className="player-controls">
        <button 
          className="nav-btn prev" 
          onClick={handlePrev} 
          disabled={currentIndex === 0 || showCheckpoint}
        >
          ⬅️ Trang trước
        </button>
        
        {currentSlide?.audio && !showCheckpoint && (
          <AudioPlayer 
            src={currentSlide.audio} 
            script={currentSlide.script}
            key={currentSlide.id} 
          />
        )}

        <button 
          className="nav-btn next" 
          onClick={handleNext}
          disabled={isNextDisabled}
          title={isNextDisabled ? "Vui lòng hoàn thành câu hỏi để tiếp tục" : ""}
        >
          {currentIndex === totalSlides - 1 && !isNextDisabled 
            ? 'Hoàn thành 🏁' 
            : 'Trang sau ➡️'}
        </button>
      </div>

      {isCompleted && <CompletionOverlay onRestart={handleRestart} />}
    </div>
  );
};

export default LessonPlayer;
