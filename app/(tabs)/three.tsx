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



// test
// Create a new Date object with the current date and time
let date = new Date();

// Get the timestamp in milliseconds
let timestamp = date.getTime();

// Adjust the timestamp to the user's local time zone offset
let offset = date.getTimezoneOffset(); // Get the time zone offset in minutes
timestamp += offset * 60 * 1000; // Convert minutes to milliseconds

// Convert the adjusted timestamp to seconds (suitable for SQL)
let sqlTimestamp = Math.floor(timestamp / 1000);

console.log(sqlTimestamp); // This is the SQL timestamp in seconds

const yesterdayHabitData = [
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 1, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 },
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 2, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 },
    { "current_streak": 0, "entry_date": yesterday, "habit_id": 3, "hit_total": 0, "new_streak_pr": 0, "status": 1, "total_days": 0 },
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 4, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 },
    { "current_streak": 0, "entry_date": yesterday, "habit_id": 5, "hit_total": 1, "new_streak_pr": 0, "status": 0, "total_days": 1 },
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 6, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 },
    { "current_streak": 0, "entry_date": yesterday, "habit_id": 7, "hit_total": 1, "new_streak_pr": 0, "status": 0, "total_days": 1 },
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 8, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 },
    { "current_streak": 1, "entry_date": yesterday, "habit_id": 9, "hit_total": 1, "new_streak_pr": 1, "status": 2, "total_days": 1 }]

const yesterdayRoutineData = [
    { "entry_date": yesterday, "habits_complete": 4, "routine_id": 1, "total_habits": 5 },
    { "entry_date": yesterday, "habits_complete": 3, "routine_id": 2, "total_habits": 4 }]

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





    const alter2Timestamp = async () => {
        try {
            await db.execAsync(`ALTER TABLE `);
            // CREATE TABLE IF NOT EXISTS routines (
            //     start_date TIMESTAMP NOT NULL);
            // CREATE TABLE IF NOT EXISTS habits (
            //     start_date TIMESTAMP NOT NULL,
            // CREATE TABLE IF NOT EXISTS habit_entries (
            //     entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            //routine_entries entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            console.log('TABLES TO TIMESTAMP');
        } catch (error) {
            console.error(error);
        }
    }

    const insertYesterdayEntries = async () => {
        for (let i = 0; i < yesterdayHabitData.length; i++) {
            await db.runAsync(`INSERT INTO habit_entries (current_streak, entry_date, habit_id, new_streak_pr, status, total_days, hit_total) VALUES (?,?,?,?,?,?,?)`, yesterdayHabitData[i].current_streak, yesterdayHabitData[i].entry_date, yesterdayHabitData[i].habit_id, yesterdayHabitData[i].new_streak_pr, yesterdayHabitData[i].status, yesterdayHabitData[i].total_days, yesterdayHabitData[i].hit_total);
        };

        for (let i = 0; i < yesterdayRoutineData.length; i++) {
            await db.runAsync(`INSERT INTO routine_entries (entry_date, habits_complete, routine_id, total_habits) VALUES (?,?,?,?)`, yesterdayRoutineData[i].entry_date, yesterdayRoutineData[i].habits_complete, yesterdayRoutineData[i].routine_id, yesterdayRoutineData[i].total_habits);
        }

        console.log('yesterday entries inserted');
    };


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
            <Button onPress={() => {
                console.log('yesterday: ', yesterday, 'today: ', today, 'dayIndex: ', dayIndex, 'sqlTimestamp: ', sqlTimestamp, timestamp, date);
            }} title={'testing timestamp'} />
            {/* <Button onPress={() => {

            }} title='alter to timestamp' />
            <Button onPress={ } title='alter back to date' /> */}
            <Button onPress={insertYesterdayEntries} title='insert yesterday entries' />
        </ScrollView>
    );
}
