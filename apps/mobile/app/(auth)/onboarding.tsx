import { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  Pressable,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { StatusBar } from 'expo-status-bar';

// ─── Data ────────────────────────────────────────────────────────────────────

const REASONS = [
  { label: 'Heartbreak', emoji: '💔' },
  { label: 'Loneliness', emoji: '🌙' },
  { label: 'Anxiety', emoji: '🌊' },
  { label: 'Growth', emoji: '🌱' },
  { label: 'Creativity', emoji: '✍️' },
  { label: 'Something else', emoji: '✨' },
] as const;

const AVATARS = ['🌿', '🌸', '🌊', '🌙', '☀️', '🍃', '🌻', '⭐'] as const;

const MORNING_TIMES = ['7am', '8am', '9am'] as const;
const EVENING_TIMES = ['8pm', '9pm', '10pm'] as const;

type Reason = (typeof REASONS)[number]['label'];
type Avatar = (typeof AVATARS)[number];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className="rounded-full"
          style={{
            width: i === current - 1 ? 20 : 8,
            height: 8,
            backgroundColor:
              i < current
                ? '#C47B47' // cahs-amber
                : '#E8E0D8', // soft neutral
          }}
        />
      ))}
    </View>
  );
}

function StepHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-8">
      <Text
        variant="display"
        className="text-cahs-charcoal dark:text-cahs-dark-text mb-3 leading-tight"
        style={{ fontSize: 30, lineHeight: 38 }}
      >
        {title}
      </Text>
      <Text variant="body" className="text-cahs-stone dark:text-cahs-dark-muted leading-relaxed">
        {subtitle}
      </Text>
    </View>
  );
}

