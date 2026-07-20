import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useRouter } from 'expo-router';

export default function CommunityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-6 pb-4">
          <Text variant="label" className="text-cahs-amber mb-1">
            Community
          </Text>
          <Text variant="h2">Voices</Text>
          <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted mt-1">
            Anonymous writing from people like you.
          </Text>
        </View>

        {/* Community principles */}
        <View className="px-5 mb-5">
          <Card className="bg-cahs-warm-gray dark:bg-cahs-dark-surface">
            <Text variant="h3" className="mb-3">
              How this works
            </Text>
            {[
              '✍️  Share anonymously — your name is never shown',
              '♡  Bookmark pieces that resonate with you',
              '🚫  No likes, no follower counts, no rankings',
              '👀  Human editors review every submission',
            ].map((rule) => (
              <Text
                key={rule}
                variant="body"
                className="text-cahs-stone dark:text-cahs-dark-muted mb-2 leading-relaxed"
              >
                {rule}
              </Text>
            ))}
          </Card>
        </View>

        {/* Submit CTA */}
        <View className="px-5 mb-5">
          <Card className="bg-cahs-amber-light dark:bg-cahs-amber/10 border-cahs-amber/20">
            <Text variant="h3" className="mb-2">
              Share something
            </Text>
            <Text
              variant="caption"
              className="text-cahs-stone dark:text-cahs-dark-muted mb-4"
            >
              A poem, a letter, an essay, a sentence. If it came from somewhere real, it belongs here.
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => router.push('/community/submit')}
            >
              Submit anonymously
            </Button>
          </Card>
        </View>

        {/* Coming soon */}
        <View className="px-5">
          <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
            Coming soon
          </Text>
          <Card className="opacity-60 mb-3">
            <Text variant="h3" className="mb-1">
              📚 Community Library
            </Text>
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
              Browse all approved community writing, filtered by emotion and category.
            </Text>
          </Card>
          <Card className="opacity-60">
            <Text variant="h3" className="mb-1">
              🖊 Writing Challenges
            </Text>
            <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
              Monthly themes and prompts to write alongside the CAHS community.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
