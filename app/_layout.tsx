import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { Text } from '@/components/Themed';
import { Platform } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite/next';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}



function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="habit365-2.0.db">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, navigationBarHidden: false }} />
          <Stack.Screen name="habit-details" options={{
            title: 'Habit Details',
            presentation: 'modal'
          }} />
          <Stack.Screen name="routine-details" options={{
            title: 'Routine Details',
            presentation: 'modal'
          }} />
          <Stack.Screen name="edit-routine" options={{
            title: 'Edit Routine',
            presentation: 'modal'
          }} />
          <Stack.Screen name="edit-habit" options={{
            title: 'Edit Habit',
            presentation: 'modal'
          }} />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
