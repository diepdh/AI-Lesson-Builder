const fs = require('fs');
const path = require('path');
const { validateLesson } = require('../utils/validate-lesson');
const { backupLesson } = require('../utils/backup-lesson');
const llmService = require('./llm.service');

const LESSON_PATH = path.join(__dirname, '../data/lesson.json');
const BACKUP_DIR = path.join(__dirname, '../data/backups');

class LessonService {
  getLesson() {
    try {
      if (!fs.existsSync(LESSON_PATH)) {
        return { ok: false, error: 'Lesson file not found' };
      }
      const data = fs.readFileSync(LESSON_PATH, 'utf-8');
      return { ok: true, lesson: JSON.parse(data) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  initializeFromLocalFolders({ slideFolder, audioFolder, videoFolder }) {
    try {
      const getFiles = (dir, extensions) => {
        if (!dir || !fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
          .filter(file => extensions.includes(path.extname(file).toLowerCase()))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
          .map(file => path.join(dir, file));
      };

      const readTextFile = (filePath) => {
        if (!filePath || !fs.existsSync(filePath)) return null;
        const content = fs.readFileSync(filePath, 'utf-8').trim();
        return content || null;
      };

      const getSlideNumber = (filePath) => {
        const baseName = path.basename(filePath, path.extname(filePath));
        const matches = baseName.match(/\d+/g);
        if (!matches || matches.length === 0) return null;
        return String(parseInt(matches[matches.length - 1], 10));
      };

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      const videoExtensions = ['.mp4', '.webm', '.mov'];
      const textExtensions = ['.txt'];

      const images = getFiles(slideFolder, imageExtensions);
      const audios = getFiles(audioFolder, audioExtensions);
      const videos = getFiles(videoFolder, videoExtensions);
      const scriptFiles = getFiles(audioFolder, textExtensions);
      const scriptsByBaseName = new Map();
      const scriptsBySlideNumber = new Map();

      scriptFiles.forEach((scriptFile) => {
        const baseName = path.basename(scriptFile, path.extname(scriptFile)).toLowerCase();
        scriptsByBaseName.set(baseName, scriptFile);

        const slideNumber = getSlideNumber(scriptFile);
        if (slideNumber && !scriptsBySlideNumber.has(slideNumber)) {
          scriptsBySlideNumber.set(slideNumber, scriptFile);
        }
      });

      if (images.length === 0) {
        return { ok: false, error: 'No images found in slide folder' };
      }

      const slides = images.map((img, index) => {
        const slideId = `slide-${(index + 1).toString().padStart(2, '0')}`;
        const audioPath = audios[index];
        const audioBaseName = audioPath
          ? path.basename(audioPath, path.extname(audioPath)).toLowerCase()
          : null;
        const audioSlideNumber = audioPath ? getSlideNumber(audioPath) : null;
        const scriptPath = audioBaseName && scriptsByBaseName.has(audioBaseName)
          ? scriptsByBaseName.get(audioBaseName)
          : scriptsBySlideNumber.get(audioSlideNumber || String(index + 1));
        const scriptFromFile = readTextFile(scriptPath);

        const slide = {
          id: slideId,
          order: index + 1,
          title: `Trang ${index + 1}`,
          image: `/api/media?path=${encodeURIComponent(img)}`,
          script: scriptFromFile || `Đây là nội dung trang thứ ${index + 1}.`,
          knowledgePoint: "Kiến thức cơ bản"
        };

        if (scriptFromFile) {
          slide.scriptSource = 'audio_text_file';
          slide.scriptFile = `/api/media?path=${encodeURIComponent(scriptPath)}`;
        }

        if (audioPath) {
          slide.audio = `/api/media?path=${encodeURIComponent(audioPath)}`;
        }

        if (videos[index]) {
          slide.video = `/api/media?path=${encodeURIComponent(videos[index])}`;
        }

        return slide;
      });

      const newLesson = {
        lessonId: `lesson-${Date.now()}`,
        title: "Bài học mới khởi tạo từ local",
        description: `Bài học được dựng tự động từ thư mục ${slideFolder}`,
        targetLearner: "Học sinh",
        slides: slides
      };

      return this.updateLesson(newLesson);
    } catch (error) {
      return { ok: false, error: `Failed to initialize lesson: ${error.message}` };
    }
  }

  async enrichLesson({ targetLearner, learningObjectives, scope = 'missing' } = {}) {
    const lessonResult = this.getLesson();
    if (!lessonResult.ok) return lessonResult;

    const currentLesson = lessonResult.lesson;
    const workingLesson = JSON.parse(JSON.stringify(currentLesson));
    const objectivesText = Array.isArray(learningObjectives) ? learningObjectives.filter(Boolean) : [];
    let removedCheckpointCount = 0;
    const learner = targetLearner || currentLesson.targetLearner || 'Học sinh';

    workingLesson.slides = (workingLesson.slides || []).map((slide) => {
      if (!slide || typeof slide !== 'object') return slide;
      const nextSlide = { ...slide };
      if (nextSlide.checkpoint) {
        removedCheckpointCount += 1;
        delete nextSlide.checkpoint;
      }
      if (Object.prototype.hasOwnProperty.call(nextSlide, 'questionEnabled')) {
        delete nextSlide.questionEnabled;
      }
      return nextSlide;
    });

    const candidates = workingLesson.slides
      .map((slide, index) => ({ slide, index }))
      .filter(({ slide }) => {
        if (scope !== 'all') return this._isPlaceholderSlide(slide);
        return true;
      });

    if (candidates.length === 0) {
      if (removedCheckpointCount > 0) {
        const updateResult = this.updateLesson(workingLesson);
        if (!updateResult.ok) return updateResult;
        return {
          ok: true,
          lesson: updateResult.lesson,
          updatedLesson: updateResult.lesson,
          backupPath: updateResult.backupPath,
          message: 'Khong co slide nao can lam giau noi dung. Da xoa checkpoint de giao vien tao lai trong Builder.',
          enrichedCount: 0,
          removedCheckpointCount
        };
      }

      return {
        ok: true,
        lesson: currentLesson,
        updatedLesson: currentLesson,
        message: 'Không có slide nào cần làm giàu nội dung.',
        enrichedCount: 0
      };
    }

    const errors = [];
    let enrichedCount = 0;

    for (const item of candidates) {
      const { slide, index } = item;
      try {
        const aiData = await this._generateSlideContent({
          slide,
          learner,
          objectivesText,
          lessonTitle: workingLesson.title
        });

        if (aiData) {
          const currentSlide = workingLesson.slides[index];
          const hasScriptFromFile = currentSlide.scriptSource === 'audio_text_file';
          const normalizedCheckpoint = this._normalizeGeneratedCheckpoint(aiData.checkpoint, currentSlide.id);
          const enrichedSlide = {
            ...currentSlide,
            script: hasScriptFromFile ? currentSlide.script : (aiData.script || currentSlide.script),
            knowledgePoint: aiData.knowledgePoint || workingLesson.slides[index].knowledgePoint
          };

          if (normalizedCheckpoint) {
            enrichedSlide.checkpoint = normalizedCheckpoint;
            enrichedSlide.questionEnabled = true;
          }

          workingLesson.slides[index] = enrichedSlide;
          enrichedCount += 1;
        }
      } catch (error) {
        errors.push(`slide ${slide.id}: ${error.message}`);
      }
    }

    const updateResult = this.updateLesson(workingLesson);
    if (!updateResult.ok) return updateResult;

    return {
      ok: true,
      lesson: updateResult.lesson,
      updatedLesson: updateResult.lesson,
      backupPath: updateResult.backupPath,
      enrichedCount,
      removedCheckpointCount,
      errors
    };
  }

  updateLesson(newLesson) {
    // 1. Validate
    const validation = validateLesson(newLesson);
    if (!validation.valid) {
      return { ok: false, error: 'Invalid lesson schema', details: validation.errors };
    }

    // 2. Backup
    const backup = backupLesson(LESSON_PATH);
    if (!backup.ok) {
      return { ok: false, error: 'Backup failed', details: backup.error };
    }

    // 3. Write
    try {
      fs.writeFileSync(LESSON_PATH, JSON.stringify(newLesson, null, 2), 'utf-8');
      return { 
        ok: true, 
        lesson: newLesson,
        updatedLesson: newLesson, // Alias for GATE-002 criteria
        backupPath: backup.backupPath 
      };
    } catch (error) {
      return { ok: false, error: 'Failed to write lesson file', details: error.message };
    }
  }

  getBackups() {
    try {
      if (!fs.existsSync(BACKUP_DIR)) {
        return { ok: true, backups: [] };
      }
      const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a)); // Newest first
      return { ok: true, backups: files };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  restoreLastBackup() {
    const backupRes = this.getBackups();
    if (!backupRes.ok || backupRes.backups.length === 0) {
      return { ok: false, error: 'No backups available' };
    }

    const lastBackup = backupRes.backups[0];
    const backupPath = path.join(BACKUP_DIR, lastBackup);

    try {
      // Before restoring, backup current if it exists (extra safety)
      const currentBackup = backupLesson(LESSON_PATH);
      if (!currentBackup.ok) {
        return { ok: false, error: 'Failed to backup current lesson before restore', details: currentBackup.error };
      }

      const data = fs.readFileSync(backupPath, 'utf-8');
      const lesson = JSON.parse(data);
      
      fs.writeFileSync(LESSON_PATH, data, 'utf-8');
      return { ok: true, lesson, message: `Restored from ${lastBackup}` };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  _isPlaceholderSlide(slide) {
    const script = String(slide.script || '').trim().toLowerCase();
    const knowledge = String(slide.knowledgePoint || '').trim().toLowerCase();
    const scriptPattern = /^đây là nội dung trang thứ \d+\.$/i;
    const scriptPatternAscii = /^day la noi dung trang thu \d+\.$/i;
    const isPlaceholderScript = scriptPattern.test(script) || scriptPatternAscii.test(script);
    const isPlaceholderKnowledge = knowledge === 'kiến thức cơ bản' || knowledge === 'kien thuc co ban';
    return isPlaceholderScript || isPlaceholderKnowledge;
  }

  async _generateSlideContent({ slide, learner, objectivesText, lessonTitle }) {
    const hasScriptFromFile = slide.scriptSource === 'audio_text_file';
    const scriptSourceLabel = hasScriptFromFile
      ? 'Script gốc được giáo viên chuẩn bị trong file .txt cùng thư mục audio.'
      : 'Script hiện tại có thể là nội dung tạm nếu chưa có file .txt.';
    const systemPrompt = [
      'Bạn là trợ giảng AI biên soạn nội dung bài học cho giáo viên tiểu học.',
      'Hãy tạo nội dung phù hợp lứa tuổi, rõ ràng, ngắn gọn, đúng trọng tâm.',
      'Luôn bám sát script gốc của slide. Không bịa thêm kiến thức ngoài nội dung script.',
      'Chỉ trả về JSON hợp lệ, không markdown.'
    ].join('\n');

    const userPrompt = [
      `Bài học: ${lessonTitle || 'Bài học mới'}`,
      `Đối tượng học: ${learner}`,
      `Mục tiêu học tập: ${objectivesText.length > 0 ? objectivesText.join('; ') : 'Chưa có'}`,
      `Slide hiện tại: ${slide.title}`,
      `Nguồn script: ${scriptSourceLabel}`,
      `Script gốc của slide: ${slide.script || ''}`,
      hasScriptFromFile
        ? 'Yêu cầu: Giữ nguyên script gốc để không lệch với audio. Tạo knowledgePoint và checkpoint bám sát script gốc.'
        : 'Yêu cầu: Tạo script rõ hơn từ nội dung hiện có, sau đó tạo knowledgePoint và checkpoint bám sát script.',
      'Checkpoint phải hỏi đúng nội dung đã xuất hiện trong script gốc, không hỏi kiến thức ngoài bài.',
      'Trả về JSON theo mẫu:',
      '{',
      '  "script": "string",',
      '  "knowledgePoint": "string",',
      '  "checkpoint": {',
      '    "id": "cp-slide-xx-01",',
      '    "type": "multiple_choice",',
      '    "question": "string",',
      '    "options": ["A","B","C"],',
      '    "correctAnswer": "string",',
      '    "explanation": "string",',
      '    "wrongFeedback": "string",',
      `    "reviewSlideId": "${slide.id}"`,
      '  } hoặc null',
      '}'
    ].join('\n');

    const aiData = await llmService.callLLMForJSON({
      systemPrompt,
      userPrompt,
      temperature: 0.3,
      maxTokens: 900
    });

    if (!aiData || typeof aiData !== 'object') {
      throw new Error('AI không trả về JSON hợp lệ');
    }

    if (aiData.checkpoint && typeof aiData.checkpoint === 'object') {
      aiData.checkpoint.reviewSlideId = aiData.checkpoint.reviewSlideId || slide.id;
    }

    return aiData;
  }

  _normalizeGeneratedCheckpoint(checkpoint, slideId) {
    if (!checkpoint || typeof checkpoint !== 'object') return null;
    const options = Array.isArray(checkpoint.options) ? checkpoint.options.filter(Boolean) : [];
    if (!checkpoint.question || !checkpoint.correctAnswer || options.length < 2) return null;

    return {
      id: checkpoint.id || `cp-${slideId}-${Date.now()}`,
      type: checkpoint.type || 'multiple_choice',
      question: checkpoint.question,
      options,
      correctAnswer: checkpoint.correctAnswer,
      explanation: checkpoint.explanation || 'Đáp án đúng như nội dung bài học.',
      wrongFeedback: checkpoint.wrongFeedback || 'Chưa chính xác, em hãy xem lại nội dung slide này.',
      reviewSlideId: checkpoint.reviewSlideId || slideId
    };
  }
}

module.exports = new LessonService();
