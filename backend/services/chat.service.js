const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class ChatService {
  async processClassroomChat({ lessonId, currentSlideId, message, chatHistory, mode }) {
    // 1. Get current lesson data
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load lesson context' };
    }
    const lesson = lessonResult.lesson;

    // 2. Find current slide context
    const currentSlide = lesson.slides.find(s => s.id === currentSlideId) || lesson.slides[0];

    // 3. Build prompts
    const systemPrompt = promptBuilder.buildChatSystemPrompt(lesson, currentSlide);
    // User prompt will include chat history for context
    const historyText = chatHistory && chatHistory.length > 0 
      ? `Lịch sử hội thoại gần đây:\n${chatHistory.map(m => `${m.role}: ${m.content}`).join('\n')}\n`
      : "";
    const userPrompt = `${historyText}Học sinh hỏi: "${message}"`;

    try {
      // 4. Call LLM
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.7
      });

      return {
        ok: true,
        reply: aiResponse.reply,
        scope: aiResponse.scope || 'in_lesson',
        speak: aiResponse.speak !== undefined ? aiResponse.speak : true
      };

    } catch (error) {
      console.error('Chat Service Error:', error);
      return { ok: false, error: 'AI Assistant is currently unavailable', details: error.message };
    }
  }
}

module.exports = new ChatService();
