import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { gridHistoryQuery, gridIndexQuery } from "./indexQueries";
import SQLite from 'expo-sqlite/next'

interface sqlCOUNT {
    'COUNT(*)': number;
}

const useGridHistory = (db: SQLite.SQLiteDatabase, historyPage: number) => {
    const [gridData, setGridData] = useState<any | null>(null);
    const [gridIndexData, setGridIndexData] = useState<any | null>(null);
    const [dates, setDates] = useState<any | null>(null);
    const [totalDates, setTotalDates] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useFocusEffect(useCallback(() => {
        const queryData = async () => {
            try {
                const indexDataQuery: any = await gridIndexQuery(db);
                setGridIndexData(indexDataQuery);
                const gridDataQuery: any = await gridHistoryQuery(db, indexDataQuery, historyPage * 5);
                setGridData(gridDataQuery);

                const datesQuery: any = await db.getAllAsync(`SELECT date FROM entry_date_storage ORDER BY date DESC LIMIT 5 OFFSET ?`, historyPage * 5);

                const dateCount: any = await db.getFirstAsync(`SELECT COUNT(*) FROM entry_date_storage;`);
                if (datesQuery.length < 5) {
                    const dummyDatesArray = new Array(5 - datesQuery.length).fill({ date: null });
                    setDates([...datesQuery, ...dummyDatesArray]);
                } else {
                    setDates(datesQuery);
                }

                setTotalDates(dateCount["COUNT(*)"]);
                setIsLoading(false);
            } catch (error) {
                console.error('Error in useGridHistory: ', error);
            }
        }

        queryData();
    }, [historyPage]));

    return [gridIndexData, gridData, dates, totalDates, isLoading]
}


export default useGridHistory;