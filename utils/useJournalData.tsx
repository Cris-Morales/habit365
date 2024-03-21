import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { journalQuery, indexQueryChecks } from "./indexQueries";
import SQLite from 'expo-sqlite/next'
import { indexDataShape } from "@/components/types/dataTypes";


const useJournalData = (db: SQLite.SQLiteDatabase) => {
    const [data, setData] = useState<indexDataShape[] | null>(null);

    useFocusEffect(useCallback(() => {
        const queryData = async () => {
            try {
                const entriesInitialized = await indexQueryChecks(db);
                if (entriesInitialized) {
                    const jouranlData: indexDataShape[] | any = await journalQuery(db);
                    console.log('cp4: ', jouranlData);
                    setData(jouranlData);
                } else {
                    throw new Error('No habits in the database');
                }
            } catch (error) {
                console.error('Error in Journal Data Query: ', error);
            }
        }

        queryData();
    }, []));

    return data;
}


export default useJournalData;