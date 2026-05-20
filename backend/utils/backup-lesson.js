const fs = require('fs');
const path = require('path');

/**
 * Backup current lesson.json before overwriting
 */
function backupLesson(currentLessonPath) {
  try {
    if (!fs.existsSync(currentLessonPath)) {
      return { ok: true, message: 'No file to backup' };
    }

    const backupDir = path.join(path.dirname(currentLessonPath), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `lesson-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFileName);

    fs.copyFileSync(currentLessonPath, backupPath);
    return { ok: true, backupPath };
  } catch (error) {
    console.error('Backup failed:', error);
    return { ok: false, error: error.message };
  }
}

module.exports = { backupLesson };
