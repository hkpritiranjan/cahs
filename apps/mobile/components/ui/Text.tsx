import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyLarge' | 'caption' | 'label' | 'micro';

interface CahsTextProps extends RNTextProps {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  display: 'font-dm-serif text-4xl leading-tight text-cahs-charcoal dark:text-cahs-dark-text',
  h1: 'font-dm-serif text-3xl leading-tight text-cahs-charcoal dark:text-cahs-dark-text',
  h2: 'font-dm-serif text-2xl leading-snug text-cahs-charcoal dark:text-cahs-dark-text',
  h3: 'font-dm-sans-semibold text-base leading-snug text-cahs-charcoal dark:text-cahs-dark-text',
  bodyLarge: 'font-dm-sans text-lg leading-relaxed text-cahs-charcoal dark:text-cahs-dark-text',
  body: 'font-dm-sans text-base leading-relaxed text-cahs-charcoal dark:text-cahs-dark-text',
  caption: 'font-dm-sans text-sm leading-normal text-cahs-stone dark:text-cahs-dark-muted',
  label: 'font-dm-sans-semibold text-xs uppercase tracking-widest text-cahs-stone dark:text-cahs-dark-muted',
  micro: 'font-dm-sans text-xs text-cahs-stone dark:text-cahs-dark-muted',
};

export const Text = React.forwardRef<RNText, CahsTextProps>(
  ({ variant = 'body', className = '', style, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        style={style}
        {...(props as RNTextProps)}
      />
    );
  }
);

Text.displayName = 'Text';
