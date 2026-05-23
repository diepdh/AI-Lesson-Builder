import { client } from './client';

export const authoringApi = {
  chat: (message, currentSlideId, chatHistory = [], intent = null) =>
    client.post('/api/ai/authoring', { message, currentSlideId, chatHistory, intent }),
};
