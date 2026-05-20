const express = require('express');
const router = express.Router();
const chatService = require('../services/chat.service');
const jsonResponse = require('../utils/json-response');

// POST /api/chat
router.post('/', async (req, res) => {
  const { lessonId, currentSlideId, message, chatHistory, mode } = req.body;

  if (!message) {
    return jsonResponse.badRequest(res, 'Missing message');
  }

  const result = await chatService.processClassroomChat({
    lessonId,
    currentSlideId,
    message,
    chatHistory,
    mode
  });

  if (result.ok) {
    return jsonResponse.success(res, result);
  } else {
    return jsonResponse.error(res, result.error, result.details, 502);
  }
});

module.exports = router;
