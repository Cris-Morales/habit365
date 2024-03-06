import { StyleSheet, Pressable, FlatList } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router'
import RoutineFeedback from './RoutineFeedback';


export default function RoutineHeader({ routine_data, routineProgress, routineLength }: any) {

    const openRoutineModal = () => {
        router.navigate(
            {
                pathname: 'routine-details',
                params: {
                    id: routine_data.id,
                    title: routine_data.title
                }
            }
        )
    }

    return (
        <View style={styles.routineHeader}>
            <RoutineFeedback routineProgress={routineProgress} routineLength={routineLength} routine_data={routine_data} />
            <Pressable onLongPress={openRoutineModal} style={styles.modalButton}>
                <View style={{
                    flex: 0.75,
                    justifyContent: 'center',
                }}>
                    <Text style={styles.routineText}>
                        {routine_data.title}
                    </Text>
                </View>
            </Pressable>
            <Text style={{
                flex: 1,
            }}>{routineProgress} / {routineLength}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    routineHeader: {
        height: 100,
        paddingVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingLeft: 5,
        marginHorizontal: 2,
        marginTop: 5,
    },
    modalButton: {
        flex: 1,
    },
    routineText: {
        flexDirection: 'row',
        marginRight: 10,
        justifyContent: 'center',
        textAlign: 'left',
        alignItems: 'center',
        fontSize: 20,
    },
});
