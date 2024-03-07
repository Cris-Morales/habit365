import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';



export default function TabTwoScreen() {

    return (
        <View style={{
            flex: 1,
        }}>
            <Text>Habit Name</Text>
            <Text>Start Date</Text>
            <Text>Intention (Optional)</Text>
            <Text>Frequency: Everyday, Select Days</Text>
            <Text>Add to Routine</Text>
            <Text>Create Habit</Text>
        </View>
    );
}


const styles = StyleSheet.create({
});