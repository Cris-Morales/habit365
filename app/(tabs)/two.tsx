import { StyleSheet, Pressable, FlatList, Button, Animated, TextInput } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


export default function TabTwoScreen() {
  const [habitName, setHabitName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date()) // DATE -  passed to database in UTC format YYYY-MM-DD, or whatever I feel like

  const [showValues, setShowValues] = useState<boolean>(false);
  const selectedColor = useSharedValue('#75faff');
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));



  return (
    <View style={styles.habitFormContainer}>
      <Text>Habit Name</Text>
      <TextInput style={styles.textInputForm} placeholder='Habit Name' onChangeText={setHabitName} />
      {/* input field */}
      <Text>Start Date</Text>
      <TextInput style={styles.textInputForm} placeholder='Start Date' onChangeText={setHabitName} />
      {/*  date picker */}
      <Text>Intention (Optional)</Text>
      {/* input field */}
      <Text>Frequency: Everyday, Select Days</Text>
      {/* date picker */}
      <Text>Add to Routine</Text>
      {/* selector from routines (fetched?) */}
      <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
      {/* overide the heabitColor state with the randomly chose one from the AppColorPicker */}
      <Text>Create Habit</Text>
      {/* button */}
      <Button onPress={() => setShowValues(!showValues)} title='Create Habit' accessibilityLabel='Create your new habit.'></Button>
      {showValues ? <Text>{selectedColor.value}, {habitName}, {startDate.toLocaleDateString()}</Text> : null}
      {/* Testing inputs */}
    </View>
  );
}


const styles = StyleSheet.create({
  habitFormContainer: {
    flex: 1,
    padding: 10,

  },
  textInputForm: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#696969',
    padding: 5,
    paddingLeft: 10,
  }
});