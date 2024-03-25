import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import dummyData from '@/components/dummyData';
import { habit, habitDetails } from '@/components/types/dataTypes';
import { useEffect, useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { useSQLiteContext } from 'expo-sqlite/next';

const todayDateObj = new Date();
const todayYear = todayDateObj.getFullYear();
const todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
const todayDay = String(todayDateObj.getDate()).padStart(2, '0');
const today = `${todayYear}-${todayMonth}-${todayDay}`;


// need date logic mixing utc and local isnt going to work
export default function HabitDetails() {
  const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type interface.
  const [showModal, setShowModal] = useState(false);
  const [habitDetails, setHabitDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [createdAtDateObj, setCreatedAtDateObj] = useState<Date>();
  const [startedAtDateObj, setStartedAtDateObj] = useState<Date>();

  const db = useSQLiteContext();

  useEffect(() => {
    const queryData = async () => {
      try {
        !isLoading && setIsLoading(true);
        const habitData: any = await db.getFirstAsync(`
                SELECT habits.color, habits.created_at, habits.id, habits.intention, habits.longest_streak, habits.routine_id, habits.start_date, habits.title, habit_entries.current_streak, habit_entries.total_days, habit_entries.hit_total, routines.title AS routine_title
                FROM habits 
                LEFT JOIN routines 
                ON habits.routine_id = routines.id 
                JOIN habit_entries
                ON habits.id = habit_entries.habit_id
                WHERE habits.id = ?
                AND
                habit_entries.entry_date = ?`, params.id, today);

        const frequency: any[] = await db.getAllAsync(`
                SELECT days.day_name 
                FROM days
                JOIN habits_days_frequency
                ON days.id = habits_days_frequency.day_id
                WHERE habits_days_frequency.habit_id = ?
                `, params.id);

        if (frequency) {
          habitData.frequency = frequency.map(data => data.day_name);
        }

        const createdAtDate = new Date(habitData.created_at);
        const startDate = new Date(habitData.start_date);
        const testDate = new Date();
        // console.log(createdAtDate, startDate.toLocaleString(undefined, {
        //   weekday: 'short',
        //   month: 'short',
        //   day: 'numeric',
        //   year: 'numeric'
        // }));

        console.log('created at: ', habitData.created_at, createdAtDate.toISOString()); // local: 3/24/2024, 2:35:42 AM - which is GMT, SQL inserts | 2024-03-24T07:35:42.000Z
        console.log('start date: ', habitData.start_date, startDate.toISOString()); // local: 3/23/2024, 7:00:00 PM idek - inserted with short date string | 2024-03-24T00:00:00.000Z - weird, it 
        console.log('test date for this moment: ', testDate.toISOString()); // local, created this moment: 3/23/2024, 9:50:00 PM | 2024-03-24T02:54:31.096Z
        const tDateObj = new Date();
        const tYear = todayDateObj.getFullYear();
        const tMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
        const tDay = String(todayDateObj.getDate()).padStart(2, '0');
        const t = `${todayYear}-${todayMonth}-${todayDay}`;

        // created at:  2024-03-23T10:16:05.000Z - iterally when this habit was created
        // start date: 2024-03 - 23T00:00:00.000Z  - literally at midnight 3-23-2024 UTC
        // test date for this moment: 2024-03 - 24T02: 26: 13.005Z - literally what UTC sql is


        // LOG  created at: 3 / 23 / 2024
        // LOG  start date: 3 / 22 / 2024 
        // LOG  test date(for this moment 3 / 23 / 2024


        setHabitDetails(habitData);
        setCreatedAtDateObj(new Date(habitData.created_at));
        setStartedAtDateObj(new Date(habitData.start_date));
        setIsLoading(false);
      } catch (error) {
        console.error('Error in Habit Details Data Query: ', error);
      }
    }

    queryData();

  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <>
        <Text>
          Loading...
        </Text>
      </> :
        <>
          <View style={styles.titleContainer}>
            <View style={[styles.habitBubble, { backgroundColor: habitDetails.color }]} />
            <Text style={styles.title}>{params.title}</Text>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={styles.subTitle}>Start Date: <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>{startedAtDateObj?.toDateString()}</Text>
            </Text>
            <Text style={styles.subTitle}>Created At: <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>{createdAtDateObj?.toDateString()}</Text>
            </Text>
            <Text style={styles.subTitle}>Current Streak:
              <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>
                {habitDetails?.current_streak}
              </Text>
            </Text>
            <Text style={styles.subTitle}>Total Hits:
              <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>
                {habitDetails?.hit_total}
              </Text>
            </Text>
            <Text style={styles.subTitle}>
              Percentage Hit Since Start Date:
              <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>
                {habitDetails?.total_days ? Math.round(habitDetails?.hit_total / habitDetails?.total_days * 1000) / 10 : 0}%
              </Text>
            </Text>
            <Text style={styles.subTitle}>
              Longest Streak:
              <Text style={{ fontWeight: 'bold', color: habitDetails?.color }}>
                {habitDetails?.longest_streak}
              </Text>
            </Text>
          </View>

          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={[styles.subTitle, { fontStyle: 'italic' }]}>Calender Coming Soon!</Text>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={styles.subTitle}>Habit Intention</Text>
            <View>
              <Text style={{ textAlign: 'left', fontWeight: 'bold', color: habitDetails?.color, fontSize: 16 }}>{habitDetails?.intention ? habitDetails?.intention : 'Intention not defined.'}</Text>
            </View>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={[styles.statContainer, { alignItems: 'center' }]}>
            <Pressable style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'gray' : 'transparent',
              },
              styles.modalButtons
            ]} onPress={() => router.navigate(
              {
                pathname: "/edit-habit", params: {
                  id: params.id,
                  title: params.title
                }
              }
            )}>
              <Text style={styles.modalTitle}>
                Edit Habit
              </Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'gray' : 'transparent',
              },
              styles.modalButtons
            ]} onPress={() => setShowModal(true)}>
              <Text style={[styles.modalTitle, { color: 'red' }]}>
                Delete Habit
              </Text>
            </Pressable>
          </View>
          <Modal animationType='fade'
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              setShowModal(!showModal);
            }}>
            <DeleteModal action={'Habit'} id={params.id} showModal={showModal} setShowModal={setShowModal} />
          </Modal>
        </>}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  titleContainer: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  subTitle: {
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: 'center'
  },
  statContainer: {
    marginVertical: 10,
    paddingHorizontal: 30,
  },
  separator: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopColor: 'gray',
    margin: 5
  },
  modalButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingVertical: 5,
    width: '33%',
    margin: 10,
  },
  modalTitle: {
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  habitBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: -30
  }
});