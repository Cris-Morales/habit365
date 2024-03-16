import { StyleSheet, Button, } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite';

interface habitRow {
    color: string;
    created_at: string;
    current_streak: number;
    id: number;
    intention: null | string;
    longest_streak: string;
    routine_id: null | number;
    start_date: string;
    title: string;
}

export default function TabThreeScreen() {
    const [data, setData] = useState<habitRow[] | undefined>();


    const db = SQLite.openDatabase('habit365');

    const createTable = function () {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS routines (
                        id INTEGER PRIMARY KEY,
                        title VARCHAR(40) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        color VARCHAR(16) NOT NULL,
                        intention VARCHAR(255),
                        start_date DATE NOT NULL
                    );`,
                [],
                (_, resultSet) => {
                    console.log("routines Table created successfully", resultSet);
                },
                (_, error): any => {
                    console.error("Error creating table:", error);
                }
            );
        });
        db.transaction(tx => {
            tx.executeSql(
                `
                    CREATE TABLE IF NOT EXISTS habits (
                        id INTEGER PRIMARY KEY,
                        title VARCHAR(28) NOT NULL,
                        color VARCHAR(16) NOT NULL,
                        start_date DATE NOT NULL,
                        routine_id INTEGER,
                        longest_streak INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        intention VARCHAR(255),
                        FOREIGN KEY (routine_id) REFERENCES routines(id)
                    );
                    `,
                [],
                (_, resultSet) => {
                    console.log("habits Table created successfully", resultSet);
                },
                (_, error): any => {
                    console.error("Error creating table:", error);
                }
            );
        });
    }

    const insertHabit = function () {
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO routines (title, start_date, color) VALUES (?, ?, ?)`, ['Testing', '2023-01-01', '#00ff00'],
                (_, resultSet) => {
                    console.log("insert successfully", resultSet);
                },
                (_, error): any => {
                    console.error("Error in insert:", error);
                }
            );
        });
    };

    const closeAndDrop = async function () {
        try {
            await db.closeAsync();
            await db.deleteAsync();
            console.log('db closed')
        } catch (error) {
            console.error('error in close and drop: ', error)
        }
    }

    const readHabit = function () {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM routines', [], (_, { rows }) => {
                const habitData = (rows._array);
                console.log(rows._array);
                setData(habitData);
            }, (_, error): any => console.error('Error in read habit: ', error),
            )
        })
    };

    return (
        <View style={{
            flex: 1,
        }}>
            <Text>Color Scheme</Text>
            <Text>Set User Name</Text>
            <Text>Toggle App Open Habit</Text>
            <Text>Day/Night Mode</Text>
            <Text>About this Project</Text>
            <Text>Github</Text>
            <Button onPress={createTable} title='create table' />
            <Button onPress={insertHabit} title='insert data' />
            <Button onPress={readHabit} title='read routine' />
            <Button onPress={closeAndDrop} title='close and drop database' />
            {data?.map((element, index) => <Text key={element.title + element.created_at}>{element.title}, {element.color}, {element.start_date}, {element.created_at}, {element.intention}</Text>)}
        </View>
    );
}
