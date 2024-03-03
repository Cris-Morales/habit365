import { StyleSheet, FlatList, SectionList } from 'react-native';
import { useState } from 'react';
import { View, Text } from '@/components/Themed';
import HabitRow from '@/components/HabitRow';
import dummyData from '@/components/dummyData';


export default function TabOneScreen() {

  const routineLists = (item: any) => {
    return (
      <View>
        <FlatList
          scrollEnabled={true}
          data={item}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => {
            return (<HabitRow habitData={item} />)
          }}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={true}
        data={dummyData}
        keyExtractor={(item, index) => item.routine_data.title + index}
        renderItem={({ item }) => {

          return (
            // <Text>{item.routine_data.title}</Text>
            routineLists(item.routine_habits)
          )
        }}
      />
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
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
