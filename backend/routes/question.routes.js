const express = require('express');
const router = express.Router();
const questionService = require('../services/question.service');
const jsonResponse = require('../utils/json-response');

// POST /api/question/generate
router.post('/generate', async (req, res) => {
  const { lessonId, slideId, questionType } = req.body;

  if (!slideId) {
    return jsonResponse.badRequest(res, 'Missing slideId');
  }

  const result = await questionService.generateQuestion({ lessonId, slideId, questionType });

  if (result.ok) {
    return jsonResponse.success(res, result);
  } else {
    return jsonResponse.error(res, result.error, result.details, 502);
  }
});

// POST /api/question/regenerate
router.post('/regenerate', async (req, res) => {
  const { lessonId, slideId, questionType } = req.body;

  if (!slideId) {
    return jsonResponse.badRequest(res, 'Missing slideId');
  }

  const result = await questionService.regenerateQuestion({ lessonId, slideId, questionType });

  if (result.ok) {
    return jsonResponse.success(res, result);
  } else {
    return jsonResponse.error(res, result.error, result.details, 502);
  }
});

module.exports = router;
