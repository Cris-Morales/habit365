import React from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import ColorPicker, { Panel2, OpacitySlider, colorKit, BrightnessSlider, InputWidget } from 'reanimated-color-picker';
import type { returnedResults } from 'reanimated-color-picker';

export default function AppColorPicker({ habitColor, setHabitColor }: any) {
    const initialColor = colorKit.randomRgbColor().hex();
    const selectedColor = useSharedValue(initialColor);
    const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

    const onColorSelect = (color: returnedResults) => {
        'worklet';
        selectedColor.value = color.hex;
    };

    return (
        <Animated.View style={styles.container}>
            <KeyboardAvoidingView behavior='position'>
                <View style={styles.pickerContainer}>
                    <ColorPicker
                        value={selectedColor.value}
                        sliderThickness={25}
                        thumbSize={30}
                        thumbShape='rect'
                        onChange={onColorSelect}
                    >
                        {/* <View style={styles.previewTxtContainer}> */}
                        <InputWidget
                            defaultFormat='HEX'
                            formats={['HEX']}
                            inputStyle={[{ paddingVertical: 2, borderColor: '#707070', fontSize: 12, marginLeft: 5 }, backgroundColorStyle]}
                            iconColor='#707070'
                        />
                        {/* </View> */}
                        <Panel2 style={styles.panelStyle} thumbShape='ring' reverseVerticalChannel />

                        <BrightnessSlider style={styles.sliderStyle} />

                        <OpacitySlider style={styles.sliderStyle} />

                    </ColorPicker>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    pickerContainer: {
        alignSelf: 'center',
        width: 300,
        backgroundColor: '#202124',
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    panelStyle: {
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    sliderStyle: {
        borderRadius: 20,
        marginTop: 20,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    previewTxtContainer: {
        paddingBottom: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#bebdbe',
    },
    openButton: {
        width: '100%',
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        bottom: 10,
        borderRadius: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});