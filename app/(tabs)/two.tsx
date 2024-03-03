import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';

const dummyData = {
  start_data: '2024-01-01',
  title: 'Meditation',
  created_at: '2024-01-01',
  color: '#e6e600',
  current_streak: 6,
  total_days: 50,
  date_diff: 60,
  id: 1
}

export default function TabTwoScreen() {

  const [pressed, setPressed] = useState<boolean>(false)
  const springAnimation = useRef(new Animated.Value(1)).current;
  const testColorAnimation = useRef(new Animated.Value(0)).current;
  const backgroundColorInterpolate = testColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', dummyData.color]
  })
  const timing: number = 150


  const handlePressedOut = () => {
    if (!pressed) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(springAnimation, {
            toValue: 1.3,
            duration: timing,
            useNativeDriver: true,
          }),
          Animated.spring(springAnimation, {
            toValue: 1.1,
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
      ]).start()
      setPressed(true)

    } else {
      Animated.parallel([
        Animated.timing(springAnimation, {
          toValue: 1,
          duration: timing,
          useNativeDriver: true,
        }),
        Animated.timing(testColorAnimation, {
          toValue: 0,
          duration: timing,
          useNativeDriver: true,
        })
      ]).start()
      setPressed(false)
    }
  }

  const handlePressedIn = () => {
    Animated.timing(springAnimation, {
      toValue: 0.8,
      duration: timing,
      useNativeDriver: true,
    }).start()
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Pressable
        onPressIn={handlePressedIn}
        onPressOut={handlePressedOut}
      >
        <Animated.View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: backgroundColorInterpolate,
            borderWidth: 1,
            borderColor: (pressed ? 'transparent' : 'gray'),
            transform: [{
              scale: springAnimation,
            }],
          }} />
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: dummyData.color
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    shadowRadius: 45,
    shadowOpacity: 1,
    shadowColor: dummyData.color
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  habitButton: {
    backgroundColor: 'green',
  },
  habitView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 6
  },
  habitText: {
    marginRight: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  habitStats: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  statsContainer: {
    flexDirection: 'row',
  }
});