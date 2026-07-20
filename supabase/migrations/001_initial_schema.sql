-- Enable UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists "pg_crypto";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create type onboarding_reason as enum (
  'heartbreak', 'loneliness', 'anxiety', 'growth', 'creativity', 'other'
);

create type subscription_status as enum ('free', 'founding', 'premium');

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text not null,
  avatar_emoji text not null default '🌿',
  onboarding_reason onboarding_reason not null default 'other',
  timezone text not null default 'UTC',
  notification_time_morning time not null default '08:00',
  notification_time_evening time,
  subscription_status subscription_status not null default 'free',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: auto-create profile on auth.users insert (minimal, user fills in rest during onboarding)
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, onboarding_complete)
  values (new.id, split_part(new.email, '@', 1), false);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Content Pieces ────────────────────────────────────────────────────────────
create type content_type as enum (
  'quote', 'reflection', 'poem', 'essay', 'story', 'letter', 'lesson'
);

create table content_pieces (
  id uuid primary key default uuid_generate_v4(),
  type content_type not null,
  title text,
  body text not null,
  author text not null default 'CAHS',
  tags text[] not null default '{}',
  is_daily boolean not null default false,
  scheduled_for date,  -- date this piece is scheduled as the daily quote/reflection
  reading_time_seconds integer not null default 60,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_content_daily on content_pieces(type, is_daily, scheduled_for) where is_daily = true;
create index idx_content_type on content_pieces(type, created_at desc);
create index idx_content_tags on content_pieces using gin(tags);

-- ── Bookmarks ─────────────────────────────────────────────────────────────────
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  content_id uuid references content_pieces(id) on delete cascade not null,
  content_type content_type not null,
  created_at timestamptz not null default now(),
  unique (user_id, content_id)
);

create index idx_bookmarks_user on bookmarks(user_id, created_at desc);

-- ── Mood Check-ins ────────────────────────────────────────────────────────────
create type mood_state as enum (
  'peaceful', 'okay', 'unsettled', 'heavy', 'overwhelmed'
);

create table mood_checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  mood_state mood_state not null,
  note text,  -- stored as plain text for now; Phase 3: encrypt
  checked_at timestamptz not null default now(),
  streak_day integer not null default 1,
  constraint note_length check (char_length(note) <= 500)
);

create index idx_mood_user_date on mood_checkins(user_id, checked_at desc);

-- ── Journal Entries ───────────────────────────────────────────────────────────
create table journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text,
  body text not null,  -- Phase 3: encrypt at application layer
  word_count integer not null default 0,
  prompt_used text,
  mood_at_time mood_state,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_journal_user on journal_entries(user_id, created_at desc);

-- Full-text search on journal (user searches own entries)
create index idx_journal_fts on journal_entries using gin(to_tsvector('english', body));

-- ── Unsent Letters ────────────────────────────────────────────────────────────
create type letter_status as enum ('active', 'archived', 'released');

create table unsent_letters (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  addressed_to text,
  body text not null,
  status letter_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_letters_user on unsent_letters(user_id, created_at desc);

-- ── Community Submissions ─────────────────────────────────────────────────────
create type submission_status as enum ('pending', 'approved', 'rejected');

create table community_submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  category text not null,
  pen_name text,
  status submission_status not null default 'pending',
  reviewer_note text,
  reviewed_at timestamptz,
  published_as uuid references content_pieces(id),
  created_at timestamptz not null default now(),
  constraint title_length check (char_length(title) <= 200),
  constraint body_length check (char_length(body) between 100 and 3000)
);

create index idx_submissions_user on community_submissions(user_id, created_at desc);
create index idx_submissions_status on community_submissions(status, created_at desc);

-- ── Subscriptions ─────────────────────────────────────────────────────────────
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  revenue_cat_user_id text,
  tier subscription_status not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Updated_at triggers ────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at();
create trigger journal_updated_at before update on journal_entries
  for each row execute procedure update_updated_at();
create trigger letters_updated_at before update on unsent_letters
  for each row execute procedure update_updated_at();
create trigger subscriptions_updated_at before update on subscriptions
  for each row execute procedure update_updated_at();
