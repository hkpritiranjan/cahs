import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  title: string | null;
  body: string;
  word_count: number;
  prompt_used: string | null;
  mood_at_time: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  saving: boolean;
  fetchEntries: () => Promise<void>;
  saveEntry: (entry: { body: string; title?: string; prompt_used?: string; mood_at_time?: string }) => Promise<{ id: string | null; error: string | null }>;
  updateEntry: (id: string, body: string) => Promise<{ error: string | null }>;
  deleteEntry: (id: string) => Promise<void>;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  loading: false,
  saving: false,

  fetchEntries: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    set({ entries: data ?? [], loading: false });
  },

  saveEntry: async ({ body, title, prompt_used, mood_at_time }) => {
    set({ saving: true });
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        body,
        title: title ?? null,
        word_count: countWords(body),
        prompt_used: prompt_used ?? null,
        mood_at_time: mood_at_time ?? null,
        tags: [],
      })
      .select()
      .single();

    if (data) {
      set((s) => ({ entries: [data, ...s.entries], saving: false }));
    } else {
      set({ saving: false });
    }
    return { id: data?.id ?? null, error: error?.message ?? null };
  },

  updateEntry: async (id, body) => {
    set({ saving: true });
    const { error } = await supabase
      .from('journal_entries')
      .update({ body, word_count: countWords(body), updated_at: new Date().toISOString() })
      .eq('id', id);
    set({ saving: false });
    if (!error) {
      set((s) => ({
        entries: s.entries.map((e) => (e.id === id ? { ...e, body } : e)),
      }));
    }
    return { error: error?.message ?? null };
  },

  deleteEntry: async (id) => {
    await supabase.from('journal_entries').delete().eq('id', id);
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },
}));
