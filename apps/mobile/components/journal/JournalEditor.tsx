import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, Pressable, Animated } from 'react-native';
import { Text } from '../ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface JournalEditorProps {
  initialValue?: string;
  prompt?: string | null;
  onSave: (body: string) => Promise<void>;
  saving?: boolean;
  placeholder?: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function JournalEditor({
  initialValue = '',
  prompt = null,
  onSave,
  saving = false,
  placeholder = "What's on your mind today?",
}: JournalEditorProps) {
  const [body, setBody] = useState(initialValue);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<'idle' | 'saving' | 'saved'>('idle');
  const insets = useSafeAreaInsets();

  // Debounced auto-save
  useEffect(() => {
    if (!body.trim() || body === initialValue) return;
    const timer = setTimeout(async () => {
      setSaveIndicator('saving');
      await onSave(body);
      setSaveIndicator('saved');
      setTimeout(() => setSaveIndicator('idle'), 2000);
    }, 1500);
    return () => clearTimeout(timer);
  }, [body]);

  const wordCount = countWords(body);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg"
      style={{ paddingBottom: insets.bottom }}
    >
      {/* Prompt */}
      {prompt && !promptDismissed && (
        <View className="mx-5 mt-4 mb-2 flex-row items-start justify-between">
          <Text
            className="flex-1 font-dm-serif-italic text-base text-cahs-stone dark:text-cahs-dark-muted mr-3 leading-relaxed"
            style={{ fontStyle: 'italic' }}
          >
            {prompt}
          </Text>
          <Pressable onPress={() => setPromptDismissed(true)} hitSlop={8} className="mt-1">
            <Text className="text-cahs-ash text-lg">×</Text>
          </Pressable>
        </View>
      )}

      {/* Writing area */}
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder={promptDismissed ? placeholder : ''}
        placeholderTextColor="#C8C0B8"
        multiline
        textAlignVertical="top"
        autoFocus
        className="flex-1 px-5 pt-4 pb-2 font-dm-sans text-base leading-relaxed text-cahs-charcoal dark:text-cahs-dark-text"
        style={{ fontSize: 16, lineHeight: 26 }}
        scrollEnabled
      />

      {/* Bottom meta row */}
      <View className="flex-row justify-between items-center px-5 py-3 border-t border-cahs-border dark:border-cahs-dark-elevated">
        <Text variant="micro" className="text-cahs-ash dark:text-cahs-dark-muted">
          {saveIndicator === 'saving' ? 'Saving…' : saveIndicator === 'saved' ? 'Saved' : ''}
        </Text>
        <Text variant="micro" className="text-cahs-ash dark:text-cahs-dark-muted">
          {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : ''}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
