import { Button, ScrollView, } from 'react-native';
import { View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';




export default function TabThreeScreen() {
    const db = SQLite.useSQLiteContext();


    const dropDatabase = async () => {
        try {
            await db.closeAsync();
            await SQLite.deleteDatabaseAsync('habit365.db');

            console.log('database deleted');
        } catch (error) {
            console.error('error in db drop: ', error);

        }
    }








    return (
        <ScrollView style={{ flex: 1 }}>

            <Button onPress={dropDatabase} title='delete database' />
            <View style={{
                borderWidth: 1,
                borderColor: 'gray',
                marginVertical: 10,
            }} />

        </ScrollView>
    );
}
