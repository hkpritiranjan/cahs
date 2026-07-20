import React from 'react';
import { Pressable, ActivityIndicator, View } from 'react-native';
import { Text } from './Text';

type Variant = 'primary' | 'ghost' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: string;
  className?: string;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-cahs-amber active:bg-cahs-amber-hover',
    text: 'text-white font-dm-sans-semibold',
  },
  ghost: {
    container: 'bg-transparent border border-cahs-amber active:bg-cahs-amber-light dark:active:bg-cahs-amber/10',
    text: 'text-cahs-amber font-dm-sans-semibold',
  },
  secondary: {
    container: 'bg-cahs-warm-gray dark:bg-cahs-dark-elevated active:bg-cahs-border',
    text: 'text-cahs-charcoal dark:text-cahs-dark-text font-dm-sans-medium',
  },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-4 py-2 rounded-lg min-h-[36px]', text: 'text-sm' },
  md: { container: 'px-6 py-3.5 rounded-xl min-h-[48px]', text: 'text-base' },
  lg: { container: 'px-8 py-4 rounded-2xl min-h-[56px]', text: 'text-lg' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  children,
  className = '',
}: ButtonProps) {
  const vs = variantStyles[variant];
  const ss = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${vs.container} ${ss.container} ${isDisabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#C47B47'} size="small" />
      ) : (
        <Text variant="body" className={`${vs.text} ${ss.text}`}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
