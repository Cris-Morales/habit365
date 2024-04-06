import { StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import HabitButton from '@/components/HabitButton';
import { habit } from './types/dataTypes';
import { useSQLiteContext } from 'expo-sqlite/next';
import { err } from 'react-native-svg';

interface listData {
    title: string;
    data: string;
}

interface props {
    habitData: habit;
    habitsComplete: any;
    setHabitsComplete: any;
    routineNull: boolean;
    routineEntryId: number | undefined;
    journalPage: number;
}



export default function HabitRow({ habitData, setHabitsComplete, routineNull, routineEntryId, journalPage }: props) {
    const [currentStreak, setCurrentStreak] = useState<number>(habitData.current_streak);
    const [hitTotal, setHitTotal] = useState<number>(habitData.hit_total);

    const db = useSQLiteContext();


    const openHabitModal = () => {
        router.navigate(
            {
                pathname: 'habit-details',
                params: {
                    id: habitData.id,
                    title: habitData.title
                },
            }
        )
    }

    const statsUpdate = async (isChecked: boolean) => {

        try {
            if (isChecked) {
                // is this a new personal best? set pr in entry to true, and display that on details
                await db.runAsync(`
                UPDATE habit_entries SET hit_total = hit_total + 1, current_streak = current_streak + 1, status = 2 WHERE habit_entries.id = ?`, habitData.entry_id);

                if (routineEntryId) {
                    await db.runAsync(`
                    UPDATE routine_entries SET habits_complete = habits_complete + 1 WHERE id = ?
                    `, routineEntryId);
                }


                // could execute in one query

                const newPrData: any = await db.getFirstAsync(`
                SELECT habit_entries.current_streak, habits.longest_streak
                FROM habit_entries
                JOIN habits
                ON
                habit_entries.habit_id = habits.id
                WHERE 
                habit_entries.id = ?
                `, habitData.entry_id);
                if (newPrData.current_streak > newPrData.longest_streak) {
                    await db.runAsync(`
                    UPDATE habit_entries SET new_streak_pr = true WHERE habit_entries.id = ?`, habitData.entry_id);
                }


            } else {
                // changing your mind or just messing around
                // update current streak, hit total, 
                await db.runAsync(`
                UPDATE habit_entries SET hit_total = hit_total - 1, current_streak = current_streak - 1, status = 0 WHERE habit_entries.id = ?`, habitData.entry_id);
                if (routineEntryId) {
                    await db.runAsync(`
                    UPDATE routine_entries SET habits_complete = habits_complete - 1 WHERE id = ?
                    `, routineEntryId);
                }

                // could execute in one query
                const wasPr: any = await db.getFirstAsync(`
                SELECT new_streak_pr 
                FROM habit_entries
                WHERE 
                habit_entries.id = ?
                `, habitData.entry_id);

                if (wasPr.new_streak_pr) {
                    await db.runAsync(`
                    UPDATE habit_entries SET new_streak_pr = false WHERE habit_entries.id = ?`, habitData.entry_id);
                }
            }

            // Confirm database results, could probably accomplish this in singular queries
            const confirmResults: any = await db.getFirstAsync(`
                SELECT habit_entries.current_streak, habit_entries.hit_total, habit_entries.total_days
                FROM habit_entries
                WHERE habit_entries.id = ?`, habitData.entry_id);
            if (routineEntryId) {
                const confirmRoutineResults: any = await db.getFirstAsync(`
                    SELECT routine_entries.habits_complete FROM routine_entries WHERE id = ?`, routineEntryId);
                setHabitsComplete(confirmRoutineResults.habits_complete);
            }

            setCurrentStreak(confirmResults.current_streak);
            setHitTotal(confirmResults.hit_total);
        } catch (error) {
            console.error('error in stats update: ', error);

        }
    }

    return (
        <View style={[styles.habitView, routineNull ? { borderWidth: 1, borderRadius: 16, borderColor: 'gray', marginTop: 10, height: 90 } : { borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'gray', marginTop: 10, height: 90 }]}>
            <Pressable onLongPress={openHabitModal} style={styles.modalButton}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'transparent'

                }}>
                    <Text style={styles.habitText}>
                        {habitData.title}
                    </Text>
                </View>
            </Pressable>
            <HabitButton statsUpdate={statsUpdate} habitColor={habitData.color} status={habitData.status} journalPage={journalPage} />
            <View style={{
                marginHorizontal: 2,
                backgroundColor: 'transparent',
                flexDirection: 'row'
            }}>
                <View style={styles.habitStats}>
                    <Text>
                        Hit Rate
                    </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: habitData.color,
                        backgroundColor: 'transparent'

                    }}>
                        {habitData.total_days ? Math.round(hitTotal / habitData.total_days * 1000) / 10 : 0}%
                    </Text>
                </View>
                <View style={styles.habitStats}>
                    <Text>
                        Streak
                    </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: habitData.color,
                        backgroundColor: 'transparent'

                    }}>
                        {currentStreak}
                    </Text>
                </View>
                <View style={styles.habitStats}>
                    <Text>
                        Total
                    </Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: habitData.color,
                        backgroundColor: 'transparent'

                    }}>
                        {hitTotal} / {habitData.total_days}
                    </Text>
                </View>
            </View>
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
        // borderRadius: 16,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        marginVertical: 2.5,
        backgroundColor: '#1c1c1c'
    },
    modalButton: {
        backgroundColor: 'transparent',
        width: '25%'

    },
    habitText: {
        flexDirection: 'row',
        marginRight: 10,
        justifyContent: 'flex-start',
        textAlign: 'left',
        alignItems: 'center',
        fontSize: 16,
        backgroundColor: 'transparent'

    },
    statsContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        backgroundColor: 'transparent'

    },
    habitStats: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        height: 65,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginHorizontal: 2,
        alignSelf: 'center',
        backgroundColor: 'transparent'

    },
});
