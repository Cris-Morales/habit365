import { StyleSheet, Pressable, FlatList, Button, Animated, TextInput, ScrollView, KeyboardAvoidingView, ViewStyle } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
const weekday: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export default function TabTwoScreen() {
  const [habitName, setHabitName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date()) // DATE -  passed to database in UTC format YYYY-MM-DD, or whatever I feel like
  const [skipDays, setSkipDays] = useState<boolean[]>(Array(7).fill(true));

  const [showValues, setShowValues] = useState<boolean>(false);
  const selectedColor = useSharedValue('#75faff');
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));



  return (
    <ScrollView style={styles.createHabitContainer}>
      {/* <KeyboardAvoidingView> */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Habit Name</Text>
        <TextInput style={styles.textInputForm} placeholder='Meditation' onChangeText={setHabitName} />
      </View>
      <View style={styles.divider} />
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Start Date</Text>
        <Text style={styles.textInputForm}>Date picker here, with short date in text input style</Text>
      </View>
      <View style={styles.divider} />



      {/* input field */}
      <View style={styles.formContainer}>
        <Text>Frequency:</Text>
        <FlatList
          horizontal={true}
          scrollEnabled={true}
          data={weekday}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index }) => {
            return (
              <DayButton index={index} day={item} skipDays={skipDays} setSkipDays={setSkipDays} />
            )
          }}
        />
      </View >
      {/* date picker */}
      <Text>Add to Routine</Text>

      {/* selector from routines (fetched?) */}
      <View style={{ borderWidth: 1, borderColor: 'gray' }}>
        <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
      </View>
      {/* overide the heabitColor state with the randomly chose one from the AppColorPicker */}
      <Text>Create Habit</Text>
      {/* button */}
      <View style={styles.formContainer}>
        <Text>Intention (Optional)</Text>
        <TextInput style={styles.textInputForm} placeholder='Habit Intention' onChangeText={setHabitName} />
      </View>
      <View style={styles.submitButton} >
        <Button onPress={() => setShowValues(!showValues)} title='Create Habit' accessibilityLabel='Create your new habit.'></Button>
      </View>
      {showValues ? <Text>{selectedColor.value}, {habitName}, {startDate.toLocaleDateString()}, {startDate.getDay()}, {skipDays.toString()}</Text> : null}
      {/* Testing inputs */}
      {/* </KeyboardAvoidingView> */}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  dayButtonsContainer: {
    margin: 5,
    padding: 5,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtons: {
    textAlign: 'center',
  },
  createHabitContainer: {
    flex: 1,
    alignContent: 'center'
  },
  formTitle: {
    marginBottom: 10,
    fontSize: 15,
  },
  formContainer: {
    marginVertical: 10,
    paddingHorizontal: 30
  },
  textInputForm: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#696969',
    padding: 5,
    paddingLeft: 10,
  },
  weekdayButton: {
    width: '14%'
  },
  divider: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopColor: 'gray',
    flex: 1,
    margin: 5
  },
  submitButton: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray'
  }
});