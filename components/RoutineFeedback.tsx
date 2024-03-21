import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Text, View } from '@/components/Themed';
import Svg, { Circle, Rect } from 'react-native-svg';

export default function RoutineFeedback({ habitsComplete, totalHabits, routine_data }: any) {
    const [bubbleProgress, setBubbleProgress] = useState<number>(100 * habitsComplete / totalHabits) // as this moves to 50, the bubble moves closer to full
    const fillAnimation = useRef(new Animated.Value(0)).current; // animation that makes it look like the bubble is filling
    const [borderColor, setborderColor] = useState<string>('gray');

    useEffect(() => {
        setBubbleProgress(100 * habitsComplete / totalHabits)
        Animated.timing(fillAnimation, {
            toValue: (-70) * habitsComplete / totalHabits,
            duration: 0,
            useNativeDriver: true,
        }).start();

        if (habitsComplete === totalHabits) {
            setborderColor(routine_data.color);
        } else {
            setborderColor('gray');
        }
    }, [habitsComplete])


    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View
                style={[styles.checkbox,
                { borderColor: borderColor }]
                }>
                <Animated.View
                    style={[
                        {
                            zIndex: -1,
                            marginLeft: -1,
                            marginTop: 69,
                            position: 'relative',
                            transform: [{
                                translateY: fillAnimation,
                            }]
                        },
                    ]} >
                    <Svg height="70" width="70" viewBox="0 0 100 100" style={{ zIndex: -1 }}>
                        <Circle cx='50' cy={- 50 + bubbleProgress} r='50' fill={routine_data.color} />
                    </Svg>
                </Animated.View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    checkbox: {
        borderWidth: 1,
        borderRadius: 35,
        marginRight: 10,
        marginVertical: 10,
        height: 70,
        width: 70,
        backgroundColor: 'transparent',
    }
});