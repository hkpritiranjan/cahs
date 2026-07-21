import React from 'react';
import { Pressable, View, StyleProp, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  noPad?: boolean;
  style?: StyleProp<ViewStyle>;
}

const shadow: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 2,
};

export function Card({ children, onPress, className = '', noPad = false, style }: CardProps) {
  const base = `bg-white dark:bg-cahs-dark-surface rounded-2xl border border-cahs-border dark:border-cahs-dark-elevated ${noPad ? '' : 'p-5'} ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${base} active:opacity-80`}
        style={[shadow, style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} style={[shadow, style]}>
      {children}
    </View>
  );
}
