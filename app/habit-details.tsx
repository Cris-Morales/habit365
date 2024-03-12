import { StatusBar } from 'expo-status-bar';
import { GestureResponderEvent, Platform, Pressable, StyleSheet, Modal } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Text, View } from '@/components/Themed';
import dummyData from '@/components/dummyData';
import { habit } from '@/components/types/propTypes';
import { GestureHandlerEvent } from 'react-native-reanimated/lib/typescript/reanimated2/hook';
import { center } from '@shopify/react-native-skia';
import { useState } from 'react';
interface habitParams {
  title: string;
  id: number;
}

const habitDataDummy: habit = dummyData[0].routine_habits[0];


export default function ModalScreen() {
  const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type interface.

  const [modalVisible, setModalVisible] = useState(false);
  // either pass all habit data, and only create fetch for updates
  // or
  // fetch data from passed id/title, and create fetch for updates
  // ... don't think I can pass props to modal, maybe if I use useContext
  // but it's looking like I need to fetch as it loads, and create local state.

  // adding in dummy data to start making the stats and options, working with forms, and constructing the props and mock fetches.
  const modalAction = (event: GestureResponderEvent, action: string) => {
    if (action == 'edit') {
      router.navigate(
        {
          pathname: "/edit-habit", params: {
            id: habitDataDummy.id,
            title: habitDataDummy.title
          }
        }
      );
    } else if (action == 'delete') {
      // pop up modal not full modal
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={{ backgroundColor: habitDataDummy.color, width: 60, height: 60, borderRadius: 30, marginRight: 10, marginLeft: -30 }} />
        <Text style={styles.title}>{params.title}</Text>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="gray" />
      <View style={styles.statContainer}>
        <Text style={styles.subTitle}>Start Date: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>{habitDataDummy.start_date}</Text></Text>
        <Text style={styles.subTitle}>Created At: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>{habitDataDummy.created_at}</Text></Text>
        <Text style={styles.subTitle}>Current Streak: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>{habitDataDummy.current_streak}</Text></Text>
        <Text style={styles.subTitle}>Total Hits: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>
          {habitDataDummy.total_days}</Text>
        </Text>
        <Text style={styles.subTitle}>Percentage Hit Since Start Date: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>
          {Math.round((habitDataDummy.total_days) / habitDataDummy.date_diff * 1000) / 10}%</Text>
        </Text>
        <Text style={styles.subTitle}>Longest Streak: <Text style={{ fontWeight: 'bold', color: habitDataDummy.color }}>
          {habitDataDummy.longest_streak}</Text>
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
          <Text style={{ textAlign: 'left', fontWeight: 'bold', color: habitDataDummy.color, fontSize: 16 }}>{habitDataDummy.intention ? habitDataDummy.intention : 'Intention not defined.'}</Text>
        </View>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="gray" />
      <View style={[styles.statContainer, { alignItems: 'center' }]}>

        <Pressable style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'gray' : 'transparent',
          },
          styles.modalButtons
        ]} onPress={(event) => { modalAction(event, 'edit') }}>
          <Text style={styles.modalTitle}>
            Edit Habit
          </Text>
        </Pressable>
        <Pressable style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'gray' : 'transparent',
          },
          styles.modalButtons
        ]} onPress={() => setModalVisible(true)}>
          <Text style={[styles.modalTitle, { color: 'red' }]}>
            Delete Habit
          </Text>
        </Pressable>
      </View>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <Modal animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { color: 'black' }]}>Delete Habit?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              {/* 
                on press, need to make db transaction 
                have loading screen 'deleting {habit_name} from tanstack query
                redirect back to index on success
                refetch index data
                
                */}
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
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
  textInputForm: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    color: 'white',
    backgroundColor: '#696969',
    padding: 5,
    paddingLeft: 10,
    height: 40,
  },
  separator: {
    flexDirection: 'row',
    borderWidth: 1,
    borderTopColor: 'gray',
    margin: 5
  },
  submitButton: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
    width: '50%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    alignSelf: 'center'
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '15%',
    backgroundColor: '#00000099', // I would rather have animate do a smooth transition for the background

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});