import { StyleSheet, FlatList, AppState, Pressable } from 'react-native';
import { View, Text } from '@/components/Themed';
import RoutineComponent from '@/components/RoutineComponent';
import { useSQLiteContext } from 'expo-sqlite/next';
import useJournalData from '@/utils/useJournalData';
import { indexDataShape } from '@/components/types/dataTypes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import Journal from '@/components/Journal';
import useDateEntriesLength from '@/utils/useDateEntriesLength';
const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayDateObj = new Date();

const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'


export default function TabOneScreen() {
  const [journalPage, setJournalPage] = useState<number>(0);
  const [date, setDate] = useState<Date | null>(null);
  const db = useSQLiteContext();
  const dateLength = useDateEntriesLength(db);

  useEffect(() => {
    const queryData = async () => {
      try {
        const journalDate: any = await db.getFirstAsync(`SELECT DISTINCT entry_date FROM habit_entries ORDER BY entry_date DESC LIMIT 1 OFFSET ?;`, journalPage);
        console.log(journalDate);
        if (journalDate.entry_date) {
          setDate(new Date(journalDate.entry_date + fullOffset));
        } else {
          console.log('no entries for this date index');
        }
      } catch (error) {
        console.error('Error in Journal Data Query: ', error);
      }
    }

    queryData();
  }, [journalPage])

  console.log('reached date limit: ', journalPage + 1 === dateLength);

  return (
    <View style={styles.container}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', height: '7%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pressable onPress={() => (journalPage + 1) != dateLength && setJournalPage(journalPage + 1)}>
          <AntDesign size={25} style={{ marginHorizontal: 5 }} name="left" color='white' />
        </Pressable>
        {date && dateLength ?
          <Text style={{ fontSize: 16 }}>{weekdays[date?.getDay()]}, {date?.toLocaleDateString()}</Text>
          : <Text>No Date</Text>}
        <Pressable onPress={() => journalPage != 0 && setJournalPage(journalPage - 1)}>
          <AntDesign size={25} style={{ marginHorizontal: 5 }} name="right" color='white' />
        </Pressable>
      </View>

      <Journal db={db} journalPage={journalPage} />
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
