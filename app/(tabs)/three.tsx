import { StyleSheet, Button, } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';
import dbInitScripts from '@/utils/dbInit';
import indexQueryChecks from '@/utils/indexQueries';

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

const todayDateObj = new Date();
const todayYear = todayDateObj.getFullYear();
const todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0');
const todayDay = String(todayDateObj.getDate()).padStart(2, '0');
const today = `${todayYear}-${todayMonth}-${todayDay}`;

// set yesterday's date context
const yesterdayDateObj = new Date();
yesterdayDateObj.setDate(todayDateObj.getDate() - 1);
const yesterdayYear = yesterdayDateObj.getFullYear();
const yesterdayMonth = String(yesterdayDateObj.getMonth() + 1).padStart(2, '0');
const yesterdayDay = String(yesterdayDateObj.getDate()).padStart(2, '0');
const yesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

// check every habit's frequency day matches date objects day
const dayIndex = todayDateObj.getDay();

export default function TabThreeScreen() {
    const [data, setData] = useState<any>();
    const db = SQLite.useSQLiteContext();

    const readTable = async (action: string) => {
        try {
            const tableRows = await db.getAllAsync(`SELECT * FROM ${action}`);
            console.log(tableRows)
        } catch (error) {
            console.error(`Error in ${action} table read: `, error)
        }
    }
    const readJournalTest = async () => {
        try {
            const tableRows: any = await db.getAllAsync(`SELECT julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries WHERE habit_id = ?));`, today, 1);
            const date_diff = tableRows[0]["julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries WHERE habit_id = ?))"];
            const frequencyRow: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits_days_frequency WHERE habit_id = ?`, 1);
            const frequencyArray: any = await db.getAllAsync('SELECT days.day_number FROM habits_days_frequency JOIN days ON days.id = habits_days_frequency.day_id WHERE habits_days_frequency.habit_id = ?', 1);
            const frequencyObject: any = {};
            frequencyArray.forEach((day: any) => {
                frequencyObject[day.day_number] = true;
            });
            let streak = 2;
            let total_days = 2;


            if (date_diff > 7) {
                streak = 0
                total_days += Math.trunc(date_diff / 7) * frequencyRow["COUNT(*)"];
            }
            for (let i = 0; i < date_diff % 7; i++) {
                const comparedDay: Date = new Date();
                comparedDay.setDate(todayDateObj.getDate() - i);

                console.log(comparedDay.getDay());
                if (frequencyObject[comparedDay.getDay()]) {
                    streak = 0;
                    total_days += 1;
                }
            }
        } catch (error) {
            console.error(`Error in journalTest table read: `, error)
        }
    }

    const readFrequencyTable = async () => {
        try {
            const tableRows = await db.getAllAsync(`SELECT habits.title, days.day_name FROM habits_days_frequency JOIN days ON habits_days_frequency.day_id = days.id JOIN habits ON habits_days_frequency.habit_id = habits.id`);
            console.log(tableRows)
        } catch (error) {
            console.error(`Error in habits_days_frequency table read: `, error)
        }
    }

    const dropDatabase = async () => {
        try {
            await db.closeAsync();
            await SQLite.deleteDatabaseAsync('habit365.db');

            console.log('database deleted');
        } catch (error) {
            console.error('error in db drop: ', error);

        }
    }

    const dropJournalTables = async () => {
        try {
            await db.execAsync(`DROP TABLE habit_entries; DROP TABLE routine_entries;`);
            console.log('journals dropped');
        } catch (error) {
            console.error(error);
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
            <Button onPress={() => dbInitScripts.initiateDb(db)} title='initiate database' />
            <Button onPress={() => readTable('habits')} title='read habits table' />
            <Button onPress={() => readTable('routines')} title='read routines table' />
            <Button onPress={() => readTable('days')} title='read days table' />
            <Button onPress={readFrequencyTable} title='read habits_days_frequency table' />
            <Button onPress={() => readTable('habit_entries')} title='read habit_entries table' />
            <Button onPress={() => readTable('routine_entries')} title='read routine_entries table' />
            <Button onPress={dropDatabase} title='delete database' />
            <View style={{
                borderWidth: 1,
                borderColor: 'gray',
                marginVertical: 10,
            }} />
            <Button onPress={() => indexQueryChecks(db)} title='IndexQueryCheck' />
            <Button onPress={() => readTable('habit_entries')} title='read habit_entries' />
            <Button onPress={() => readTable('routine_entries')} title='read routine_entries' />
            <Button onPress={dropJournalTables} title='drop journal tables' />
            <Button onPress={readJournalTest} title='test journal query.' />

        </View>
    );
}
