import { StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useColorScheme } from '@/components/useColorScheme';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router'

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

export default function TabOneScreen() {
  const [streak, setStreak] = useState<number>(dummyData.current_streak)
  const [total, setTotal] = useState<number>(dummyData.total_days)
  const [perHit, setPerHit] = useState<number>(Math.round(total / dummyData.date_diff * 1000) / 10)


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

  return (
    <View style={styles.container}>
      <View style={styles.habitView}>
        <Pressable onLongPress={openHabitModal}>
          <Text style={styles.habitText}>
            {dummyData.title}
          </Text>
        </Pressable>
        <BouncyCheckbox fillColor={dummyData.color} size={40} onPress={(isChecked: boolean) => {
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
        }}
        />
        <View style={styles.habitStats}>
          <Text>
            Hit Rate
          </Text>
          <Text>
            {perHit}%
          </Text>
        </View>
        <View style={styles.habitStats}>
          <Text>
            Streak
          </Text>
          <Text>
            {streak}
          </Text>
        </View>
        <View style={styles.habitStats}>
          <Text>
            Total
          </Text>
          <Text>
            {total} / {dummyData.date_diff}
          </Text>
        </View>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  habitButton: {
    backgroundColor: 'green',
  },
  habitView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 6
  },
  habitText: {
    marginRight: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  habitStats: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3
  }
});
