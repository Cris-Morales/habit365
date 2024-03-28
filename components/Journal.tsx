import { StyleSheet, FlatList, Modal } from 'react-native';
import { View, Text } from '@/components/Themed';
import RoutineComponent from '@/components/RoutineComponent';
import useJournalData from '@/utils/useJournalData';
import { indexDataShape } from '@/components/types/dataTypes';
import { SQLiteDatabase } from 'expo-sqlite/next';
import { useEffect, useState } from 'react';


export default function Journal({ db, journalPage }: { db: SQLiteDatabase, journalPage: number }) {
    const journalData: indexDataShape[] | null = useJournalData(db, journalPage);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        if (journalData) {
            setIsLoading(false);
        }
    }, [journalData]);

    return (

        <View style={styles.container}>
            {(journalData != null) ?
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
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 24 }}>
                        No Data
                    </Text>
                </View>}
            <Modal animationType='fade'
                transparent={true}
                visible={isLoading}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000000a9',
                }} >
                    <Text style={{
                        marginBottom: 5,
                        textAlign: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20
                    }}>
                        Loading...
                    </Text>
                </View >
            </Modal>
        </View >

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
