import * as SQLite from 'expo-sqlite/next';

interface indexData {
    routine_data: any | null;
    habit_data: any[] | null;
}

// set today's date context
const todayDateObj = new Date();
const today = todayDateObj.toISOString().split('T')[0]; // string
// set yesterday's date context
const yesterdayDateObj = new Date();
yesterdayDateObj.setDate(todayDateObj.getDate() - 1);
const yesterday = yesterdayDateObj.toISOString().split('T')[0];
// check every habit's frequency day matches date objects day
const dayIndex = todayDateObj.getDay();

const indexQueryChecks = async (db: SQLite.SQLiteDatabase) => {

    const habitList: any = await db.getAllAsync('SELECT id, habits_days_frequency.day_id FROM habits LEFT JOIN habits_days_frequency ON habits.id = habits_days_frequency.habit_id;');
    const routineList: any = await db.getAllAsync('SELECT id FROM routines (SELECT COUNT (*) FROM habits WHERE habits.routine_id = routines.id) AS total_habits FROM routines;');

    // On app first open, no habits => feedback
    if (habitList.length === 0) {
        // return no habit data text on index tab.
    }

    const checkTodayEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries WHERE entry_date = ?', today);
    const getYeserdayEntries: any = await db.getAllAsync('SELECT * FROM habit_entries WHERE entry_date = ?', yesterday);

    // Do entries for today's journal exist
    if (checkTodayEntries['COUNT(*)'] === 0) {
        // check dev mode, habits exist, no journal entries at all
        // initialize all entries, streak = 0, check freq day matches today for status and total days = 0 or 1
        const checkDevMode: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries');
        if (checkDevMode['COUNT(*)'] === 0) {
            for (let i = 0; i < habitList.length; i++) {
                console.log('habitList values: ', habitList[i].id, habitList[i].day_id);

                await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date) VALUES (?, ?, ?, ?, ?, ?)', habitList[i].id, habitList[i].day_id === (dayIndex + 1) ? 0 : 1, 0, 0, habitList[i].day_id === (dayIndex + 1) ? 1 : 0, today);
            }

        } else {
            // No entries for today, entries exists, 
            // Do yesterday's journals exist
            // true => iterate total days total_days for every insert entry
            if (getYeserdayEntries.length) {
                for (let i = 0; i < getYeserdayEntries; i++) {
                    console.log('yesterday\'s entries: ', getYeserdayEntries[i].habit_id);

                    await db.runAsync(`INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date)
                    VALUES (?, 
                    CASE WHEN EXISTS (
                        SELECT 1 
                        FROM habits_days_frequency 
                        WHERE habit_id = ? 
                        AND day_id = ?
                    ) THEN 0
                    ELSE 1
                    END,
                    ?,
                    ?,
                    CASE WHEN EXISTS (
                        SELECT 1 
                        FROM habits_days_frequency 
                        WHERE habit_id = ? 
                        AND day_id = ?
                    ) THEN (? + 1)
                    ELSE ?
                    END,
                    ,?);
                `, getYeserdayEntries[i].habit_id, getYeserdayEntries[i].habit_id, dayIndex + 1, getYeserdayEntries[i].current_streak, getYeserdayEntries[i].hit_total, getYeserdayEntries[i].habit_id, dayIndex + 1, getYeserdayEntries[i].total_days, getYeserdayEntries[i].total_days, today);
                }
            } else {
                // false => calculate them
                // date diff between today and last journal entry
                // date diff => 7 
                //automatic streak = 0
                // total_days = date_diff / 7 * count_frequency + funciton(date_diff % 7, check frequency days)
                // date diff < 7 
                // count frequency days between today and last entry
                // insert these for every entry 
                for (let i = 0; i < habitList; i++) {
                    console.log('yesterday\'s entries: ', getYeserdayEntries[i].habit_id);

                    await db.runAsync(`INSERT INTO habit_entries (habit_id, status, hit_total, current_streak, total_days, entry_date)
                    VALUES (
                        ?, 
                    CASE WHEN EXISTS (
                        SELECT 1 
                        FROM habits_days_frequency 
                        WHERE habit_id = ? 
                        AND day_id = ?
                    ) THEN 0
                    ELSE 1
                    END,
                    (SELECT hit_total FROM habit_entries WHERE habit_id = ? ORDER BY entry_date DESC LIMIT 1), 
                    CASE
                        WHEN DATEDIFF(CURDATE(), (SELECT entry_date FROM habit_entries WHERE habit_id = ? ORDER BY entry_date DESC LIMIT 1)) > 7 THEN 0
                        ELSE
                            CASE 
                                WHEN NOT EXISTS (
                                    SELECT 1
                                    FROM habits_days_frequency
                                    WHERE habit_id = ? 
                                    AND day_id BETWEEN (SELECT DAYOFWEEK((SELECT entry_date FROM habit_entries WHERE habit_id = ? ORDER BY entry_date DESC LIMIT 1)) + 1) AND DAYOFWEEK(CURDATE())
                                ) THEN 0
                                ELSE 
                                    (SELECT current_streak FROM habit_entries WHERE habit_id = ? ORDER BY entry_date DESC LIMIT 1)
                            END
                    END, 
                    (SELECT COUNT(*) 
                    FROM habits_days_frequency 
                    WHERE habit_id = ? 
                    AND day_id BETWEEN DAYOFWEEK((SELECT MAX(entry_date) 
                                                FROM habit_entries 
                                                WHERE habit_id = ?)) 
                    AND DAYOFWEEK(?)),
                    ?);
                `, habitList[i].habit_id, habitList[i].habit_id, dayIndex + 1, habitList[i].habit_id, habitList[i].habit_id, habitList[i].habit_id, habitList[i].habit_id, habitList[i].habit_id, habitList[i].habit_id, habitList[i].habit_id, dayIndex + 1, today);
                }
            }

        }




        // if routines exist
        // count 1's for each journal entry, joined with habit data, checking status and matching routine id
        // count total habits associaed with routine for total
        // calculate percent complete for habits that dont occur today
        for (let i = 0; i < routineList.length; i++) {
            console.log('routine list values: ', routineList[i].title, routineList[i].id);
            // insert routine entry, calculate per
            if (routineList[i].total_habits != 0) {
                await db.runAsync(`
                    INSERT INTO routine_entries (routine_id, entry_date, percent_complete) 
                    SELECT ?, ?, 
                        (SELECT COUNT(*) * 100.0 / ? 
                        FROM habit_entries AS he 
                        LEFT JOIN habits AS h ON he.habit_id = h.id 
                        WHERE h.routine_id = ? AND he.status = 1) 
                    FROM habit_entries;`, routineList[i].id, today, routineList[i].total_habits, routineList[i].id);
            }
        }
    }

    console.log('today\'s habit entries initialization/verification complete')
    return
};

const queryIndexData = async (db: SQLite.SQLiteDatabase) => {


};


export default indexQuery;