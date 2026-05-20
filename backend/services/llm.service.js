const axios = require('axios');
const { safeJsonParse } = require('../utils/safe-json-parse');

class LLMConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LLMConfigError';
  }
}

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'mock';
    this.apiKey = process.env.LLM_API_KEY;
    this.model = process.env.LLM_MODEL;
    this.baseUrl = process.env.LLM_BASE_URL;
    this.timeout = parseInt(process.env.LLM_TIMEOUT || '30000');
  }

  async callLLM({ systemPrompt, userPrompt, temperature = 0.7, maxTokens = 1500 }) {
    this._validateConfig();

    if (this.provider === 'mock') {
      return this._mockResponse(userPrompt);
    }

    const providers = {
      openai: this._callOpenAI.bind(this),
      gemini: this._callGemini.bind(this),
      anthropic: this._callAnthropic.bind(this)
    };

    const fn = providers[this.provider];
    if (!fn) throw new LLMConfigError(`Unknown LLM provider: ${this.provider}`);

    return await fn({ systemPrompt, userPrompt, temperature, maxTokens });
  }

  async callLLMForJSON(params) {
    const response = await this.callLLM(params);
    const parsed = safeJsonParse(response);
    if (!parsed) {
      throw new Error('LLM returned invalid JSON format');
    }
    return parsed;
  }

  _validateConfig() {
    if (this.provider !== 'mock' && !this.apiKey) {
      throw new LLMConfigError('LLM_API_KEY is missing in environment configuration');
    }
  }

  // --- Adapters ---

  async _callOpenAI({ systemPrompt, userPrompt, temperature, maxTokens }) {
    const url = this.baseUrl || 'https://api.openai.com/v1/chat/completions';
    const response = await axios.post(url, {
      model: this.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      max_tokens: maxTokens
    }, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      timeout: this.timeout
    });

    return response.data.choices[0].message.content;
  }

  async _callGemini({ systemPrompt, userPrompt, temperature, maxTokens }) {
    const url = `${this.baseUrl || 'https://generativelanguage.googleapis.com/v1beta/models'}/${this.model || 'gemini-1.5-flash'}:generateContent?key=${this.apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    }, {
      timeout: this.timeout
    });

    return response.data.candidates[0].content.parts[0].text;
  }

  async _callAnthropic({ systemPrompt, userPrompt, temperature, maxTokens }) {
    const url = this.baseUrl || 'https://api.anthropic.com/v1/messages';
    const response = await axios.post(url, {
      model: this.model || 'claude-3-haiku-20240307',
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: maxTokens,
      temperature
    }, {
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      timeout: this.timeout
    });

    return response.data.content[0].text;
  }

  _mockResponse(userPrompt) {
    console.log('[LLM Mock] Received prompt:', userPrompt);
    
    // Simple routing for mock responses based on keywords
    if (userPrompt.toLowerCase().includes('authoring') || userPrompt.toLowerCase().includes('lesson')) {
      // Try to extract current lesson from prompt to simulate patching
      let updatedLesson = { 
        lessonId: "mock-lesson", 
        title: "Mock Lesson", 
        slides: [
          {
            id: "slide-01",
            order: 1,
            title: "Slide Mock",
            image: "/assets/slides/mock.jpg",
            script: "Đây là slide giả lập.",
            knowledgePoint: "Kiến thức giả lập"
          }
        ] 
      };

      try {
        // Find JSON block in prompt
        const jsonMatch = userPrompt.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const currentLesson = JSON.parse(jsonMatch[0]);
          updatedLesson = JSON.parse(JSON.stringify(currentLesson)); // deep copy
          
          // Simulate adding a checkpoint to slide-04 if requested
          if (userPrompt.toLowerCase().includes('checkpoint') && userPrompt.toLowerCase().includes('slide 4')) {
            const slide04 = updatedLesson.slides.find(s => s.id === 'slide-04');
            if (slide04) {
              slide04.checkpoint = {
                id: "cp-04-mock",
                type: "multiple_choice",
                question: "Mock: Đây có phải AI không?",
                options: ["Có", "Không"],
                correctAnswer: "Có",
                explanation: "Đúng!",
                wrongFeedback: "Sai rồi!",
                reviewSlideId: "slide-03"
              };
            }
          }
        }
      } catch (e) {
        console.warn('[LLM Mock] Could not parse lesson from prompt, using default mock.');
      }

      return JSON.stringify({
        assistantMessage: "Tôi đã hiểu yêu cầu và cập nhật bài học cho bạn.",
        changeSummary: "Mock: Đã cập nhật slide.",
        patch: [],
        updatedLesson: updatedLesson
      });
    }

    if (userPrompt.toLowerCase().includes('đánh giá câu trả lời') || userPrompt.toLowerCase().includes('câu trả lời của lớp')) {
      // Robust extraction: get everything after the label until the end of the line
      const classAnswerPart = userPrompt.split(/Câu trả lời của lớp:\s*/i)[1] || "";
      const classAnswer = classAnswerPart.split(/\r?\n/)[0].trim().toLowerCase();
      
      console.log(`[LLM Mock] Extracted classAnswer: "${classAnswer}"`);

      // Enhanced detection for negative/wrong answers to handle mojibake and encoding issues
      // Using regex to catch variants of "không", "không đúng", "sai", etc.
      // '.' in regex matches any character, which is robust against mojibake placeholders
      const isWrong = /kh.ng/.test(classAnswer) || 
                      /khong/.test(classAnswer) || 
                      /ko/.test(classAnswer) || 
                      /sai/.test(classAnswer) || 
                      /no/.test(classAnswer) || 
                      /ch.a/.test(classAnswer) || 
                      /chua/.test(classAnswer) ||
                      (classAnswer.includes('kh') && classAnswer.includes('ng')) || // Catch kh?ng/khong variants
                      (/..ng/.test(classAnswer) && (classAnswer.includes('kh') || classAnswer.includes('sai'))); // Catch "không đúng" mojibake

      // Determine appropriate reviewSlideId based on the question context in the prompt
      let reviewSlideId = "slide-03"; // Default for cp-04
      if (userPrompt.includes('tạo ra') || userPrompt.includes('con người')) {
        reviewSlideId = "slide-07"; // For cp-08
      }
      
      return JSON.stringify({
        isCorrect: !isWrong,
        feedback: !isWrong ? "Giỏi lắm! Bạn đã trả lời đúng rồi." : "Chưa chính xác rồi. Chúng mình cùng xem lại kiến thức nhé!",
        shouldReview: isWrong,
        reviewSlideId: isWrong ? reviewSlideId : null,
        nextAction: isWrong ? "review" : "continue"
      });
    }

    if (userPrompt.toLowerCase().includes('tạo một câu hỏi') || userPrompt.toLowerCase().includes('checkpoint')) {
      const isRegen = userPrompt.toLowerCase().includes('tương tự') || userPrompt.toLowerCase().includes('diễn đạt khác');
      const typeMatch = userPrompt.match(/Loại câu hỏi: (.*)/i);
      const type = typeMatch ? typeMatch[1].trim() : "multiple_choice";

      return JSON.stringify({
        checkpoint: {
          id: `cp-mock-${isRegen ? 'regen' : 'gen'}-${Date.now()}`,
          type: type,
          question: isRegen ? "Câu hỏi này đã được diễn đạt khác đi: AI có thông minh không?" : "Câu hỏi mới: AI là do ai tạo ra?",
          options: type === 'multiple_choice' ? ["Con người", "Tự nhiên"] : null,
          correctAnswer: "Con người",
          explanation: "Đúng, con người tạo ra AI.",
          wrongFeedback: "Không đúng, AI không tự nhiên sinh ra.",
          reviewSlideId: "slide-02"
        }
      });
    }
  }
}

module.exports = new LLMService();
