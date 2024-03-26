import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import dummyData from '@/components/dummyData';
import { routine } from '@/components/types/dataTypes';
import { useEffect, useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { useSQLiteContext } from 'expo-sqlite/next';


const todayDateObj = new Date();
const todayYear = todayDateObj.getFullYear();
const todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
const todayDay = String(todayDateObj.getDate()).padStart(2, '0');
const today = `${todayYear}-${todayMonth}-${todayDay}`;

export default function RoutineDetails() {
  const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type interface.
  const [showModal, setShowModal] = useState(false);
  const [routineDetails, setRoutineDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [createdAtDateObj, setCreatedAtDateObj] = useState<Date>();
  const [startedAtDateObj, setStartedAtDateObj] = useState<Date>();

  const db = useSQLiteContext();

  useEffect(() => {
    const queryData = async () => {
      try {
        !isLoading && setIsLoading(true);
        const routineData: any = await db.getFirstAsync(`
                SELECT routines.color, routines.created_at, routines.id, routines.intention, routines.id, routines.start_date, routines.title, routine_entries.habits_complete, routine_entries.total_habits
                FROM routines 
                JOIN routine_entries
                ON routines.id = routine_entries.routine_id
                WHERE routines.id = ?
                AND
                routine_entries.entry_date = ?`, params.id, today);

        const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
        const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
        const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
        const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
        const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'


        const averageCompletion: any = await db.getFirstAsync(`SELECT (SUM(habits_complete) * 1.0 / SUM(total_habits)) AS [Avg_Completion_Rate] FROM routine_entries WHERE routine_id = ?`, params.id);
        routineData.average_completion_rate = averageCompletion['Avg_Completion_Rate']



        console.log(routineData)
        setRoutineDetails(routineData);
        setCreatedAtDateObj(new Date(routineData.created_at));
        setStartedAtDateObj(new Date(routineData.start_date + fullOffset));
        setIsLoading(false);
      } catch (error) {
        console.error('Error in Habit Details Data Query: ', error);
      }
    }

    queryData();

  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? <View style={{ justifyContent: 'center', flex: 1 }}>
        <Text style={{ textAlignVertical: 'center', textAlign: 'center', fontSize: 20 }}>
          Loading...
        </Text>
      </View> :
        <>
          <View style={styles.titleContainer}>
            <View style={{ backgroundColor: routineDetails.color, width: 60, height: 60, borderRadius: 30, marginRight: 10, marginLeft: -30 }} />
            <Text style={styles.title} >{params.title}</Text>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={styles.subTitle}>Start Date: <Text style={{ fontWeight: 'bold', color: routineDetails.color }}>{startedAtDateObj?.toLocaleDateString()}</Text></Text>
            <Text style={styles.subTitle}>Created At: <Text style={{ fontWeight: 'bold', color: routineDetails.color }}>{createdAtDateObj?.toLocaleDateString()}</Text></Text>
            <Text style={styles.subTitle}>Today's Habits Complete: <Text style={{ fontWeight: 'bold', color: routineDetails.color }}>{routineDetails.habits_complete} / {routineDetails.total_habits}</Text></Text>
            <Text style={styles.subTitle}>Average Completion Rate: <Text style={{ fontWeight: 'bold', color: routineDetails.color }}>{routineDetails.average_completion_rate * 100}%</Text></Text>
          </View>

          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={[styles.subTitle, { fontStyle: 'italic' }]}>Calender Coming Soon!</Text>
          </View>
          <View style={styles.separator} lightColor="#eee" darkColor="gray" />
          <View style={styles.statContainer}>
            <Text style={styles.subTitle}>Routine Intention</Text>
            <View>
              <Text style={{ textAlign: 'left', fontWeight: 'bold', color: routineDetails.color, fontSize: 16 }}>{routineDetails.intention ? routineDetails.intention : 'Intention not defined.'}</Text>
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
                pathname: "/edit-routine", params: {
                  id: params.id,
                  title: params.title
                }
              }
            )}>
              <Text style={styles.modalTitle}>
                Edit Routine
              </Text>
            </Pressable>
            <Pressable style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'gray' : 'transparent',
              },
              styles.modalButtons
            ]} onPress={() => setShowModal(true)}>
              <Text style={[styles.modalTitle, { color: 'red' }]}>
                Delete Routine
              </Text>
            </Pressable>
          </View>
          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <Modal animationType='fade'
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
              setShowModal(!showModal);
            }}>
            <DeleteModal action={'Routine'} id={params.id} showModal={showModal} setShowModal={setShowModal} db={db} routineId={null} today={today} />
          </Modal>
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </>}
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
    width: '50%'
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
    width: '40%',
    margin: 10,
  },
  modalTitle: {
    fontSize: 16,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});