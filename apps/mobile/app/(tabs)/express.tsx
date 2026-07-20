import { useState, useCallback } from 'react';
import { View, SafeAreaView, FlatList, Pressable, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { useJournalStore } from '../../store/journal';
import { useAuthStore } from '../../store/auth';

const DAILY_PROMPTS = [
  "What are you carrying today that you haven't been able to say out loud?",
  'What do you need to forgive yourself for right now?',
  'Write a letter to the version of you from one year ago.',
  'What are you most afraid to want?',
  'What would you say if you knew no one would ever read it?',
  'What does a good day look like for you right now?',
  "Who do you miss? What would you tell them if you could?",
  'What part of yourself have you been neglecting?',
];

function getDailyPrompt(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ExpressScreen() {
  const router = useRouter();
  const { entries, loading, fetchEntries, deleteEntry } = useJournalStore();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'journal' | 'letters'>('journal');
  const prompt = getDailyPrompt();

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete entry',
      'This entry will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEntry(id),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-6 pb-4 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Text variant="label" className="text-cahs-amber mb-1">
          Express
        </Text>
        <View className="flex-row items-center justify-between">
          <Text variant="h2">Your writing</Text>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/journal/new', params: { prompt } })
            }
            className="bg-cahs-amber rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-white text-2xl leading-none" style={{ marginTop: -2 }}>
              +
            </Text>
          </Pressable>
        </View>

        {/* Tab switcher */}
        <View className="flex-row mt-4 gap-4">
          {(['journal', 'letters'] as const).map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                variant="body"
                className={`capitalize pb-1 ${
                  activeTab === tab
                    ? 'text-cahs-amber font-dm-sans-semibold border-b-2 border-cahs-amber'
                    : 'text-cahs-stone dark:text-cahs-dark-muted'
                }`}
              >
                {tab === 'letters' ? 'Unsent letters' : tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Today's prompt banner */}
      <View className="mx-5 mt-4 px-4 py-3 bg-cahs-warm-gray dark:bg-cahs-dark-surface rounded-xl border-l-2 border-cahs-amber">
        <Text variant="micro" className="text-cahs-amber font-dm-sans-semibold mb-1">
          Today's prompt
        </Text>
        <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted" numberOfLines={2}>
          {prompt}
        </Text>
      </View>

      {/* Entries list */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-4xl mb-4">✍️</Text>
            <Text variant="h3" className="text-center mb-2">
              Your first entry is waiting
            </Text>
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted text-center">
              Tap + to start writing. Nobody else will ever read it.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            onPress={() =>
              router.push({ pathname: '/journal/[id]', params: { id: item.id } })
            }
            className="mb-3"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-3">
                <Text variant="caption" className="text-cahs-ash mb-1">
                  {formatDate(item.created_at)}
                </Text>
                {item.title && (
                  <Text variant="h3" className="mb-1" numberOfLines={1}>
                    {item.title}
                  </Text>
                )}
                <Text
                  variant="body"
                  className="text-cahs-stone dark:text-cahs-dark-muted leading-snug"
                  numberOfLines={2}
                >
                  {item.body}
                </Text>
              </View>
              <Pressable
                onPress={() => handleDelete(item.id)}
                hitSlop={8}
                className="w-8 h-8 items-center justify-center rounded-full"
              >
                <Text className="text-cahs-ash text-base">×</Text>
              </Pressable>
            </View>
            <Text variant="micro" className="text-cahs-ash mt-3">
              {item.word_count} word{item.word_count !== 1 ? 's' : ''}
            </Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
