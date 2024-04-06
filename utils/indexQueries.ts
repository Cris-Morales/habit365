import * as SQLite from 'expo-sqlite/next';
import { habit, routine, indexDataShape } from '@/components/types/dataTypes';



export const indexQueryChecks = async (db: SQLite.SQLiteDatabase) => {
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

    try {
        await db.runAsync(`INSERT OR IGNORE INTO entry_date_storage (date) VALUES (?);`, today);
        const todayIdResult: any = await db.getFirstAsync(`SELECT id FROM entry_date_storage WHERE date = ?`, today)
        const todayId: number = todayIdResult.id;
        const yesterdayQuery: any = await db.getFirstAsync(`SELECT id FROM entry_date_storage WHERE date = ?`, yesterday);
        const yesterdayId = yesterdayQuery?.id;
        // nullable id
        // console.log('date storage', todayId, yesterdayId);

        // check every habit's frequency day matches date objects day
        const dayIndex = todayDateObj.getDay();
        // console.log(today);
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

        const checkTodayEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries WHERE entry_date_id = ?', todayId);
        const checkTodayRoutineEntries: any = await db.getFirstAsync('SELECT COUNT(*) FROM routine_entries WHERE entry_date_id = ?', todayId);
        const getYesterdayEntries: any = await db.getAllAsync(`
        SELECT 
        habit_entries.id, 
        habit_entries.habit_id, 
        habit_entries.current_streak, 
        habit_entries.status,
        habit_entries.entry_date_id, 
        habit_entries.hit_total, 
        habit_entries.total_days,
        habit_entries.new_streak_pr,
        habits_days_frequency.day_id
        FROM 
        habit_entries
        LEFT JOIN 
        habits_days_frequency ON habit_entries.habit_id = habits_days_frequency.habit_id
        AND habits_days_frequency.day_id = ? 
        WHERE 
        habit_entries.entry_date_id = ?;
        `, dayIndex + 1, yesterdayId);

        // no entries initialized today, initialize entries
        if (checkTodayEntries['COUNT(*)'] === 0) {
            const habitEntriesExist: any = await db.getFirstAsync('SELECT COUNT(*) FROM habit_entries');
            // Only would occur on dev mode. Or if somehow you would empty your journal tables, while having habits or routines
            if (habitEntriesExist['COUNT(*)'] === 0) {
                for (let i = 0; i < habitList.length; i++) {
                    await db.runAsync('INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date_id) VALUES (?, ?, ?, ?, ?, ?)', habitList[i].id, habitList[i].day_id ? 0 : 1, 0, 0, habitList[i].day_id ? 1 : 0, todayId);
                };
            } else {
                // entries exist from yesterday, initialize habit entries the easy way
                if (getYesterdayEntries.length) {
                    for (let i = 0; i < getYesterdayEntries.length; i++) {
                        // console.log(`yesterday\'s entry index-${i}`, getYesterdayEntries[i]);
                        // console.log(getYesterdayEntries[i].habit_id, getYesterdayEntries[i].status)

                        await db.runAsync(`INSERT INTO habit_entries (habit_id, status, current_streak, hit_total, total_days, entry_date_id)
                                            VALUES (
                                            ?,
                                            ?,
                                            ?,
                                            ?,
                                            ?,
                                            ?);
                                        `, getYesterdayEntries[i].habit_id, getYesterdayEntries[i].day_id ? 0 : 1, getYesterdayEntries[i].status === 0 ? 0 : getYesterdayEntries[i].current_streak, getYesterdayEntries[i].hit_total, getYesterdayEntries[i].day_id ? getYesterdayEntries[i].total_days + 1 : getYesterdayEntries[i].total_days, todayId);

                        // update that habit's Pr if pr = true, UPDATE habits SET longest_streak = ? WHERE id = ?, getYesterdayEntries[i].current_streak, getYesterdayEntries[i].habit_id
                        if (getYesterdayEntries[i].new_streak_pr) {
                            await db.runAsync(`UPDATE habits SET longest_streak = ? WHERE id = ?;`, getYesterdayEntries[i].current_streak, getYesterdayEntries[i].habit_id);
                        }
                    };
                    // entries from yesterday don't exist, an unknown time has passed since last open, check is streak is maintained, and calculate total_days
                } else {


                    const dateDiffQuery: any = await db.getFirstAsync(`SELECT julianday(?) - julianday((SELECT MAX(date) FROM entry_date_storage));`, today);
                    const date_diff = dateDiffQuery["julianday(?) - julianday((SELECT MAX(date) FROM entry_date_storage))"];

                    for (let i = 0; i < 1; i++) {
                        // get latest pr and update longest_streak if it's true. 
                        const frequencyArray: any = await db.getAllAsync('SELECT days.day_number FROM habits_days_frequency JOIN days ON days.id = habits_days_frequency.day_id WHERE habits_days_frequency.habit_id = ?', habitList[i].id);

                        const frequencyObject: any = {};

                        frequencyArray.forEach((day: any) => {
                            frequencyObject[day.day_number] = true;
                        });

                        const lastHabitEntry: any = await db.getFirstAsync('SELECT current_streak, total_days, new_streak_pr, hit_total, entry_date_storage.date FROM habit_entries JOIN entry_date_storage ON habit_entries.entry_date_id = entry_date_storage.id WHERE habit_id = ? ORDER BY date DESC', habitList[i].id);

                        if (lastHabitEntry.new_streak_pr) {
                            await db.runAsync(`UPDATE habits SET longest_streak = ? WHERE id = ?;`, lastHabitEntry.current_streak, lastHabitEntry.habit_id);
                        }

                        if (date_diff > 7) {
                            lastHabitEntry.current_streak = 0
                            lastHabitEntry.total_days += Math.trunc(date_diff / 7) * frequencyArray.length;
                        };
                        for (let i = 0; i < date_diff % 7; i++) {
                            const comparedDay: Date = new Date();
                            comparedDay.setDate(todayDateObj.getDate() - i);
                            if (frequencyObject[comparedDay.getDay()]) {
                                lastHabitEntry.current_streak = 0;
                                lastHabitEntry.total_days += 1;
                            };
                        };

                        await db.runAsync(`
                        INSERT INTO habit_entries (
                            habit_id, 
                            status, 
                            current_streak, 
                            hit_total, 
                            total_days, 
                            entry_date_id
                        )
                        VALUES (
                            ?, 
                            ?, 
                            ?, 
                            ?, 
                            ?, 
                            ?
                        );
                    `, habitList[i].id, habitList[i].day_id ? 0 : 1, lastHabitEntry.current_streak, lastHabitEntry.hit_total, lastHabitEntry.total_days, todayId);
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
                        INSERT INTO routine_entries (routine_id, entry_date_id, habits_complete, total_habits) 
                        SELECT ?, ?, 
                        (SELECT COUNT(*) FROM habits JOIN habit_entries ON habits.id = habit_entries.habit_id WHERE routine_id = ? AND habit_entries.status = 1 AND habit_entries.entry_date_id = ?),
                        ?
                        `, routineList[i].id, todayId, routineList[i].id, todayId, routineList[i].total_habits);
                };
            };
        };

        return true;
    } catch (error) {
        console.error('Error in Index Query: ', error);
        return (new Error('Error in indexQueryChecks'));
    }
};

export const journalQuery = async (db: SQLite.SQLiteDatabase, journalPage: number) => {
    try {
        const journalDate: any = await db.getFirstAsync(`SELECT * FROM entry_date_storage ORDER BY date DESC LIMIT 1 OFFSET ?;`, journalPage);

        // console.log(journalDate);

        const habitDataArrayNull: habit[] = await db.getAllAsync(`
        SELECT habits.id, habits.title, habits.color, habits.longest_streak, habit_entries.status, habit_entries.current_streak, habit_entries.total_days, habit_entries.hit_total, habit_entries.id AS entry_id 
        FROM habits
        JOIN habit_entries
        ON habits.id = habit_entries.habit_id
        WHERE habit_entries.entry_date_id = ?
        AND
        habits.routine_id IS NULL;
        `, journalDate.id);

        const routineQuery: routine[] = await db.getAllAsync(`
        SELECT routines.id, routines.title, routines.color, routine_entries.total_habits, routine_entries.habits_complete, routine_entries.id AS entry_id
        FROM routine_entries
        JOIN routines
        ON routine_entries.routine_id = routines.id
        WHERE routine_entries.entry_date_id = ?
        `, journalDate.id);

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
            WHERE habit_entries.entry_date_id = ?
            AND
            habits.routine_id = ?; 
            `, journalDate.id, routine.id);
            // refresh
            journalResults.push({
                routine_data: routine,
                routine_habits: habitDataArray
            });
        }

        // console.log(journalResults);

        return journalResults;
    } catch (error) {
        console.error('Error in journalQuery: ', error);
        return null;
    };
};

export const gridIndexQuery = async (db: SQLite.SQLiteDatabase) => {
    try {
        const gridIndexResults: any = [];

        for await (const row of db.getEachAsync(`SELECT id, title, color FROM habits WHERE routine_id IS NULL ORDER BY id ASC`)) {
            row.type = 'habit';
            gridIndexResults.push(row);
        }

        for await (const routineRow of db.getEachAsync(`SELECT id, title, color FROM routines ORDER BY id ASC;`)) {

            const habitCount = await db.getFirstAsync(`SELECT COUNT(*) as total FROM habits WHERE routine_id = ?`, routineRow.id);
            if (habitCount.total) {
                routineRow.type = 'routine';
                gridIndexResults.push(routineRow);

                for await (const habitRow of db.getEachAsync(`SELECT id, routine_id, title, color FROM habits WHERE routine_id = ? ORDER BY id ASC`, routineRow.id)) {
                    habitRow.type = 'habit';
                    gridIndexResults.push(habitRow);
                }
            }

        }

        return gridIndexResults
    } catch (error) {
        console.error('Error in gridIndexQuery: ', error);
    }
}

export const gridHistoryQuery = async (db: SQLite.SQLiteDatabase, indexList: any, historyPage: number) => {
    try {

        const gridHistoryResult = [];
        for (let i = 0; i < indexList.length; i++) {
            const gridRow = await db.getAllAsync(`SELECT ${indexList[i].type === 'habit' ? 'habit_entries.status, habit_entries.id, habit_entries.habit_id' : 'routine_entries.habits_complete, routine_entries.total_habits, routine_entries.id, routine_entries.routine_id'}, entry_date_id
            FROM ${indexList[i].type === 'habit' ? 'habit_entries' : 'routine_entries'} 
            LEFT JOIN entry_date_storage 
            ON ${indexList[i].type === 'habit' ? 'habit_entries' : 'routine_entries'}.entry_date_id = entry_date_storage.id
            WHERE ${indexList[i].type === 'habit' ? 'habit_entries.habit_id' : 'routine_entries.routine_id'} = ?
            ORDER BY date DESC LIMIT 5 OFFSET ?`, indexList[i].id, historyPage);

            if (gridRow.length < 5) {
                const emptyCells = new Array(5 - gridRow.length).fill({ status: null, id: 0, habit_id: indexList[i].title + '-null', routine_id: indexList[i].title + '-null', habits_complete: null, total_habits: null })
                gridRow.push(emptyCells);
            }

            gridHistoryResult.push(
                {
                    gridDetails: indexList[i],
                    gridRow: gridRow
                }
            )
        }
        return gridHistoryResult
    } catch (error) {
        console.error('Error in gridHistoryQuery: ', error);
    }
}
