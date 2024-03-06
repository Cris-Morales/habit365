import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import HabitButton from '@/components/HabitButton';

interface listData {
    title: string;
    data: string;
}


export default function HabitRow({ habitData, setRoutineProgress, routineProgress }: any) {
    const [streak, setStreak] = useState<number>(habitData.current_streak)
    const [total, setTotal] = useState<number>(habitData.total_days)
    const [perHit, setPerHit] = useState<number>(Math.round(total / habitData.date_diff * 1000) / 10)

    const dataArray: listData[] = [
        {
            title: 'Hit Rate',
            data: `${perHit}%`
        },
        {
            title: 'Streak',
            data: `${streak}`
        },
        {
            title: 'Total',
            data: `${total} / ${habitData.date_diff}`
        }
    ]

    const openHabitModal = () => {
        router.navigate(
            {
                pathname: 'modal',
                params: {
                    id: habitData.id,
                    title: habitData.title
                }
            }
        )
    }

    const statsUpdate = (isChecked: boolean): void => {
        if (isChecked) {
            setStreak(streak + 1)
            setTotal(total + 1)
            setRoutineProgress(routineProgress + 1)
            setPerHit(Math.round((total + 1) / habitData.date_diff * 1000) / 10)
        } else {
            setStreak(streak - 1)
            setTotal(total - 1)
            setRoutineProgress(routineProgress - 1)
            setPerHit(Math.round((total - 1) / habitData.date_diff * 1000) / 10)
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
        <View style={styles.habitView}>
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
        // borderWidth: 1,
        // borderColor: 'gray',
        borderRadius: 16,
        paddingLeft: 5,
        marginHorizontal: 2.5,
        marginVertical: 2.5,
        backgroundColor: '#1c1c1c'
    },
    modalButton: {
        flex: 1,
        backgroundColor: 'transparent'

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
