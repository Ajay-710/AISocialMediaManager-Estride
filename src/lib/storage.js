import { mockPosts } from '../data/mockData';

// API client to communicate with the SQLite Express backend
const API_URL = '/api';
const FALLBACK_KEY = 'estride_fallback_posts';

// Helper to use LocalStorage fallback when Vercel backend isn't available
const getFallbackStorage = () => {
  const saved = localStorage.getItem(FALLBACK_KEY);
  if (saved) return JSON.parse(saved);
  return mockPosts;
};

const setFallbackStorage = (posts) => {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(posts));
};

export const storage = {
  // Load posts asynchronously from the backend or fallback
  loadPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      return await res.json();
    } catch (e) {
      console.warn('Backend completely absent, dropping to local fallback memory:', e);
      return getFallbackStorage();
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
      console.warn('Backend absent, saving to fallback storage.');
      const all = getFallbackStorage();
      const updated = [newPost, ...all];
      setFallbackStorage(updated);
      return newPost;
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
      const all = getFallbackStorage();
      const mapped = all.map(p => p.id === id ? { ...p, ...updates } : p);
      setFallbackStorage(mapped);
      return true;
    }
  },
  
  // Delete a post
  deletePost: async (id) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      return await res.json();
    } catch (e) {
      const all = getFallbackStorage();
      setFallbackStorage(all.filter(p => p.id !== id));
      return true;
    }
  }
};
