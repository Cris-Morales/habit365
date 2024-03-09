import { StyleSheet, Button, Pressable } from 'react-native';
import { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { processPath } from '@shopify/react-native-skia';


type onChange = (event: DateTimePickerEvent, date?: Date | undefined) => void;

export default function AppDatePicker({ date, setDate, weekdays }: any) {
    const [show, setShow] = useState<boolean>(false);

    const onChange: onChange = (event, selectedDate) => {
        const currentDate: Date | undefined = selectedDate;
        setShow(false);
        setDate(currentDate);
    };


    const selectStartDate = () => {
        setShow(true);
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.textInputForm} onPress={selectStartDate}>
                <Text>
                    {weekdays[date?.getDay()]}, {date?.toLocaleDateString('en-US')}
                </Text>
            </Pressable>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? date : new Date()}
                    is24Hour={true}
                    onChange={onChange}
                />)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInputForm: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        color: 'white',
        backgroundColor: '#696969',
        padding: 5,
        paddingLeft: 10,
        height: 40,
        justifyContent: 'center'
    },
})