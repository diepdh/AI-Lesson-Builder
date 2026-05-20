const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class AuthoringService {
  async processAuthoringChat(message, currentSlideId) {
    // 1. Get current lesson
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load current lesson for authoring', details: lessonResult.error };
    }
    const currentLesson = lessonResult.lesson;

    // 2. Build prompts
    const systemPrompt = promptBuilder.buildAuthoringSystemPrompt();
    const userPrompt = promptBuilder.buildAuthoringUserPrompt(message, currentLesson, currentSlideId);

    try {
      // 3. Call LLM for JSON response
      // Structure expected: { assistantMessage, changeSummary, patch, updatedLesson }
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2 // Lower temperature for more stable JSON/Logic
      });

      if (!aiResponse.updatedLesson) {
        return { ok: false, error: 'LLM did not return updatedLesson field' };
      }

      // 4. Update lesson (this includes validate and backup)
      const updateResult = lessonService.updateLesson(aiResponse.updatedLesson);
      
      if (!updateResult.ok) {
        return { 
          ok: false, 
          error: 'LLM returned an invalid lesson update', 
          details: updateResult.details,
          assistantMessage: aiResponse.assistantMessage || "Rất tiếc, tôi đã tạo ra một bản cập nhật không hợp lệ. Vui lòng thử lại."
        };
      }

      // 5. Return success with metadata
      return {
        ok: true,
        assistantMessage: aiResponse.assistantMessage,
        changeSummary: aiResponse.changeSummary,
        patch: aiResponse.patch,
        updatedLesson: updateResult.lesson,
        backupPath: updateResult.backupPath
      };

    } catch (error) {
      console.error('Authoring Service Error:', error);
      return { 
        ok: false, 
        error: 'AI Authoring failed', 
        details: error.message 
      };
    }
  }
}

module.exports = new AuthoringService();
