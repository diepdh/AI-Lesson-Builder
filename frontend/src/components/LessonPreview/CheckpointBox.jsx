import React, { useState } from 'react';
import { answerApi } from '../../api/answer.api';
import VoiceButton from './VoiceButton';
import './CheckpointBox.css';

const CheckpointBox = ({ checkpoint, lessonId, slideId, knowledgePoint, answerMode, onCorrect, onReview }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [validationError, setValidationError] = useState('');

  if (!checkpoint) return null;

  const handleSubmit = async (selectedAnswer) => {
    const finalAnswer = selectedAnswer || answer;

    if (!finalAnswer || !finalAnswer.trim()) {
      setValidationError('Vui lòng nhập câu trả lời của lớp.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);
    try {
      const result = await answerApi.evaluate({
        lessonId,
        slideId,
        checkpointId: checkpoint.id,
        question: checkpoint.question,
        correctAnswer: checkpoint.correctAnswer,
        classAnswer: finalAnswer,
        knowledgePoint,
        answerMode
      });

      if (result.ok) {
        setEvaluation(result);
      } else {
        setValidationError('Lỗi khi chấm điểm: ' + (result.error || 'Không rõ nguyên nhân'));
      }
    } catch (error) {
      console.error('Submit answer failed:', error);
      setValidationError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setAnswer(transcript);
    handleSubmit(transcript);
  };

  const handleNextAction = () => {
    if (evaluation.nextAction === 'continue') {
      onCorrect(checkpoint.id);
    } else if (evaluation.nextAction === 'review') {
      onReview(evaluation.reviewSlideId, checkpoint.id);
    }

    setEvaluation(null);
    setAnswer('');
  };

  return (
    <div className="checkpoint-box">
      <div className="checkpoint-header">
        <span className="badge">Câu hỏi nhỏ</span>
        <h4>{checkpoint.question}</h4>
      </div>

      {!evaluation ? (
        <div className="checkpoint-body">
          {checkpoint.type === 'multiple_choice' && (
            <>
              <div className="options-grid">
                {(checkpoint.options || []).map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => handleSubmit(opt)}
                    disabled={isSubmitting}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="answer-divider">Hoặc cả lớp trả lời bằng câu riêng</div>
            </>
          )}

          <div className="class-answer-area">
            <input
              type="text"
              placeholder="Nhập câu trả lời chung của lớp..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (validationError) setValidationError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isSubmitting}
            />
            <button
              className="submit-btn"
              onClick={() => handleSubmit()}
              disabled={isSubmitting || !answer.trim()}
            >
              {isSubmitting ? 'Đang kiểm tra...' : 'Gửi câu trả lời'}
            </button>
            <VoiceButton
              onTranscript={handleVoiceTranscript}
              isProcessing={isSubmitting}
            />
          </div>

          {validationError && <div className="validation-error">{validationError}</div>}
        </div>
      ) : (
        <div className={`evaluation-result ${evaluation.isCorrect ? 'correct' : 'wrong'}`}>
          <div className="result-header">
            <span className="result-icon">{evaluation.isCorrect ? 'OK' : '!'}</span>
            <span className="result-title">{evaluation.isCorrect ? 'Đúng rồi!' : 'Chưa đúng rồi...'}</span>
          </div>
          <p className="feedback-text">{evaluation.feedback}</p>
          <div className="explanation-box">
            <strong>Giải thích:</strong> {evaluation.isCorrect ? checkpoint.explanation : checkpoint.wrongFeedback}
          </div>
          <button className="action-btn" onClick={handleNextAction}>
            {evaluation.nextAction === 'continue' ? 'Tiếp tục bài học' : 'Xem lại kiến thức'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckpointBox;
