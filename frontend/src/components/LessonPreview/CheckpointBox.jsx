import React, { useEffect, useState } from 'react';
import { answerApi } from '../../api/answer.api';
import VoiceButton from './VoiceButton';
import './CheckpointBox.css';

const CheckpointBox = ({ checkpoint, lessonId, slideId, knowledgePoint, answerMode, onCorrect, onReview, autoContinue = false }) => {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [orderedItems, setOrderedItems] = useState([]);

  useEffect(() => {
    if (!checkpoint) return;
    setOrderedItems(checkpoint.type === 'image_ordering' ? [...(checkpoint.items || [])].reverse() : []);
    setEvaluation(null);
    setAnswer('');
    setValidationError('');
  }, [checkpoint?.id, checkpoint?.type]);

  if (!checkpoint) return null;

  const setLocalEvaluation = (isCorrect) => {
    setEvaluation({
      ok: true,
      isCorrect,
      feedback: isCorrect
        ? 'Đúng rồi, cả lớp đã trả lời chính xác.'
        : 'Chưa chính xác, cả lớp hãy xem lại nội dung slide.',
      shouldReview: !isCorrect,
      reviewSlideId: isCorrect ? null : checkpoint.reviewSlideId,
      nextAction: isCorrect ? 'continue' : 'review'
    });
  };

  const handleImageChoice = (optionId) => {
    if (isSubmitting) return;
    setValidationError('');
    setLocalEvaluation(optionId === checkpoint.correctAnswer);
  };

  const moveOrderedItem = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedItems.length) return;
    const nextItems = [...orderedItems];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setOrderedItems(nextItems);
  };

  const handleSubmitOrdering = () => {
    const currentOrder = orderedItems.map((item) => item.id);
    const correctOrder = checkpoint.correctOrder || [];
    const isCorrect = currentOrder.length === correctOrder.length
      && currentOrder.every((id, index) => id === correctOrder[index]);
    setLocalEvaluation(isCorrect);
  };

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

  React.useEffect(() => {
    if (!evaluation || !autoContinue) return;
    if (evaluation.nextAction !== 'continue') return;
    const timer = setTimeout(() => {
      handleNextAction();
    }, 700);
    return () => clearTimeout(timer);
  }, [evaluation, autoContinue]);

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

          {checkpoint.type === 'image_choice' && (
            <div className="image-options-grid">
              {(checkpoint.options || []).map((opt) => (
                <button
                  key={opt.id}
                  className="image-option-btn"
                  onClick={() => handleImageChoice(opt.id)}
                  disabled={isSubmitting}
                >
                  <img src={opt.image} alt={opt.label || ''} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {checkpoint.type === 'image_ordering' && (
            <div className="ordering-area">
              {orderedItems.map((item, index) => (
                <div key={item.id} className="ordering-item">
                  <img src={item.image} alt={item.label || ''} />
                  <span className="ordering-label">{item.label}</span>
                  <div className="ordering-controls">
                    <button type="button" onClick={() => moveOrderedItem(index, -1)} disabled={index === 0}>
                      Lên
                    </button>
                    <button type="button" onClick={() => moveOrderedItem(index, 1)} disabled={index === orderedItems.length - 1}>
                      Xuống
                    </button>
                  </div>
                </div>
              ))}
              <button className="submit-btn ordering-submit" onClick={handleSubmitOrdering}>
                Kiểm tra thứ tự
              </button>
            </div>
          )}

          {checkpoint.type !== 'image_choice' && checkpoint.type !== 'image_ordering' && (
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
          )}

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
          {evaluation.nextAction === 'review' ? (
            <button className="action-btn" onClick={handleNextAction}>
              Xem lại kiến thức
            </button>
          ) : (
            <div className="auto-next-text">Đã đúng, đang tự chuyển sang slide tiếp theo...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckpointBox;
