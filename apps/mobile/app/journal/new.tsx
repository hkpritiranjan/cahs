import { useRef, useState } from 'react';
import { View, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { JournalEditor } from '../../components/journal/JournalEditor';
import { useJournalStore } from '../../store/journal';

export default function NewJournalEntry() {
  const { prompt } = useLocalSearchParams<{ prompt?: string }>();
  const router = useRouter();
  const { saveEntry, saving } = useJournalStore();
  const savedIdRef = useRef<string | null>(null);

  const handleSave = async (body: string) => {
    if (!body.trim()) return;
    if (savedIdRef.current) {
      // Already created — update instead (handled by JournalEditor auto-save chain)
      return;
    }
    const { id } = await saveEntry({
      body,
      prompt_used: prompt ?? undefined,
    });
    if (id) savedIdRef.current = id;
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Pressable onPress={() => router.back()} hitSlop={8} className="w-10 h-10 justify-center">
          <Text className="text-cahs-stone text-2xl">←</Text>
        </Pressable>
        <Text variant="label" className="text-cahs-amber">
          Journal
        </Text>
        <View className="w-10" />
      </View>

      <JournalEditor
        prompt={prompt ?? null}
        onSave={handleSave}
        saving={saving}
      />
    </SafeAreaView>
  );
}
