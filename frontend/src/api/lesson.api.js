import { client } from './client';

export const lessonApi = {
  getLesson: () => client.get('/api/lesson'),
  updateLesson: (lesson) => client.put('/api/lesson', lesson),
  getBackups: () => client.get('/api/lesson/backups'),
  restoreLast: () => client.post('/api/lesson/restore-last'),
  getHealth: () => client.get('/api/health'),
  initLesson: (folders) => client.post('/api/lesson/init', folders),
};
