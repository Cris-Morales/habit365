import { StyleSheet, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { GestureHandlerRootView, ScrollView, Switch } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
import AppDatePicker from '@/components/AppDatePicker';
import { Picker } from '@react-native-picker/picker';
import { router, useRouter } from 'expo-router';
import tabTwoQueries from '@/utils/tabTwoQueries';
import { useSQLiteContext } from 'expo-sqlite/next';

const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TabTwoScreen() {
  const [isEnabled, setIsEnabled] = useState(false); // false - habit, true - routine
  const [habitName, setHabitName] = useState<string | undefined>();
  const [routineName, setRoutineName] = useState<string | undefined>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date()) // DATE -  passed to database in format YYYY-MM-DD, local to the user, to match user perception.
  const [selectedRoutine, setSelectedRoutine] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<boolean[]>(Array(7).fill(true));
  const [intention, setIntention] = useState<string>();
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [routineList, setRoutineList] = useState<any>([]);
  const selectedColor = useSharedValue('#75faff');
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

  const db = useSQLiteContext();

  useEffect(() => {
    const queryRoutineList = async () => {
      try {
        const routineListResults = await tabTwoQueries.getRoutineList(db);
        if (routineListResults) {
          setRoutineList(routineListResults);
        } else {
          setRoutineList([]);
        }
      } catch (error) {
        console.error('Error in routine list query: ', error)
        setRoutineList([]);
      }
    }
    queryRoutineList();
  }, [isEnabled])


  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    setCanSubmit(false);
  };

  const resetForm = () => {
    setIsEnabled(false);
    setHabitName(undefined);
    setStartDate(new Date());
    setFrequency(Array(7).fill(true));
    setIntention('');
    setCanSubmit(false);
    setSelectedRoutine(null);
    setRoutineName('');
  }

  const handleSubmit = async (action: string) => {
    if (canSubmit) {
      try {
        if (action === 'routine') {
          await tabTwoQueries.insertRoutine(db, routineName, startDate?.toISOString().split('T')[0], selectedColor.value, intention);
        } else if (action === 'habit') {
          await tabTwoQueries.insertHabit(db, habitName, startDate?.toISOString().split('T')[0], selectedColor.value, intention, selectedRoutine, frequency);
        }
        resetForm();
        router.replace(
          {
            pathname: '/(tabs)/'
          }
        )
      } catch (error) {
        console.error(error);
      }

    } else {
      console.error('Cannot submit without a Name');
    }
  }

  return (
    <GestureHandlerRootView style={styles.createHabitContainer}>
      <KeyboardAvoidingView style={styles.createHabitContainer} behavior='height' keyboardVerticalOffset={100}>
        <View style={styles.switchContainer}>
          <Pressable style={[styles.switchTitleContainer, { backgroundColor: !isEnabled ? '#4fa8cc' : 'gray' }]} onPress={toggleSwitch}>
            <Text style={styles.switchTitle}>Habit</Text>
          </Pressable>
          <Switch
            style={styles.switch}
            trackColor={{ false: 'white', true: 'white' }}
            thumbColor={isEnabled ? '#e17c30' : '#4fa8cc'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Pressable style={[styles.switchTitleContainer, { backgroundColor: isEnabled ? '#e17c30' : 'gray' }]} onPress={toggleSwitch}>
            <Text style={styles.switchTitle}>Routine</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.createHabitContainer}>
          {isEnabled ?
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Routine Name</Text>
              <TextInput style={styles.textInputForm} maxLength={40} placeholderTextColor={'white'} placeholder='ex. Morning Routine' value={routineName} onChangeText={(text) => {
                if (text.length) {
                  setCanSubmit(true);
                  setRoutineName(text);
                } else {
                  setCanSubmit(false);
                  setRoutineName(undefined);
                }
              }} />
            </View>
            :
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Habit Name</Text>
              <TextInput style={styles.textInputForm} maxLength={28} placeholderTextColor={'white'} placeholder='ex. Meditation' value={habitName} onChangeText={(text) => {
                if (text.length) {
                  setCanSubmit(true);
                  setHabitName(text);
                } else {
                  setCanSubmit(false);
                  setHabitName(undefined);
                }
              }} />
            </View>
          }
          <View style={styles.divider} />
          <View style={[styles.formContainer,]}>
            <Text style={styles.formTitle}>Start Date</Text>
            <AppDatePicker date={startDate} setDate={setStartDate} weekdays={weekdays} />
          </View>
          {!isEnabled ? <>
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
                      <DayButton index={index} day={item} skipDays={frequency} setSkipDays={setFrequency} color={isEnabled ? '#e17c30' : '#4fa8cc'} />
                    )
                  }}
                />
              </View>
            </View >
          </> : null}
          <View style={styles.divider} />
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Customize Color</Text>
            <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
          </View>
          <View style={styles.divider} />
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Intention (Optional)</Text>
            <TextInput style={styles.textInputForm} placeholderTextColor={'white'} placeholder='ex. To Embrace Mindfulness' value={intention} onChangeText={setIntention} />
          </View>
          <View style={styles.divider} />
          {!isEnabled && <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add to Routine (Optional)</Text>
            <Picker
              style={[styles.textInputForm, { marginBottom: 15 }]}
              selectedValue={selectedRoutine}
              dropdownIconRippleColor={isEnabled ? '#e17c30' : '#4fa8cc'}
              dropdownIconColor={isEnabled ? '#e17c30' : '#4fa8cc'}
              onValueChange={(itemValue) => {
                setSelectedRoutine(itemValue)
              }}>
              <Picker.Item key={'undefined routine'} label={'N/A'} value={null} />
              {routineList[0] ? routineList?.map((routineData: any, index: number) => <Picker.Item key={routineData + '-' + index} label={routineData.title} value={routineData.id} />) : null}
            </Picker>
          </View>}
          {!isEnabled && <View style={styles.divider} />}
          <TouchableOpacity style={[styles.submitButton, { backgroundColor: canSubmit ? (isEnabled ? '#e17c30' : '#4fa8cc') : 'gray' }]} onPress={() => handleSubmit(isEnabled ? 'routine' : 'habit')} accessibilityLabel='Create your new habit.'
            activeOpacity={canSubmit ? 0.85 : 1.0}>
            <Text>{!isEnabled ? 'Create Habit' : 'Create Routine'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView >
  );
}


const styles = StyleSheet.create({
  createHabitContainer: {
    flex: 1,
    alignContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#373737',
  },
  switchTitleContainer: {
    margin: 10,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 5,
    width: '30%',
  },
  switchTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  switch: {
  },
  formTitle: {
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: 'center'
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
    marginTop: 10,
    marginBottom: 20,
    width: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    alignSelf: 'center'
  }
});