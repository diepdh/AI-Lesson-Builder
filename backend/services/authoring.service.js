const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class AuthoringService {
  async processAuthoringChat(message, currentSlideId, chatHistory = []) {
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load current lesson for authoring', details: lessonResult.error };
    }

    const currentLesson = lessonResult.lesson;

    if (!this._shouldApplyEdit(message)) {
      return await this._handleConversation(message, currentLesson, currentSlideId, chatHistory);
    }

    if (this._isCheckpointRequest(message)) {
      return await this._addCheckpoint(message, currentLesson, currentSlideId);
    }

    const systemPrompt = promptBuilder.buildAuthoringSystemPrompt();
    const userPrompt = promptBuilder.buildAuthoringUserPrompt(message, currentLesson, currentSlideId);

    try {
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2
      });

      if (!aiResponse.updatedLesson) {
        return { ok: false, error: 'LLM did not return updatedLesson field' };
      }

      const updateResult = lessonService.updateLesson(aiResponse.updatedLesson);
      if (!updateResult.ok) {
        return {
          ok: false,
          error: 'LLM returned an invalid lesson update',
          details: updateResult.details,
          assistantMessage: aiResponse.assistantMessage || 'Rất tiếc, bản cập nhật AI tạo ra không hợp lệ. Vui lòng thử lại.'
        };
      }

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

  _normalizeText(message) {
    return (message || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  _shouldApplyEdit(message) {
    const text = this._normalizeText(message);
    const applyWords = [
      'hay', 'lam luon', 'thuc hien', 'ap dung', 'chot', 'ok lam',
      'sua luon', 'them luon', 'tao luon', 'cap nhat luon', 'apply'
    ];
    const editWords = [
      'them', 'tao', 'sua', 'xoa', 'doi', 'cap nhat', 'chinh', 'viet lai',
      'bo sung', 'cai thien', 'rut gon', 'mo rong', 'thay', 'add', 'update',
      'edit', 'delete', 'rewrite', 'improve'
    ];
    const lessonWords = [
      'checkpoint', 'trac nghiem', 'cau hoi', 'slide', 'trang', 'noi dung',
      'loi thoai', 'kich ban', 'bai giang', 'audio', 'anh', 'hinh', 'video'
    ];

    const hasEditTopic = editWords.some(word => text.includes(word)) && lessonWords.some(word => text.includes(word));
    const hasApplyIntent = applyWords.some(word => text.includes(word));
    const startsWithEditCommand = editWords.some(word => text.startsWith(`${word} `));

    return hasEditTopic && (hasApplyIntent || startsWithEditCommand);
  }

  async _handleConversation(message, lesson, currentSlideId, chatHistory = []) {
    const currentSlide = lesson.slides.find(s => s.id === currentSlideId) || lesson.slides[0];
    const systemPrompt = [
      'Bạn là trợ lý AI biên soạn bài giảng cho giáo viên.',
      'Hãy trò chuyện tự nhiên như một chatbot thông thường: giải thích, gợi ý, brainstorm, hỏi lại khi yêu cầu chưa rõ.',
      'Không sửa lesson JSON và không nói đã cập nhật bài giảng trong nhánh hội thoại này.',
      'Khi giáo viên muốn chốt sửa bài, hãy gợi ý họ nói rõ bằng các câu như: "chốt phương án này", "hãy thêm checkpoint này", "áp dụng vào slide hiện tại".',
      'Trả lời bằng tiếng Việt, ngắn gọn, đúng trọng tâm.'
    ].join('\n');

    const historyText = Array.isArray(chatHistory) && chatHistory.length > 0
      ? chatHistory.slice(-8).map(item => `${item.role === 'user' ? 'Giáo viên' : 'AI'}: ${item.content || ''}`).join('\n')
      : '';

    const userPrompt = [
      `Bài học: ${lesson.title}`,
      `Số slide: ${lesson.slides.length}`,
      currentSlide ? `Slide hiện tại: ${currentSlide.title}\nLời thoại: ${currentSlide.script}\nKiến thức chính: ${currentSlide.knowledgePoint}` : '',
      historyText ? `Lịch sử gần đây:\n${historyText}` : '',
      `Tin nhắn mới của giáo viên: ${message}`
    ].filter(Boolean).join('\n\n');

    try {
      const assistantMessage = await llmService.callLLM({
        systemPrompt,
        userPrompt,
        temperature: 0.7,
        maxTokens: 700
      });

      return {
        ok: true,
        assistantMessage,
        changeSummary: null,
        patch: []
      };
    } catch (error) {
      console.error('Authoring Conversation Error:', error);
      return {
        ok: false,
        error: 'AI conversation failed',
        details: error.message
      };
    }
  }

  _isCheckpointRequest(message) {
    const text = this._normalizeText(message);
    return (text.includes('checkpoint') || text.includes('trac nghiem') || text.includes('cau hoi'))
      && (text.includes('them') || text.includes('tao') || text.includes('add'));
  }

  async _addCheckpoint(message, lesson, currentSlideId) {
    const slide = lesson.slides.find(s => s.id === currentSlideId) || lesson.slides[0];
    if (!slide) {
      return { ok: false, error: 'No slide available for checkpoint generation' };
    }

    const systemPrompt = 'Return only valid JSON. No markdown. Create content for Vietnamese elementary students.';
    const userPrompt = [
      'Create one multiple-choice checkpoint JSON for this slide.',
      'Required fields: id, type, question, options, correctAnswer, explanation, wrongFeedback, reviewSlideId.',
      'type must be multiple_choice.',
      `reviewSlideId must be "${slide.id}".`,
      `Slide title: ${slide.title}`,
      `Slide script: ${slide.script}`,
      `Knowledge point: ${slide.knowledgePoint}`,
      `Teacher request: ${message}`
    ].join('\n');

    try {
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
        maxTokens: 700
      });

      const checkpoint = this._normalizeCheckpoint(aiResponse, slide.id);
      if (!checkpoint) {
        return { ok: false, error: 'LLM did not return a valid checkpoint' };
      }

      const updatedLesson = JSON.parse(JSON.stringify(lesson));
      const targetSlide = updatedLesson.slides.find(s => s.id === slide.id);
      targetSlide.checkpoint = checkpoint;

      const updateResult = lessonService.updateLesson(updatedLesson);
      if (!updateResult.ok) {
        return {
          ok: false,
          error: 'Generated checkpoint made lesson invalid',
          details: updateResult.details
        };
      }

      return {
        ok: true,
        assistantMessage: 'Đã thêm checkpoint cho slide hiện tại.',
        changeSummary: `Đã thêm câu hỏi kiểm tra cho ${slide.title}.`,
        patch: [{ op: 'set', path: `/slides/${slide.id}/checkpoint` }],
        updatedLesson: updateResult.lesson,
        backupPath: updateResult.backupPath
      };
    } catch (error) {
      console.error('Checkpoint Authoring Error:', error);
      return {
        ok: false,
        error: 'AI checkpoint generation failed',
        details: error.message
      };
    }
  }

  _normalizeCheckpoint(aiResponse, slideId) {
    const cp = aiResponse.checkpoint && typeof aiResponse.checkpoint === 'object'
      ? aiResponse.checkpoint
      : aiResponse;

    if (!cp || typeof cp !== 'object') return null;

    const options = Array.isArray(cp.options) && cp.options.length >= 2
      ? cp.options
      : [String(cp.correctAnswer || 'Đúng'), 'Chưa đúng'];

    return {
      id: cp.id || `cp-${slideId}-${Date.now()}`,
      type: cp.type || 'multiple_choice',
      question: cp.question,
      options,
      correctAnswer: cp.correctAnswer || options[0],
      explanation: cp.explanation || 'Câu trả lời đúng.',
      wrongFeedback: cp.wrongFeedback || 'Chưa chính xác, hãy xem lại nội dung slide.',
      reviewSlideId: cp.reviewSlideId || slideId
    };
  }
}

module.exports = new AuthoringService();
