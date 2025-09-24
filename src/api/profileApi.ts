import { api } from './client';

export const profileApi = {
  // Memories
  getMemories: async (userId: string) => {
    const response = await api.get(`/memories?user_id=${encodeURIComponent(userId)}`);
    return response.data;
  },

  addMemory: async (userId: string, memory: { content: string; category: string }) => {
    const response = await api.post('/memories', {
      user_id: userId,
      ...memory,
      importance: 1
    });
    return response.data;
  },

  deleteMemory: async (id: string) => {
    const response = await api.delete(`/memories/${id}`);
    return response.data;
  },

  // Snippets
  getSnippets: async (userId: string) => {
    const response = await api.get(`/snippets?user_id=${encodeURIComponent(userId)}`);
    return response.data;
  },

  addSnippet: async (userId: string, content: string) => {
    const response = await api.post('/snippets', {
      user_id: userId,
      content
    });
    return response.data;
  },

  deleteSnippet: async (id: string) => {
    const response = await api.delete(`/snippets/${id}`);
    return response.data;
  },
};
