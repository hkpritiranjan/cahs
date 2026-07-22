import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MORNING_CONTENT = [
  { title: 'Good morning ✦', body: 'Your daily reflection is waiting.' },
  { title: 'A moment for you 🌿', body: 'Start your day with something that matters.' },
  { title: 'Good morning.', body: "Something beautiful is here when you're ready." },
  { title: 'Rise gently ✦', body: "Today's quote is waiting for you." },
  { title: 'Good morning 🌅', body: 'A quiet moment before the day begins.' },
  { title: 'Your daily read 🌿', body: "Something worth sitting with today." },
  { title: 'Good morning ✦', body: 'A new day. A new reflection.' },
];

const EVENING_CONTENT = [
  { title: 'How was today? 🌙', body: 'A moment to breathe and check in.' },
  { title: 'Evening ✦', body: 'How are you feeling right now?' },
  { title: 'Before you sleep 🌙', body: 'A few words are waiting for you.' },
  { title: 'End of day 🌙', body: "Take a breath. You made it through." },
  { title: 'A quiet minute ✦', body: "How did today treat you?" },
  { title: 'Evening check-in 🌙', body: 'Log your mood before the day ends.' },
  { title: 'Good night ✦', body: "Reflect on one thing that happened today." },
];

export function parseDbTime(dbTime: string): { hour: number; minute: number } {
  const parts = dbTime.split(':');
  return { hour: parseInt(parts[0], 10), minute: parseInt(parts[1], 10) };
}

// Convert display label ("8am") to DB time format ("08:00")
export const DISPLAY_TO_DB: Record<string, string> = {
  '7am': '07:00',
  '8am': '08:00',
  '9am': '09:00',
  '8pm': '20:00',
  '9pm': '21:00',
  '10pm': '22:00',
};

// Convert DB time ("08:00:00" or "08:00") to display label ("8am")
export function dbTimeToDisplay(dbTime: string | null): string | null {
  if (!dbTime) return null;
  const hhmm = dbTime.substring(0, 5); // "08:00"
  const reverse: Record<string, string> = {
    '07:00': '7am',
    '08:00': '8am',
    '09:00': '9am',
    '20:00': '8pm',
    '21:00': '9pm',
    '22:00': '10pm',
  };
  return reverse[hhmm] ?? null;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleReminders(
  morningTime: string,
  eveningTime: string | null,
): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const dayIndex = new Date().getDay();
  const morning = parseDbTime(morningTime);
  const morningMsg = MORNING_CONTENT[dayIndex % MORNING_CONTENT.length];

  await Notifications.scheduleNotificationAsync({
    identifier: 'cahs-morning',
    content: { title: morningMsg.title, body: morningMsg.body, sound: true },
    trigger: { hour: morning.hour, minute: morning.minute, repeats: true } as any,
  });

  if (eveningTime) {
    const evening = parseDbTime(eveningTime);
    const eveningMsg = EVENING_CONTENT[dayIndex % EVENING_CONTENT.length];
    await Notifications.scheduleNotificationAsync({
      identifier: 'cahs-evening',
      content: { title: eveningMsg.title, body: eveningMsg.body, sound: true },
      trigger: { hour: evening.hour, minute: evening.minute, repeats: true } as any,
    });
  }
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
