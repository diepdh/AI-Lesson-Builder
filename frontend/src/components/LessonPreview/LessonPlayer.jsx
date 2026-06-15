import React, { useState, useEffect, useRef } from 'react';
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
  const [audioCompletedSlideId, setAudioCompletedSlideId] = useState(null);
  const [afterCorrectPlayback, setAfterCorrectPlayback] = useState(null);
  const [reviewState, setReviewState] = useState(null); // { originalIndex, checkpointId }
  const nextAfterCorrectTimerRef = useRef(null);

  const slides = lesson?.slides || [];
  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  useEffect(() => {
    setCurrentIndex(0);
    setIsCompleted(false);
    setShowCheckpoint(false);
    setAudioCompletedSlideId(null);
    setAfterCorrectPlayback(null);
    setReviewState(null);
  }, [lesson?.lessonId]);

  useEffect(() => {
    return () => clearTimeout(nextAfterCorrectTimerRef.current);
  }, []);

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
    clearTimeout(nextAfterCorrectTimerRef.current);
    setShowCheckpoint(false);
    setAudioCompletedSlideId(null);
    setAfterCorrectPlayback(null);

    const shouldShowAfterAudio = currentSlide?.checkpoint
      && isQuestionEnabledForSlide(currentSlide);

    if (!shouldShowAfterAudio || currentSlide?.audio) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowCheckpoint(true);
    }, currentIndex === 0 ? 0 : 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, currentSlide]);

  useEffect(() => {
    const shouldShowAfterAudio = currentSlide?.checkpoint
      && isQuestionEnabledForSlide(currentSlide);

    if (shouldShowAfterAudio && audioCompletedSlideId === currentSlide.id) {
      setShowCheckpoint(true);
    }
  }, [audioCompletedSlideId, currentSlide]);

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
    setAudioCompletedSlideId(null);
    setAfterCorrectPlayback(null);
    setReviewState(null);
  };

  const advanceAfterDelay = () => {
    clearTimeout(nextAfterCorrectTimerRef.current);
    nextAfterCorrectTimerRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < totalSlides - 1) return prevIndex + 1;
        setIsCompleted(true);
        return prevIndex;
      });
    }, 5000);
  };

  const handleCorrect = (checkpoint) => {
    setReviewState(null);
    setShowCheckpoint(false);

    if (checkpoint?.afterCorrectAudio) {
      setAfterCorrectPlayback({
        slideId: currentSlide.id,
        src: checkpoint.afterCorrectAudio,
        script: checkpoint.afterCorrectScript || ''
      });
      return;
    }

    setCurrentIndex((prevIndex) => {
      if (prevIndex < totalSlides - 1) return prevIndex + 1;
      setIsCompleted(true);
      return prevIndex;
    });
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
    && !afterCorrectPlayback;

  const isNextDisabled = shouldAskCheckpoint || Boolean(afterCorrectPlayback);

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
            autoContinueDelayMs={currentSlide.checkpoint.afterCorrectAudio ? 700 : 5000}
            autoContinueMessage={
              currentSlide.checkpoint.afterCorrectAudio
                ? 'Đã đúng, đang phát tiếp lời giảng của slide này...'
                : 'Đã đúng, sẽ tự chuyển sang slide tiếp theo sau 5 giây...'
            }
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

        {(afterCorrectPlayback || currentSlide?.audio) && !showCheckpoint && (
          <AudioPlayer
            src={afterCorrectPlayback?.src || currentSlide.audio}
            script={afterCorrectPlayback?.script || currentSlide.script}
            forceTTS={!afterCorrectPlayback && Boolean(currentSlide.audioNeedsUpdate)}
            autoPlay={Boolean(afterCorrectPlayback) || currentIndex !== 0}
            autoPlayDelay={afterCorrectPlayback ? 0 : (currentIndex === 0 ? 0 : 1000)}
            startLabel={afterCorrectPlayback ? 'Phát tiếp' : (currentIndex === 0 ? 'Bắt đầu' : 'Phát lời giảng')}
            replayLabel={afterCorrectPlayback ? 'Phát lại đoạn tiếp' : 'Phát lại lời giảng'}
            onStarted={() => setAudioCompletedSlideId(null)}
            onEnded={() => {
              if (afterCorrectPlayback) {
                advanceAfterDelay();
                return;
              }
              setAudioCompletedSlideId(currentSlide.id);
            }}
            key={afterCorrectPlayback ? `${currentSlide.id}-after-correct` : currentSlide.id}
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
