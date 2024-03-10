import { StyleSheet, Pressable, FlatList, Button, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import DayButton from '@/components/DayButton';
import AppDatePicker from '@/components/AppDatePicker';
import { Picker } from '@react-native-picker/picker';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// import dummyData from '@/components/dummyData';

export default function TabThreeScreen() {
    const [routineName, setroutineName] = useState<string | undefined>();
    const [startDate, setStartDate] = useState<Date | undefined>(new Date()) // DATE -  passed to database in UTC format YYYY-MM-DD, or whatever I feel like
    const [skipDays, setSkipDays] = useState<boolean[]>(Array(7).fill(true));
    const [showValues, setShowValues] = useState<boolean>(false);
    const [intention, setIntention] = useState<string>('');
    const [canSubmit, setCanSubmit] = useState<boolean>(false);
    const selectedColor = useSharedValue('#75faff');
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

    const handleSubmit = () => {
        // submit selected state with a fetch
        // display loading feedback
        // switch to journal page, which should fetch an updated list
        // reset all state after submit
        if (canSubmit) {
            setShowValues(!showValues);
        }
    }

    return (
        <GestureHandlerRootView style={styles.createRoutineContainer}>
            <KeyboardAvoidingView style={styles.createRoutineContainer} behavior='height' keyboardVerticalOffset={100}>
                <ScrollView style={styles.createRoutineContainer}>
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Routine Name</Text>
                        <TextInput style={styles.textInputForm} maxLength={40} placeholderTextColor={'white'} placeholder='ex. Morning Routine' onChangeText={(text) => {
                            if (text.length) {
                                setCanSubmit(true);
                                setroutineName(text);
                            } else {
                                setCanSubmit(false);
                                setroutineName(text);
                            }
                        }} />
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
                                        <DayButton index={index} day={item} skipDays={skipDays} setSkipDays={setSkipDays} color={'#e17c30'} />
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
                        <TextInput style={styles.textInputForm} placeholderTextColor={'white'} placeholder='ex. To Start My Day On the Right Path' onChangeText={setIntention} />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: canSubmit ? '#e17c30' : 'gray' }]} onPress={() => handleSubmit()} accessibilityLabel='Create your new routine.'
                        activeOpacity={canSubmit ? 0.85 : 1.0}>
                        <Text>Create Routine</Text>
                    </TouchableOpacity>
                    {/* {showValues ? <Text>{selectedColor.value}, {routineName}, {startDate?.toLocaleDateString()}, {intention}, {skipDays.toString()}, {selectedRoutine}</Text> : null} */}
                    {/* feedback for testing */}
                </ScrollView>
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