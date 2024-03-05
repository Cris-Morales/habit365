import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import RoutineComponent from '@/components/RoutineComponent';


const dummyData = {
  routine_data: {
    title: 'Daily Routine',
    color: '#00ffff',
    current_streak: 6,
    total_days: 20,
    date_diff: 60,
    id: 1
  },
  routine_habits: [
    {
      title: 'Practice Coding',
      color: '#db7093',
      current_streak: 59,
      total_days: 59,
      date_diff: 60,
      id: 4
    },
    {
      title: 'Exercise',
      color: '#7cfc00',
      current_streak: 6,
      total_days: 48,
      date_diff: 60,
      id: 2
    },
    {
      title: 'Drink a Gallon of Water',
      color: '#48d1cc',
      current_streak: 6,
      total_days: 35,
      date_diff: 60,
      id: 3
    },
    {
      title: 'Meditation',
      color: '#ffd700',
      current_streak: 6,
      total_days: 27,
      date_diff: 60,
      id: 1
    },
    {
      title: 'See the Sunrise',
      color: '#ffff00',
      current_streak: 6,
      total_days: 56,
      date_diff: 60,
      id: 5
    },
    {
      title: 'Cold Shower',
      color: '#f0f8ff',
      current_streak: 6,
      total_days: 19,
      date_diff: 60,
      id: 6
    }
  ]
}

export default function TabTwoScreen() {

  return (
    <View style={{
      flex: 1,
    }}>
      <RoutineComponent routine_data={dummyData.routine_data} routine_habits={dummyData.routine_habits} />
    </View>
  );
}


const styles = StyleSheet.create({
});