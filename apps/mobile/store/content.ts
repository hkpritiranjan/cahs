import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ContentPiece {
  id: string;
  type: string;
  title: string | null;
  body: string;
  author: string;
  tags: string[];
  published_at: string;
  reading_time_seconds: number;
}

interface ContentState {
  todayQuote: ContentPiece | null;
  todayReflection: ContentPiece | null;
  libraryItems: ContentPiece[];
  bookmarkedIds: Set<string>;
  loading: boolean;
  fetchToday: () => Promise<void>;
  fetchLibrary: (tag?: string) => Promise<void>;
  toggleBookmark: (contentId: string, contentType: string) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  todayQuote: null,
  todayReflection: null,
  libraryItems: [],
  bookmarkedIds: new Set(),
  loading: false,

  fetchToday: async () => {
    set({ loading: true });
    const today = new Date().toISOString().split('T')[0];

    const [quoteRes, reflectionRes] = await Promise.all([
      supabase
        .from('content_pieces')
        .select('*')
        .eq('type', 'quote')
        .eq('is_daily', true)
        .lte('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('content_pieces')
        .select('*')
        .eq('type', 'reflection')
        .eq('is_daily', true)
        .lte('scheduled_for', today)
        .order('scheduled_for', { ascending: false })
        .limit(1)
        .single(),
    ]);

    set({
      todayQuote: quoteRes.data ?? null,
      todayReflection: reflectionRes.data ?? null,
      loading: false,
    });
  },

  fetchLibrary: async (tag) => {
    set({ loading: true });
    let query = supabase.from('content_pieces').select('*').order('published_at', { ascending: false }).limit(50);
    if (tag) query = query.contains('tags', [tag]);
    const { data } = await query;
    set({ libraryItems: data ?? [], loading: false });
  },

  toggleBookmark: async (contentId, contentType) => {
    const { bookmarkedIds } = get();
    const isBookmarked = bookmarkedIds.has(contentId);
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('content_id', contentId);
      set((s) => {
        const next = new Set(s.bookmarkedIds);
        next.delete(contentId);
        return { bookmarkedIds: next };
      });
    } else {
      await supabase.from('bookmarks').insert({ content_id: contentId, content_type: contentType });
      set((s) => ({ bookmarkedIds: new Set([...s.bookmarkedIds, contentId]) }));
    }
  },

  fetchBookmarks: async () => {
    const { data } = await supabase.from('bookmarks').select('content_id');
    if (data) {
      set({ bookmarkedIds: new Set(data.map((b) => b.content_id)) });
    }
  },
}));
