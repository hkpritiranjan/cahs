import { View, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';

export default function ListenScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cahs-cream dark:bg-cahs-dark-bg">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-6 pb-4">
          <Text variant="label" className="text-cahs-amber mb-1">
            Listen
          </Text>
          <Text variant="h2">You are heard.</Text>
        </View>

        <View className="px-5 items-center py-8">
          <Text className="text-6xl mb-6">👂</Text>
          <Text variant="h3" className="text-center mb-3">
            The Listening Room is coming.
          </Text>
          <Text
            variant="body"
            className="text-cahs-stone dark:text-cahs-dark-muted text-center leading-relaxed"
          >
            A safe space to share what you're carrying — anonymously, without judgment, with a human on the other side.
          </Text>
        </View>

        {/* What it will be */}
        <View className="px-5">
          <Text variant="label" className="text-cahs-stone dark:text-cahs-dark-muted mb-3">
            What to expect
          </Text>

          {[
            {
              title: 'Say anything',
              body: 'Write what you cannot say out loud. You will not be judged. You will not be ignored.',
            },
            {
              title: 'AI acknowledges first',
              body: 'A warm AI response arrives within minutes — not to solve, but to acknowledge.',
            },
            {
              title: 'A human replies',
              body: 'The CAHS team reads every message. Real replies from real people who care.',
            },
            {
              title: 'Always anonymous',
              body: 'Nothing you share here is connected to your name or profile.',
            },
          ].map((item) => (
            <Card key={item.title} className="mb-3">
              <Text variant="h3" className="mb-1">
                {item.title}
              </Text>
              <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted">
                {item.body}
              </Text>
            </Card>
          ))}
        </View>

        {/* Important notice */}
        <View className="mx-5 mt-5 px-4 py-4 bg-cahs-warm-gray dark:bg-cahs-dark-surface rounded-xl border-l-2 border-cahs-stone">
          <Text variant="caption" className="text-cahs-stone dark:text-cahs-dark-muted leading-relaxed">
            <Text variant="caption" className="font-dm-sans-semibold text-cahs-charcoal dark:text-cahs-dark-text">
              Important:{' '}
            </Text>
            CAHS is not a crisis service and is not a replacement for professional support. If you are in immediate danger, please contact emergency services or the 988 Suicide & Crisis Lifeline.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
