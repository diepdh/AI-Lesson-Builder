const express = require('express');
const router = express.Router();
const voiceService = require('../services/voice.service');
const jsonResponse = require('../utils/json-response');

// POST /api/voice/chat
router.post('/', async (req, res) => {
  const { lessonId, currentSlideId, transcript, mode } = req.body;

  if (!transcript) {
    return jsonResponse.badRequest(res, 'Missing transcript');
  }

  const result = await voiceService.processVoiceChat({
    lessonId,
    currentSlideId,
    transcript,
    mode
  });

  if (result.ok) {
    return jsonResponse.success(res, result);
  } else {
    return jsonResponse.error(res, result.error, result.details, 502);
  }
});

module.exports = router;
