import { StyleSheet, Pressable, Animated } from 'react-native';
import { useState, useRef } from 'react';

interface props {
    statsUpdate: (checked: boolean) => void;
    habitColor: string;
}



export default function HabitButton({ statsUpdate, habitColor }: props) {

    const [pressed, setPressed] = useState<boolean>(false)
    const springAnimation = useRef(new Animated.Value(1)).current;
    const colorAnimation = useRef(new Animated.Value(0)).current;
    const backgroundColorInterpolate = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', habitColor]
    })
    const timing: number = 100;
    const tension: number = 65;
    const friction: number = 4;

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
                        friction: friction,
                        tension: tension,
                        useNativeDriver: true,
                    })
                ]),
                Animated.timing(colorAnimation, {
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
                    friction: friction,
                    tension: tension,
                    useNativeDriver: true,
                }),
                Animated.timing(colorAnimation, {
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
            Animated.spring(springAnimation, {
                toValue: 0.85,
                friction: friction * 1.5,
                tension: tension * 2,
                useNativeDriver: true,
            }).start()
            // Animated.timing(springAnimation, {
            //     toValue: 0.85,
            //     duration: 75,
            //     useNativeDriver: true,
            // }).start()
        } else {
            Animated.spring(springAnimation, {
                toValue: 0.75,
                friction: friction * 1.5,
                tension: tension * 2,
                useNativeDriver: true,
            }).start()
            // Animated.timing(springAnimation, {
            //     toValue: 0.75,
            //     duration: 75,
            //     useNativeDriver: true,
            // }).start()
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