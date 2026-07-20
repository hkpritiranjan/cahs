import { useEffect, useRef } from 'react';
import { View, Animated, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <Animated.View style={{ opacity }} className="flex-1 px-8 justify-center">
        {/* Top spacer */}
        <View className="flex-1" />

        {/* Hero content */}
        <View className="items-center">
          {/* Amber accent dot */}
          <View className="w-2 h-2 rounded-full bg-cahs-amber mb-8 opacity-70" />

          <Text
            variant="display"
            className="text-center text-cahs-charcoal dark:text-cahs-dark-text mb-5 leading-tight"
            style={{ fontSize: 38, lineHeight: 46 }}
          >
            A place to feel heard.
          </Text>

          <Text
            variant="bodyLarge"
            className="text-center text-cahs-stone dark:text-cahs-dark-muted leading-relaxed"
            style={{ fontWeight: '300' }}
          >
            Express yourself. Heal slowly.{'\n'}Feel less alone.
          </Text>
        </View>

        {/* Bottom spacer */}
        <View className="flex-1" />

        {/* CTAs */}
        <View className="gap-3 mb-6">
          <Button size="lg" onPress={() => router.push('/(auth)/sign-in')}>
            Begin
          </Button>
          <Pressable
            onPress={() => router.push('/(auth)/sign-in')}
            className="items-center py-3"
          >
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
              Already have an account?{' '}
              <Text variant="caption" className="text-cahs-amber font-dm-sans-semibold">
                Sign in
              </Text>
            </Text>
          </Pressable>
        </View>

        {/* Legal */}
        <Text variant="micro" className="text-center text-cahs-ash dark:text-cahs-dark-muted mb-4">
          By continuing you agree to our Terms &amp; Privacy Policy
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}
