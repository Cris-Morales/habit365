import { FlatList } from 'react-native';
import { View } from '@/components/Themed';

import DayButton from '@/components/DayButton';


const weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


const FrequencyPicker = ({ frequency, setFrequency, tab, color }: any) => {
    return (
        <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginHorizontal: -10 }}>
            <FlatList
                horizontal={true}
                scrollEnabled={false}
                data={weekdays}
                keyExtractor={(item, index) => item + '-' + index}
                renderItem={({ item, index }) => {
                    return (
                        <DayButton index={index} day={item} skipDays={frequency} setSkipDays={setFrequency} color={color} tab={tab} />
                    )
                }}
            />
        </View>
    )
}

export default FrequencyPicker;