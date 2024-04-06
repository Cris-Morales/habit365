import { StyleSheet, FlatList, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';
import useGridHistory from '@/utils/useGridHistory';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import HistoryRow from '@/components/HistoryRow';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const todayDateObj = new Date();
const offsetHoursOperation = todayDateObj.getTimezoneOffset() / 60;
const offsetHours = offsetHoursOperation > 9 ? '0' + offsetHoursOperation.toString() : offsetHoursOperation;
const offsetMinutesMod = todayDateObj.getTimezoneOffset() % 60;
const offsetMinutes = offsetMinutesMod === 0 ? '00' : offsetMinutesMod;
const fullOffset = 'T' + offsetHours + ':' + offsetMinutes + ':00'



export default function TabFourScreen() {
    const [historyPage, setHistoryPage] = useState<number>(0);
    const db = SQLite.useSQLiteContext();
    const [gridIndexData, gridData, dates, totalDates, isLoading] = useGridHistory(db, historyPage);

    return (
        <GestureHandlerRootView>
            {isLoading ?
                <View>
                    <Text style={{ fontSize: 12, textAlign: 'center', textAlignVertical: 'center' }}>
                        Loading...
                    </Text>
                </View> :
                <ScrollView>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <Pressable onPress={() => (totalDates - historyPage * 5) > 5 ? setHistoryPage(historyPage + 1) : null} style={{
                                alignItems: 'flex-start',
                                height: '100%',
                                marginVertical: 10,

                                // borderBottomWidth: 1, borderLeftWidth: 1,
                                // borderTopWidth: 1, borderColor: 'gray',
                                width: '10%'
                            }}>
                                <AntDesign size={20} name="left" color='white' />
                            </Pressable>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 16 }}>Date Navigation</Text>
                            </View>
                            <Pressable onPress={() => historyPage != 0 ? setHistoryPage(historyPage - 1) : null} style={[
                                {
                                    alignItems: 'flex-end',
                                    height: '100%',
                                    marginVertical: 10,
                                    width: '10%',
                                }]}>
                                <AntDesign size={20} name="right" color='white' />
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderColor: 'gray', borderTopWidth: 0.5 }}>
                            <FlatList
                                horizontal={true}
                                scrollEnabled={false}
                                inverted={true}
                                style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: 'gray' }}
                                data={dates}
                                keyExtractor={(item, index) => item.date + '-' + index}
                                renderItem={({ item, index }) => {
                                    if (item.date) {
                                        const date = new Date(item.date + fullOffset);
                                        return (
                                            <View style={[styles.topRowCells, { borderLeftWidth: index === 4 ? 0 : 1 }]}>
                                                <Text style={{ textAlign: 'center', }}>{date.toLocaleDateString('default', { weekday: 'short' })}</Text>
                                                <Text style={{ textAlign: 'center' }}>{date.toLocaleString('default', { month: 'short' })}, {date.getDate()}</Text>
                                                <Text style={{ textAlign: 'center' }}>{date.getFullYear()}</Text>
                                            </View>
                                        )
                                    } else {
                                        return (
                                            <View style={styles.topRowCells} />
                                        )
                                    }
                                }}
                            />

                            <View style={styles.iconCell}>
                                <Text style={{ textAlign: 'center' }}>Icon</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', borderColor: 'gray' }}>
                        <FlatList
                            scrollEnabled={false}
                            data={gridData}
                            keyExtractor={(item, index) => item + '-' + index}
                            renderItem={({ item, index }) => {
                                return (
                                    <HistoryRow rowData={item} index={index} />
                                )
                            }} />
                        <FlatList
                            scrollEnabled={false}
                            data={gridIndexData}
                            keyExtractor={(item, index) => item.title + '-' + item.type + item.id + '-' + index}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={[styles.gridCell, {

                                        borderTopWidth: item.type === 'habit' ? 0 : 2, flexDirection: 'column', alignSelf: 'flex-end', borderLeftWidth: 2, borderColor: 'gray', width: windowWidth * 0.165, height: windowHeight * 0.144,

                                    }]} >
                                        <Text style={{ marginTop: item.type === 'habit' ? -25 : -10, marginBottom: 10 }}>
                                            {item.title.length > 5 ? item.title.substring(0, 5) + '...' : item.title}
                                        </Text>
                                        <View style={{ height: item.type === 'habit' ? 50 : 55, width: item.type === 'habit' ? 50 : 55, borderRadius: item.type === 'habit' ? 25 : 27.5, backgroundColor: item.color }} />
                                    </View>
                                )
                            }} />
                    </View>
                </ScrollView>
            }
        </GestureHandlerRootView >
    );
}

const styles = StyleSheet.create({
    gridCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.1667,
        height: windowHeight * 0.1425,
        borderColor: 'gray',
    },
    topRowCells: {
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.166,
        borderColor: 'gray',
        borderLeftWidth: 1
    },
    iconCell: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.165,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'gray'
    }
});