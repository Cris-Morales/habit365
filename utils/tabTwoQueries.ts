import * as SQLite from 'expo-sqlite/next';


const tabTwoQueries: any = {
    insertHabit: async (title: string, start_date: string, color: string, intention: string) => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');
            const results: any = await db.runAsync('INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);

            console.log('Habit Inserted: ', results.lastInsertRowId, results.changes);
        } catch (error) {
            console.error(error);
        }
    },
    insertRoutine: async (title: string, start_date: string, color: string, intention: string) => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');
            const results: any = await db.runAsync('INSERT INTO routines (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);

            console.log('Routine Inserted: ', results.lastInsertRowId, results.changes);
        } catch (error) {
            console.error(error);
        }
    },
    getRoutineList: async () => {
        try {
            const db = await SQLite.openDatabaseAsync('habit365.db');

            const allRows = await db.getAllAsync('SELECT title, id FROM routines');
            console.log('Routine Rows Queries: ', allRows);
            return allRows;
        } catch (error) {
            console.error('Error in Routine List Query: ', error);
        }
    }
}

export default tabTwoQueries;