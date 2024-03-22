import { StyleSheet, Pressable, FlatList } from 'react-native';
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
}



export default function HabitRow({ habitData, habitsComplete, setHabitsComplete, routineNull, routineEntryId }: props) {
    const [currentStreak, setCurrentStreak] = useState<number>(habitData.current_streak);
    const [hitTotal, setHitTotal] = useState<number>(habitData.hit_total);
    const [perHit, setPerHit] = useState<number>(habitData.total_days ? Math.round(habitData.hit_total / habitData.total_days * 1000) / 10 : 0);

    const db = useSQLiteContext();

    const dataArray: listData[] = [
        {
            title: 'Hit Rate',
            data: `${perHit}%`
        },
        {
            title: 'Streak',
            data: `${currentStreak}`
        },
        {
            title: 'Total',
            data: `${hitTotal} / ${habitData.total_days}`
        }
    ]

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
                setCurrentStreak(currentStreak + 1);
                setHitTotal(hitTotal + 1);
                setHabitsComplete(habitsComplete + 1);
                setPerHit(Math.round((hitTotal + 1) / habitData.total_days * 1000) / 10);
                // update currentStreak
                // update hitTotal
                // if routine_id exists, update habits_complete
                // is this a new personal best? set pr in entry to true, and display that on details
                // else, continue

            } else {
                setCurrentStreak(currentStreak - 1);
                setHitTotal(hitTotal - 1);
                setHabitsComplete(habitsComplete - 1);
                setPerHit(Math.round((hitTotal - 1) / habitData.total_days * 1000) / 10);
                // changing your mind or just messing around

                // update current streak, hit total, 
                // if routine_id exists, decrement habits_complete
                // is new pr true? (need to see results for boolean)
                // if so, turn it false, display should be updated on details

                // indexQueries, ifPrev entry exists, check if it was a new pr, 
                // if true, update its longest_streak on habits table.
            }
        } catch (error) {
            console.error('error in stats update: ', error);

        }

        // triggers a database update, do not update state until we receive an okay from the transaction function, ie. The Tanstack Query function. For now it's just a simple state function update.
    }

    const dbHabitEntryUpdate = async (isChecked: boolean) => {
        try {
            const results = await db.runAsync(`UPDATE habit_entries SET status = ?, hit_total = hit_total, current_streak = ? WHERE habit_entries.id = ?;`, isChecked ? 2 : 0, isChecked ? habitData.hit_total + 1 : habitData.hit_total - 1, isChecked ? habitData.current_streak + 1 : habitData.current_streak - 1, habitData.entry_id);

            if (isChecked) {
                if ((habitData.current_streak + 1) > habitData.longest_streak) {
                    await db.runAsync(`UPDATE habits SET longest_streak = ? WHERE id = ?`, habitData.current_streak + 1, habitData.id);
                }
            } else {
                await db.runAsync(`UPDATE habits SET longest_streak = ? WHERE id = ?`, habitData.current_streak - 1, habitData.id);
            }
            // console.log(`habit ${habitData.title} entry changed: `, results.changes);
            if (routineEntryId) {
                const routineEntryResults = await db.runAsync(`UPDATE routine_entries SET habits_complete = ? WHERE id = ?`, isChecked ? habitsComplete + 1 : habitsComplete - 1, routineEntryId);
                console.log(`routine entry (entry id: ${routineEntryId}) changed: `, routineEntryResults.changes);
            }
        } catch (error) {
            console.log('error in habitEntryUpdate: ', error);
        }
    };


    const HabitData = ({ item }: { item: listData }) => {
        return (
            <View style={styles.habitStats}>
                <Text>
                    {item.title}
                </Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: habitData.color,
                    backgroundColor: 'transparent'

                }}>
                    {item.data}
                </Text>
            </View>
        )
    }
    //routineNull &&  in container view style
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
            <HabitButton statsUpdate={statsUpdate} habitColor={habitData.color} status={habitData.status} />
            <View style={{
                marginHorizontal: 2,
                backgroundColor: 'transparent',
            }}>
                <FlatList
                    horizontal={true}
                    scrollEnabled={false}
                    data={dataArray}
                    keyExtractor={item => item.title}
                    renderItem={HabitData}
                    ListFooterComponentStyle={styles.statsContainer}
                />
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
