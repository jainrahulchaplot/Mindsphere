const API_BASE_URL = '/api/v1';

export const profileApi = {
  // Memories
  getMemories: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/memories?user_id=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error('Failed to fetch memories');
    return response.json();
  },

  addMemory: async (userId: string, memory: { content: string; category: string }) => {
    const response = await fetch(`${API_BASE_URL}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        ...memory,
        importance: 1
      }),
    });
    if (!response.ok) throw new Error('Failed to add memory');
    return response.json();
  },

  deleteMemory: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/memories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete memory');
  },

  // Snippets
  getSnippets: async (userId: string) => {
    const response = await fetch(`${API_BASE_URL}/snippets?user_id=${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error('Failed to fetch snippets');
    return response.json();
  },

  addSnippet: async (userId: string, content: string) => {
    const response = await fetch(`${API_BASE_URL}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        content
      }),
    });
    if (!response.ok) throw new Error('Failed to add snippet');
    return response.json();
  },

  deleteSnippet: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/snippets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete snippet');
  },
};
