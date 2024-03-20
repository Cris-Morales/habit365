import * as SQLite from 'expo-sqlite/next';

interface indexData {
    routine_data: any | null;
    habit_data: any[] | null;
}

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

const indexQueryChecks = async (db: SQLite.SQLiteDatabase) => {
    try {
        const habitList: any = await db.getAllAsync(`
        SELECT habits.id, habits_days_frequency.day_id 
        FROM habits 
        LEFT JOIN habits_days_frequency 
        ON habits.id = habits_days_frequency.habit_id 
        AND habits_days_frequency.day_id = ? 
        WHERE habits_days_frequency.day_id = ? 
        OR habits_days_frequency.day_id IS NULL;
        `, dayIndex + 1, dayIndex + 1);
        // console.log('habitsList', habitList);

        const routineList: any = await db.getAllAsync(`
        SELECT routines.id, 
        (SELECT COUNT(*) FROM habits WHERE habits.routine_id = routines.id) 
        AS total_habits
        FROM routines;`);
        // console.log('routineList', routineList);

        // On app first open, no habits => feedback
        if (habitList.length === 0) {
            // return no habit data text on index tab.
            return console.log('no habits in database.');
        }


        const checkTodayEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries WHERE entry_date = ?', today);
        const getYesterdayEntries: any = await db.getAllAsync(`
        SELECT 
        habit_entries.id, 
        habit_entries.habit_id, 
        habit_entries.current_streak, 
        habit_entries.entry_date, 
        habit_entries.hit_total, 
        habit_entries.total_days,
        habits_days_frequency.day_id
        FROM 
        habit_entries
        LEFT JOIN 
        habits_days_frequency ON habit_entries.habit_id = habits_days_frequency.habit_id
        AND habits_days_frequency.day_id = ? 
        WHERE 
        habit_entries.entry_date = ?;
        `, dayIndex + 1, yesterday);

        // console.log('getYesterdayEntries: ', getYesterdayEntries);

        // Do entries for today's journal exist
        if (checkTodayEntries['COUNT(*)'] === 0) {
            // check dev mode, habits exist, no journal entries at all
            // initialize all entries, streak = 0, check freq day matches today for status and total days = 0 or 1
            const checkDevMode: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries');

            /**
             *@abstract COMPLETE, COME BACK TO THIS FOR HABIT CREATION. On that note, come back to this for edit (adding to routine.);
             */
            if (checkDevMode['COUNT(*)'] === 0) {
                for (let i = 0; i < habitList.length; i++) {
                    console.log('habitList values: ', habitList[i].id, habitList[i].day_id);

                    await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date) VALUES (?, ?, ?, ?, ?, ?)', habitList[i].id, habitList[i].day_id ? 0 : 1, 0, 0, habitList[i].day_id ? 1 : 0, today);
                }

            } else {
                // No entries for today, entries exists, 
                // Do yesterday's journals exist
                // true => iterate total days total_days for every insert entry
                if (getYesterdayEntries.length) {
                    for (let i = 0; i < getYesterdayEntries.length; i++) {
                        console.log(`yesterday\'s entry index-${i}`, getYesterdayEntries[i]);

                        await db.runAsync(`INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date)
                                            VALUES (?,
                                            ?,
                                            ?,
                                            ?,
                                            ?,
                                            ?);
                                        `, getYesterdayEntries[i].habit_id, getYesterdayEntries[i].day_id ? 0 : 1, getYesterdayEntries[i].current_streak, getYesterdayEntries[i].hit_total, getYesterdayEntries[i].day_id ? getYesterdayEntries[i].total_days + 1 : getYesterdayEntries[i].total_days, today);
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
                    /**
                     * @abstract checkpoint
                     */

                    console.log('here: ', habitList);
                    for (let i = 0; i < habitList.length; i++) {
                        console.log('habit entries: ', habitList[i].id);

                        const tableRows: any = await db.getAllAsync(`SELECT julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries WHERE habit_id = ?));`, today, habitList[i].id);
                        const date_diff = tableRows[0]["julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries WHERE habit_id = ?))"];
                        const frequencyRow: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits_days_frequency WHERE habit_id = ?`, habitList[i].id);
                        const frequencyArray: any = await db.getAllAsync('SELECT days.day_number FROM habits_days_frequency JOIN days ON days.id = habits_days_frequency.day_id WHERE habits_days_frequency.habit_id = ?', habitList[i].id);
                        const frequencyObject: any = {};
                        frequencyArray.forEach((day: any) => {
                            frequencyObject[day.day_number] = true;
                        });
                        let current_streak = 2;
                        let total_days = 2;
                        if (date_diff > 7) {
                            current_streak = 0
                            total_days += Math.trunc(date_diff / 7) * frequencyRow["COUNT(*)"];
                        }
                        for (let i = 0; i < date_diff % 7; i++) {
                            const comparedDay: Date = new Date();
                            comparedDay.setDate(todayDateObj.getDate() - i);
                            if (frequencyObject[comparedDay.getDay()]) {
                                current_streak = 0;
                                total_days += 1;
                            }
                        }

                        await db.runAsync(`
                        INSERT INTO habit_entries (
                            habit_id, 
                            status, 
                            hit_total, 
                            current_streak, 
                            total_days, 
                            entry_date
                        )
                        VALUES (
                            ?, 
                            ?, 
                            (SELECT hit_total FROM habit_entries WHERE habit_id = ? ORDER BY entry_date DESC LIMIT 1), 
                            ?, 
                            ?, 
                            ?
                        );

                    `, habitList[i].id, habitList[i].day_id ? 0 : 1, habitList[i].id, current_streak, total_days, today);
                    }
                }
                //DAYOFWEEK() has been replaced with strftime('%w', date), which returns the day of the week as a number (0 for Sunday, 1 for Monday, etc.).
                //LIMIT without an ORDER BY clause is replaced with ORDER BY entry_date DESC LIMIT 1 to ensure we get the latest entry.
                //The BETWEEN condition now uses strftime('%w', date) to get the day of the week.
            }
            // if routines exist
            // count 1's for each journal entry, joined with habit data, checking status and matching routine id
            // count total habits associaed with routine for total
            // calculate percent complete for habits that dont occur today
            for (let i = 0; i < routineList.length; i++) {
                // console.log('routine list values: ', routineList[i].id, routineList[i].total_habits);
                if (routineList[i].total_habits != 0) {
                    await db.runAsync(`
                        INSERT INTO routine_entries (routine_id, entry_date, percent_complete) 
                        SELECT ?, ?, 
                            (SELECT COUNT(*) * 100.0 / total_habits 
                            FROM habit_entries AS he 
                            LEFT JOIN habits AS h ON he.habit_id = h.id 
                            WHERE h.routine_id = ? AND he.status = 1) 
                        FROM (
                            SELECT COUNT(*) as total_habits
                            FROM habits
                            WHERE routine_id = ?
                        ) AS total_habits_query;
                        `, routineList[i].id, today, routineList[i].total_habits, routineList[i].id);
                }
            }

        }

        // console.log('today\'s habit entries initialization/verification complete')

        return console.log('today\'s habit entries initialization/verification complete');
    } catch (error) {
        console.error('Error in Index Query: ', error);
    }
};

const queryIndexData = async (db: SQLite.SQLiteDatabase) => {


};


export default indexQueryChecks;