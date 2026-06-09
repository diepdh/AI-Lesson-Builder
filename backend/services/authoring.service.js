const llmService = require('./llm.service');
const lessonService = require('./lesson.service');
const promptBuilder = require('../utils/prompt-builder');

class AuthoringService {
  async processAuthoringChat(message, currentSlideId, chatHistory = [], intent = null) {
    const lessonResult = lessonService.getLesson();
    if (!lessonResult.ok) {
      return { ok: false, error: 'Could not load current lesson for authoring', details: lessonResult.error };
    }

    const currentLesson = lessonResult.lesson;

    if (!this._shouldApplyEdit(message, intent)) {
      return await this._handleConversation(message, currentLesson, currentSlideId, chatHistory);
    }

    if (this._isCheckpointRequest(message, intent)) {
      return await this._addCheckpoint(message, currentLesson, currentSlideId, intent);
    }

    const systemPrompt = promptBuilder.buildAuthoringSystemPrompt();
    const userPrompt = promptBuilder.buildAuthoringUserPrompt(message, currentLesson, currentSlideId, intent);

    try {
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2
      });

      if (!aiResponse.updatedLesson) {
        return { ok: false, error: 'LLM did not return updatedLesson field' };
      }

      const normalizedLesson = this._mergeLessonPreserveMedia(currentLesson, aiResponse.updatedLesson);
      if (!normalizedLesson.ok) {
        return {
          ok: false,
          error: 'LLM returned an invalid lesson update',
          details: normalizedLesson.error
        };
      }

      const updateResult = lessonService.updateLesson(normalizedLesson.lesson);
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

