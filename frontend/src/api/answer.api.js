import { client } from './client';

export const answerApi = {
  evaluate: (params) => client.post('/api/answer/evaluate', params),
};
