import * as SQLite from 'expo-sqlite/next';
import { habit, routine, indexDataShape } from '@/components/types/dataTypes';

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

export const indexQueryChecks = async (db: SQLite.SQLiteDatabase) => {
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

        const routineList: any = await db.getAllAsync(`
        SELECT routines.id, 
        (SELECT COUNT(*) FROM habits WHERE habits.routine_id = routines.id) 
        AS total_habits
        FROM routines;`);

        // On app first open, no habits => feedback
        if (habitList.length === 0) {
            // return no habit data text on index tab.
            return false;
        };

        const checkTodayEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries WHERE entry_date = ?', today);
        const checkTodayRoutineEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM routine_entries WHERE entry_date = ?', today);
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

        if (checkTodayEntries['COUNT(*)'] === 0) {
            const habitEntriesExist: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries');
            // Only would occur on dev mode. Or if somehow you would empty your journal tables, while having habits or routines
            if (habitEntriesExist['COUNT(*)'] === 0) {
                for (let i = 0; i < habitList.length; i++) {
                    await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date) VALUES (?, ?, ?, ?, ?, ?)', habitList[i].id, habitList[i].day_id ? 0 : 1, 0, 0, habitList[i].day_id ? 1 : 0, today);
                };
            } else {
                // entries exist from yesterday, initialize habit entries the easy way
                if (getYesterdayEntries.length) {
                    for (let i = 0; i < getYesterdayEntries.length; i++) {
                        // console.log(`yesterday\'s entry index-${i}`, getYesterdayEntries[i]);

                        await db.runAsync(`INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date)
                                            VALUES (?,
                                            ?,
                                            ?,
                                            ?,
                                            ?,
                                            ?);
                                        `, getYesterdayEntries[i].habit_id, getYesterdayEntries[i].day_id ? 0 : 1, getYesterdayEntries[i].current_streak, getYesterdayEntries[i].hit_total, getYesterdayEntries[i].day_id ? getYesterdayEntries[i].total_days + 1 : getYesterdayEntries[i].total_days, today);
                    };
                    // entries from yesterday don't exist, an unknown time has passed since last open, check is treak is maintained, and calculate total_days
                } else {
                    const dateDiffQuery: any = await db.getAllAsync(`SELECT julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries));`, today);
                    const date_diff = dateDiffQuery[0]["julianday(?) - julianday((SELECT MAX(entry_date) FROM habit_entries))"];
                    for (let i = 0; i < habitList.length; i++) {
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
                        };
                        for (let i = 0; i < date_diff % 7; i++) {
                            const comparedDay: Date = new Date();
                            comparedDay.setDate(todayDateObj.getDate() - i);
                            if (frequencyObject[comparedDay.getDay()]) {
                                current_streak = 0;
                                total_days += 1;
                            };
                        };

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
                    };
                };
            };
        };

        if (checkTodayRoutineEntries['COUNT(*)'] === 0) {
            // are there routine entries alread? might need to check
            for (let i = 0; i < routineList.length; i++) {
                // console.log('routine: ', routineList[i]);
                if (routineList[i].total_habits != 0) {
                    // console.log('routine habits list: ', routineList[i].total_habits, 'routine ');
                    await db.runAsync(`
                        INSERT INTO routine_entries (routine_id, entry_date, habits_complete, total_habits) 
                        SELECT ?, ?, 
                        (SELECT COUNT(*) FROM habits JOIN habit_entries ON habits.id = habit_entries.habit_id WHERE routine_id = ? AND habit_entries.status = 1 AND habit_entries.entry_date = ?),
                        ?
                        `, routineList[i].id, today, routineList[i].id, today, routineList[i].total_habits);
                };
            };
        };

        // console.log('today\'s habit entries initialization/verification complete');
        return true;
    } catch (error) {
        console.error('Error in Index Query: ', error);
        return (new Error('Error in indexQueryChecks'));
    }
};

export const journalQuery = async (db: SQLite.SQLiteDatabase) => {
    try {
        const habitDataArrayNull: habit[] = await db.getAllAsync(`
        SELECT habits.id, habits.title, habits.color, habits.longest_streak, habit_entries.status, habit_entries.current_streak, habit_entries.total_days, habit_entries.hit_total, habit_entries.id AS entry_id 
        FROM habits
        JOIN habit_entries
        ON habits.id = habit_entries.habit_id
        WHERE habit_entries.entry_date = ?
        AND
        habits.routine_id IS NULL;
        `, today);

        const routineQuery: routine[] = await db.getAllAsync(`
        SELECT routines.id, routines.title, routines.color, routine_entries.total_habits, routine_entries.habits_complete, routine_entries.id AS entry_id
        FROM routine_entries
        JOIN routines
        ON routine_entries.routine_id = routines.id
        WHERE routine_entries.entry_date = ?
        `, today);

        const journalResults: indexDataShape[] = [{
            routine_data: null,
            routine_habits: habitDataArrayNull
        },]

        for (const routine of routineQuery) {
            const habitDataArray: habit[] = await db.getAllAsync(`
            SELECT habits.id, habits.title, habits.color, habits.longest_streak, habit_entries.status, habit_entries.current_streak, habit_entries.total_days, habit_entries.hit_total, habit_entries.id AS entry_id 
            FROM habits
            JOIN habit_entries
            ON habits.id = habit_entries.habit_id
            WHERE habit_entries.entry_date = ?
            AND
            habits.routine_id = ?; 
            `, today, routine.id);
            // refresh
            journalResults.push({
                routine_data: routine,
                routine_habits: habitDataArray
            });
        }

        return journalResults;
    } catch (error) {
        console.error('Error in journalQuery: ', error);
        return null;
    };
};