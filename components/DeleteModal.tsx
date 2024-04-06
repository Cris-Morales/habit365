import { useRouter } from "expo-router";
import { View, Text } from "./Themed";
import { StyleSheet, Pressable, Alert } from "react-native";
import React from "react";
import { SQLiteDatabase } from "expo-sqlite/next";
import HabitDetails from "@/app/habit-details";


interface props {
    action: string;
    id: number;
    showModal: boolean;
    setShowModal: React.Dispatch<boolean>;
    db: SQLiteDatabase;
    routineId: number | null;
    today: string;
}

export default function DeleteModal({ action, id, showModal, setShowModal, db, routineId, today }: props) {
    const router = useRouter()

    // use action and id to specify delete action.

    const deleteFunction = async () => {
        // on press, need to make db transacti` 
        // action = 'Habit' or 'Routine', defines the tanstack function above
        // have loading screen 'deleting {habit_name} from tanstack query
        try {
            const todayIdQuery: any = await db.getFirstAsync(`SELECT id FROM entry_date_storage WHERE date = ?`, today);
            const todayId: number = todayIdQuery.id;

            if (action === 'Habit') {
                await db.execAsync(`
                DELETE FROM habits_days_frequency WHERE habit_id = ${id};
                DELETE FROM habit_entries WHERE habit_id = ${id};
                DELETE FROM habits WHERE id = ${id};
                `);

                if (routineId) {
                    const totalHabits: any = await db.getFirstAsync(`SELECT COUNT(*) FROM habits WHERE routine_id = ?`, routineId);
                    const habitsComplete: any = await db.getFirstAsync(`
                                            SELECT COUNT(*) 
                                                FROM habit_entries 
                                                JOIN habits 
                                                ON habits.id = habit_entries.habit_id 
                                                WHERE routine_id = ?
                                                AND habit_entries.status > 0 
                                                AND habit_entries.entry_date_id = ?`, routineId, todayId);

                    await db.runAsync(`
                    UPDATE routine_entries 
                    SET total_habits = ?,
                    habits_complete = ? 
                    WHERE routine_id = ?
                    AND
                    entry_date_id = ?;
                    `, totalHabits['COUNT(*)'], habitsComplete['COUNT(*)'], routineId, todayId);
                }

            } else if (action === 'Routine') {
                await db.execAsync(`
                UPDATE habits SET routine_id = NULL WHERE routine_id = ${id};
                DELETE FROM routine_entries WHERE routine_id = ${id};
                DELETE FROM routines WHERE id = ${id};
                `);
            }

            console.log(`${action} ${id} records deleted`)
        } catch (error) {
            console.error(`Error in delete ${action} ${id}: `, error);
        }
        router.replace(
            {
                pathname: '/(tabs)/'
            }
        )
    }

    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                <Text style={[styles.modalText]}>Delete {action}?</Text>
                <Pressable
                    style={[styles.button, styles.buttonDelete]}
                    onPress={deleteFunction}>
                    <Text style={styles.textStyle}>Delete</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonCancel]}
                    onPress={() => setShowModal(!showModal)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b9',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        width: '50%',
        height: '30%',
        justifyContent: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 10,
        width: '100%'
    },
    buttonDelete: {
        backgroundColor: 'red',
    },
    buttonCancel: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 5,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
});