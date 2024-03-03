import { StyleSheet, FlatList } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
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
// routines

export default function TabOneScreen() {

  // const HabitData = ({ item }: { item: listData }) => {
  //   return (
  //     <View style={styles.habitStats}>
  //       <Text>
  //         {item.title}
  //       </Text>
  //       <Text style={{
  //         fontWeight: 'bold',
  //         color: habitData.color
  //       }}>
  //         {item.data}
  //       </Text>
  //     </View>
  //   )
  // }

  return (
    <View style={styles.container}>
      <View style={{
        marginHorizontal: 2
      }}>
        {/* <FlatList
          horizontal={true}
          scrollEnabled={false}
          data={dataArray}
          keyExtractor={item => item.title}
          renderItem={HabitData}
          ListFooterComponentStyle={styles.statsContainer}
        /> */}
      </View>
      <HabitRow habitData={dummyData} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
