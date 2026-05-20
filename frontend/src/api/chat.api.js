import { client } from './client';

export const chatApi = {
  chat: (params) => client.post('/api/chat', params),
};
