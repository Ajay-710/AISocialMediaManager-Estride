import { supabase } from './supabase';
import { mockPosts } from '../data/mockData';

const FALLBACK_KEY = 'estride_fallback_posts';

const getFallbackStorage = () => {
  const saved = localStorage.getItem(FALLBACK_KEY);
  return saved ? JSON.parse(saved) : mockPosts;
};

const setFallbackStorage = (posts) => {
  localStorage.setItem(FALLBACK_KEY, JSON.stringify(posts));
};

export const storage = {
  // Load posts from Supabase only for the current user
  loadPosts: async (userId) => {
    if (!supabase || !userId) return getFallbackStorage();
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data.map(p => ({
        ...p,
        engagement: typeof p.engagement === 'string' ? JSON.parse(p.engagement) : p.engagement
      }));
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
      return getFallbackStorage();
    }
  },

  // Add a post tied to the user
  addPost: async (newPost, userId) => {
    if (!supabase || !userId) return newPost;
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...newPost,
          user_id: userId,
          engagement: JSON.stringify(newPost.engagement || {})
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      return newPost;
    }
  },
  
  // Update a post (securely filtered by userId)
  updatePost: async (id, updates, userId) => {
    if (!supabase || !userId) return true;
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          ...updates,
          engagement: updates.engagement ? JSON.stringify(updates.engagement) : undefined
        })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (e) {
      return true;
    }
  },
  
  // Delete a post (securely filtered by userId)
  deletePost: async (id, userId) => {
    if (!supabase || !userId) return true;
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (e) {
      return true;
    }
  }
};