function TimeChip({
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
      className="rounded-2xl px-5 py-3 border"
      style={{
        borderColor: selected ? '#C47B47' : '#E8E0D8',
        backgroundColor: selected ? '#FDF3E8' : 'transparent',
      }}
    >
      <Text
        variant="body"
        style={{
          color: selected ? '#C47B47' : '#8A8078',
          fontWeight: selected ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, loading } = useAuthStore();

  // Shared state across steps
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [reason, setReason] = useState<Reason | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [morningTime, setMorningTime] = useState<string | null>(null);
  const [eveningTime, setEveningTime] = useState<string | null>(null);

  // Fade transition between steps
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const transitionTo = (nextStep: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleContinue = async () => {
    if (step < 4) {
      transitionTo(step + 1);
      return;
    }

    // Step 4 — save and navigate
    if (!reason || !avatar) return;
    const { error } = await updateProfile({
      first_name: firstName.trim(),
      onboarding_reason: reason,
      avatar_emoji: avatar,
      notification_time_morning: morningTime ?? '08:00',
      notification_time_evening: eveningTime,
      onboarding_complete: true,
    });

    if (!error) {
      router.replace('/(tabs)');
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return firstName.trim().length > 0;
      case 2:
        return reason !== null;
      case 3:
        return avatar !== null;
      case 4:
        return true; // reminder is optional
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-8 pb-10">
            {/* Progress indicator */}
            <ProgressDots total={4} current={step} />

            {/* Step content — fades on transition */}
            <Animated.View style={{ opacity: fadeAnim }} className="flex-1">
              {step === 1 && (
                <Step1
                  firstName={firstName}
                  onChange={setFirstName}
                />
              )}
              {step === 2 && (
                <Step2
                  selected={reason}
                  onSelect={setReason}
                />
              )}
              {step === 3 && (
                <Step3
                  selected={avatar}
                  onSelect={setAvatar}
                />
              )}
              {step === 4 && (
                <Step4
                  morningTime={morningTime}
                  eveningTime={eveningTime}
                  onSelectMorning={setMorningTime}
                  onSelectEvening={setEveningTime}
                />
              )}
            </Animated.View>

            {/* Spacer before CTA */}
            <View className="flex-1" />

            {/* Continue / finish button */}
            <View className="mt-8">
              <Button
                size="lg"
                disabled={!canContinue()}
                loading={step === 4 && loading}
                onPress={handleContinue}
              >
                {step === 4 ? 'Begin my journey' : 'Continue'}
              </Button>

              {step === 4 && (
                <Pressable onPress={() => router.replace('/(tabs)')} className="items-center mt-4 py-2">
                  <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
                    Skip for now
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Step 1: Name ─────────────────────────────────────────────────────────────

function Step1({
  firstName,
  onChange,
}: {
  firstName: string;
  onChange: (v: string) => void;
}) {
  return (
    <View>
      <StepHeading
        title="What should we call you?"
        subtitle="Just a first name is perfect — this is a space that's all yours."
      />
      <TextInput
        value={firstName}
        onChangeText={onChange}
        placeholder="Your name…"
        placeholderTextColor="#C8C0B8"
        autoFocus
        autoCapitalize="words"
        autoComplete="given-name"
        returnKeyType="done"
        className="text-cahs-charcoal dark:text-cahs-dark-text font-dm-serif"
        style={{
          fontSize: 32,
          lineHeight: 40,
          borderBottomWidth: 2,
          borderBottomColor: firstName.length > 0 ? '#C47B47' : '#E8E0D8',
          paddingVertical: 8,
          fontFamily: 'DMSerifDisplay_400Regular',
        }}
      />
    </View>
  );
}

// ─── Step 2: Reason ───────────────────────────────────────────────────────────

function Step2({
  selected,
  onSelect,
}: {
  selected: Reason | null;
  onSelect: (r: Reason) => void;
}) {
  return (
    <View>
      <StepHeading
        title="What brings you here?"
        subtitle="There's no wrong answer. Choose what resonates most right now."
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {REASONS.map(({ label, emoji }) => {
          const isSelected = selected === label;
          return (
            <Pressable
              key={label}
              onPress={() => onSelect(label)}
              style={{
                width: '47%',
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 16,
                borderWidth: 1.5,
                borderColor: isSelected ? '#C47B47' : '#E8E0D8',
                backgroundColor: isSelected ? '#FDF3E8' : 'transparent',
                alignItems: 'flex-start',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</Text>
              <Text
                variant="body"
                style={{
                  color: isSelected ? '#C47B47' : '#5C5248',
                  fontWeight: isSelected ? '600' : '400',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Step 3: Avatar ───────────────────────────────────────────────────────────

function Step3({
  selected,
  onSelect,
}: {
  selected: Avatar | null;
  onSelect: (a: Avatar) => void;
}) {
  return (
    <View>
      <StepHeading
        title="Choose your avatar."
        subtitle="Pick the one that feels like you today. You can always change it later."
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
        }}
      >
        {AVATARS.map((emoji) => {
          const isSelected = selected === emoji;
          return (
            <Pressable
              key={emoji}
              onPress={() => onSelect(emoji)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2.5,
                borderColor: isSelected ? '#C47B47' : 'transparent',
                backgroundColor: isSelected ? '#FDF3E8' : '#F0EBE4',
                shadowColor: isSelected ? '#C47B47' : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isSelected ? 0.25 : 0,
                shadowRadius: 8,
                elevation: isSelected ? 4 : 0,
              }}
            >
              <Text style={{ fontSize: 30 }}>{emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Step 4: Reminder time ────────────────────────────────────────────────────

function Step4({
  morningTime,
  eveningTime,
  onSelectMorning,
  onSelectEvening,
}: {
  morningTime: string | null;
  eveningTime: string | null;
  onSelectMorning: (t: string | null) => void;
  onSelectEvening: (t: string | null) => void;
}) {
  const toggleMorning = (t: string) =>
    onSelectMorning(morningTime === t ? null : t);

  const toggleEvening = (t: string) =>
    onSelectEvening(eveningTime === t ? null : t);

  return (
    <View>
      <StepHeading
        title="When would you like your daily reflection?"
        subtitle="A gentle nudge at the right moment can make all the difference. Totally optional."
      />

      {/* Morning */}
      <View className="mb-8">
        <View className="flex-row items-center gap-2 mb-4">
          <Text style={{ fontSize: 16 }}>🌅</Text>
          <Text variant="bodyLarge" className="text-cahs-charcoal dark:text-cahs-dark-text font-dm-sans-semibold">
            Morning
          </Text>
        </View>
        <View className="flex-row gap-3">
          {MORNING_TIMES.map((t) => (
            <TimeChip
              key={t}
              label={t}
              selected={morningTime === t}
              onPress={() => toggleMorning(t)}
            />
          ))}
        </View>
      </View>

      {/* Evening */}
      <View>
        <View className="flex-row items-center gap-2 mb-4">
          <Text style={{ fontSize: 16 }}>🌙</Text>
          <Text variant="bodyLarge" className="text-cahs-charcoal dark:text-cahs-dark-text font-dm-sans-semibold">
            Evening
          </Text>
        </View>
        <View className="flex-row gap-3">
          {EVENING_TIMES.map((t) => (
            <TimeChip
              key={t}
              label={t}
              selected={eveningTime === t}
              onPress={() => toggleEvening(t)}
            />
          ))}
        </View>
      </View>

      {/* Neither selected hint */}
      {!morningTime && !eveningTime && (
        <Text
          variant="caption"
          className="text-cahs-ash dark:text-cahs-dark-muted mt-6 leading-relaxed"
        >
          You can set this up later in Settings.
        </Text>
      )}
    </View>
  );
}
