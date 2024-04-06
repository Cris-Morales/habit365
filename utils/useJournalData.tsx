import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { journalQuery, indexQueryChecks } from "./indexQueries";
import SQLite from 'expo-sqlite/next'
import { indexDataShape } from "@/components/types/dataTypes";
import dbInitScripts from "./dbInit";


const useJournalData = (db: SQLite.SQLiteDatabase, journalPage: number) => {
    const [data, setData] = useState<indexDataShape[] | null>(null);

    useFocusEffect(useCallback(() => {
        const queryData = async () => {
            try {
                await dbInitScripts.initiateDb(db);
                const entriesInitialized = await indexQueryChecks(db);
                if (entriesInitialized) {
                    const jouranlData: indexDataShape[] | any = await journalQuery(db, journalPage);
                    setData(jouranlData);
                } else {
                    console.log('No habits in the database');
                    return
                }
            } catch (error) {
                console.error('Error in Journal Data Query: ', error);
            }
        }

        queryData();
    }, [journalPage]));


    return data;
}


export default useJournalData;