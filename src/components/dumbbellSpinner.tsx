import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type DumbbellSpinnerProps = {
    message?: string;
    color?: string;
    backgroundColor?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
};

export function DumbbellSpinner({
                                    message = 'Analyzing Your Form…',
                                    color = '#5C5CFF',
                                    backgroundColor = '#FFFFFF',
                                    size = 34,
                                    style,
                                }: DumbbellSpinnerProps) {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let mounted = true;
        let completedTurns = 0;
        let animation: Animated.CompositeAnimation;

        const runNextTurn = () => {
            animation = Animated.timing(rotation, {
                toValue: completedTurns + 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
                isInteraction: false,
            });

            animation.start(({finished}) => {
                if (finished && mounted) {
                    completedTurns += 1;
                    runNextTurn();
                }
            });
        };

        rotation.setValue(0);
        runNextTurn();

        return () => {
            mounted = false;
            animation.stop();
        };
    }, [rotation]);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
        extrapolate: 'extend',
    });

    return (
        <View
            accessibilityLabel={message || 'Loading'}
            accessibilityLiveRegion="polite"
            accessibilityRole="progressbar"
            style={[styles.container, {backgroundColor}, style]}>
            <Animated.View
                style={[
                    styles.iconBox,
                    {width: size, height: size, transform: [{rotate: spin}]},
                ]}>
                <Ionicons
                    name="barbell-outline"
                    size={size}
                    color={color}
                    style={{width: size, height: size, lineHeight: size, textAlign: 'center'}}
                />
            </Animated.View>

            {!!message && <Text style={[styles.message, {color}]}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: 12,
        fontSize: 20,
        lineHeight: 20,
        fontWeight: '600',
    },
});

export default DumbbellSpinner;
