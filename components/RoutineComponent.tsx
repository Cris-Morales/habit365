import { StyleSheet, FlatList, SectionList } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
import RoutineHeader from './RoutineHeader';
import HabitRow from './HabitRow';
import { dataShape } from './types/propTypes';

export default function RoutineComponent({ routine_data, routine_habits }: dataShape) {

    // makes db query to routine entries
    // routes to routine modal

    // edge cases, what happens if a habit's routine is null?
    // just doesn't display the routine row component
    // displays that list on top

    return (
        <View style={styles.routineContainer}>
            <RoutineHeader routine_data={routine_data} />
            <FlatList
                scrollEnabled={true}
                data={routine_habits}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => {
                    return (<HabitRow habitData={item} />)
                }}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    routineContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 16,
    },
    container: {
        flex: 1,
        marginHorizontal: 16,
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
});
