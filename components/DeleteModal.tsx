import { useRouter } from "expo-router";
import { View, Text } from "./Themed";
import { StyleSheet, Pressable, Alert } from "react-native";
import React from "react";


interface props {
    action: string;
    id: number;
    showModal: boolean;
    setShowModal: React.Dispatch<boolean>
}

export default function DeleteModal({ action, id, showModal, setShowModal }: props) {
    const router = useRouter()

    // use action and id to specify delete action.

    const deleteFunction = () => {
        // on press, need to make db transaction 
        // action = 'Habit' or 'Routine', defines the tanstack function above
        // have loading screen 'deleting {habit_name} from tanstack query

        router.dismissAll() // might be the only way to route to index, while not leaving screens on the screen stack
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