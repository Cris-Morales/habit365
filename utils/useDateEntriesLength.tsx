import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import SQLite from 'expo-sqlite/next'

const useDateEntriesLength = (db: SQLite.SQLiteDatabase) => {
    const [dateLength, setDateLength] = useState<number | null>(null);
    // console.log('useDateIndex');

    useFocusEffect(useCallback(() => {
        const queryData = async () => {
            try {
                const results: any = await db.getFirstAsync(`SELECT COUNT(*) FROM entry_date_storage;`);
                if (results['COUNT(*)']) {
                    setDateLength(results['COUNT(*)']);
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