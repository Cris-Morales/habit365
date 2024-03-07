import { StyleSheet, Pressable, FlatList, Button, Animated, KeyboardAvoidingView } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';



export default function TabTwoScreen() {
  const [habitColor, setHabitColor] = useState<any>('green')

  return (
    <View style={{
      flex: 1,
    }}>
      <Text>Habit Name</Text>
      <Text>Start Date</Text>
      <Text>Intention (Optional)</Text>
      <Text>Frequency: Everyday, Select Days</Text>
      <Text>Add to Routine</Text>
      <AppColorPicker habitColor={habitColor} setHabitColor={setHabitColor} />

      <Text>{Object.values(habitColor)}</Text>
      <Text>Create Habit</Text>
    </View>
  );
}


const styles = StyleSheet.create({
});