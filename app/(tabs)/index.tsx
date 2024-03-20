import { StyleSheet, FlatList } from 'react-native';
import { View } from '@/components/Themed';
import HabitRow from '@/components/HabitRow';
import dummyData from '@/components/dummyData';
import RoutineComponent from '@/components/RoutineComponent';
import openDatabase from '@/utils/dbInit';
import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { indexQueryChecks } from '@/utils/indexQueries';

export default function TabOneScreen() {
  const [habitsInDatabase, setHabitsInDatabase] = useState<boolean>(false);
  const [journalData, setJournalData] = useState<any>([]);
  const db = useSQLiteContext();

  // useEffect(() => {
  //   const asyncJournalQuery = async () => {
  //     try {
  //       const entriesInitiated: boolean | Error = await indexQueryChecks(db); // initiates today's journal entries
  //       if (entriesInitiated) {
  //         // grab journal data
  //       }
  //     } catch (error) {
  //       console.error('Error in indexQuery: ', error);
  //     }
  //   }
  //   asyncJournalQuery();
  // }, [])

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        data={dummyData}
        keyExtractor={(item, index) => {
          return (item.routine_data ? item.routine_data.title : 'undefined' + index)
        }}
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
