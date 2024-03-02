import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

interface habitParams {
  title: string;
  id: number;
}

export default function ModalScreen() {
  const params: any = useLocalSearchParams(); // see habitParams, will not accept it as a type interface.


  // either pass all habit data, and only create fetch for updates
  // or
  // fetch data from passed id/title, and create fetch for updates
  // ... don't think I can pass props to modal, maybe if I use useContext
  // but it's looking like I need to fetch as it loads, and create local state.

  // adding in dummy data to start making the stats and options, working with forms, and constructing the props and mock fetches.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{params.title}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="app/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
  },
});
