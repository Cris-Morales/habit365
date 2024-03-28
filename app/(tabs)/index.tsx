import { StyleSheet, FlatList, AppState, Pressable } from 'react-native';
import { View, Text } from '@/components/Themed';
import RoutineComponent from '@/components/RoutineComponent';
import { useSQLiteContext } from 'expo-sqlite/next';
import useJournalData from '@/utils/useJournalData';
import { indexDataShape } from '@/components/types/dataTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayDateObj = new Date();


export default function TabOneScreen() {
  const db = useSQLiteContext();
  const journalData: indexDataShape[] | null = useJournalData(db);

  useEffect(() => {
    const getAllEntryDates = async () => {
      const results = await db.getAllAsync(`SELECT DISTINCT entry_date FROM habit_entries ORDER BY entry_date DESC;`)
      console.log(results);
    }

    getAllEntryDates();
  }, [])

  return (
    <View style={styles.container}>
      {journalData != null ?
        <>
          <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', height: '7%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pressable>
              <AntDesign size={25} style={{ marginHorizontal: 5 }} name="left" color='white' />
            </Pressable>
            <Text style={{ fontSize: 16 }}>{weekdays[todayDateObj.getDay()]}, {todayDateObj.toLocaleDateString()}</Text>
            <Pressable>
              <AntDesign size={25} style={{ marginHorizontal: 5 }} name="right" color='white' />
            </Pressable>
          </View>
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
          />
        </>
        :
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
