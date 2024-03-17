import { StyleSheet, Button, } from 'react-native';
import { useState } from 'react';
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

let db = SQLite.openDatabase('habit365.db');
export default function TabThreeScreen() {
    const [data, setData] = useState<habitRow[] | undefined>();

    const openDatabase = function () {
        db = SQLite.openDatabase('habit365.db');
        console.log('database re-open')
    }

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

    const insertHabitAsync = async function () {
        const query: string = 'INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)';

        const params: any[] = ['TestingHabits', '2023-01-01', '#00ff00', 'intentionHabit'];

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    params,
                    (tx, result) => resolve(result),
                    (_, error): any => reject(error)
                )
            })
        })
    };
    const insertHabit = async function () {
        try {
            const resultSet = await db.transactionAsync(async tx => {
                await tx.executeSqlAsync(
                    `INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)`, ['TestingHabit', '2023-01-01', '#00ff00', 'intentionHabit'],
                );
            });
            console.log('result check: ', resultSet)
        } catch (error) {
            console.error(error);
        }

    };

    const insertRoutine = async function () {
        try {
            const resultSet = await db.transactionAsync(async tx => {
                await tx.executeSqlAsync(
                    `INSERT INTO routines (title, start_date, color, intention) VALUES (?, ?, ?, ?)`, ['TestingRoutine', '2023-01-01', '#00ff00', 'intentionHabit'],
                );
            });
            console.log('result check: ', resultSet)
        } catch (error) {
            console.error(error);
        }
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
            tx.executeSql('SELECT * FROM habits', [], (_, { rows }) => {
                const habitData = (rows._array);
                console.log('read habits successfully', rows._array);
                setData(habitData);
            }, (_, error): any => console.error('Error in read habit: ', error),
            )
        })
    };
    const readRoutine = function () {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM routines', [], (_, { rows }) => {
                const habitData = (rows._array);
                console.log('read routines successfully', rows._array);
                setData(habitData);
            }, (_, error): any => console.error('Error in read routines: ', error),
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
            <Button onPress={openDatabase} title='re-open' />
            <Button onPress={createTable} title='create table' />
            <Button onPress={insertHabitAsync} title='insert habit async' />
            <Button onPress={insertHabit} title='insert habit' />
            <Button onPress={readHabit} title='read habit' />
            <Button onPress={insertRoutine} title='insert routine' />
            <Button onPress={readRoutine} title='read routine' />
            <Button onPress={closeAndDrop} title='close and drop database' />

            {data?.map((element, index) => <Text key={element.title + element.created_at}>{element.title}, {element.color}, {element.start_date}, {element.created_at}, {element.intention}</Text>)}
        </View>
    );
}
