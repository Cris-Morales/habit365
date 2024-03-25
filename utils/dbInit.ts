import * as SQLite from 'expo-sqlite/next';

const dbInitScripts: any = {
    initiateDb: async (db: SQLite.SQLiteDatabase) => {

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
                    entry_date DATE NOT NULL,
                    new_streak_pr BOOLEAN DEFAULT false,
                    FOREIGN KEY (habit_id) REFERENCES habits(id));

                CREATE TABLE IF NOT EXISTS routine_entries (
                    id INTEGER PRIMARY KEY,
                    entry_date DATE NOT NULL,
                    total_habits integer,
                    habits_complete integer,
                    routine_id INTEGER NOT NULL,
                    FOREIGN KEY (routine_id) REFERENCES routines(id));
                    `);

        // await db.execAsync(`
        //         INSERT INTO habit_entries (habit_id, current_streak, entry_date, hit_total, status, total_days) VALUES (1, 1, '2024-03-01', 1, 2, 1);
        //         INSERT INTO habit_entries (habit_id, current_streak, entry_date, hit_total, status, total_days) VALUES (2, 1, '2024-03-01', 1, 2, 1);
        //             `);

        // await db.execAsync(`
        //         INSERT INTO habit_entries (habit_id, current_streak, entry_date, hit_total, status, total_days) VALUES (1, 1, '2024-03-18', 1, 2, 1);
        //         INSERT INTO habit_entries (habit_id, current_streak, entry_date, hit_total, status, total_days) VALUES (2, 1, '2024-03-18', 1, 2, 1);
        //             `);

        await db.execAsync(`
                INSERT INTO days (day_number, day_name) VALUES (0, 'Sunday');
                INSERT INTO days (day_number, day_name) VALUES (1, 'Monday');
                INSERT INTO days (day_number, day_name) VALUES (2, 'Tuesday');
                INSERT INTO days (day_number, day_name) VALUES (3, 'Wednesday');
                INSERT INTO days (day_number, day_name) VALUES (4, 'Thursday');
                INSERT INTO days (day_number, day_name) VALUES (5, 'Friday');
                INSERT INTO days (day_number, day_name) VALUES (6, 'Saturday');
                    `);

        console.log('tables created')
    },
}


export default dbInitScripts