import React, { useState, useEffect } from 'react';
import SlideViewer from './SlideViewer';
import AudioPlayer from './AudioPlayer';
import ProgressBar from './ProgressBar';
import CompletionOverlay from './CompletionOverlay';
import CheckpointBox from './CheckpointBox';
import ClassroomChat from './ClassroomChat';
import './LessonPlayer.css';

const LessonPlayer = ({ lesson, onSlideChange, onToggleSlideQuestion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [passedCheckpoints, setPassedCheckpoints] = useState(new Set());
  const [reviewState, setReviewState] = useState(null); // { originalIndex, checkpointId }

  const slides = lesson?.slides || [];
  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  useEffect(() => {
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowCheckpoint(false);
    setAudioCompleted(false);
    setPassedCheckpoints(new Set());
    setReviewState(null);
  }, [lesson?.lessonId]);

  useEffect(() => {
    if (currentSlide && onSlideChange) {
      onSlideChange(currentSlide.id);
    }
  }, [currentIndex, currentSlide, onSlideChange]);

  const isQuestionEnabledForSlide = (slide) => {
    if (!slide?.checkpoint) return false;
    return slide.questionEnabled !== false;
  };

  useEffect(() => {
    setShowCheckpoint(false);
    setAudioCompleted(false);

    const shouldShowAfterAudio = currentSlide?.checkpoint
      && isQuestionEnabledForSlide(currentSlide)
      && !passedCheckpoints.has(currentSlide.checkpoint.id);

    if (!shouldShowAfterAudio || currentSlide?.audio) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowCheckpoint(true);
    }, currentIndex === 0 ? 0 : 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, passedCheckpoints, currentSlide]);

  useEffect(() => {
    const shouldShowAfterAudio = currentSlide?.checkpoint
      && isQuestionEnabledForSlide(currentSlide)
      && !passedCheckpoints.has(currentSlide.checkpoint.id);

    if (shouldShowAfterAudio && audioCompleted) {
      setShowCheckpoint(true);
    }
  }, [audioCompleted, currentSlide, passedCheckpoints]);

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
    setAudioCompleted(false);
    setPassedCheckpoints(new Set());
    setReviewState(null);
  };

  const handleCorrect = (checkpointId) => {
    setPassedCheckpoints((prev) => new Set([...prev, checkpointId]));
    setReviewState(null);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < totalSlides - 1) return prevIndex + 1;
        setIsCompleted(true);
        return prevIndex;
      });
    }, 500);
  };

  const handleReview = (reviewSlideId, checkpointId) => {
    const reviewIndex = slides.findIndex((s) => s.id === reviewSlideId);
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

  const shouldAskCheckpoint = currentSlide?.checkpoint
    && isQuestionEnabledForSlide(currentSlide)
    && !passedCheckpoints.has(currentSlide.checkpoint.id);

  const isNextDisabled = shouldAskCheckpoint;

  const handleToggleQuestion = () => {
    if (!currentSlide?.checkpoint || !onToggleSlideQuestion) return;
    const nextEnabled = !isQuestionEnabledForSlide(currentSlide);
    onToggleSlideQuestion(currentSlide.id, nextEnabled);
  };

  if (!lesson) return <div className="player-empty">Đang tải bài học...</div>;

  return (
    <div className="lesson-player">
      <ProgressBar current={currentIndex + 1} total={totalSlides} />

      {reviewState && (
        <div className="review-banner">
          <span>Đang ôn tập kiến thức...</span>
          <button className="back-to-cp-btn" onClick={handleBackToCheckpoint}>
            Quay lại câu hỏi
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
            autoContinue
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
          Trang trước
        </button>

        {currentSlide?.checkpoint && (
          <button
            className={`nav-btn toggle-question ${isQuestionEnabledForSlide(currentSlide) ? 'on' : 'off'}`}
            onClick={handleToggleQuestion}
            title="Bật hoặc tắt câu hỏi phụ cho slide này"
          >
            {isQuestionEnabledForSlide(currentSlide) ? 'Tắt câu hỏi phụ' : 'Bật câu hỏi phụ'}
          </button>
        )}

        {currentSlide?.audio && !showCheckpoint && (
          <AudioPlayer
            src={currentSlide.audio}
            script={currentSlide.script}
            forceTTS={Boolean(currentSlide.audioNeedsUpdate)}
            autoPlay={currentIndex !== 0}
            autoPlayDelay={currentIndex === 0 ? 0 : 1000}
            startLabel={currentIndex === 0 ? 'Bắt đầu' : 'Phát lời giảng'}
            replayLabel="Phát lại lời giảng"
            onEnded={() => setAudioCompleted(true)}
            key={currentSlide.id}
          />
        )}

        <button
          className="nav-btn next"
          onClick={handleNext}
          disabled={isNextDisabled}
          title={isNextDisabled ? 'Vui lòng hoàn thành câu hỏi để tiếp tục' : ''}
        >
          {currentIndex === totalSlides - 1 && !isNextDisabled ? 'Hoàn thành' : 'Trang sau'}
        </button>
      </div>

      {isCompleted && <CompletionOverlay onRestart={handleRestart} />}
    </div>
  );
};

export default LessonPlayer;
