import { StyleSheet, FlatList } from 'react-native';
import { View } from '@/components/Themed';
import HabitRow from '@/components/HabitRow';
import dummyData from '@/components/dummyData';
import RoutineComponent from '@/components/RoutineComponent';
import openDatabase from '@/utils/dbInit';

export default function TabOneScreen() {

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        data={dummyData}
        keyExtractor={(item, index) => item.routine_data.title + index}
        renderItem={({ item }) => {
          return (
            < RoutineComponent routine_data={item.routine_data} routine_habits={item.routine_habits} />
          )
        }}
      />
    </View >

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
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
