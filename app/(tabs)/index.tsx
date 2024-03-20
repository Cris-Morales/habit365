import { StyleSheet, FlatList } from 'react-native';
import { View, Text } from '@/components/Themed';
import RoutineComponent from '@/components/RoutineComponent';
import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { indexQueryChecks, journalQuery } from '@/utils/indexQueries';

export default function TabOneScreen() {
  const [habitsInDatabase, setHabitsInDatabase] = useState<boolean>(false);
  const [journalData, setJournalData] = useState<any>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    const asyncJournalQuery = async () => {
      try {
        console.log('index query');
        const entriesInitiated: boolean | Error = await indexQueryChecks(db);
        if (entriesInitiated) {
          setHabitsInDatabase(true);
          const queryJournalData = await journalQuery(db);
          setJournalData(queryJournalData)
        } else {
          setHabitsInDatabase(false);
        }
      } catch (error) {
        console.error('Error in indexQuery: ', error);
      }
    }
    asyncJournalQuery();
  }, [])

  return (
    <View style={styles.container}>
      {habitsInDatabase ?
        <FlatList
          scrollEnabled={true}
          data={journalData}
          keyExtractor={(item, index) => {
            return (item.routine_data ? item.routine_data.title : 'undefined' + index)
          }}
          renderItem={({ item }) => {
            return (
              < RoutineComponent routine_data={item.routine_data} routine_habits={item.routine_habits} />
            )
          }}
        /> :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 24 }}>
            No Habits In the Database
          </Text>
        </View>}
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
