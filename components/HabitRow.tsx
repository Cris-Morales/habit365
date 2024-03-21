import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import HabitButton from '@/components/HabitButton';

interface listData {
    title: string;
    data: string;
}


export default function HabitRow({ habitData, habitsComplete, setHabitsComplete, routineNull }: any) {
    const [currentStreak, setCurrentStreak] = useState<number>(habitData.current_streak);
    const [hitTotal, setHitTotal] = useState<number>(habitData.hit_total);
    const [perHit, setPerHit] = useState<number>(habitData.total_days ? Math.round(habitData.hit_total / habitData.total_days * 1000) / 10 : 0);

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

    const statsUpdate = (isChecked: boolean): void => {
        if (isChecked) {
            setCurrentStreak(currentStreak + 1)
            setHitTotal(hitTotal + 1)
            setHabitsComplete(habitsComplete + 1)
            setPerHit(Math.round((hitTotal + 1) / habitData.total_days * 1000) / 10)
        } else {
            setCurrentStreak(currentStreak - 1)
            setHitTotal(hitTotal - 1)
            setHabitsComplete(habitsComplete - 1)
            setPerHit(Math.round((hitTotal - 1) / habitData.total_days * 1000) / 10)
        }
        // triggers a database update, do not update state until we receive an okay from the transaction function, ie. The Tanstack Query function. For now it's just a simple state function update.
    }

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

    return (
        <View style={[styles.habitView, routineNull && { borderWidth: 1, borderColor: 'gray', marginTop: 10, height: 90 }]}>
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
            <HabitButton statsUpdate={statsUpdate} habitColor={habitData.color} />
            <View style={{
                marginHorizontal: 2,
                backgroundColor: 'transparent'

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
        borderRadius: 16,
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
