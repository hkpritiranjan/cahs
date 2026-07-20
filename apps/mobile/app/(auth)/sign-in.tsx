import { useState } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth';
import { StatusBar } from 'expo-status-bar';

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, loading } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    const fn = mode === 'signin' ? signInWithEmail : signUpWithEmail;
    const { error: authError } = await fn(email.trim(), password);
    if (authError) {
      setError(authError);
    }
    // On success the auth store sets session and the root layout redirects automatically.
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
        >
          <View className="flex-1 px-6 pt-4">
            {/* Back button */}
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
              hitSlop={8}
            >
              <Text className="text-cahs-stone text-2xl">←</Text>
            </Pressable>

            {/* Heading */}
            <View className="mt-10 mb-10">
              <Text variant="h1" className="mb-2">
                {mode === 'signin' ? 'Welcome back.' : 'Join CAHS.'}
              </Text>
              <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
                {mode === 'signin'
                  ? 'Your journal is waiting.'
                  : 'A private space, just for you.'}
              </Text>
            </View>

            {/* Form fields */}
            <View className="gap-3">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#C8C0B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                className="bg-cahs-warm-gray dark:bg-cahs-dark-surface border border-cahs-border dark:border-cahs-dark-elevated rounded-xl px-4 py-3.5 text-base font-dm-sans text-cahs-charcoal dark:text-cahs-dark-text"
                style={{ fontSize: 16, minHeight: 52 }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#C8C0B8"
                secureTextEntry
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                returnKeyType="done"
                className="bg-cahs-warm-gray dark:bg-cahs-dark-surface border border-cahs-border dark:border-cahs-dark-elevated rounded-xl px-4 py-3.5 text-base font-dm-sans text-cahs-charcoal dark:text-cahs-dark-text"
                style={{ fontSize: 16, minHeight: 52 }}
                onSubmitEditing={handleSubmit}
              />
            </View>

            {/* Inline error */}
            {error ? (
              <Text variant="caption" className="text-cahs-overwhelmed mt-3">
                {error}
              </Text>
            ) : null}

            {/* Submit button */}
            <Button
              size="lg"
              loading={loading}
              onPress={handleSubmit}
              className="mt-6"
            >
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>

            {/* Toggle mode */}
            <Pressable
              onPress={() => {
                setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
                setError(null);
              }}
              className="items-center mt-5 py-3"
            >
              <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <Text variant="caption" className="text-cahs-amber font-dm-sans-semibold">
                  {mode === 'signin' ? 'Create one' : 'Sign in'}
                </Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
