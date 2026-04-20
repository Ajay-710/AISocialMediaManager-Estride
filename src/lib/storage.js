// API client to communicate with the SQLite Express backend
const API_URL = '/api';

export const storage = {
  // Load posts asynchronously from the backend
  loadPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    } catch (e) {
      console.error('Failed to load posts from backend:', e);
      return [];
    }
  },

  // Add a single post
  addPost: async (newPost) => {
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (!res.ok) throw new Error('Failed to add post');
      return await res.json();
    } catch (e) {
      console.error('Failed to save post to backend:', e);
      return null;
    }
  },
  
  // Update a post
  updatePost: async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update post');
      return await res.json();
    } catch (e) {
      console.error('Failed to update post on backend:', e);
      return null;
    }
  },
  
  // Delete a post
  deletePost: async (id) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      return await res.json();
    } catch (e) {
      console.error('Failed to delete post from backend:', e);
      return null;
    }
  }
};
