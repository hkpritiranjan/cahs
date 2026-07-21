import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  first_name: string;
  avatar_emoji: string;
  onboarding_reason: string;
  timezone: string;
  notification_time_morning: string;
  notification_time_evening: string | null;
  subscription_status: 'free' | 'founding' | 'premium';
  created_at: string;
  onboarding_complete: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: string | null }>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, initialized: true });
    if (session) {
      get().fetchProfile();
    }
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signUpWithEmail: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error: error?.message ?? null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) set({ profile: data as UserProfile });
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...data, updated_at: new Date().toISOString() });
    if (!error) {
      set((s) => ({ profile: s.profile ? { ...s.profile, ...data } : null }));
    }
    return { error: error?.message ?? null };
  },
}));
