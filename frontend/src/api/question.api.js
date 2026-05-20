import { client } from './client';

export const questionApi = {
  generate: (lessonId, slideId, type) => client.post('/api/question/generate', { lessonId, slideId, type }),
  regenerate: (lessonId, slideId, checkpointId) => client.post('/api/question/regenerate', { lessonId, slideId, checkpointId }),
};
