import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useColorScheme } from 'nativewind';
import { Text } from '../../components/ui/Text';

type TabIconProps = {
  emoji: string;
  label: string;
  focused: boolean;
};

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-1 w-16">
      <Text className={`text-xl ${focused ? '' : 'opacity-40'}`}>{emoji}</Text>
      <Text
        className={`text-xs mt-0.5 font-dm-sans ${
          focused
            ? 'text-cahs-amber font-dm-sans-semibold'
            : 'text-cahs-stone dark:text-cahs-dark-muted'
        }`}
        style={{ fontSize: 10 }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" label="Read" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="express"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="✍️" label="Express" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="heal"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌱" label="Heal" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🤝" label="Community" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="listen"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👂" label="Listen" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
