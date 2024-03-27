import { StyleSheet, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AppDatePicker from '@/components/AppDatePicker';
import { Picker } from '@react-native-picker/picker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite/next';
import FrequencyPicker from '@/components/FrequencyPicker';
import tabTwoQueries from '@/utils/tabTwoQueries';

interface habitData {
    color: string;
    frequency: boolean[];
    intention: string;
    routine_id: number | null;
    start_date: string;
    title: string;
}

const todayDateObj = new Date();
const todayYear = todayDateObj.getFullYear();
const todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
const todayDay = String(todayDateObj.getDate()).padStart(2, '0');
const today = `${todayYear}-${todayMonth}-${todayDay}`;

const dayIndex = todayDateObj.getDay();

const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'

export default function EditHabit() {

    const db = useSQLiteContext();
    const router = useRouter()
    const [originalHabitData, setOriginalHabitDate] = useState<habitData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [habitName, setHabitName] = useState<string | undefined>();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [skipDays, setSkipDays] = useState<boolean[]>(new Array(7).fill(true));
    const selectedColor = useSharedValue(originalHabitData?.color);
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));
    const [intention, setIntention] = useState<string>();
    const [selectedRoutine, setSelectedRoutine] = useState<number>();
    const [routineList, setRoutineList] = useState<any[]>([]);

    useEffect(() => {
        const queryFormData = async () => {
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

                setOriginalHabitDate(habitData);

                setHabitName(habitData.title);
                setStartDate(new Date(habitData?.start_date + fullOffset));
                setSkipDays(habitData.frequency);
                setIntention(habitData.intention ? habitData.intention : '');
                setSelectedRoutine(habitData.routine_id);
                selectedColor.value = habitData.color;
                // color picker needs a tick to both set the selected color hex AND move the slider to that position.
                setTimeout(() => setIsLoading(false), 0);
            } catch (error) {
                console.error('Error in query: ', error)
            }
        }

        queryFormData();
    }, [])

    // Only used here, but I want to shorten this file.
    const handleSubmit = async () => {

        // set isLoading to true
        const possibleNewDate: string = (startDate?.getFullYear() + '-' + String(startDate?.getMonth() + 1).padStart(2, '0') + '-' + String(startDate?.getDate()).padStart(2, '0'));

        console.log(habitName, startDate, skipDays, selectedColor.value, 'intention: ', intention, selectedRoutine)
        console.log(originalHabitData);

        // update habit name
        if (habitName != originalHabitData?.title) {
            if (habitName) {
                console.log('updating name');
                await db.runAsync(`UPDATE habits SET title = ? WHERE id = ?`, habitName, params.id);
            }
        }

        // update start date (changes when stats are recieved);
        if (originalHabitData?.start_date != possibleNewDate) {
            console.log('updating date');
            await db.runAsync(`UPDATE habits SET start_date = ? WHERE id = ?`, possibleNewDate, params.id);

        }

        if (originalHabitData?.color != selectedColor.value) {
            if (selectedColor.value) {
                console.log('updating color');
                await db.runAsync(`UPDATE habits SET color = ? WHERE id = ?`, selectedColor.value, params.id);
            }
        }

        // update intention
        if ((originalHabitData?.intention ? originalHabitData?.intention : '') != intention) {
            if (intention) {
                console.log('updating intention');
                await db.runAsync(`UPDATE habits SET intention = ? WHERE id = ?`, intention, params.id);
            }

        }

        // for loop frequency 
        //      check matches with original habit data
        //      if miss match
        //          false in new: delete entry in habits_days_frequency
        //          true in new: add entry in habits_days_frequency
        // update habit_entries row:
        for (let i = 0; i < skipDays.length; i++) {
            if (skipDays[i] != originalHabitData?.frequency[i]) {
                console.log('update habit frequency (i + 1 = day_id)', i, skipDays[i]);

                if (skipDays[i]) {
                    await db.runAsync(`INSERT INTO habits_days_frequency (habit_id, day_id) VALUES (?, ?)`, params.id, i + 1);
                } else {
                    await db.runAsync(`DELETE FROM habits_days_frequency WHERE habit_id = ? AND day_id = ?`, params.id, i + 1);
                }
                // did today's frequency day change?
                if (dayIndex === i) {
                    // true
                    console.log('update today\'s entry');
                    //where entry date = today, and habit_id = params.id
                    // is today a habit day?
                    if (skipDays[i]) {
                        // true: is a day: set status to 0
                        console.log('change entry status to 0 and increment total days'); // previous was a skip, but today is a day so set to 0, increment today days

                        await db.runAsync(`UPDATE habit_entries SET status = 0, total_days = total_days + 1 WHERE habit_id = ? AND DATE(entry_date) = ?`, params.id, today);
                        // if there is a routine_id, update that routine entry
                    } else {
                        // false
                        console.log('changed entry status to 1 but keep streak, and hit total');
                        console.log('if prev status was 0 decrement total days, if it was 2 do nothing'); // To not remove the hit if the person already did the habit today but wants to change the frequency anyway
                        // or if they missed it but want to change the frequency, to not penalize their streak
                        // if there is a routine_id, update that routine entry
                        const entryStatus: any = await db.getFirstAsync(`SELECT status, total_days FROM habit_entries WHERE habit_id = ? and DATE(entry_date) = ?`, params.id, today);

                        console.log(entryStatus);

                        await db.runAsync(`UPDATE habit_entries SET total_days = ?, status = 1 WHERE habit_id = ? AND DATE(entry_date) = ?`, entryStatus.status === 0 ? entryStatus.total_days - 1 : entryStatus.total_days, params.id, today);
                    }

                    // Habit Entry was changed, change its routine if it exists
                    if (originalHabitData?.routine_id) {
                        const totalHabits: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits WHERE routine_id = ?`, originalHabitData?.routine_id);
                        const habitsComplete: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habit_entries 
                                                    JOIN habits 
                                                    ON habits.id = habit_entries.habit_id 
                                                    WHERE routine_id = ?
                                                    AND habit_entries.status > 0 
                                                    AND DATE(entry_date) = ?`, originalHabitData?.routine_id, today);

                        await db.runAsync(`
                        UPDATE routine_entries 
                        SET total_habits = ?,
                        habits_complete = ? 
                        WHERE routine_id = ?
                        AND
                        DATE(entry_date) = ?;
                        `, totalHabits['COUNT(*)'], habitsComplete['COUNT(*)'], originalHabitData?.routine_id, today);
                    }

                }
                // false: don't update the entry    
            }
        }


        // did the routine change?
        if (originalHabitData?.routine_id != selectedRoutine) {
            // was old routine null
            console.log('update new routine entry');

            if (selectedRoutine) {
                // new routine is not null
                // update latest entry (use controlled form state);
                // total_habits count habits table rows, habits_complete count habit_entries
                await db.runAsync(`UPDATE habits SET routine_id = ? WHERE id = ?;`, selectedRoutine, params.id);
                const totalHabits: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits WHERE routine_id = ?`, selectedRoutine);
                const habitsComplete: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habit_entries 
                                                        JOIN habits 
                                                        ON habits.id = habit_entries.habit_id 
                                                        WHERE routine_id = ?
                                                        AND habit_entries.status > 0 
                                                        AND DATE(entry_date) = ?`, selectedRoutine, today);
                if (totalHabits['COUNT(*)'] === 1) {
                    // this routine now has entries, initialize its entry
                    await db.runAsync(`INSERT INTO routine_entries (routine_id, habits_complete, total_habits) 
                    SELECT ?, ?, 1`, selectedRoutine, habitsComplete['COUNT(*)']);
                } else {
                    await db.runAsync(`
                                UPDATE routine_entries 
                                SET total_habits = ?,
                                habits_complete = ? 
                                WHERE routine_id = ?
                                AND
                                DATE(entry_date) = ?;
                                `, totalHabits['COUNT(*)'], habitsComplete['COUNT(*)'], selectedRoutine, today);
                }
            } else {
                // new routine is null
                await db.runAsync(`UPDATE habits SET routine_id = NULL WHERE id = ?;`, params.id);
            }
            // if old routine was not null, 
            if (originalHabitData?.routine_id) {
                // update old routine entry
                // update old routine entry (use originalHabitDate);
                // total_habits count habits table rows, habits_complete count habit_entries
                console.log('update old routine entry for today');
                console.log('if today habits are 0, remove entry');
                const oldTotalHabits: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits WHERE routine_id = ?`, originalHabitData?.routine_id);
                const oldHabitsComplete: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habit_entries 
                                                    JOIN habits 
                                                    ON habits.id = habit_entries.habit_id 
                                                    WHERE routine_id = ?
                                                    AND habit_entries.status > 0 
                                                    AND DATE(entry_date) = ?`, originalHabitData?.routine_id, today);
                if (oldTotalHabits['COUNT(*)'] === 0) {
                    await db.runAsync(`DELETE FROM routine_entries WHERE routine_id = ? AND DATE(entry_date) = ?`, originalHabitData.routine_id, today)
                } else {
                    await db.runAsync(`
                        UPDATE routine_entries 
                        SET total_habits = ?,
                        habits_complete = ? 
                        WHERE routine_id = ?
                        AND
                        DATE(entry_date) = ?;
                        `, oldTotalHabits['COUNT(*)'], oldHabitsComplete['COUNT(*)'], originalHabitData?.routine_id, today);
                }
            }
        }

        console.log('update complete');
        // reroute to home, and refetch
        router.replace(
            {
                pathname: '/(tabs)/'
            }
        )
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
                        {/* HABIT NAME INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Habit Name</Text>
                                {originalHabitData?.title != habitName && <Text style={[styles.formTitle, { color: originalHabitData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextInput style={styles.textInputForm} maxLength={28} placeholderTextColor={'white'} value={habitName} onChangeText={setHabitName} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        {/* HABIT START DATE INPUT */}
                        <View style={[styles.formContainer,]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Start Date</Text>
                                {originalHabitData?.start_date != (startDate?.getFullYear() + '-' + String(startDate.getMonth() + 1).padStart(2, '0') + '-' + String(startDate?.getDate()).padStart(2, '0')) && <Text style={[styles.formTitle, { color: originalHabitData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <AppDatePicker date={startDate} setDate={setStartDate} weekdays={weekdays} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        {/* HABIT FREQUENCY INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Frequency:</Text>
                            </View>
                            <FrequencyPicker frequency={skipDays} setFrequency={setSkipDays} color={originalHabitData?.color} tab={'edit'} />
                        </View>
                        <View style={styles.divider} />
                        {/* HABIT COLOR INPUT */}
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Edit Custom Color</Text>
                            <View style={{ backgroundColor: originalHabitData?.color, height: 30, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', width: '75%', borderRadius: 2, marginVertical: 5 }}>
                                <Text style={{ textAlign: 'center', color: 'black', textAlignVertical: 'center', fontSize: 16 }}>Original Color: {originalHabitData?.color}</Text>
                            </View>
                            <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
                        </View>
                        <View style={styles.divider} />
                        {/* HABIT INTENTION INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Intention</Text>
                                {(originalHabitData?.intention ? originalHabitData?.intention : '') == intention ? null : <Text style={[styles.formTitle, { color: originalHabitData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <TextInput style={[styles.textInputForm, { lineHeight: 20, textAlign: 'left', textAlignVertical: 'top' }]} placeholderTextColor={'white'} multiline={true} value={intention} onChangeText={setIntention} placeholder={originalHabitData?.intention ? originalHabitData?.intention : 'Intention not defined.'} />
                        </View>
                        <View style={styles.divider} />
                        {/* HABIT ROUTINE ID INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Add/Change Routine</Text>
                                {originalHabitData?.routine_id != selectedRoutine && <Text style={[styles.formTitle, { color: originalHabitData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
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
                        {/* SUBMIT */}
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
        paddingBottom: 5,
        padding: 10,
        height: 'auto',
        width: '100%',
        fontSize: 16
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