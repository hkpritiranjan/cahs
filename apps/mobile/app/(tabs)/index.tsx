import { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { QuoteCard } from '../../components/quote/QuoteCard';
import { MoodSelector } from '../../components/mood/MoodSelector';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { useContentStore } from '../../store/content';
import { useMoodStore } from '../../store/mood';

type MoodState = 'peaceful' | 'okay' | 'unsettled' | 'heavy' | 'overwhelmed';

const JOURNAL_PROMPTS: Record<string, string> = {
  heartbreak: "What are you carrying today that you haven't been able to say out loud?",
  loneliness: 'When did you last feel truly seen by someone? What did that feel like?',
  anxiety: 'What is the one thing your mind keeps returning to? Write it down here.',
  growth: 'What would the version of you from a year ago think of who you are today?',
  creativity: 'What are you afraid to make? What would it look like if you made it anyway?',
  other: "What's on your mind today?",
};

function greetingForTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { todayQuote, todayReflection, libraryItems, bookmarkedIds, fetchToday, fetchLibrary, toggleBookmark, fetchBookmarks } =
    useContentStore();
  const { todayCheckin, currentStreak, checkin, fetchToday: fetchMoodToday } = useMoodStore();

  const [selectedMood, setSelectedMood] = useState<MoodState | null>(
    (todayCheckin?.mood_state as MoodState) ?? null,
  );
  const [moodNote, setMoodNote] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchToday();
    fetchBookmarks();
    fetchMoodToday();
    fetchLibrary();
  }, []);

  useEffect(() => {
    if (todayCheckin) setSelectedMood(todayCheckin.mood_state as MoodState);
  }, [todayCheckin]);

  const handleCheckin = async (mood: MoodState) => {
    if (todayCheckin) return; // already checked in today
    setSelectedMood(mood);
    setCheckingIn(true);
    await checkin(mood);
    setCheckingIn(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchToday(), fetchMoodToday(), fetchLibrary()]);
    setRefreshing(false);
  };

  const prompt =
    JOURNAL_PROMPTS[profile?.onboarding_reason ?? 'other'] ?? JOURNAL_PROMPTS.other;

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C47B47" />
        }
      >
        {/* Header */}
        <View className="px-5 pt-6 pb-2 flex-row items-center justify-between">
          <View>
            <Text variant="label" className="text-cahs-amber mb-1">
              Today
            </Text>
            <Text variant="h2">
              {greetingForTime()}{profile?.first_name ? `, ${profile.first_name}` : ''}.
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            {currentStreak > 1 && (
              <View className="bg-cahs-amber-light dark:bg-cahs-amber/10 px-3 py-2 rounded-xl items-center">
                <Text className="text-lg">🔥</Text>
                <Text variant="micro" className="text-cahs-amber" style={{ fontWeight: '600' }}>
                  {currentStreak} days
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => router.push('/profile')}
              className="w-11 h-11 items-center justify-center bg-cahs-warm-gray dark:bg-cahs-dark-surface rounded-full border border-cahs-border dark:border-cahs-dark-elevated active:opacity-70"
            >
              <Text style={{ fontSize: 22 }}>{profile?.avatar_emoji ?? '🌿'}</Text>
            </Pressable>
          </View>
        </View>

        {/* Daily Quote */}
        <View className="px-5 mt-4">
          <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
            Today's Quote
          </Text>

          {todayQuote ? (
            <QuoteCard
              quote={todayQuote}
              isBookmarked={bookmarkedIds.has(todayQuote.id)}
              onBookmark={() => toggleBookmark(todayQuote.id, 'quote')}
            />
          ) : (
            <Card>
              <Text variant="caption" className="text-cahs-stone text-center py-4">
                Loading today's quote…
              </Text>
            </Card>
          )}
        </View>

        {/* Mood Check-in */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted">
              How are you feeling?
            </Text>
            {todayCheckin && (
              <Text variant="micro" className="text-cahs-ash dark:text-cahs-dark-muted">
                Checked in today ✓
              </Text>
            )}
          </View>

          <MoodSelector
            selected={selectedMood}
            onSelect={handleCheckin}
            disabled={!!todayCheckin || checkingIn}
          />

          {todayCheckin && (
            <Text
              variant="caption"
              className="text-cahs-stone dark:text-cahs-dark-muted text-center mt-3"
            >
              You chose{' '}
              <Text variant="caption" className="text-cahs-amber font-dm-sans-semibold capitalize">
                {todayCheckin.mood_state}
              </Text>{' '}
              today. See you tomorrow.
            </Text>
          )}
        </View>

        {/* Today's Reflection */}
        {todayReflection && (
          <View className="px-5 mt-6">
            <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
              Today's Reflection
            </Text>
            <Card
              onPress={() => router.push({ pathname: '/content/[id]', params: { id: todayReflection.id } })}
            >
              <Text variant="h3" className="mb-2">
                {todayReflection.title}
              </Text>
              <Text variant="body" className="text-cahs-stone dark:text-cahs-dark-muted" numberOfLines={3}>
                {todayReflection.body}
              </Text>
              <View className="flex-row items-center justify-between mt-4">
                <Text variant="micro" className="text-cahs-ash">
                  {Math.ceil(todayReflection.reading_time_seconds / 60)} min read
                </Text>
                <Text className="text-cahs-amber font-dm-sans-semibold text-sm">
                  Read →
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Journal prompt CTA */}
        <View className="px-5 mt-6">
          <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
            Write
          </Text>
          <Card className="bg-cahs-amber-light dark:bg-cahs-amber/10 border-cahs-amber/20">
            <Text
              variant="body"
              className="text-cahs-charcoal dark:text-cahs-dark-text mb-4 leading-relaxed"
              style={{ fontStyle: 'italic' }}
            >
              "{prompt}"
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(tabs)/express')}
            >
              Open journal
            </Button>
          </Card>
        </View>

        {/* Library */}
        {libraryItems.length > 0 && (
          <View className="mt-8">
            <View className="flex-row items-center justify-between px-5 mb-3">
              <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted">
                From the library
              </Text>
            </View>
            <FlatList
              data={libraryItems}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({ pathname: '/content/[id]', params: { id: item.id } })
                  }
                  className="w-56 bg-white dark:bg-cahs-dark-surface rounded-2xl p-4 border border-cahs-border dark:border-cahs-dark-elevated active:opacity-80"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
                >
                  <View className="bg-cahs-amber-light dark:bg-cahs-amber/10 px-2 py-1 rounded-full self-start mb-3">
                    <Text className="text-cahs-amber text-xs" style={{ fontWeight: '600' }}>
                      {item.type}
                    </Text>
                  </View>
                  {item.title && (
                    <Text variant="h3" className="mb-2 leading-snug" numberOfLines={2}>
                      {item.title}
                    </Text>
                  )}
                  <Text
                    variant="caption"
                    className="text-cahs-stone dark:text-cahs-dark-muted leading-relaxed"
                    numberOfLines={3}
                  >
                    {item.body}
                  </Text>
                  <Text variant="micro" className="text-cahs-ash mt-3">
                    {Math.ceil(item.reading_time_seconds / 60)} min read
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
