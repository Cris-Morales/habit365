import * as SQLite from 'expo-sqlite';




const dbInsert = {
    routine: (title, start_date, color, intention) => {
        const db = SQLite.openDatabase('habit365');

        console.log('inserting into routine')
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO routines (title, start_date, color, intention) VALUES (?, ?, ?, ?)`, [title, start_date, color, intention],
                (_, resultSet) => {
                    console.log("Routines insert successful: ", resultSet);
                },
                (_, error) => {
                    console.error("Error in habit insert: ", error);
                }
            );
        });
    },
    habit: (title, start_date, color, intention) => {
        const db = SQLite.openDatabase('habit365');

        console.log('inserting into routine')
        db.transaction(tx => {
            tx.executeSql(
                `INSERT INTO habits (title, start_date, color, intention) VALUES (?, ?, ?, ?)`, [title, start_date, color, intention],
                (_, resultSet) => {
                    console.log("Habits insert successful: ", resultSet);
                },
                (_, error) => {
                    console.error("Error in habit insert: ", error);
                }
            );
        });
    }
}

export default dbInsert