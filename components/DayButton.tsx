import { StyleSheet, FlatList, Pressable } from 'react-native';
import { View, Text } from '@/components/Themed';
import HabitRow from '@/components/HabitRow';
import dummyData from '@/components/dummyData';
import RoutineComponent from '@/components/RoutineComponent';
import { useState } from 'react';



export default function DayButton({ index, day, skipDays, setSkipDays }: any) {
    const [pressed, setPressed] = useState<boolean>(true);

    const handlePress = () => {
        const eventValue: boolean = pressed ? false : true
        setPressed(eventValue);
        const newSkipDays = [...skipDays];
        newSkipDays[index] = eventValue;
        setSkipDays(newSkipDays);
    };

    return (
        <Pressable style={[styles.dayButtonsContainer, { backgroundColor: pressed ? '#4fa8cc' : 'transparent' }]} onPress={handlePress}>
            <Text style={styles.dayButtons}>
                {day.charAt(0)}
            </Text>
        </Pressable>
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