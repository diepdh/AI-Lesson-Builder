import React, { useState } from 'react';
import { answerApi } from '../../api/answer.api';
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
      setValidationError('Vui lòng nhập câu trả lời của em nhé!');
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
        knowledgePoint: knowledgePoint,
        answerMode: answerMode
      });

      if (result.ok) {
        setEvaluation(result);
      } else {
        setValidationError('Lỗi khi chấm điểm: ' + result.error);
      }
    } catch (error) {
      console.error('Submit answer failed:', error);
      setValidationError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextAction = () => {
    if (evaluation.nextAction === 'continue') {
      onCorrect(checkpoint.id);
    } else if (evaluation.nextAction === 'review') {
      onReview(evaluation.reviewSlideId, checkpoint.id);
    }
    // Reset state
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
          {checkpoint.type === 'multiple_choice' ? (
            <div className="options-grid">
              {checkpoint.options.map((opt, idx) => (
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
          ) : (
            <div className="short-text-area">
              <input 
                type="text" 
                placeholder="Nhập câu trả lời của lớp..." 
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang kiểm tra...' : 'Gửi câu trả lời'}
              </button>
            </div>
          )}
          {validationError && <div className="validation-error">{validationError}</div>}
        </div>
      ) : (
        <div className={`evaluation-result ${evaluation.isCorrect ? 'correct' : 'wrong'}`}>
          <div className="result-header">
            <span className="result-icon">{evaluation.isCorrect ? '✅' : '❌'}</span>
            <span className="result-title">{evaluation.isCorrect ? 'Tuyệt vời!' : 'Chưa đúng rồi...'}</span>
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
