const express = require('express');
const router = express.Router();
const answerService = require('../services/answer.service');
const jsonResponse = require('../utils/json-response');

// POST /api/answer/evaluate
router.post('/evaluate', async (req, res) => {
  const { lessonId, slideId, checkpointId, question, correctAnswer, classAnswer, knowledgePoint } = req.body;

  if (!classAnswer) {
    return jsonResponse.badRequest(res, 'Missing classAnswer');
  }

  const result = await answerService.evaluateAnswer({
    lessonId,
    slideId,
    checkpointId,
    question,
    correctAnswer,
    classAnswer,
    knowledgePoint
  });

  if (result.ok) {
    return jsonResponse.success(res, result);
  } else {
    return jsonResponse.error(res, result.error, result.details, 502);
  }
});

module.exports = router;
