import { StyleSheet, Button, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import * as SQLite from 'expo-sqlite/next';
import useGridHistory from '@/utils/useGridHistory';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Svg } from 'react-native-svg';

export default function GridBubble({ color, id, title, type }: any) {

    // custom grid bubble, bigger to show it's routine

    // index shows color
    // grid shows percentage based svg
    if (type === 'routine') {
        return (
            <View style={{ backgroundColor: 'orange' }} >
                <Text >
                    {type} {title}
                </Text>
                <Canvas style={{ height: 70, width: 70 }}>
                    <Path
                        path='M 100,50 A 50,50 0 0,1 0,50 Z'
                        color={color}
                    />
                </Canvas>

            </View>
        )
    } else if (type === 'habit') {


        return (
            <View style={{ flex: 1 }} >
                <Text >
                    {color}, {title}, {id}, {type}
                </Text>
            </View>
        )
    }
}