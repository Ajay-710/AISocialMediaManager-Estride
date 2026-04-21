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
  // Load posts from Supabase or fallback
  loadPosts: async () => {
    if (!supabase) return getFallbackStorage();
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      if (!data || data.length === 0) return getFallbackStorage();
      
      return data.map(p => ({
        ...p,
        engagement: typeof p.engagement === 'string' ? JSON.parse(p.engagement) : p.engagement
      }));
    } catch (e) {
      console.warn('Supabase fetch failed, using fallback:', e);
      return getFallbackStorage();
    }
  },

  // Add a post to Supabase
  addPost: async (newPost) => {
    if (!supabase) {
      const all = getFallbackStorage();
      const updated = [newPost, ...all];
      setFallbackStorage(updated);
      return newPost;
    }
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          ...newPost,
          engagement: JSON.stringify(newPost.engagement || {})
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase insert failed, using fallback:', e);
      const all = getFallbackStorage();
      const updated = [newPost, ...all];
      setFallbackStorage(updated);
      return newPost;
    }
  },
  
  // Update a post in Supabase
  updatePost: async (id, updates) => {
    if (!supabase) {
      const all = getFallbackStorage();
      const mapped = all.map(p => p.id === id ? { ...p, ...updates } : p);
      setFallbackStorage(mapped);
      return true;
    }
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          ...updates,
          engagement: updates.engagement ? JSON.stringify(updates.engagement) : undefined
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      const all = getFallbackStorage();
      const mapped = all.map(p => p.id === id ? { ...p, ...updates } : p);
      setFallbackStorage(mapped);
      return true;
    }
  },
  
  // Delete a post from Supabase
  deletePost: async (id) => {
    if (!supabase) {
      const all = getFallbackStorage();
      setFallbackStorage(all.filter(p => p.id !== id));
      return true;
    }
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (e) {
      const all = getFallbackStorage();
      setFallbackStorage(all.filter(p => p.id !== id));
      return true;
    }
  }
};
