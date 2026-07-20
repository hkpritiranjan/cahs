import { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { useContentStore } from '../../store/content';
import { supabase } from '../../lib/supabase';

interface ContentPiece {
  id: string;
  type: string;
  title: string | null;
  body: string;
  author: string;
  tags: string[];
  reading_time_seconds: number;
}

export default function ContentReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { bookmarkedIds, toggleBookmark } = useContentStore();
  const [piece, setPiece] = useState<ContentPiece | null>(null);

  useEffect(() => {
    supabase
      .from('content_pieces')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setPiece(data));
  }, [id]);

  if (!piece) return null;

  const isBookmarked = bookmarkedIds.has(piece.id);
  const readingMins = Math.ceil(piece.reading_time_seconds / 60);

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Nav */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Pressable onPress={() => router.back()} hitSlop={8} className="w-10 h-10 justify-center">
          <Text className="text-cahs-stone text-2xl">←</Text>
        </Pressable>
        <Pressable
          onPress={() => toggleBookmark(piece.id, piece.type as any)}
          hitSlop={8}
          className="w-10 h-10 items-center justify-center"
        >
          <Text className={`text-2xl ${isBookmarked ? 'text-cahs-amber' : 'text-cahs-ash'}`}>
            {isBookmarked ? '♥' : '♡'}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
      >
        {/* Meta */}
        <View className="flex-row items-center gap-3 mb-6">
          <View className="bg-cahs-amber-light dark:bg-cahs-amber/10 px-3 py-1 rounded-full">
            <Text className="text-cahs-amber text-xs font-dm-sans-semibold capitalize">
              {piece.type}
            </Text>
          </View>
          <Text variant="micro" className="text-cahs-ash">
            {readingMins} min read
          </Text>
        </View>

        {/* Title */}
        {piece.title && (
          <Text variant="h1" className="mb-6">
            {piece.title}
          </Text>
        )}

        {/* Body */}
        <Text
          variant="bodyLarge"
          className="text-cahs-charcoal dark:text-cahs-dark-text leading-loose"
          style={{ lineHeight: 30 }}
        >
          {piece.body}
        </Text>

        {/* Author */}
        <View className="mt-10 pt-6 border-t border-cahs-border dark:border-cahs-dark-elevated">
          <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
            — {piece.author}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
