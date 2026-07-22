import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UnsentLetter {
  id: string;
  addressed_to: string | null;
  body: string;
  status: 'active' | 'archived' | 'released';
  created_at: string;
  updated_at: string;
}

interface LettersState {
  letters: UnsentLetter[];
  loading: boolean;
  fetchLetters: () => Promise<void>;
  saveLetter: (data: { addressed_to?: string; body: string }) => Promise<{ id?: string; error: string | null }>;
  updateLetter: (id: string, data: Partial<Pick<UnsentLetter, 'addressed_to' | 'body' | 'status'>>) => Promise<{ error: string | null }>;
  deleteLetter: (id: string) => Promise<void>;
}

export const useLettersStore = create<LettersState>((set) => ({
  letters: [],
  loading: false,

  fetchLetters: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('unsent_letters')
      .select('*')
      .eq('status', 'active')
      .order('updated_at', { ascending: false });
    set({ letters: data ?? [], loading: false });
  },

  saveLetter: async ({ addressed_to, body }) => {
    const { data, error } = await supabase
      .from('unsent_letters')
      .insert({ addressed_to: addressed_to?.trim() || null, body })
      .select()
      .single();
    if (data) set((s) => ({ letters: [data, ...s.letters] }));
    return { id: data?.id, error: error?.message ?? null };
  },

  updateLetter: async (id, updates) => {
    const { error } = await supabase.from('unsent_letters').update(updates).eq('id', id);
    if (!error) {
      set((s) => ({
        letters: s.letters.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      }));
    }
    return { error: error?.message ?? null };
  },

  deleteLetter: async (id) => {
    await supabase.from('unsent_letters').delete().eq('id', id);
    set((s) => ({ letters: s.letters.filter((l) => l.id !== id) }));
  },
}));
