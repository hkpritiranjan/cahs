-- Enable RLS on all user-data tables
alter table profiles enable row level security;
alter table bookmarks enable row level security;
alter table mood_checkins enable row level security;
alter table journal_entries enable row level security;
alter table unsent_letters enable row level security;
alter table community_submissions enable row level security;
alter table subscriptions enable row level security;

-- content_pieces: publicly readable (no RLS needed for reads)
-- but only service_role can write
alter table content_pieces enable row level security;
create policy "content_pieces_public_read" on content_pieces
  for select using (published = true);

-- Profiles: user owns their own profile
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- Bookmarks
create policy "bookmarks_select_own" on bookmarks
  for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on bookmarks
  for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on bookmarks
  for delete using (auth.uid() = user_id);

-- Mood check-ins
create policy "mood_select_own" on mood_checkins
  for select using (auth.uid() = user_id);
create policy "mood_insert_own" on mood_checkins
  for insert with check (auth.uid() = user_id);
create policy "mood_update_own" on mood_checkins
  for update using (auth.uid() = user_id);

-- Journal entries
create policy "journal_select_own" on journal_entries
  for select using (auth.uid() = user_id);
create policy "journal_insert_own" on journal_entries
  for insert with check (auth.uid() = user_id);
create policy "journal_update_own" on journal_entries
  for update using (auth.uid() = user_id);
create policy "journal_delete_own" on journal_entries
  for delete using (auth.uid() = user_id);

-- Unsent letters
create policy "letters_select_own" on unsent_letters
  for select using (auth.uid() = user_id);
create policy "letters_insert_own" on unsent_letters
  for insert with check (auth.uid() = user_id);
create policy "letters_update_own" on unsent_letters
  for update using (auth.uid() = user_id);
create policy "letters_delete_own" on unsent_letters
  for delete using (auth.uid() = user_id);

-- Community submissions
create policy "submissions_select_own" on community_submissions
  for select using (auth.uid() = user_id);
create policy "submissions_insert_own" on community_submissions
  for insert with check (auth.uid() = user_id);

-- Subscriptions
create policy "subscriptions_select_own" on subscriptions
  for select using (auth.uid() = user_id);
