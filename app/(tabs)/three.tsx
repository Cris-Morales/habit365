import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppDatePicker from '@/components/AppDatePicker';



export default function TabThreeScreen() {


    return (
        <>
            <AppDatePicker />
        </>
    );
};