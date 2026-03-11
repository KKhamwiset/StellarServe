import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const StellaServeLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.white,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.accent,
  },
};

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={StellaServeLight}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen
          name="restaurant/[id]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="restaurant/[id]/reviews"
          options={{ headerShown: true, title: 'Reviews' }}
        />
        <Stack.Screen
          name="restaurant/[id]/createReview"
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
