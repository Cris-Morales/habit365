import * as SQLite from 'expo-sqlite/next';

const dbInitScripts: any = {
    initiateDb: async () => {
        const db = await SQLite.openDatabaseAsync('habit365.db');
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
                    FOREIGN KEY (routine_id) REFERENCES routines(id));`
        );

        console.log('table created')
    },
}


export default dbInitScripts