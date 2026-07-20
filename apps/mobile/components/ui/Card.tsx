import React from 'react';
import { Pressable, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  noPad?: boolean;
}

export function Card({ children, onPress, className = '', noPad = false, style, ...props }: CardProps) {
  const base = `bg-white dark:bg-cahs-dark-surface rounded-2xl border border-cahs-border dark:border-cahs-dark-elevated ${noPad ? '' : 'p-5'} ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${base} active:opacity-80`}
        style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }, style as any]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      className={base}
      style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }, style as any]}
      {...props}
    >
      {children}
    </View>
  );
}
