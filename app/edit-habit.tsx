import { StyleSheet, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
import AppDatePicker from '@/components/AppDatePicker';
import { Picker } from '@react-native-picker/picker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { useLocalSearchParams } from 'expo-router';
import dummyData from '@/components/dummyData';
import { habit, routine } from '@/components/types/dataTypes';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';
import FrequencyPicker from '@/components/FrequencyPicker';
import HabitDetails from './habit-details';
import tabTwoQueries from '@/utils/tabTwoQueries';
import { returnedResults } from 'reanimated-color-picker';

interface habitParams {
    title: string;
    id: number;
}

interface habitData {
    color: string;
    frequency: boolean[] | undefined;
    intention: string | null;
    routine_id: number | null;
    start_date: string;
    title: string;
}


const todayDateObj = new Date();
const todayYear = todayDateObj.getFullYear();
const todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
const todayDay = String(todayDateObj.getDate()).padStart(2, '0');

const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'

export default function EditHabit() {

    const db = useSQLiteContext();
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [habitName, setHabitName] = useState<string | undefined>();
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [skipDays, setSkipDays] = useState<boolean[]>(new Array(7).fill(true));
    const selectedColor = useSharedValue('#75faff');
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));
    const [intention, setIntention] = useState<string | undefined>();
    const [color, setColor] = useState<string>('')
    const [selectedRoutine, setSelectedRoutine] = useState<string>('#4fa8cc');
    const [routineList, setRoutineList] = useState<any[]>([]);

    const [canSubmit, setCanSubmit] = useState<boolean>(false);


    useEffect(() => {
        const queryEditData = async () => {
            try {
                const routineListResults = await tabTwoQueries.getRoutineList(db);
                if (routineListResults) {
                    setRoutineList(routineListResults);
                } else {
                    setRoutineList([]);
                }
                const habitData: any = await db.getFirstAsync('SELECT habits.title, habits.start_date, habits.color, habits.intention, habits.routine_id FROM habits WHERE habits.id = ?', params.id);


                const frequency: any[] = await db.getAllAsync(`
                    SELECT days.day_number 
                    FROM days
                    JOIN habits_days_frequency
                    ON days.id = habits_days_frequency.day_id
                    WHERE habits_days_frequency.habit_id = ?
                    `, params.id);

                if (frequency) {
                    const frequencyArray = new Array(7).fill(false);
                    frequency.forEach(data => {
                        frequencyArray[data.day_number] = true;
                    });
                    habitData.frequency = frequencyArray;
                }
                console.log(habitData)

                setHabitName(habitData?.title);
                setStartDate(new Date(habitData?.start_date + fullOffset));
                setSkipDays(habitData?.frequency);
                setColor(habitData?.color);
                setIntention(habitData?.intention);
                setSelectedRoutine(habitData?.routine_title);
                setIsLoading(false);
                setSelectedRoutine(habitData.routine_id)

            } catch (error) {
                console.error('Error in query: ', error)
            }
        }

        queryEditData();
    }, [])


    const handleSubmit = () => {

        console.log(habitName, startDate, skipDays, selectedColor.value, intention, selectedRoutine)

        // router.replace(
        //     {
        //         pathname: '/(tabs)/'
        //     }
        // )
    }

    const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type 

    return (
        <GestureHandlerRootView style={styles.createHabitContainer}>
            <KeyboardAvoidingView style={styles.createHabitContainer} behavior='height' keyboardVerticalOffset={100}>
                {isLoading ? <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontSize: 20 }}>
                        Loading...
                    </Text>
                </View> :
                    <ScrollView style={styles.createHabitContainer}>
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Edit Habit Name</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextInput style={styles.textInputForm} maxLength={28} placeholderTextColor={'white'} value={habitName} onChangeText={(text) => {
                                    if (text.length) {
                                        setCanSubmit(true);
                                        setHabitName(text);
                                    } else {
                                        setCanSubmit(false);
                                        setHabitName(text);
                                    }
                                }} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={[styles.formContainer,]}>
                            <Text style={styles.formTitle}>Edit Start Date</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <AppDatePicker date={startDate} setDate={setStartDate} weekdays={weekdays} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Frequency:</Text>
                            <FrequencyPicker frequency={skipDays} setFrequency={setSkipDays} color={color} tab={'edit'} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Edit Custom Color</Text>

                            <View style={{ backgroundColor: color, height: 30, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', width: '75%', borderRadius: 2, marginVertical: 5 }}>
                                <Text style={{ textAlign: 'center', color: 'black', textAlignVertical: 'center' }}>Current Color: {color}</Text>
                            </View>
                            <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Edit Intention</Text>
                            <TextInput style={[styles.textInputForm, { lineHeight: 20, textAlign: 'left', textAlignVertical: 'top' }]} placeholderTextColor={'white'} multiline={true} value={intention} onChangeText={setIntention} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Add/Change Routine</Text>
                            <Picker
                                style={[styles.textInputForm, { marginBottom: 15 }]}
                                selectedValue={selectedRoutine}
                                dropdownIconRippleColor={selectedColor.value}
                                dropdownIconColor={selectedColor.value}
                                onValueChange={(itemValue) => {
                                    setSelectedRoutine(itemValue)
                                }}>
                                <Picker.Item key={'undefined routine'} label={'N/A'} value={null} />
                                {routineList[0] ? routineList?.map((routineData: any, index: number) => <Picker.Item key={routineData + '-' + index} label={routineData.title} value={routineData.id} />) : null}
                            </Picker>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#4fa8cc' }]} onPress={() => handleSubmit()} accessibilityLabel='Create your new habit.'
                            activeOpacity={0.85}>
                            <Text>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>}
            </KeyboardAvoidingView>
        </GestureHandlerRootView >
    );
}


const styles = StyleSheet.create({
    createHabitContainer: {
        flex: 1,
        alignContent: 'center',
    },
    editIcon: {
        margin: 10
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
        height: 'auto',
        width: '100%',
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
        marginBottom: 30,
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