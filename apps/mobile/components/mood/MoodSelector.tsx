import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '../ui/Text';

type MoodState = 'peaceful' | 'okay' | 'unsettled' | 'heavy' | 'overwhelmed';

const MOODS: { state: MoodState; emoji: string; label: string; color: string }[] = [
  { state: 'peaceful', emoji: '🌿', label: 'Peaceful', color: '#6B9E7A' },
  { state: 'okay', emoji: '🌤', label: 'Okay', color: '#C47B47' },
  { state: 'unsettled', emoji: '🌊', label: 'Unsettled', color: '#5A80C8' },
  { state: 'heavy', emoji: '🌧', label: 'Heavy', color: '#7A6080' },
  { state: 'overwhelmed', emoji: '🌪', label: 'Overwhelmed', color: '#C0544A' },
];

interface MoodSelectorProps {
  selected: MoodState | null;
  onSelect: (mood: MoodState) => void;
  disabled?: boolean;
}

export function MoodSelector({ selected, onSelect, disabled = false }: MoodSelectorProps) {
  return (
    <View className="flex-row justify-between gap-2">
      {MOODS.map((mood) => {
        const isSelected = selected === mood.state;
        return (
          <Pressable
            key={mood.state}
            onPress={() => !disabled && onSelect(mood.state)}
            disabled={disabled}
            className={`flex-1 items-center py-3 px-1 rounded-xl border-2 min-h-[72px] justify-center
              ${isSelected
                ? 'bg-cahs-amber-light dark:bg-cahs-amber/10 border-cahs-amber'
                : 'bg-cahs-warm-gray dark:bg-cahs-dark-elevated border-transparent'
              } ${disabled ? 'opacity-60' : 'active:opacity-80'}`}
          >
            <Text className="text-2xl mb-1">{mood.emoji}</Text>
            <Text
              className={`text-center font-dm-sans text-xs leading-tight
                ${isSelected ? 'text-cahs-amber font-dm-sans-semibold' : 'text-cahs-stone dark:text-cahs-dark-muted'}`}
            >
              {mood.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
