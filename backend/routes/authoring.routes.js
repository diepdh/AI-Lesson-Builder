const express = require('express');
const router = express.Router();
const authoringService = require('../services/authoring.service');
const jsonResponse = require('../utils/json-response');

// POST /api/ai/authoring
router.post('/', async (req, res) => {
  const { message, currentSlideId } = req.body;

  if (!message) {
    return jsonResponse.badRequest(res, 'Missing message in request body');
  }

  const result = await authoringService.processAuthoringChat(message, currentSlideId);

  if (result.ok) {
    return jsonResponse.success(res, result, 'Authoring successful');
  } else {
    // Determine status code based on error type
    const status = result.error.includes('invalid') ? 422 : 502;
    return jsonResponse.error(res, result.error, result.details || result.assistantMessage, status);
  }
});

module.exports = router;
