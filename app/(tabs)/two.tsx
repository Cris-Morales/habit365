import { StyleSheet, Pressable, FlatList, Button, Animated } from 'react-native';
import { useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import Svg, { Circle, Rect } from 'react-native-svg';
import HabitRow from '@/components/HabitRow';

const dummyData = {
  start_data: '2024-01-01',
  title: 'Meditation',
  created_at: '2024-01-01',
  color: 'cyan',
  current_streak: 6,
  total_days: 50,
  date_diff: 60,
  id: 1
}

export default function TabTwoScreen() {

  const [pressed, setPressed] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0);
  const [bubbleProgress, setBubbleProgress] = useState<number>(-49)
  const springAnimation = useRef(new Animated.Value(1)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const fillAnimation = useRef(new Animated.Value(0)).current;
  const backgroundColorInterpolate = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', dummyData.color]
  });
  const timing: number = 150;
  const progression: number = 4;

  const handlePressedOut = () => {
    if (!pressed) {
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
        Animated.timing(colorAnimation, {
          toValue: 1,
          duration: timing,
          useNativeDriver: true,
        })
      ]).start();
      setPressed(true);

    } else {
      Animated.parallel([
        Animated.spring(springAnimation, {
          toValue: 1,
          friction: 3,
          tension: 20,
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
      Animated.timing(springAnimation, {
        toValue: 0.85,
        duration: timing,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(springAnimation, {
        toValue: 0.75,
        duration: timing,
        useNativeDriver: true,
      }).start()
    }
  };

  const handleFillAnimation = (action: string) => {
    if (action === 'touch') {
      setProgress(progress - progression)
      setBubbleProgress(bubbleProgress + 10)
      Animated.timing(fillAnimation, {
        toValue: (progress - progression),
        duration: 0,
        useNativeDriver: true,
      }).start()
    } else if (action === 'hold') {
      setProgress(0)
      setBubbleProgress(-50)
      Animated.timing(fillAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start()
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={styles.container}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
          <Pressable
            onPressIn={handlePressedIn}
            onPressOut={handlePressedOut}>
            <Animated.View
              style={[
                styles.checkbox,
                {
                  backgroundColor: backgroundColorInterpolate,
                  borderColor: dummyData.color,
                  transform: [{
                    scale: springAnimation,
                  }]
                },
              ]}>
              <Animated.View
                style={[
                  {
                    // borderWidth: 1,
                    // borderColor: 'gray',
                    zIndex: -1,
                    marginLeft: -1,
                    marginTop: 39,
                    position: 'relative',
                    transform: [{
                      translateY: fillAnimation,
                    }]
                  },
                ]} >
                <Svg height="40" width="40" viewBox="0 0 100 100" style={{ zIndex: -1 }}>
                  <Circle cx='50' cy={bubbleProgress} r='50' stroke='gray' strokeWidth="1" fill='cyan' style={{ position: 'absolute' }} />
                </Svg>
              </Animated.View>
            </Animated.View>
          </Pressable>

          <Pressable onPress={() => handleFillAnimation('touch')} onLongPress={() => handleFillAnimation('hold')}>
            <Text style={{ height: 50, width: 50, backgroundColor: 'gray', textAlign: 'center', textAlignVertical: 'center' }}> {Math.round((progress / (-40)) * 100)}</Text>
          </Pressable>
        </View>
        <HabitRow habitData={dummyData} />
      </View >
    </View>

  );
}

// if this doesn't work out, what if I fill the bubble 
// as progress goes, once it fills the entire way you can click it.


const styles = StyleSheet.create({
  progressBar: {
    width: 40,
    backgroundColor: 'red',
    position: 'absolute',
    zIndex: -1,
  },
  checkbox: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    marginHorizontal: 5,
    height: 40,
    width: 40,
    backgroundColor: dummyData.color,

  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'gray'
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