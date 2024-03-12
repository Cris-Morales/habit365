import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import dummyData from '@/components/dummyData';
import { routine } from '@/components/types/dataTypes';
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';

const RoutineDummyData: routine = dummyData[0].routine_data;


export default function RoutineDetails() {
  const params: any = useLocalSearchParams(); // see RoutineParams, will not accept it as a type interface.
  const [showModal, setShowModal] = useState(false);

  // must fetch the additional data on load
  // fetch data from passed id/title, and create fetch for updates

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={{ backgroundColor: RoutineDummyData.color, width: 60, height: 60, borderRadius: 30, marginRight: 10, marginLeft: -30 }} />
        <Text style={styles.title} >{params.title}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="gray" />
      <View style={styles.statContainer}>
        <Text style={styles.subTitle}>Start Date: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>{RoutineDummyData.start_date}</Text></Text>
        <Text style={styles.subTitle}>Created At: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>{RoutineDummyData.created_at}</Text></Text>
        <Text style={styles.subTitle}>Current Streak: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>{RoutineDummyData.current_streak}</Text></Text>
        <Text style={styles.subTitle}>Total Hits: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>
          {RoutineDummyData.total_days}</Text>
        </Text>
        <Text style={styles.subTitle}>Percentage Hit Since Start Date: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>
          {Math.round((RoutineDummyData.total_days) / RoutineDummyData.date_diff * 1000) / 10}%</Text>
        </Text>
        <Text style={styles.subTitle}>Longest Streak: <Text style={{ fontWeight: 'bold', color: RoutineDummyData.color }}>
          {RoutineDummyData.longest_streak}</Text>
        </Text>
        <Text>Best 100% Streak</Text>
        <Text>Average Completion</Text>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="gray" />
      <View style={styles.statContainer}>
        <Text style={[styles.subTitle, { fontStyle: 'italic' }]}>Calender Coming Soon!</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="gray" />
      <View style={styles.statContainer}>
        <Text style={styles.subTitle}>Routine Intention</Text>
        <View>
          <Text style={{ textAlign: 'left', fontWeight: 'bold', color: RoutineDummyData.color, fontSize: 16 }}>{RoutineDummyData.intention ? RoutineDummyData.intention : 'Intention not defined.'}</Text>
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
        <DeleteModal action={'Routine'} id={params.id} showModal={showModal} setShowModal={setShowModal} />
      </Modal>
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