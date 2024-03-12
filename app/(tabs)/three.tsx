import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import AppColorPicker from '@/components/AppColorPicker';



export default function TabThreeScreen() {

    return (
        <View style={{
            flex: 1,
        }}>
            <Text>Color Scheme</Text>
            <Text>Set User Name</Text>
            <Text>Toggle App Open Habit</Text>
            <Text>Day/Night Mode</Text>
            <Text>About this Project</Text>
            <Text>Github</Text>
        </View>
    );
}


const styles = StyleSheet.create({
});