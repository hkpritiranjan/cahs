import { useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../components/ui/Text';
import { useAuthStore } from '../store/auth';
import { scheduleReminders, cancelReminders, DISPLAY_TO_DB, dbTimeToDisplay } from '../lib/notifications';

const AVATARS = ['🌿', '🌸', '🌊', '🌙', '☀️', '🍃', '🌻', '⭐'] as const;
const MORNING_TIMES = ['7am', '8am', '9am'] as const;
const EVENING_TIMES = ['8pm', '9pm', '10pm'] as const;

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-2 rounded-full border"
      style={{
        borderColor: selected ? '#C47B47' : '#E8E0D8',
        backgroundColor: selected ? '#FDF3E8' : 'transparent',
      }}
    >
      <Text
        variant="caption"
        style={{ color: selected ? '#C47B47' : '#8A8078', fontWeight: selected ? '600' : '400' }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3 mt-6">
      {title}
    </Text>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useAuthStore();

  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [avatar, setAvatar] = useState(profile?.avatar_emoji ?? '🌿');
  const [morningTime, setMorningTime] = useState<string | null>(
    dbTimeToDisplay(profile?.notification_time_morning ?? null),
  );
  const [eveningTime, setEveningTime] = useState<string | null>(
    dbTimeToDisplay(profile?.notification_time_evening ?? null),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty =
    firstName !== profile?.first_name ||
    avatar !== profile?.avatar_emoji ||
    morningTime !== dbTimeToDisplay(profile?.notification_time_morning ?? null) ||
    eveningTime !== dbTimeToDisplay(profile?.notification_time_evening ?? null);

  const handleSave = async () => {
    if (!firstName.trim()) return;
    setSaving(true);

    const morningDb = morningTime ? DISPLAY_TO_DB[morningTime] : profile?.notification_time_morning ?? '08:00';
    const eveningDb = eveningTime ? DISPLAY_TO_DB[eveningTime] : null;

    const { error } = await updateProfile({
      first_name: firstName.trim(),
      avatar_emoji: avatar,
      notification_time_morning: morningDb,
      notification_time_evening: eveningDb,
    });

    if (!error) {
      if (morningDb) {
        await scheduleReminders(morningDb, eveningDb);
      } else {
        await cancelReminders();
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }

    setSaving(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await cancelReminders();
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />

      {/* Nav */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
        <Pressable onPress={() => router.back()} hitSlop={8} className="w-10 h-10 justify-center">
          <Text className="text-cahs-stone text-2xl">←</Text>
        </Pressable>
        <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted">
          Profile & Settings
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!isDirty || saving}
          hitSlop={8}
          className="h-10 px-3 justify-center"
        >
          {saving ? (
            <ActivityIndicator size="small" color="#C47B47" />
          ) : (
            <Text
              className="text-sm"
              style={{
                fontWeight: '600',
                color: saved ? '#6DA06F' : isDirty ? '#C47B47' : '#C8C0B8',
              }}
            >
              {saved ? 'Saved ✓' : 'Save'}
            </Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        {/* Avatar */}
        <SectionHeader title="Your avatar" />
        <View className="flex-row flex-wrap gap-3">
          {AVATARS.map((emoji) => (
            <Pressable
              key={emoji}
              onPress={() => setAvatar(emoji)}
              className="w-14 h-14 items-center justify-center rounded-2xl border"
              style={{
                borderColor: avatar === emoji ? '#C47B47' : '#E8E0D8',
                backgroundColor: avatar === emoji ? '#FDF3E8' : 'transparent',
              }}
            >
              <Text style={{ fontSize: 28 }}>{emoji}</Text>
            </Pressable>
          ))}
        </View>

        {/* Name */}
        <SectionHeader title="Your name" />
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          placeholderTextColor="#C8C0B8"
          autoCapitalize="words"
          className="bg-white dark:bg-cahs-dark-surface rounded-xl px-4 py-3 font-dm-sans text-base text-cahs-charcoal dark:text-cahs-dark-text border border-cahs-border dark:border-cahs-dark-elevated"
          style={{ fontSize: 16 }}
        />

        {/* Notifications */}
        <SectionHeader title="Morning reminder" />
        <View className="flex-row gap-3">
          {MORNING_TIMES.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={morningTime === t}
              onPress={() => setMorningTime(morningTime === t ? null : t)}
            />
          ))}
        </View>
        <Text variant="micro" className="text-cahs-ash mt-2">
          {morningTime ? `Daily at ${morningTime} — quote & reflection` : 'No morning reminder'}
        </Text>

        <SectionHeader title="Evening reminder" />
        <View className="flex-row gap-3">
          {EVENING_TIMES.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={eveningTime === t}
              onPress={() => setEveningTime(eveningTime === t ? null : t)}
            />
          ))}
        </View>
        <Text variant="micro" className="text-cahs-ash mt-2">
          {eveningTime ? `Daily at ${eveningTime} — mood check-in prompt` : 'No evening reminder'}
        </Text>

        {/* Account */}
        <SectionHeader title="Account" />
        <View className="bg-white dark:bg-cahs-dark-surface rounded-xl border border-cahs-border dark:border-cahs-dark-elevated overflow-hidden">
          <View className="px-4 py-3 border-b border-cahs-border dark:border-cahs-dark-elevated">
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
              {profile?.subscription_status === 'free' ? 'Free plan' : 'Founding member ✦'}
            </Text>
          </View>
          <Pressable
            onPress={handleSignOut}
            className="px-4 py-3 active:bg-cahs-warm-gray dark:active:bg-cahs-dark-elevated"
          >
            <Text variant="body" style={{ color: '#E07060' }}>
              Sign out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
