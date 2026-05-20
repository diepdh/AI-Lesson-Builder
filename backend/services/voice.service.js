const chatService = require('./chat.service');

class VoiceService {
  async processVoiceChat({ lessonId, currentSlideId, transcript, mode }) {
    // In MVP, voice chat is essentially processing a transcript
    // We reuse the chat service logic for consistency
    return await chatService.processClassroomChat({
      lessonId,
      currentSlideId,
      message: transcript,
      chatHistory: [], // Usually voice interactions are single-turn or handled by frontend state
      mode
    });
  }
}

module.exports = new VoiceService();
