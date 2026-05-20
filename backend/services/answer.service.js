const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class AnswerService {
  async evaluateAnswer({ lessonId, slideId, checkpointId, question, correctAnswer, classAnswer, knowledgePoint }) {
    // 1. Get current lesson to verify reviewSlideId if needed later
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load lesson context for evaluation' };
    }
    const lesson = lessonResult.lesson;

    // 2. Build evaluation prompt
    const systemPrompt = "Bạn là trợ lý AI đánh giá câu trả lời e-learning.";
    const userPrompt = promptBuilder.buildEvaluationPrompt(question, correctAnswer, classAnswer, knowledgePoint);

    try {
      // 3. Call LLM
      const evaluation = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.1 // High precision for evaluation
      });

      // 4. Validate reviewSlideId if present
      if (evaluation.reviewSlideId) {
        const slideExists = lesson.slides.some(s => s.id === evaluation.reviewSlideId);
        if (!slideExists) {
          console.warn(`[Evaluation] AI suggested non-existent reviewSlideId: ${evaluation.reviewSlideId}. Falling back to null.`);
          evaluation.reviewSlideId = null;
        }
      }

      return {
        ok: true,
        ...evaluation
      };

    } catch (error) {
      console.error('Answer Evaluation Error:', error);
      return { ok: false, error: 'Evaluation failed', details: error.message };
    }
  }
}

module.exports = new AnswerService();
