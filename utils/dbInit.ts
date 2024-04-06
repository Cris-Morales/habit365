import * as SQLite from 'expo-sqlite/next';

const dbInitScripts: any = {
    initiateDb: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS routines (
                id INTEGER PRIMARY KEY, 
                title VARCHAR(40) NOT NULL, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                color VARCHAR(16) NOT NULL, 
                intention VARCHAR(255), 
                start_date DATE NOT NULL);
                
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY, 
                title VARCHAR(28) NOT NULL, 
                start_date DATE NOT NULL, 
                color VARCHAR(16) NOT NULL, 
                intention VARCHAR(255), 
                routine_id INTEGER, 
                longest_streak INTEGER NOT NULL DEFAULT 0, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (routine_id) REFERENCES routines(id));
            
            CREATE TABLE IF NOT EXISTS days (
                id INTEGER PRIMARY KEY, 
                day_number INTEGER,
                day_name STRING,
                UNIQUE(day_number, day_name));

            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (0, 'Sunday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (1, 'Monday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (2, 'Tuesday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (3, 'Wednesday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (4, 'Thursday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (5, 'Friday');
            INSERT OR IGNORE INTO days (day_number, day_name) VALUES (6, 'Saturday');

            CREATE TABLE IF NOT EXISTS habits_days_frequency (
                id INTEGER PRIMARY KEY,
                habit_id INTEGER NOT NULL,
                day_id INTEGER NOT NULL,
                FOREIGN KEY (habit_id) REFERENCES habits(id)
                FOREIGN KEY (day_id) REFERENCES days(id));

            CREATE TABLE IF NOT EXISTS habit_entries (
                id INTEGER PRIMARY KEY,
                habit_id INTEGER NOT NULL,
                status INTEGER NOT NULL,
                current_streak INTEGER NOT NULL,
                hit_total INTEGER NOT NULL,
                total_days INTEGER NOT NULL,
                entry_date_id INTEGER NOT NULL,
                new_streak_pr BOOLEAN DEFAULT false,
                FOREIGN KEY (habit_id) REFERENCES habits(id),
                FOREIGN KEY (entry_date_id) REFERENCES entry_date_storage(id)
                );

            CREATE TABLE IF NOT EXISTS routine_entries (
                id INTEGER PRIMARY KEY,
                entry_date_id INTEGER NOT NULL,
                total_habits INTEGER,
                habits_complete INTEGER,
                routine_id INTEGER NOT NULL,
                FOREIGN KEY (routine_id) REFERENCES routines(id),
                FOREIGN KEY (entry_date_id) REFERENCES entry_date_storage(id)
                );
                
            CREATE TABLE IF NOT EXISTS entry_date_storage (
                id INTEGER PRIMARY KEY,
                date DATE NOT NULL,
                UNIQUE(date)
            )
            `);

            // await db.execAsync(`ALTER TABLE habit_entries RENAME COLUMN entry_date to entry_date_id;`);
            // await db.execAsync(`ALTER TABLE routine_entries RENAME COLUMN entry_date to entry_date_id;`);

            // await db.execAsync(`ALTER TABLE habit_entries ALTER COLUMN entry_date_id INTEGER;`);
            // await db.execAsync(`ALTER TABLE routine_entries ALTER COLUMN entry_date_id INTEGER`);

            // for await (const row of db.getEachAsync(`SELECT * FROM entry_date_storage;`)) {
            //     await db.runAsync(`UPDATE habit_entries SET entry_date_id = ? WHERE entry_date_id = ?;`, row.id, row.date);
            //     await db.runAsync(`UPDATE routine_entries SET entry_date_id = ? WHERE entry_date_id = ?;`, row.id, row.date);

            // }

            // await db.execAsync(`ALTER TABLE habit_entries 
            // ADD FOREIGN KEY (entry_date_id) REFERENCES entry_date_storage(id);ALTER TABLE routines_entries 
            // ADD FOREIGN KEY (entry_date_id) REFERENCES entry_date_storage(id);`)

            // console.log('Tables Initialized');
        } catch (error) {
            console.error('Error Occured in dbInit: ', error);
        }
    },
}


export default dbInitScripts