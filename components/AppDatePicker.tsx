import { StyleSheet, Button } from 'react-native';
import { useState } from 'react';
import { Text } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

type onChange = (event: DateTimePickerEvent, date?: Date | undefined) => void;

export default function AppDatePicker() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [show, setShow] = useState<boolean>(false);

    const onChange: onChange = (event, selectedDate) => {
        const currentDate: Date | undefined = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = () => {
        setShow(true);
    };

    return (
        <SafeAreaView>
            <Button onPress={showMode} title="Show date picker!" />
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date ? date : new Date()}
                    is24Hour={true}
                    onChange={onChange}
                />
            )}
            <Text>selected: {date?.toLocaleString()}, {date?.getDay()}</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

})