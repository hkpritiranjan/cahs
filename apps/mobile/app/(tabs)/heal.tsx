import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { useMoodStore } from '../../store/mood';
import { useEffect } from 'react';

const MOOD_LABELS: Record<string, string> = {
  peaceful: '🌿 Peaceful',
  okay: '🌤 Okay',
  unsettled: '🌊 Unsettled',
  heavy: '🌧 Heavy',
  overwhelmed: '🌪 Overwhelmed',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HealScreen() {
  const { history, currentStreak, fetchHistory, loading } = useMoodStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const last7 = history.slice(0, 7);

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <Text variant="label" className="text-cahs-amber mb-1">
            Heal
          </Text>
          <Text variant="h2">Your journey</Text>
        </View>

        {/* Streak card */}
        <View className="px-5 mb-5">
          <Card className="bg-cahs-amber-light dark:bg-cahs-amber/10 border-cahs-amber/20">
            <View className="items-center py-2">
              <Text className="text-5xl mb-2">
                {currentStreak > 0 ? '🔥' : '🌱'}
              </Text>
              <Text
                variant="display"
                className="text-cahs-amber"
                style={{ fontSize: 48, lineHeight: 56 }}
              >
                {currentStreak}
              </Text>
              <Text variant="body" className="text-cahs-stone dark:text-cahs-dark-muted mt-1">
                {currentStreak === 1
                  ? 'day showing up'
                  : currentStreak > 1
                  ? 'days showing up'
                  : 'Start your streak today'}
              </Text>
              {currentStreak > 0 && (
                <Text
                  variant="caption"
                  className="text-cahs-stone dark:text-cahs-dark-muted mt-2 text-center"
                >
                  Every check-in is an act of self-awareness.{'\n'}That's worth something.
                </Text>
              )}
            </View>
          </Card>
        </View>

        {/* Mood history */}
        {last7.length > 0 && (
          <View className="px-5 mb-5">
            <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
              Recent check-ins
            </Text>
            {last7.map((item) => (
              <Card key={item.id} className="mb-2">
                <View className="flex-row justify-between items-center">
                  <Text variant="body" className="text-cahs-charcoal dark:text-cahs-dark-text">
                    {MOOD_LABELS[item.mood_state] ?? item.mood_state}
                  </Text>
                  <Text variant="micro" className="text-cahs-ash">
                    {formatDate(item.checked_at)}
                  </Text>
                </View>
                {item.note && (
                  <Text
                    variant="caption"
                    className="text-cahs-stone dark:text-cahs-dark-muted mt-1"
                    numberOfLines={2}
                  >
                    {item.note}
                  </Text>
                )}
              </Card>
            ))}
          </View>
        )}

        {/* Coming soon: Healing Journeys */}
        <View className="px-5">
          <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
            Coming soon
          </Text>
          <Card className="opacity-60">
            <Text variant="h3" className="mb-1">
              🗺 Healing Journeys
            </Text>
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
              Guided multi-day programs for heartbreak, anxiety, and growth. Launching in Phase 2.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
