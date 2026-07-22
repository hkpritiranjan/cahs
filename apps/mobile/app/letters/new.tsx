import { useState, useRef } from 'react';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { useLettersStore } from '../../store/letters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewLetterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { saveLetter } = useLettersStore();

  const [addressedTo, setAddressedTo] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const bodyRef = useRef<TextInput>(null);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const canSave = body.trim().length > 0;

  const handleSeal = async () => {
    if (!canSave) return;
    setSaving(true);
    const { error } = await saveLetter({ addressed_to: addressedTo, body });
    setSaving(false);
    if (!error) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Pressable onPress={() => router.back()} hitSlop={8} className="w-10 h-10 justify-center">
          <Text className="text-cahs-stone text-2xl">←</Text>
        </Pressable>
        <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted">
          Unsent letter
        </Text>
        <Pressable
          onPress={handleSeal}
          disabled={!canSave || saving}
          hitSlop={8}
          className="h-10 px-4 justify-center"
        >
          {saving ? (
            <ActivityIndicator size="small" color="#C47B47" />
          ) : (
            <Text
              className={`font-dm-sans-semibold text-sm ${canSave ? 'text-cahs-amber' : 'text-cahs-ash'}`}
            >
              Seal & keep
            </Text>
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ paddingBottom: insets.bottom }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        >
          {/* Dear [name] line */}
          <View className="flex-row items-baseline mb-6">
            <Text
              variant="bodyLarge"
              className="text-cahs-charcoal dark:text-cahs-dark-text mr-2"
              style={{ fontStyle: 'italic' }}
            >
              Dear
            </Text>
            <TextInput
              value={addressedTo}
              onChangeText={setAddressedTo}
              placeholder="someone…"
              placeholderTextColor="#C8C0B8"
              returnKeyType="next"
              onSubmitEditing={() => bodyRef.current?.focus()}
              className="flex-1 font-dm-sans text-lg text-cahs-charcoal dark:text-cahs-dark-text border-b border-cahs-border dark:border-cahs-dark-elevated pb-1"
              style={{ fontStyle: 'italic', fontSize: 18 }}
            />
          </View>

          {/* Letter body */}
          <TextInput
            ref={bodyRef}
            value={body}
            onChangeText={setBody}
            placeholder="Write what you've been unable to say…"
            placeholderTextColor="#C8C0B8"
            multiline
            textAlignVertical="top"
            autoFocus={false}
            className="flex-1 font-dm-sans text-base text-cahs-charcoal dark:text-cahs-dark-text"
            style={{ fontSize: 16, lineHeight: 28, minHeight: 300 }}
          />
        </ScrollView>

        {/* Footer */}
        <View className="flex-row justify-between items-center px-5 py-3 border-t border-cahs-border dark:border-cahs-dark-elevated">
          <Text variant="micro" className="text-cahs-ash dark:text-cahs-dark-muted" style={{ fontStyle: 'italic' }}>
            Only you can read this.
          </Text>
          <Text variant="micro" className="text-cahs-ash dark:text-cahs-dark-muted">
            {wordCount > 0 ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : ''}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
