import { StyleSheet, Pressable } from 'react-native';
import { Text } from '@/components/Themed';




export default function DayButton({ index, day, skipDays, setSkipDays, color, tab }: any) {

    const handlePress = () => {

        const newSkipDays = [...skipDays];
        newSkipDays[index] = skipDays[index] ? false : true;
        setSkipDays(newSkipDays);
    };

    return (
        <Pressable style={[styles.dayButtons, { backgroundColor: skipDays[index] ? color : 'transparent', borderColor: skipDays[index] ? 'transparent' : 'gray' }]} onPress={handlePress} disabled={tab == 'details' ? true : false}>
            <Text style={[styles.dayButtonText, { color: skipDays[index] ? 'black' : 'white' }]}>
                {day.charAt(0)}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    dayButtons: {
        marginVertical: 5,
        marginHorizontal: 2,
        padding: 5,
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    },
    dayButtonText: {
        textAlign: 'center',
    },
});