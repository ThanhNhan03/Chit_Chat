import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FloatingReactionProps {
    icon: string;
    onComplete: () => void;
}

const FloatingReaction: React.FC<FloatingReactionProps> = ({ icon, onComplete }) => {
    const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
    const scale = useRef(new Animated.Value(0.5)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Random starting position at bottom of screen
        const startX = Math.random() * (width - 40);
        position.setValue({ x: startX, y: height });

        // Animate the reaction floating up
        Animated.parallel([
            Animated.timing(position.y, {
                toValue: -100,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 0.8,
                    duration: 1800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 1800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            onComplete();
        });

        // Add some random horizontal movement
        Animated.timing(position.x, {
            toValue: startX + (Math.random() * 100 - 50),
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.Text
            style={[
                styles.floatingEmoji,
                {
                    transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                        { scale },
                    ],
                    opacity,
                },
            ]}
        >
            {icon}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    floatingEmoji: {
        position: 'absolute',
        fontSize: 40,
    },
});

export default FloatingReaction;