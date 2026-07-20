import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type MoodState = 'peaceful' | 'okay' | 'unsettled' | 'heavy' | 'overwhelmed';

interface MoodCheckin {
  id: string;
  mood_state: MoodState;
  note: string | null;
  checked_at: string;
  streak_day: number;
}

interface MoodStoreState {
  todayCheckin: MoodCheckin | null;
  history: MoodCheckin[];
  currentStreak: number;
  loading: boolean;
  fetchToday: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  checkin: (mood: MoodState, note?: string) => Promise<{ error: string | null }>;
}

export const useMoodStore = create<MoodStoreState>((set, get) => ({
  todayCheckin: null,
  history: [],
  currentStreak: 0,
  loading: false,

  fetchToday: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('mood_checkins')
      .select('*')
      .gte('checked_at', `${today}T00:00:00`)
      .lte('checked_at', `${today}T23:59:59`)
      .order('checked_at', { ascending: false })
      .limit(1)
      .single();
    set({ todayCheckin: data ?? null });
  },

  fetchHistory: async () => {
    set({ loading: true });
    const { data } = await supabase
      .from('mood_checkins')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(90);
    if (data) {
      const streak = calculateStreak(data);
      set({ history: data, currentStreak: streak, loading: false });
    } else {
      set({ loading: false });
    }
  },

  checkin: async (mood, note) => {
    const { currentStreak } = get();
    const { data, error } = await supabase
      .from('mood_checkins')
      .insert({
        mood_state: mood,
        note: note ?? null,
        checked_at: new Date().toISOString(),
        streak_day: currentStreak + 1,
      })
      .select()
      .single();

    if (data) {
      set((s) => ({
        todayCheckin: data,
        currentStreak: s.currentStreak + 1,
      }));
    }
    return { error: error?.message ?? null };
  },
}));

function calculateStreak(checkins: MoodCheckin[]): number {
  if (!checkins.length) return 0;
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const first = new Date(checkins[0].checked_at);
  first.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - first.getTime()) / 86400000);
  if (diffDays > 1) return 0; // broke streak

  for (let i = 1; i < checkins.length; i++) {
    const curr = new Date(checkins[i].checked_at);
    const prev = new Date(checkins[i - 1].checked_at);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
