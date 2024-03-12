import { StyleSheet, FlatList, TextInput, KeyboardAvoidingView, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from "expo-router";
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
import AppDatePicker from '@/components/AppDatePicker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
import { useLocalSearchParams } from 'expo-router';
import dummyData from '@/components/dummyData';
import { routine } from '@/components/types/dataTypes';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const dummyRoutineList: string[] = ['N/A', 'Daily', 'Post-Morning Coffee Dookie Sit-down', 'Evening']

const dummyRoutine: routine = dummyData[2].routine_data

function FAIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

function EditIcon() {
    return (
        <Pressable style={styles.editIcon}>
            <FAIcon name='edit' color='white' />
        </Pressable>
    )
}

export default function RoutineDetails() {
    const router = useRouter()
    const [isEnabled, setIsEnabled] = useState(false); // false - habit, true - routine
    const [habitName, setHabitName] = useState<string | undefined>(dummyRoutine.title);
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(dummyRoutine.start_date)) // DATE -  passed to database in UTC format YYYY-MM-DD,
    const [selectedRoutine, setSelectedRoutine] = useState<string>('');
    const [skipDays, setSkipDays] = useState<boolean[]>(dummyRoutine.frequency ? dummyRoutine.frequency : Array(7).fill(true));
    const [intention, setIntention] = useState<string | undefined>(dummyRoutine.intention);
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const selectedColor = useSharedValue(dummyRoutine.color);
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

    const handleSubmit = () => {
        // submit selected state with a fetch
        // display loading feedback
        // switch to journal page, which should fetch an updated list
        // if (canSubmit) {
        // }
        router.dismissAll()
    }

    const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type 

    return (
        <GestureHandlerRootView style={styles.createHabitContainer}>
            <KeyboardAvoidingView style={styles.createHabitContainer} behavior='height' keyboardVerticalOffset={100}>
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
                        <Text style={styles.formTitle}>Edit Frequency:</Text>
                        <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <FlatList
                                horizontal={true}
                                scrollEnabled={false}
                                data={weekdays}
                                keyExtractor={(item, index) => item + index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <DayButton index={index} day={item} skipDays={skipDays} setSkipDays={setSkipDays} color={'#4fa8cc'} />
                                    )
                                }}
                            />
                        </View>
                    </View >
                    <View style={styles.divider} />
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Edit Custom Color</Text>
                        <AppColorPicker selectedColor={selectedColor} backgroundColorStyle={backgroundColorStyle} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Edit Intention</Text>
                        <TextInput style={[styles.textInputForm, { lineHeight: 20, textAlign: 'left', textAlignVertical: 'top' }]} placeholderTextColor={'white'} multiline={true} value={intention} onChangeText={setIntention} />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#4fa8cc' }]} onPress={() => handleSubmit()} accessibilityLabel='Create your new habit.'
                        activeOpacity={0.85}>
                        <Text>Save Changes</Text>
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