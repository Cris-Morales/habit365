import { Text, View } from '@/components/Themed';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';


export function TopRowDateCell({ date }: any) {

    return (
        <View style={styles.dateCell}>
            <Text style={styles.title}>
                {date}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold'
    },
    routineCell: {
        flex: 1,
        borderLeftWidth: 1,
        borderTopWidth: 3,
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        paddingVertical: 5,
        borderLeftColor: 'gray'
    },
    habitCell: {
        flex: 1,
        paddingVertical: 5,
        borderLeftWidth: 1,
        borderLeftColor: 'gray',
        // borderTopColor: 'gray'
    },
    dateCell: {
        height: '5%',
        borderWidth: 1,
        borderBottomColor: 'gray',
        borderLeftColor: 'gray'

    }
});