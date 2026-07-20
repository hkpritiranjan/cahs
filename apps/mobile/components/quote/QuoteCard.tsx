import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

interface QuoteCardProps {
  quote: {
    body: string;
    author: string;
    tags: string[];
  };
  onBookmark: () => void;
  isBookmarked: boolean;
}

export function QuoteCard({ quote, onBookmark, isBookmarked }: QuoteCardProps) {
  return (
    <View className="rounded-2xl overflow-hidden bg-cahs-warm-gray dark:bg-cahs-dark-surface border border-cahs-border dark:border-cahs-dark-elevated"
      style={{ shadowColor: '#C47B47', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
      {/* amber top border accent */}
      <View className="h-1 bg-cahs-amber rounded-t-2xl" />
      <View className="p-6">
        {/* header row */}
        <View className="flex-row justify-between items-start mb-4">
          <Text className="text-cahs-amber text-5xl font-dm-serif leading-none opacity-60">"</Text>
          <Pressable
            onPress={onBookmark}
            className="w-10 h-10 items-center justify-center rounded-full bg-cahs-cream dark:bg-cahs-dark-elevated"
            hitSlop={8}
          >
            <Text className={`text-xl ${isBookmarked ? 'text-cahs-amber' : 'text-cahs-ash'}`}>
              {isBookmarked ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        {/* quote body — the most important element */}
        <Text
          className="font-dm-serif-italic text-2xl leading-relaxed text-cahs-charcoal dark:text-cahs-dark-text mb-5"
          style={{ fontStyle: 'italic' }}
        >
          {quote.body}
        </Text>

        {/* author + tag */}
        <View className="flex-row items-center justify-between">
          <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
            — {quote.author}
          </Text>
          {quote.tags[0] && (
            <View className="bg-cahs-amber-light dark:bg-cahs-amber/10 px-3 py-1 rounded-full">
              <Text className="text-cahs-amber text-xs font-dm-sans-semibold capitalize">
                {quote.tags[0]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
