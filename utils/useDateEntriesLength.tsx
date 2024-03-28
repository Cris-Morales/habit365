import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { journalQuery, indexQueryChecks } from "./indexQueries";
import SQLite from 'expo-sqlite/next'
import { indexDataShape } from "@/components/types/dataTypes";

const todayDateObj = new Date();

const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'


const useDateEntriesLength = (db: SQLite.SQLiteDatabase) => {
    const [dateLength, setDateLength] = useState<number | null>(null);
    console.log('useDateIndex');

    useFocusEffect(useCallback(() => {
        const queryData = async () => {
            try {
                const results: any = await db.getFirstAsync(`SELECT COUNT(DISTINCT entry_date) FROM habit_entries;`);
                if (results['COUNT(DISTINCT entry_date)']) {
                    setDateLength(results['COUNT(DISTINCT entry_date)']);
                } else {
                    console.log('no entries');
                }
            } catch (error) {
                console.error('Error in Date Length Query: ', error);
            }
        }

        queryData();
    }, []));

    return dateLength;
}


export default useDateEntriesLength;