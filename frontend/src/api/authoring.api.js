import { client } from './client';

export const authoringApi = {
  chat: (message, currentSlideId, chatHistory = []) => client.post('/api/ai/authoring', { message, currentSlideId, chatHistory }),
};
