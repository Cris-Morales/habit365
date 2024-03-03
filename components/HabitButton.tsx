import { StyleSheet, Pressable, Animated } from 'react-native';
import { useState, useRef } from 'react';

interface props {
    statsUpdate: (checked: boolean) => void;
    habitColor: string;
}



export default function HabitButton({ statsUpdate, habitColor }: props) {

    const [pressed, setPressed] = useState<boolean>(false)
    const springAnimation = useRef(new Animated.Value(1)).current;
    const testColorAnimation = useRef(new Animated.Value(0)).current;
    const backgroundColorInterpolate = testColorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', habitColor]
    })
    const timing: number = 150

    const handlePressedOut = () => {
        if (!pressed) {
            statsUpdate(true);
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(springAnimation, {
                        toValue: 1.35,
                        duration: timing,
                        useNativeDriver: true,
                    }),
                    Animated.spring(springAnimation, {
                        toValue: 1.2,
                        friction: 3,
                        tension: 20,
                        useNativeDriver: true,
                    })
                ]),
                Animated.timing(testColorAnimation, {
                    toValue: 1,
                    duration: timing,
                    useNativeDriver: true,
                })
            ]).start();
            setPressed(true);

        } else {
            statsUpdate(false);
            Animated.parallel([
                Animated.spring(springAnimation, {
                    toValue: 1,
                    friction: 3,
                    tension: 20,
                    useNativeDriver: true,
                }),
                Animated.timing(testColorAnimation, {
                    toValue: 0,
                    duration: timing,
                    useNativeDriver: true,
                })
            ]).start();
            setPressed(false);
        };
    };
    const handlePressedIn = () => {

        if (pressed) {
            Animated.timing(springAnimation, {
                toValue: 0.9,
                duration: timing * 0.50,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(springAnimation, {
                toValue: 0.8,
                duration: timing * 0.50,
                useNativeDriver: true,
            }).start()
        }
    };



    return (

        <Pressable
            onPressIn={handlePressedIn}
            onPressOut={handlePressedOut}
            style={styles.container}>
            <Animated.View
                style={[
                    styles.checkbox,
                    {
                        backgroundColor: backgroundColorInterpolate,
                        borderColor: habitColor,
                        transform: [{
                            scale: springAnimation,
                        }]
                    },
                ]} />
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