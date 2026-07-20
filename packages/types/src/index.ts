// ── User ──────────────────────────────────────────────────────────────────
export type OnboardingReason =
  | 'heartbreak'
  | 'loneliness'
  | 'anxiety'
  | 'growth'
  | 'creativity'
  | 'other';

export interface UserProfile {
  id: string;
  first_name: string;
  avatar_emoji: string;
  onboarding_reason: OnboardingReason;
  timezone: string;
  notification_time_morning: string; // HH:MM
  notification_time_evening: string | null;
  subscription_status: 'free' | 'founding' | 'premium';
  created_at: string;
}

// ── Content ───────────────────────────────────────────────────────────────
export type ContentType =
  | 'quote'
  | 'reflection'
  | 'poem'
  | 'essay'
  | 'story'
  | 'letter'
  | 'lesson';

export type ContentTag =
  | 'heartbreak'
  | 'loneliness'
  | 'anxiety'
  | 'growth'
  | 'creativity'
  | 'general'
  | 'gratitude'
  | 'courage'
  | 'healing';

export interface ContentPiece {
  id: string;
  type: ContentType;
  title: string | null;
  body: string;
  author: string;
  tags: ContentTag[];
  published_at: string;
  is_daily: boolean;
  scheduled_for: string | null;
  reading_time_seconds: number;
}

export interface DailyContent {
  quote: ContentPiece;
  reflection: ContentPiece;
}

// ── Mood ──────────────────────────────────────────────────────────────────
export type MoodState =
  | 'peaceful'
  | 'okay'
  | 'unsettled'
  | 'heavy'
  | 'overwhelmed';

export interface MoodConfig {
  state: MoodState;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export const MOOD_CONFIG: MoodConfig[] = [
  {
    state: 'peaceful',
    label: 'Peaceful',
    emoji: '🌿',
    color: '#6B9E7A',
    description: 'Calm and at ease',
  },
  {
    state: 'okay',
    label: 'Okay',
    emoji: '🌤',
    color: '#C47B47',
    description: 'Getting through it',
  },
  {
    state: 'unsettled',
    label: 'Unsettled',
    emoji: '🌊',
    color: '#5A80C8',
    description: 'Something feels off',
  },
  {
    state: 'heavy',
    label: 'Heavy',
    emoji: '🌧',
    color: '#7A6080',
    description: 'Carrying a lot today',
  },
  {
    state: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌪',
    color: '#C0544A',
    description: 'Too much at once',
  },
];

export interface MoodCheckin {
  id: string;
  user_id: string;
  mood_state: MoodState;
  note: string | null;
  checked_at: string;
  streak_day: number;
}

// ── Journal ───────────────────────────────────────────────────────────────
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  body: string;
  word_count: number;
  prompt_used: string | null;
  mood_at_time: MoodState | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ── Bookmark ──────────────────────────────────────────────────────────────
export interface Bookmark {
  id: string;
  user_id: string;
  content_id: string;
  content_type: ContentType;
  created_at: string;
}

// ── Unsent Letter ─────────────────────────────────────────────────────────
export interface UnsentLetter {
  id: string;
  user_id: string;
  addressed_to: string | null;
  body: string;
  status: 'active' | 'archived' | 'released';
  created_at: string;
  updated_at: string;
}
