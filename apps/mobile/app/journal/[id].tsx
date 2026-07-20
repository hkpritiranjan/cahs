import { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { JournalEditor } from '../../components/journal/JournalEditor';
import { useJournalStore } from '../../store/journal';

export default function EditJournalEntry() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, updateEntry, saving } = useJournalStore();
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg items-center justify-center">
        <Text variant="caption" className="text-cahs-stone">Entry not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSave = async (body: string) => {
    await updateEntry(id, body);
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
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
        initialValue={entry.body}
        prompt={entry.prompt_used}
        onSave={handleSave}
        saving={saving}
      />
    </SafeAreaView>
  );
}
