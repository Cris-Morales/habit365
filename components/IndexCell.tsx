import { Text, View } from '@/components/Themed';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';


export default function IndexCell({ color, id, title, type }: any) {

    // custom grid bubble, bigger to show it's routine

    // index shows color
    // grid shows percentage based svg
    if (type === 'routine') {
        return (
            <View style={[styles.routineCell]} >
                <Text style={styles.title}>
                    {title}
                </Text>
                <View style={{ backgroundColor: color, height: 70, width: 70, borderRadius: 35, borderWidth: 1, borderColor: 'black', marginBottom: 5 }} />
            </View>
        )
    } else if (type === 'habit') {
        return (
            <View style={[styles.habitCell]} >
                <Text style={styles.title}>
                    {title}
                </Text>
                <View style={{ backgroundColor: color, height: 55, width: 55, borderRadius: 27.5, borderWidth: 1, borderColor: 'black', marginBottom: 5 }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 5,
        fontSize: 16
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
    }
});