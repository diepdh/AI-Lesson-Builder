require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid JSON request body',
      details: err.message
    });
  }

  return next(err);
});

// Routes
const lessonRoutes = require('./routes/lesson.routes');
const authoringRoutes = require('./routes/authoring.routes');
const chatRoutes = require('./routes/chat.routes');
const voiceRoutes = require('./routes/voice.routes');
const answerRoutes = require('./routes/answer.routes');
const questionRoutes = require('./routes/question.routes');
const mediaRoutes = require('./routes/media.routes');

app.use('/api/lesson', lessonRoutes);
app.use('/api/ai/authoring', authoringRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice/chat', voiceRoutes);
app.use('/api/answer', answerRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/media', mediaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: "ai-lesson-builder-backend",
    llmConfigured: !!process.env.LLM_API_KEY
  });
});

const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(path.join(publicDir, 'index.html'))) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
