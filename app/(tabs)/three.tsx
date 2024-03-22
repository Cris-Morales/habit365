import { StyleSheet, Button, ScrollView, } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';
import dbInitScripts from '@/utils/dbInit';
import { indexQueryChecks, journalQuery } from '@/utils/indexQueries';

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
            const dateDiffQuery: any = await db.getAllAsync(`SELECT julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries));`, today);
            const date_diff = dateDiffQuery[0]["julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries))"];
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
            console.log(streak, total_days, date_diff);
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

    const queryIndexData = async () => {
        try {
            await journalQuery(db);
        } catch (error) {
            console.error('Error in queryIndexData: ', error);

        }
    }

    const habitFrequency = async () => {
        try {
            const results = await db.getAllAsync(`SELECT title, day_id FROM habits JOIN habits_days_frequency ON habits.id = habits_days_frequency.habit_id`);
            console.log(results, dayIndex)
        } catch (error) {
            console.error('Error in queryIndexData: ', error);

        }
    }

    const routineEntriesToday = async () => {
        try {

            console.log(yesterday, today);
            //     const results = await db.getAllAsync(`
            // SELECT routines.id, routines.title, routines.color, routine_entries.total_habits, routine_entries.habits_complete, routine_entries.id AS entry_id
            // FROM routines
            // JOIN routine_entries
            // ON routines.id = routine_entries.id
            // WHERE routine_entries.entry_date = ?
            // `, today);
            const results = await db.getAllAsync(`
        SELECT routines.id, routines.title, routines.color, routine_entries.total_habits, routine_entries.habits_complete, routine_entries.id AS entry_id
        FROM routine_entries
        JOIN routines
        ON routine_entries.routine_id = routines.id
        WHERE routine_entries.entry_date = ?
        `, today);

            console.log(results);
        } catch (error) {
            console.error('error in routine entries today: ', error);

        }
    }


    return (
        <ScrollView style={{ flex: 1 }}>

            <Text>Color Scheme</Text>
            <Text>Set User Name</Text>
            <Text>Toggle App Open Habit</Text>
            <Text>Day/Night Mode</Text>
            <Text>About this Project</Text>
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
            <Button onPress={queryIndexData} title='grab index data routine null' />
            <Button onPress={habitFrequency} title='grab habits that occur today' />
            <Button onPress={routineEntriesToday} title='grab routine entries today' />
        </ScrollView>
    );
}
