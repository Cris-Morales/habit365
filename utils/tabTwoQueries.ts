import * as SQLite from 'expo-sqlite/next';


const tabTwoQueries: any = {
    insertHabit: async (db: SQLite.SQLiteDatabase, title: string, start_date: string, color: string, intention: string, routine_id: number | undefined) => {
        try {
            const results: any = await db.runAsync('INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);

            console.log('Habit Inserted, checking routine_id...');

            if (routine_id) {
                console.log('updating routine_id: ', results.lastInsertRowId, routine_id);
                await db.runAsync('UPDATE habits SET routine_id = ? WHERE id = ?;', routine_id, results.lastInsertRowId);
            }

            console.log('Habit Inserted: ', results.lastInsertRowId, results.changes);

            return results.lastInsertRowId
        } catch (error) {
            console.error('Error in habit insert: ', error);
            return (0);
        }
    },
    insertHabitSync: (db: SQLite.SQLiteDatabase, title: string, start_date: string, color: string, intention: string, routine_id: number | undefined) => {
        const results: any = db.runSync('INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);

        console.log('Habit Inserted, checking routine_id...');

        if (routine_id) {
            console.log('updating routine_id: ', results.lastInsertRowId, routine_id);
            db.runSync('UPDATE habits SET routine_id = ? WHERE id = ?;', routine_id, results.lastInsertRowId);
        }

        console.log('Habit Inserted: ', results.lastInsertRowId, results.changes);

        return results.lastInsertRowId
    },
    insertRoutine: async (db: SQLite.SQLiteDatabase, title: string, start_date: string, color: string, intention: string) => {
        try {
            const results: any = await db.runAsync('INSERT INTO routines (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);
            console.log('Routine Inserted: ', results.lastInsertRowId, results.changes);

            return results.lastInsertRowId
        } catch (error) {
            console.error(error);
            return ([]);
        }
    },
    getRoutineList: async (db: SQLite.SQLiteDatabase) => {
        try {
            const allRows = await db.getAllAsync('SELECT title, id FROM routines');
            return allRows;
        } catch (error) {
            console.error('Error in Routine List Query: ', error);
            return ([]);
        }
    },
    getRoutineListSync: (db: SQLite.SQLiteDatabase) => {
        console.log('getRoutineListSync');

        const allRows = db.getAllSync('SELECT title, id FROM routines');
        console.log('Routine Rows Queries: ', allRows);
        return allRows;

    },
    setFrequency: async (db: SQLite.SQLiteDatabase, habit_id: number, frequency: boolean[]) => {
        try {
            for (let i = 1; i <= frequency.length; i++) {
                // console.log(habit_id, i, frequency[i - 1])
                if (frequency[i - 1]) {
                    const frequencyResult: any = await db.runAsync(`
                    INSERT INTO habits_days_frequency (habit_id, day_id) VALUES( ?, ?);`, habit_id, i);

                    // console.log(`Frequency day ${i} inserted for habit ${habit_id}: `, frequencyResult)
                }
            }
        } catch (error) {
            console.error('error in setFrequency: ', error);
        }
    }
}

export default tabTwoQueries;