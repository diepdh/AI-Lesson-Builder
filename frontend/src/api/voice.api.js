import { client } from './client';

export const voiceApi = {
  chat: (transcript, params) => client.post('/api/voice/chat', { transcript, ...params }),
};
