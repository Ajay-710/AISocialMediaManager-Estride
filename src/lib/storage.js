import { supabase } from './supabase';
import { mockPosts } from '../data/mockData';

const FALLBACK_KEY = 'estride_fallback_posts';

const getFallbackStorage = () => {
  const saved = localStorage.getItem(FALLBACK_KEY);
  return saved ? JSON.parse(saved) : mockPosts;
};

export const storage = {
  // ── Posts ──────────────────────────────────────────────────────────────────

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
        engagement: typeof p.engagement === 'string' ? JSON.parse(p.engagement) : p.engagement,
      }));
    } catch (e) {
      console.warn('Supabase loadPosts failed:', e);
      return getFallbackStorage();
    }
  },

  addPost: async (newPost, userId) => {
    if (!supabase || !userId) return newPost;
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...newPost, user_id: userId, engagement: JSON.stringify(newPost.engagement || {}) }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.warn('Supabase addPost failed:', e);
      return newPost;
    }
  },

  updatePost: async (id, updates, userId) => {
    if (!supabase || !userId) return true;
    try {
      const { error } = await supabase
        .from('posts')
        .update({ ...updates, engagement: updates.engagement ? JSON.stringify(updates.engagement) : undefined })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase updatePost failed:', e);
      return true;
    }
  },

  deletePost: async (id, userId) => {
    if (!supabase || !userId) return true;
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deletePost failed:', e);
      return true;
    }
  },

  // ── Brand Voice ─────────────────────────────────────────────────────────────
  // Table: brand_voice (user_id PK, brand_name, tone, audience, restricted_words, ayrshare_profile_key, updated_at)

  loadBrandVoice: async (userId) => {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('brand_voice')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (e) {
      console.warn('Supabase loadBrandVoice failed:', e);
      return null;
    }
  },

  saveBrandVoice: async (brandData, userId) => {
    if (!supabase || !userId) return false;
    try {
      const { error } = await supabase
        .from('brand_voice')
        .upsert(
          { ...brandData, user_id: userId, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase saveBrandVoice failed:', e);
      return false;
    }
  },

  // ── Profiles ─────────────────────────────────────────────────────────────────
  // Table: profiles (user_id PK, display_name, bio, handle_x, handle_linkedin, handle_instagram, updated_at)

  loadProfile: async (userId) => {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (e) {
      console.warn('Supabase loadProfile failed:', e);
      return null;
    }
  },

  saveProfile: async (profileData, userId) => {
    if (!supabase || !userId) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { ...profileData, user_id: userId, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase saveProfile failed:', e);
      return false;
    }
  },
};
