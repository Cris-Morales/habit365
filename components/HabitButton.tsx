import { StyleSheet, Pressable, Animated, GestureResponderEvent } from 'react-native';
import { Text } from './Themed';
import { useState, useRef } from 'react';

interface props {
    statsUpdate: (checked: boolean) => void;
    habitColor: string;
    status: number;
}



export default function HabitButton({ statsUpdate, habitColor, status }: props) {

    const [pressed, setPressed] = useState<boolean>(status >= 1 ? true : false);
    const springAnimation = useRef(new Animated.Value(status === 2 ? 1.2 : 1)).current;
    const colorAnimation = useRef(new Animated.Value(status === 2 ? 1 : 0)).current;
    const backgroundColorInterpolate = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', habitColor]
    })
    const timing: number = 50;
    const tension: number = 65;
    const friction: number = 4;

    const handlePressed = () => {
        if (!pressed) {
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(springAnimation, {
                        toValue: 0.85,
                        duration: timing,
                        useNativeDriver: true,
                    }),
                    Animated.timing(springAnimation, {
                        toValue: 1.35,
                        duration: timing,
                        useNativeDriver: true,
                    }),
                    Animated.spring(springAnimation, {
                        toValue: 1.2,
                        friction: friction,
                        tension: tension,
                        useNativeDriver: true,
                    })
                ]),
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start();
            statsUpdate(true);
            setPressed(true);
        } else {
            Animated.sequence([
                Animated.timing(springAnimation, {
                    toValue: 0.75,
                    duration: timing,
                    useNativeDriver: true,
                }),
                Animated.parallel([
                    Animated.spring(springAnimation, {
                        toValue: 1,
                        friction: friction,
                        tension: tension,
                        useNativeDriver: true,
                    }),
                    Animated.timing(colorAnimation, {
                        toValue: 0,
                        duration: 100,
                        useNativeDriver: true,
                    })
                ])]).start();
            statsUpdate(false);
            setPressed(false);
        };

    };


    return (
        <Pressable
            onPressIn={handlePressed}
            style={styles.container}
            disabled={status === 1 ? true : false}>
            <Animated.View
                style={[
                    styles.checkbox,
                    {
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: status === 1 ? habitColor : backgroundColorInterpolate,
                        opacity: status === 1 ? 0.50 : 1,
                        borderColor: habitColor,
                        transform: [{
                            scale: status === 1 ? 1.2 : springAnimation,
                        }]
                    },
                ]}>
                {status === 1 && <Text style={{ fontSize: 12, textAlign: 'center', textAlignVertical: 'center' }}>Skip Day</Text>}
            </Animated.View>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    checkbox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
    },
    container: {
        width: 67.5,
        height: 67.5,
        alignItems: 'center',
        justifyContent: 'center',
    }
});