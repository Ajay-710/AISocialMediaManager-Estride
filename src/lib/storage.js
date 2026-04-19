import { mockPosts } from '../data/mockData';

const STORAGE_KEY = 'estride_marketing_os_posts';

export const storage = {
  // Load posts: prioritize local storage, fallback to mock data if empty
  loadPosts: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved posts:', e);
      }
    }
    // First time? Use mock data to make it look full
    return mockPosts;
  },

  // Save posts to browser memory
  savePosts: (posts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  // Add a single post
  addPost: (newPost) => {
    const posts = storage.loadPosts();
    const updated = [newPost, ...posts];
    storage.savePosts(updated);
    return updated;
  }
};
