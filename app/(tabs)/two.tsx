import { StyleSheet, Pressable, FlatList, Button, Animated, TextInput, KeyboardAvoidingView, ViewStyle } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
import AppDatePicker from '@/components/AppDatePicker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


export default function TabTwoScreen() {
  const [habitName, setHabitName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date()) // DATE -  passed to database in UTC format YYYY-MM-DD, or whatever I feel like
  const [skipDays, setSkipDays] = useState<boolean[]>(Array(7).fill(true));
  const [showValues, setShowValues] = useState<boolean>(false);
  const selectedColor = useSharedValue('#75faff');
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));
  const [scroll, setScroll] = useState<boolean>(true);



  return (
    <GestureHandlerRootView style={styles.createHabitContainer}>
      <ScrollView style={styles.createHabitContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Habit Name</Text>
          <TextInput style={styles.textInputForm} maxLength={28} placeholderTextColor={'white'} placeholder='ex. Meditation' onChangeText={setHabitName} />
        </View>
        <View style={styles.divider} />
        <View style={[styles.formContainer,]}>
          <Text style={styles.formTitle}>Start Date</Text>
          <AppDatePicker date={startDate} setDate={setStartDate} weekdays={weekdays} />
        </View>
        <View style={styles.divider} />
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Frequency:</Text>
          <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              horizontal={true}
              scrollEnabled={false}
              data={weekdays}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item, index }) => {
                return (
                  <DayButton index={index} day={item} skipDays={skipDays} setSkipDays={setSkipDays} />
                )
              }}
            />
          </View>
        </View >
        <View style={styles.divider} />
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Customize Color</Text>
          <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
        </View>
        <View style={styles.divider} />
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Intention (Optional)</Text>
          <TextInput style={styles.textInputForm} placeholderTextColor={'white'} placeholder='ex. To Embrace Mindfulness' onChangeText={setHabitName} />
        </View>
        <View style={styles.divider} />
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add to Routine (Optional)</Text>
          <Pressable>
            <Text>
              Drop Down Menu Here
            </Text>
          </Pressable>
        </View>
        <View style={styles.divider} />
        <View style={styles.submitButton} >
          <Button onPress={() => setShowValues(!showValues)} title='Create Habit' accessibilityLabel='Create your new habit.'></Button>
        </View>
        {showValues ? <Text>{selectedColor.value}, {habitName}, {startDate?.toLocaleDateString()}, , {skipDays.toString()}</Text> : null}
      </ScrollView>
    </GestureHandlerRootView>
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
    paddingHorizontal: 30,
  },
  textInputForm: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#696969',
    padding: 5,
    paddingLeft: 10,
    height: 40,
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