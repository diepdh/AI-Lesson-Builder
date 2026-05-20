import { client } from './client';

export const authoringApi = {
  chat: (message, currentSlideId) => client.post('/api/ai/authoring', { message, currentSlideId }),
};
