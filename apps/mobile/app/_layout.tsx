import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-display';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/auth';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, profile, initialized, setSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  // Listen to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hide splash screen once fonts are ready and auth is initialized
  useEffect(() => {
    if ((fontsLoaded || fontError) && initialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, initialized]);

  // Auth guard — redirect based on session + onboarding state
  useEffect(() => {
    if (!initialized || (!fontsLoaded && !fontError)) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (
      session &&
      profile &&
      !profile.onboarding_complete &&
      segments[1] !== 'onboarding'
    ) {
      router.replace('/(auth)/onboarding');
    } else if (session && profile?.onboarding_complete && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, profile, initialized, fontsLoaded]);

  if (!fontsLoaded && !fontError) return null;
  if (!initialized) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
    </Stack>
  );
}
