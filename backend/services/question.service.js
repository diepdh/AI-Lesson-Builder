const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class QuestionService {
  async generateQuestion({ lessonId, slideId, questionType }) {
    // 1. Get lesson and slide context
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load lesson context' };
    }
    const lesson = lessonResult.lesson;
    const slide = lesson.slides.find(s => s.id === slideId);
    
    if (!slide) {
      return { ok: false, error: `Slide ${slideId} not found` };
    }

    // 2. Build prompt
    const systemPrompt = "Bạn là chuyên gia thiết kế câu hỏi học tập tương tác.";
    const userPrompt = promptBuilder.buildQuestionGenerationPrompt(lesson, slide, questionType);

    try {
      // 3. Call LLM
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.7
      });

      // 4. Extract and Validate checkpoint
      const checkpoint = aiResponse.checkpoint || aiResponse;
      
      const validation = this._validateCheckpointSchema(checkpoint, slideId);
      if (!validation.ok) {
        return { ok: false, error: 'AI generated an invalid checkpoint', details: validation.errors };
      }

      return {
        ok: true,
        checkpoint
      };

    } catch (error) {
      console.error('Question Generation Error:', error);
      return { ok: false, error: 'Failed to generate question', details: error.message };
    }
  }

  async regenerateQuestion({ lessonId, slideId, questionType }) {
    // 1. Get lesson and slide context
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load lesson context' };
    }
    const lesson = lessonResult.lesson;
    const slide = lesson.slides.find(s => s.id === slideId);
    
    if (!slide) {
      return { ok: false, error: `Slide ${slideId} not found` };
    }

    // 2. Build prompt with "regenerate" flavor
    const systemPrompt = "Bạn là chuyên gia thiết kế câu hỏi học tập tương tác.";
    const userPrompt = `Dựa trên slide sau, hãy tạo một câu hỏi checkpoint TƯƠNG TỰ nhưng diễn đạt KHÁC ĐI hoặc thay đổi nội dung hỏi một chút để học sinh không bị nhàm chán.\n\n` + 
                       promptBuilder.buildQuestionGenerationPrompt(lesson, slide, questionType);

    try {
      // 3. Call LLM with higher temperature for variety
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.8
      });

      const checkpoint = aiResponse.checkpoint || aiResponse;
      
      const validation = this._validateCheckpointSchema(checkpoint, slideId);
      if (!validation.ok) {
        return { ok: false, error: 'AI generated an invalid checkpoint during regeneration', details: validation.errors };
      }

      return {
        ok: true,
        checkpoint
      };

    } catch (error) {
      console.error('Question Regeneration Error:', error);
      return { ok: false, error: 'Failed to regenerate question', details: error.message };
    }
  }

  _validateCheckpointSchema(cp, slideId) {
    const errors = [];
    if (!cp.id) errors.push('Missing id');
    if (!cp.type) errors.push('Missing type');
    if (!cp.question) errors.push('Missing question');
    if (!cp.correctAnswer) errors.push('Missing correctAnswer');
    if (!cp.explanation) errors.push('Missing explanation');
    if (!cp.wrongFeedback) errors.push('Missing wrongFeedback');
    if (!cp.reviewSlideId) errors.push('Missing reviewSlideId');
    
    if (cp.type === 'multiple_choice' && (!Array.isArray(cp.options) || cp.options.length < 2)) {
      errors.push('multiple_choice question must have at least 2 options');
    }

    return {
      ok: errors.length === 0,
      errors
    };
  }
}

module.exports = new QuestionService();