  _shouldApplyEdit(message, intent) {
    if (intent && intent !== 'general_conversation') return true;
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

  _isCheckpointRequest(message, intent) {
    if ([
      'add_checkpoint_current_slide',
      'add_image_choice_checkpoint_current_slide',
      'add_image_ordering_checkpoint_current_slide'
    ].includes(intent)) return true;
    const text = this._normalizeText(message);
    return (text.includes('checkpoint') || text.includes('trac nghiem') || text.includes('cau hoi'))
      && (text.includes('them') || text.includes('tao') || text.includes('add'));
  }

  _checkpointTypeFromIntent(intent, message) {
    if (intent === 'add_image_choice_checkpoint_current_slide') return 'image_choice';
    if (intent === 'add_image_ordering_checkpoint_current_slide') return 'image_ordering';
    const text = this._normalizeText(message);
    if (text.includes('sap xep hinh') || text.includes('image_ordering')) return 'image_ordering';
    if (text.includes('chon hinh') || text.includes('image_choice')) return 'image_choice';
    return 'multiple_choice';
  }

  async _addCheckpoint(message, lesson, currentSlideId, intent = null) {
    const slide = lesson.slides.find(s => s.id === currentSlideId) || lesson.slides[0];
    if (!slide) {
      return { ok: false, error: 'No slide available for checkpoint generation' };
    }
    const checkpointType = this._checkpointTypeFromIntent(intent, message);
    const availableImages = this._getAvailableImagesForCheckpoint(lesson, slide.id);

    const systemPrompt = 'Return only valid JSON. No markdown. Create content for Vietnamese elementary students.';
    const userPrompt = this._buildCheckpointPrompt({
      message,
      lesson,
      slide,
      checkpointType,
      availableImages
    });

    try {
      const aiResponse = await llmService.callLLMForJSON({
        systemPrompt,
        userPrompt,
        temperature: 0.2,
        maxTokens: 700
      });

      const checkpoint = this._normalizeCheckpoint(aiResponse, slide.id, checkpointType, availableImages);
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

  _getAvailableImagesForCheckpoint(lesson, currentSlideId) {
    const slides = Array.isArray(lesson?.slides) ? lesson.slides : [];
    const currentIndex = slides.findIndex((slide) => slide.id === currentSlideId);
    const orderedSlides = [
      slides[currentIndex],
      slides[currentIndex - 1],
      slides[currentIndex + 1],
      ...slides
    ].filter(Boolean);

    const seen = new Set();
    return orderedSlides
      .filter((slide) => slide.image && !seen.has(slide.id) && seen.add(slide.id))
      .slice(0, 4)
      .map((slide) => ({
        id: slide.id,
        label: slide.title || slide.id,
        image: slide.image
      }));
  }

  _buildCheckpointPrompt({ message, lesson, slide, checkpointType, availableImages }) {
    const common = [
      `Create one checkpoint JSON for this slide.`,
      `Required type: ${checkpointType}.`,
      `reviewSlideId must be "${slide.id}".`,
      `Slide title: ${slide.title}`,
      `Slide script: ${slide.script}`,
      `Knowledge point: ${slide.knowledgePoint}`,
      `Target learner: ${lesson.targetLearner || 'Hoc sinh'}`,
      `Teacher request: ${message}`,
      `Available images: ${JSON.stringify(availableImages)}`
    ];

    if (checkpointType === 'image_choice') {
      return [
        ...common,
        'Return JSON shape:',
        '{"checkpoint":{"id":"cp-slide-id","type":"image_choice","question":"string","options":[{"id":"opt-1","label":"string","image":"image-url"}],"correctAnswer":"opt-1","explanation":"string","wrongFeedback":"string","reviewSlideId":"slide-id"}}',
        'Use 2-4 options. Use only image URLs from Available images. correctAnswer must be one option id.'
      ].join('\n');
    }

    if (checkpointType === 'image_ordering') {
      return [
        ...common,
        'Return JSON shape:',
        '{"checkpoint":{"id":"cp-slide-id","type":"image_ordering","question":"string","items":[{"id":"step-1","label":"string","image":"image-url"}],"correctOrder":["step-1","step-2"],"correctAnswer":"step-1,step-2","explanation":"string","wrongFeedback":"string","reviewSlideId":"slide-id"}}',
        'Use 2-4 items. Use only image URLs from Available images. correctOrder must list item ids in the correct order.'
      ].join('\n');
    }

    return [
      ...common,
      'Return JSON shape:',
      '{"checkpoint":{"id":"cp-slide-id","type":"multiple_choice","question":"string","options":["A","B","C"],"correctAnswer":"A","explanation":"string","wrongFeedback":"string","reviewSlideId":"slide-id"}}',
      'Use at least 3 answer options. correctAnswer must exactly match one option.'
    ].join('\n');
  }

  _normalizeCheckpoint(aiResponse, slideId, requestedType = 'multiple_choice', availableImages = []) {
    const cp = aiResponse.checkpoint && typeof aiResponse.checkpoint === 'object'
      ? aiResponse.checkpoint
      : aiResponse;

    if (!cp || typeof cp !== 'object') return null;

    const type = ['multiple_choice', 'image_choice', 'image_ordering'].includes(cp.type)
      ? cp.type
      : requestedType;
    const fallbackImages = availableImages.length > 0
      ? availableImages
      : [{ id: slideId, label: 'Slide hien tai', image: '' }];

    if (type === 'image_choice') {
      const rawOptions = Array.isArray(cp.options) ? cp.options : [];
      const options = rawOptions
        .map((option, index) => {
          const fallback = fallbackImages[index % fallbackImages.length] || fallbackImages[0];
          if (typeof option === 'string') {
            return { id: `opt-${index + 1}`, label: option, image: fallback.image };
          }
          return {
            id: option.id || `opt-${index + 1}`,
            label: option.label || option.text || fallback.label || `Lua chon ${index + 1}`,
            image: option.image || fallback.image
          };
        })
        .filter((option) => option.label && option.image);

      while (options.length < Math.min(2, fallbackImages.length)) {
        const fallback = fallbackImages[options.length];
        options.push({
          id: `opt-${options.length + 1}`,
          label: fallback.label || `Lua chon ${options.length + 1}`,
          image: fallback.image
        });
      }

      if (!cp.question || options.length < 2) return null;
      const optionIds = options.map((option) => option.id);
      const correctAnswer = optionIds.includes(cp.correctAnswer) ? cp.correctAnswer : optionIds[0];

      return {
        id: cp.id || `cp-${slideId}-${Date.now()}`,
        type: 'image_choice',
        question: cp.question,
        options,
        correctAnswer,
        explanation: cp.explanation || 'Cau tra loi dung theo noi dung bai hoc.',
        wrongFeedback: cp.wrongFeedback || 'Chua chinh xac, hay xem lai noi dung slide.',
        reviewSlideId: cp.reviewSlideId || slideId
      };
    }

    if (type === 'image_ordering') {
      const rawItems = Array.isArray(cp.items) ? cp.items : (Array.isArray(cp.options) ? cp.options : []);
      const items = rawItems
        .map((item, index) => {
          const fallback = fallbackImages[index % fallbackImages.length] || fallbackImages[0];
          if (typeof item === 'string') {
            return { id: `step-${index + 1}`, label: item, image: fallback.image };
          }
          return {
            id: item.id || `step-${index + 1}`,
            label: item.label || item.text || fallback.label || `Buoc ${index + 1}`,
            image: item.image || fallback.image
          };
        })
        .filter((item) => item.label && item.image);

      while (items.length < Math.min(2, fallbackImages.length)) {
        const fallback = fallbackImages[items.length];
        items.push({
          id: `step-${items.length + 1}`,
          label: fallback.label || `Buoc ${items.length + 1}`,
          image: fallback.image
        });
      }

      if (!cp.question || items.length < 2) return null;
      const itemIds = items.map((item) => item.id);
      const correctOrder = Array.isArray(cp.correctOrder)
        ? cp.correctOrder.filter((id) => itemIds.includes(id))
        : itemIds;
      const normalizedOrder = correctOrder.length === itemIds.length ? correctOrder : itemIds;

      return {
        id: cp.id || `cp-${slideId}-${Date.now()}`,
        type: 'image_ordering',
        question: cp.question,
        items,
        correctOrder: normalizedOrder,
        correctAnswer: normalizedOrder.join(','),
        explanation: cp.explanation || 'Thu tu dung theo noi dung bai hoc.',
        wrongFeedback: cp.wrongFeedback || 'Chua chinh xac, hay sap xep lai theo noi dung slide.',
        reviewSlideId: cp.reviewSlideId || slideId
      };
    }

    const options = Array.isArray(cp.options) && cp.options.length >= 2
      ? cp.options
      : [String(cp.correctAnswer || 'Đúng'), 'Chưa đúng'];

    return {
      id: cp.id || `cp-${slideId}-${Date.now()}`,
      type: 'multiple_choice',
      question: cp.question,
      options,
      correctAnswer: cp.correctAnswer || options[0],
      explanation: cp.explanation || 'Câu trả lời đúng.',
      wrongFeedback: cp.wrongFeedback || 'Chưa chính xác, hãy xem lại nội dung slide.',
      reviewSlideId: cp.reviewSlideId || slideId
    };
  }

  _mergeLessonPreserveMedia(currentLesson, incomingLesson) {
    if (!incomingLesson || !Array.isArray(incomingLesson.slides)) {
      return { ok: false, error: 'updatedLesson.slides must be a non-empty array' };
    }

    let nextSlides;
    try {
      const currentSlideById = new Map((currentLesson.slides || []).map((slide) => [slide.id, slide]));
      const seen = new Set();
      nextSlides = incomingLesson.slides.map((slide, index) => {
        if (!slide || typeof slide !== 'object' || !slide.id) {
          throw new Error(`slides[${index}] is missing id`);
        }
        if (seen.has(slide.id)) {
          throw new Error(`Duplicate slide id in updatedLesson: ${slide.id}`);
        }
        seen.add(slide.id);

        const currentSlide = currentSlideById.get(slide.id);
        if (!currentSlide) {
          return slide;
        }

        const scriptChanged = typeof slide.script === 'string'
          && typeof currentSlide.script === 'string'
          && slide.script.trim() !== currentSlide.script.trim();

        return {
          ...slide,
          image: currentSlide.image,
          audio: currentSlide.audio,
          video: currentSlide.video,
          audioNeedsUpdate: Boolean(currentSlide.audio) && scriptChanged
        };
      });
    } catch (error) {
      return { ok: false, error: error.message };
    }

    return {
      ok: true,
      lesson: {
        ...incomingLesson,
        slides: nextSlides
      }
    };
  }
}

module.exports = new AuthoringService();
