import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import HabitButton from '@/components/HabitButton';
import HabitRow from '@/components/HabitRow';

const dummyData = {
  start_data: '2024-01-01',
  title: 'Meditation',
  created_at: '2024-01-01',
  color: '#e6e600',
  current_streak: 6,
  total_days: 50,
  date_diff: 60,
  id: 1
}

interface listData {
  title: string;
  data: string;
}

export default function TabOneScreen() {
  const [streak, setStreak] = useState<number>(dummyData.current_streak)
  const [total, setTotal] = useState<number>(dummyData.total_days)
  const [perHit, setPerHit] = useState<number>(Math.round(total / dummyData.date_diff * 1000) / 10)

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
      data: `${total} / ${dummyData.date_diff}`
    }
  ]



  const openHabitModal = () => {
    router.navigate(
      {
        pathname: 'modal',
        params: {
          id: dummyData.id,
          title: dummyData.title
        }
      }
    )
  }

  const statsUpdate = (isChecked: boolean): void => {
    if (isChecked) {
      setStreak(streak + 1)
      setTotal(total + 1)
      setPerHit(Math.round((total + 1) / dummyData.date_diff * 1000) / 10)
    } else {
      setStreak(streak - 1)
      setTotal(total - 1)
      setPerHit(Math.round((total - 1) / dummyData.date_diff * 1000) / 10)
    }
    // triggers a database update, do not update state until we receive an okay from the transaction function, ie. The Tanstack Query function. For now it's just a simple state function update.
  }

  const HabitData = ({ item }: { item: listData }) => {
    return (
      <View style={styles.habitStats}>
        <Text>
          {item.title}
        </Text>
        <Text>
          {item.data}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <HabitRow habitData={dummyData} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitView: {
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    marginTop: 5,
  },
  modalButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
  },
  habitText: {
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'center',
    textAlign: 'justify',
    alignItems: 'center',
    fontSize: 16,
  },
  habitButton: {
    backgroundColor: 'green',
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
  },
});
