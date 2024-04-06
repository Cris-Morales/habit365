import { FlatList } from "react-native-gesture-handler";
import { Text, View } from "./Themed";

import { Dimensions, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function HistoryRow({ rowData, index }: any) {


    return (
        <View style={{
            alignItems: 'flex-end',
            width: windowWidth * 5 * 0.166,
            borderTopWidth: rowData.gridDetails.type === 'habit' ? (index != 0 ? 1 : 0) : 2,
            borderColor: 'gray',
            height: windowHeight * 0.144
        }}>
            {rowData.gridDetails.type === 'habit' ?
                <FlatList
                    horizontal={true}
                    scrollEnabled={false}
                    data={rowData.gridRow}
                    inverted={true}
                    keyExtractor={(item, index) => item.id + '-' + item.status + '-' + index}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={[styles.gridCell]}>

                                {isNaN(item.status) ? null : <View style={[
                                    {
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        backgroundColor: item.status >= 1 ? rowData.gridDetails.color : 'transparent',
                                        opacity: item.status === 1 ? 0.50 : 1,
                                        borderColor: rowData.gridDetails.color
                                    },
                                ]}>
                                    {item.status === 1 && <Text style={{ fontSize: 12, textAlign: 'center', textAlignVertical: 'center' }}>Skip Day</Text>}
                                    {item.status === 0 && <Text style={{ fontSize: 12, textAlign: 'center', textAlignVertical: 'center' }}>Missed</Text>}
                                    {item.status === 2 && <Text style={{ fontSize: 12, textAlign: 'center', textAlignVertical: 'center' }}>Hit</Text>}
                                </View>}
                            </View>
                        )
                    }}
                /> :
                <FlatList
                    horizontal={true}
                    scrollEnabled={false}
                    data={rowData.gridRow}
                    inverted={true}

                    keyExtractor={(item, index) => item.id + '-' + item.routine_id + '-' + index}
                    renderItem={({ item, index }) => {
                        const y: number = (1 - Math.round(item.habits_complete / item.total_habits * 1000) / 1000) * 100;
                        const x_mod: number = (50 ** 2 - (y - 50) ** 2);
                        const x_start: number = 50 - Math.sqrt(x_mod);
                        const x_end: number = 50 + Math.sqrt(x_mod);

                        return (
                            <View style={[styles.gridCell, { flexDirection: 'column' }]}>
                                <Text>{item.total_habits ? item.habits_complete + '/' + item.total_habits : ''}</Text>
                                <Svg style={{ height: 55, width: 55, justifyContent: 'center' }} viewBox='0 0 100 100'>
                                    {!item.total_habits ? <View style={{ height: 55, width: 55, borderRadius: 27.5, }} /> : item.habits_complete == item.total_habits ?
                                        <View style={{ height: 55, width: 55, borderRadius: 27.5, backgroundColor: rowData.gridDetails.color }} /> :
                                        !item.habits_complete ?
                                            <View style={{ height: 55, width: 55, borderRadius: 27.5, borderColor: rowData.gridDetails.color, borderWidth: 1 }} />
                                            :
                                            <Path
                                                d={`M ${x_start}, ${y} A 50,50  0,${y >= 50 ? 0 : 1} 0 ${x_end}, ${y} Z`}
                                                fill={rowData.gridDetails.color}
                                            />
                                    }
                                </Svg>
                            </View>

                        )
                    }}
                />}
        </View>
    )
}


const styles = StyleSheet.create({
    gridCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.166,
        minHeight: 114.25,
        height: windowHeight * 0.1425,
        borderColor: 'gray',
    }

})