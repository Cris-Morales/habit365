import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { View } from '@/components/Themed';
import HabitRow from '@/components/HabitRow';

const dummyData = {
  start_data: '2024-01-01',
  title: 'Meditation',
  created_at: '2024-01-01',
  color: '#e6e600',
  current_streak: 6,
  total_days: 50,
  date_diff: 60,
  id: 1
}

export default function TabOneScreen() {

  return (
    <View style={styles.container}>
      <HabitRow habitData={dummyData} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
