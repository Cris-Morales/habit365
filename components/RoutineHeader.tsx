import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import { routine } from './types/propTypes';

interface listData {
    title: string;
    data: string;
}

export default function RoutineHeader(routine_data: any) {
    const [streak, setStreak] = useState<number>(routine_data.current_streak)
    const [total, setTotal] = useState<number>(routine_data.total_days)
    const [perHit, setPerHit] = useState<number>(Math.round(total / routine_data.date_diff * 1000) / 10)


    const openHabitModal = () => {
        router.navigate(
            {
                pathname: 'routineDetails',
                params: {
                    id: routine_data.id,
                    title: routine_data.title
                }
            }
        )
    }
    const statsUpdate = (isChecked: boolean): void => {
        if (isChecked) {
            setStreak(streak + 1)
            setTotal(total + 1)
            setPerHit(Math.round((total + 1) / routine_data.date_diff * 1000) / 10)
        } else {
            setStreak(streak - 1)
            setTotal(total - 1)
            setPerHit(Math.round((total - 1) / routine_data.date_diff * 1000) / 10)
        }
        // triggers a database update, do not update state until we receive an okay from the transaction function, ie. The Tanstack Query function. For now it's just a simple state function update.
    }

    return (
        <View style={styles.habitView}>
            <Pressable onLongPress={openHabitModal} style={styles.modalButton}>
                <View style={{
                    flex: 0.75,
                    justifyContent: 'center',
                }}>
                    <Text style={styles.habitText}>
                        {routine_data.title}
                    </Text>
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    habitView: {
        height: 75,
        paddingVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingLeft: 5,
        marginHorizontal: 2,
        marginTop: 5,
    },
    modalButton: {
        flex: 1,
    },
    habitText: {
        flexDirection: 'row',
        marginRight: 10,
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems: 'center',
        fontSize: 20,
    },
});
