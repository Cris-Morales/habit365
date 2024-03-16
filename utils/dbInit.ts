import * as SQLite from 'expo-sqlite';

const dbInit: any = () => {
    const db: SQLite.Database = SQLite.openDatabase("habit365.db");

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



export default dbInit;