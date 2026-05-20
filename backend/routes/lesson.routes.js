const express = require('express');
const router = express.Router();
const lessonService = require('../services/lesson.service');

// GET /api/lesson
router.get('/', (req, res) => {
  const result = lessonService.getLesson();
  if (result.ok) {
    res.json(result);
  } else {
    res.status(404).json(result);
  }
});

// PUT /api/lesson
router.put('/', (req, res) => {
  const { lesson } = req.body;
  if (!lesson) {
    return res.status(400).json({ ok: false, error: 'Missing lesson data in body' });
  }

  const result = lessonService.updateLesson(lesson);
  if (result.ok) {
    res.json(result);
  } else {
    res.status(422).json(result);
  }
});

// GET /api/lesson/backups
router.get('/backups', (req, res) => {
  const result = lessonService.getBackups();
  if (result.ok) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// POST /api/lesson/restore-last
router.post('/restore-last', (req, res) => {
  const result = lessonService.restoreLastBackup();
  if (result.ok) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

module.exports = router;
