import { StyleSheet, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import AppDatePicker from '@/components/AppDatePicker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite/next';

interface routineData {
    color: string;
    intention: string;
    start_date: string;
    title: string;
}

const todayDateObj = new Date();

const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'

export default function EditRoutine() {
    //(title, start_date, color, intention)
    const db = useSQLiteContext();
    const router = useRouter()
    const [originalRoutineData, setOriginalRoutineDate] = useState<routineData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [routineName, setRoutineName] = useState<string | undefined>();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const selectedColor = useSharedValue(originalRoutineData?.color);
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));
    const [intention, setIntention] = useState<string>();

    useEffect(() => {
        const queryFormData = async () => {
            try {
                const routineData: any = await db.getFirstAsync('SELECT title, start_date, color, intention FROM routines WHERE id = ?', params.id);

                setOriginalRoutineDate(routineData);
                setRoutineName(routineData.title);
                setStartDate(new Date(routineData?.start_date + fullOffset));
                setIntention(routineData.intention ? routineData.intention : '');
                selectedColor.value = routineData.color;
                setTimeout(() => setIsLoading(false), 0);
            } catch (error) {
                console.error('Error in query: ', error)
            }
        }

        queryFormData();
    }, [])

    const handleSubmit = async () => {
        // set isLoading to true
        const possibleNewDate: string = (startDate?.getFullYear() + '-' + String(startDate?.getMonth() + 1).padStart(2, '0') + '-' + String(startDate?.getDate()).padStart(2, '0'));

        // console.log(routineName, startDate, selectedColor.value, 'intention: ', intention)
        // console.log(originalRoutineData);

        // update routine name
        if (routineName != originalRoutineData?.title) {
            if (routineName) {
                console.log('updating routine name');
                await db.runAsync(`UPDATE routines SET title = ? WHERE id = ?`, routineName, params.id);
            }
        }

        // update start date (changes when stats are recieved);
        if (originalRoutineData?.start_date != possibleNewDate) {
            console.log('updating routine date');
            await db.runAsync(`UPDATE routines SET start_date = ? WHERE id = ?`, possibleNewDate, params.id);

        }

        // update color
        if (originalRoutineData?.color != selectedColor.value) {
            if (selectedColor.value) {
                console.log('updating routine color');
                await db.runAsync(`UPDATE routines SET color = ? WHERE id = ?`, selectedColor.value, params.id);
            }
        }

        // update intention
        if ((originalRoutineData?.intention ? originalRoutineData?.intention : '') != intention) {
            if (intention) {
                console.log('updating routine intention');
                await db.runAsync(`UPDATE routines SET intention = ? WHERE id = ?`, intention, params.id);
            }

        }

        console.log('routine update complete');
        // reroute to home, and refetch
        router.replace(
            {
                pathname: '/(tabs)/'
            }
        )
    }

    const params: any = useLocalSearchParams(); // see routineParams, will not accept it as a type 

    return (
        <GestureHandlerRootView style={styles.createRoutineContainer}>
            <KeyboardAvoidingView style={styles.createRoutineContainer} behavior='height' keyboardVerticalOffset={100}>
                {isLoading ? <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontSize: 20 }}>
                        Loading...
                    </Text>
                </View> :
                    <ScrollView style={styles.createRoutineContainer}>
                        {/* Routine NAME INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Routine Name</Text>
                                {originalRoutineData?.title != routineName && <Text style={[styles.formTitle, { color: originalRoutineData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextInput style={styles.textInputForm} maxLength={28} placeholderTextColor={'white'} value={routineName} onChangeText={setRoutineName} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        {/* ROUTINE START DATE INPUT */}
                        <View style={[styles.formContainer,]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Start Date</Text>
                                {originalRoutineData?.start_date != (startDate?.getFullYear() + '-' + String(startDate.getMonth() + 1).padStart(2, '0') + '-' + String(startDate?.getDate()).padStart(2, '0')) && <Text style={[styles.formTitle, { color: originalRoutineData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <AppDatePicker date={startDate} setDate={setStartDate} weekdays={weekdays} />
                            </View>
                        </View>
                        <View style={styles.divider} />
                        {/* ROUTINE COLOR INPUT */}
                        <View style={styles.formContainer}>
                            <Text style={styles.formTitle}>Edit Custom Color</Text>
                            <View style={{ backgroundColor: originalRoutineData?.color, height: 30, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', width: '75%', borderRadius: 2, marginVertical: 5 }}>
                                <Text style={{ textAlign: 'center', color: 'black', textAlignVertical: 'center', fontSize: 16 }}>Original Color: {originalRoutineData?.color}</Text>
                            </View>
                            <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
                        </View>
                        <View style={styles.divider} />
                        {/* ROUTINE INTENTION INPUT */}
                        <View style={styles.formContainer}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.formTitle}>Edit Intention</Text>
                                {(originalRoutineData?.intention ? originalRoutineData?.intention : '') == intention ? null : <Text style={[styles.formTitle, { color: originalRoutineData?.color, fontWeight: 'bold' }]}>Updated</Text>}
                            </View>
                            <TextInput style={[styles.textInputForm, { lineHeight: 20, textAlign: 'left', textAlignVertical: 'top' }]} placeholderTextColor={'white'} multiline={true} value={intention} onChangeText={setIntention} placeholder={originalRoutineData?.intention ? originalRoutineData?.intention : 'Intention not defined.'} />
                        </View>
                        <View style={styles.divider} />
                        {/* SUBMIT */}
                        <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#4fa8cc' }]} onPress={() => handleSubmit()} accessibilityLabel='Update Your Routine.'
                            activeOpacity={0.85}>
                            <Text>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>}
            </KeyboardAvoidingView>
        </GestureHandlerRootView >
    );
}


const styles = StyleSheet.create({
    createRoutineContainer: {
        flex: 1,
        alignContent: 'center',
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