const fs = require('fs');
const path = require('path');
const { validateLesson } = require('../utils/validate-lesson');
const { backupLesson } = require('../utils/backup-lesson');

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

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a'];
      const videoExtensions = ['.mp4', '.webm', '.mov'];

      const images = getFiles(slideFolder, imageExtensions);
      const audios = getFiles(audioFolder, audioExtensions);
      const videos = getFiles(videoFolder, videoExtensions);

      if (images.length === 0) {
        return { ok: false, error: 'No images found in slide folder' };
      }

      const slides = images.map((img, index) => {
        const slideId = `slide-${(index + 1).toString().padStart(2, '0')}`;
        const slide = {
          id: slideId,
          order: index + 1,
          title: `Trang ${index + 1}`,
          image: `/api/media?path=${encodeURIComponent(img)}`,
          script: `Đây là nội dung trang thứ ${index + 1}.`,
          knowledgePoint: "Kiến thức cơ bản"
        };

        if (audios[index]) {
          slide.audio = `/api/media?path=${encodeURIComponent(audios[index])}`;
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
}

module.exports = new LessonService();
