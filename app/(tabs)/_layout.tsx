import React from 'react';
import { Ionicons, FontAwesome, Fontisto } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// this is the bottom tab component
function FATabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
function IITabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function FontistoIcon(props: {
  name: React.ComponentProps<typeof Fontisto>['name'];
  color: string;
}) {
  return <Fontisto size={23} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <FATabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <FontistoIcon name="nav-icon-grid-a" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <IITabBarIcon name="add-circle-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IITabBarIcon name="settings-sharp" color={color} />,
        }}
      />
    </Tabs>
  );
}
