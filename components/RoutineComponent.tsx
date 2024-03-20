import { StyleSheet, FlatList, SectionList } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
import RoutineHeader from './RoutineHeader';
import HabitRow from './HabitRow';
import { indexDataShape } from './types/dataTypes';

export default function RoutineComponent({ routine_data, routine_habits }: any) {

    // makes db query to routine entries
    // routes to routine modal

    // edge cases, what happens if a habit's routine is null?
    // just doesn't display the routine row component
    // displays that list on top
    const [routineProgress, setRoutineProgress] = useState<number>(0)
    return (
        <View style={[styles.routineContainer, (routine_data != null) && { borderWidth: 1, borderColor: 'gray' }]}>
            {(routine_data != null) &&
                <RoutineHeader routine_data={routine_data} routineProgress={routineProgress} routineLength={routine_habits.length} />
            }
            <View style={[styles.habitRowContainer, { marginVertical: 10 }]}>
                <FlatList
                    scrollEnabled={true}
                    data={routine_habits}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => {
                        return (<HabitRow habitData={item} setRoutineProgress={setRoutineProgress} routineProgress={routineProgress} routineNull={routine_data == null} />)
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
        marginVertical: 2.5
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
