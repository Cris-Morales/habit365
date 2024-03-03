import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import HabitButton from '@/components/HabitButton';

interface listData {
    title: string;
    data: string;
}

interface props {
    habitData: habitData;
}
interface habitData {
    start_data: string;
    title: string;
    created_at: string;
    color: string;
    current_streak: number;
    total_days: number;
    date_diff: number;
    id: number
}


export default function HabitRow({ habitData }: props) {
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
            setPerHit(Math.round((total + 1) / habitData.date_diff * 1000) / 10)
        } else {
            setStreak(streak - 1)
            setTotal(total - 1)
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
                    color: habitData.color
                }}>
                    {item.data}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.habitView}>
            <Pressable onLongPress={openHabitModal} style={styles.modalButton}>
                <Text style={styles.habitText}>
                    {habitData.title}
                </Text>
            </Pressable>
            <HabitButton statsUpdate={statsUpdate} habitColor={habitData.color} />
            <View style={{
                marginHorizontal: 2
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
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingLeft: 5,
        marginHorizontal: 2,
        marginTop: 5,
    },
    modalButton: {
        // borderWidth: 1,
        // borderColor: 'gray',
        flex: 1,
    },
    habitText: {
        flexDirection: 'row',
        marginRight: 10,
        justifyContent: 'center',
        textAlign: 'justify',
        alignItems: 'center',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
    },
    habitStats: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 65,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        marginHorizontal: 2
    },
});
