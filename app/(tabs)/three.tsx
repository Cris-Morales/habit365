import { StyleSheet, Button, } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';
import dbInitScripts from '@/utils/dbInit';

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
    const [data, setData] = useState<any>();

    const readTable = async (action: string) => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');
            const tableRows = await db.getAllAsync(`SELECT * FROM ${action}`);
            console.log(tableRows)
        } catch (error) {
            console.error(`Error in ${action} table read: `, error)
        }
    }

    const readFrequencyTable = async () => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');
            const tableRows = await db.getAllAsync(`SELECT habits.title, days.day_name FROM habits_days_frequency JOIN days ON habits_days_frequency.day_id = days.id JOIN habits ON habits_days_frequency.habit_id = habits.id`);
            console.log(tableRows)
        } catch (error) {
            console.error(`Error in habits_days_frequency table read: `, error)
        }
    }

    const dropDatabase = async () => {
        try {

            const db = await SQLite.openDatabaseAsync('habit365.db');
            await db.closeAsync();
            await SQLite.deleteDatabaseAsync('habit365.db');

            console.log('database deleted');
        } catch (error) {
            console.error('error in db drop: ', error);

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
            <Button onPress={dbInitScripts.initiateDb} title='initiate database' />
            <Button onPress={() => readTable('habits')} title='read habits table' />
            <Button onPress={() => readTable('routines')} title='read routines table' />
            <Button onPress={() => readTable('days')} title='read days table' />
            <Button onPress={readFrequencyTable} title='read habits_days_frequency table' />
            <Button onPress={() => readTable('habit_entries')} title='read habit_entries table' />
            <Button onPress={() => readTable('routine_entries')} title='read routine_entries table' />
            {/* <Button onPress={dropDatabase} title='drop database' /> */}
        </View>
    );
}
