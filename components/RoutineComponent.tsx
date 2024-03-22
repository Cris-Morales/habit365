import { StyleSheet, FlatList, SectionList } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
import RoutineHeader from './RoutineHeader';
import HabitRow from './HabitRow';
import { routine, habit, indexDataShape } from './types/dataTypes';

export default function RoutineComponent({ routine_data, routine_habits }: indexDataShape) {

    // makes db query to routine entries
    // routes to routine modal
    const [habitsComplete, setHabitsComplete] = useState<number | undefined>(routine_data?.habits_complete);


    return (
        <View style={[styles.routineContainer, (routine_data != null) && { borderWidth: 1, borderColor: 'gray' }]}>
            {(routine_data != null) &&
                <RoutineHeader routine_data={routine_data} habitsComplete={habitsComplete} totalHabits={routine_data.total_habits} />
            }
            <View style={[styles.habitRowContainer, { marginVertical: 10 }]}>
                <FlatList
                    scrollEnabled={true}
                    data={routine_habits}
                    keyExtractor={(item, index) => item.title + '-index-' + index + item.entry_id}
                    renderItem={({ item }) => {
                        return (<HabitRow habitData={item} habitsComplete={habitsComplete} setHabitsComplete={setHabitsComplete} routineNull={routine_data === null} routineEntryId={routine_data?.entry_id} />)
                    }}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    routineContainer: {
        // borderWidth: 1,
        // borderColor: 'gray',
        borderRadius: 16,
        paddingBottom: 2.5,
        flex: 1,
        marginVertical: 2.5,
    },
    habitRowContainer: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        width: '99%',
        backgroundColor: 'transparent',
        paddingHorizontal: 10
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: 'gray',
    },
    title: {
        fontSize: 24,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
