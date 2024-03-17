import { StyleSheet, Button, } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';

interface habitRow {
    color: string;
    created_at: string;
    current_streak: number;
    id: number;
    intention: null | string;
    longest_streak: string;
    routine_id: null | number;
    start_date: string;
    title: string;
}

export default function TabThreeScreen() {
    const [data, setData] = useState<habitRow[] | undefined>();


    const readHabitsTable = async () => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');

            const allRows = await db.getAllAsync('SELECT * FROM habits');
            console.log(allRows);
        } catch (error) {
            console.error('Error in read habits: ', error);
        }
    }
    const readRoutinesTable = async () => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');

            const allRows = await db.getAllAsync('SELECT * FROM routines');
            console.log(allRows);
        } catch (error) {
            console.error('Error in read habits: ', error);
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Text>Color Scheme</Text>
            <Text>Set User Name</Text>
            <Text>Toggle App Open Habit</Text>
            <Text>Day/Night Mode</Text>
            <Text>About this Project</Text>
            <Text>Github</Text>
            <Text>Database Should be Created</Text>
            <Button onPress={readHabitsTable} title='read habits table' />
            <Button onPress={readRoutinesTable} title='read routines table' />
        </View>
    );
}
