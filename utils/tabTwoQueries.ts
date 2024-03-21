import * as SQLite from 'expo-sqlite/next';

// set today's date context
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

const tabTwoQueries: any = {
    insertHabit: async (db: SQLite.SQLiteDatabase, title: string, start_date: string, color: string, intention: string, routine_id: number | null, frequency: boolean[]) => {
        try {
            const results: any = await db.runAsync('INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)', title, start_date, color, intention);

            // console.log('Habit Inserted, checking routine_id...');

            if (routine_id) {
                await db.runAsync('UPDATE habits SET routine_id = ? WHERE id = ?;', routine_id, results.lastInsertRowId);

                const routineEntry: any[] | any = await db.getFirstAsync(`SELECT id, habits_complete, total_habits FROM routine_entries WHERE routine_id = ? AND entry_date = ?`, routine_id, today);
                console.log('updating routine_id: ', routineEntry);

                if (routineEntry) {
                    // add to its totals, frequency determines if habit is skipped and added to complete total or not which means complete total is the same
                    await db.runAsync(`UPDATE routine_entries SET total_habits = ?, habits_complete = ? WHERE id = ? AND entry_date = ?`, routineEntry.total_habits + 1, routineEntry.habits_complete + !frequency[dayIndex] && 1, routineEntry.id, today);
                } else {
                    // means this is this routine's first habit or routine has a singular habit
                    await db.runAsync(`
                    INSERT INTO routine_entries (routine_id, entry_date, habits_complete, total_habits) 
                    SELECT ?, ?, 
                    ?,
                    1`, routine_id, today, frequency[dayIndex] ? 0 : 1);
                }
            }

            for (let i = 1; i <= frequency.length; i++) {
                if (frequency[i - 1]) {
                    await db.runAsync(`
                    INSERT INTO habits_days_frequency (habit_id, day_id) VALUES( ?, ?);`, results.lastInsertRowId, i);
                }
            }

            // insert journal entry
            await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date) VALUES (?, ?, ?, ?, ?, ?)', results.lastInsertRowId, frequency[dayIndex] ? 0 : 1, 0, 0, frequency[dayIndex] ? 1 : 0, today);


            console.log('Habit Inserted: ', results.lastInsertRowId, results.changes);


        } catch (error) {
            console.error('Error in habit insert: ', error);
            return (0);
        }
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
                }
            }
        } catch (error) {
            console.error('error in setFrequency: ', error);
        }
    },
    insertEntry: async (db: SQLite.SQLiteDatabase, action: string, id: number, frequency: boolean[]) => {
        try {
            if (action == 'habit') {
                await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date) VALUES (?, ?, ?, ?, ?, ?)', id, frequency[dayIndex] ? 0 : 1, 0, 0, frequency[dayIndex] ? 1 : 0, today);
            } else {

            }
        } catch (error) {
            console.error('error in setFrequency: ', error);
        }
    }
}

export default tabTwoQueries;