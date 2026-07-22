import { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { useLettersStore } from '../../store/letters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function LetterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { letters, updateLetter, deleteLetter } = useLettersStore();

  const letter = letters.find((l) => l.id === id);

  const [editing, setEditing] = useState(false);
  const [addressedTo, setAddressedTo] = useState(letter?.addressed_to ?? '');
  const [body, setBody] = useState(letter?.body ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (letter) {
      setAddressedTo(letter.addressed_to ?? '');
      setBody(letter.body);
    }
  }, [letter]);

  if (!letter) return null;

  const handleSave = async () => {
    setSaving(true);
    await updateLetter(id, { addressed_to: addressedTo.trim() || null, body });
    setSaving(false);
    setEditing(false);
  };

  const handleLetGo = () => {
    Alert.alert(
      'Let it go',
      'Archiving this letter means it's still safely kept, but you won't see it in your main list. This can be a small act of release.',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Let it go',
          onPress: async () => {
            await updateLetter(id, { status: 'archived' });
            router.back();
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete forever',
      'This letter will be permanently removed. There is no undo.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteLetter(id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Pressable onPress={() => { editing ? setEditing(false) : router.back(); }} hitSlop={8} className="w-10 h-10 justify-center">
          <Text className="text-cahs-stone text-2xl">{editing ? '✕' : '←'}</Text>
        </Pressable>
        <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted">
          {formatDate(letter.created_at)}
        </Text>
        {editing ? (
          <Pressable onPress={handleSave} disabled={saving} hitSlop={8} className="h-10 px-4 justify-center">
            {saving ? (
              <ActivityIndicator size="small" color="#C47B47" />
            ) : (
              <Text className="font-dm-sans-semibold text-sm text-cahs-amber">Save</Text>
            )}
          </Pressable>
        ) : (
          <Pressable onPress={() => setEditing(true)} hitSlop={8} className="h-10 px-4 justify-center">
            <Text className="font-dm-sans-semibold text-sm text-cahs-stone dark:text-cahs-dark-muted">Edit</Text>
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ paddingBottom: insets.bottom }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Dear [name] */}
          <View className="flex-row items-baseline mb-6">
            <Text
              variant="bodyLarge"
              className="text-cahs-charcoal dark:text-cahs-dark-text mr-2"
              style={{ fontStyle: 'italic' }}
            >
              Dear
            </Text>
            {editing ? (
              <TextInput
                value={addressedTo}
                onChangeText={setAddressedTo}
                placeholder="someone…"
                placeholderTextColor="#C8C0B8"
                className="flex-1 font-dm-sans text-lg text-cahs-charcoal dark:text-cahs-dark-text border-b border-cahs-border dark:border-cahs-dark-elevated pb-1"
                style={{ fontStyle: 'italic', fontSize: 18 }}
              />
            ) : (
              <Text
                variant="bodyLarge"
                className="text-cahs-charcoal dark:text-cahs-dark-text"
                style={{ fontStyle: 'italic' }}
              >
                {letter.addressed_to ?? 'someone'}
              </Text>
            )}
          </View>

          {/* Body */}
          {editing ? (
            <TextInput
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              autoFocus
              className="flex-1 font-dm-sans text-base text-cahs-charcoal dark:text-cahs-dark-text"
              style={{ fontSize: 16, lineHeight: 28, minHeight: 300 }}
            />
          ) : (
            <Text
              variant="bodyLarge"
              className="text-cahs-charcoal dark:text-cahs-dark-text"
              style={{ lineHeight: 28 }}
            >
              {letter.body}
            </Text>
          )}
        </ScrollView>

        {/* Footer actions — only in read mode */}
        {!editing && (
          <View className="flex-row justify-between items-center px-5 py-4 border-t border-cahs-border dark:border-cahs-dark-elevated">
            <Pressable onPress={handleLetGo} hitSlop={8}>
              <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
                Let it go ✦
              </Text>
            </Pressable>
            <Pressable onPress={handleDelete} hitSlop={8}>
              <Text variant="caption" className="text-red-400">
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
