import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface FloatingReactionProps {
    icon: string;
    onComplete: () => void;
}

const FloatingReaction: React.FC<FloatingReactionProps> = ({ icon, onComplete }) => {
    const position = useRef(new Animated.ValueXY()).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Tạo vị trí bắt đầu ngẫu nhiên theo chiều ngang rộng hơn
        const startX = Math.random() * width - width / 2;
        
        Animated.parallel([
            // Animation di chuyển
            Animated.timing(position, {
                toValue: {
                    x: startX,
                    y: -height + 100, // Bay cao gần full màn hình
                },
                duration: 800, // Tăng thời gian để thấy rõ hơn
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            // Animation opacity
            Animated.timing(opacity, {
                toValue: 0,
                duration: 700,
                delay: 100, // Delay fade out để thấy rõ icon
                useNativeDriver: true,
            }),
            // Animation scale
            Animated.sequence([
                // Phóng to lúc đầu
                Animated.timing(scale, {
                    toValue: 1.5,
                    duration: 200,
                    useNativeDriver: true,
                }),
                // Thu nhỏ dần khi bay lên
                Animated.timing(scale, {
                    toValue: 0.5,
                    duration: 600,
                    useNativeDriver: true,
                })
            ])
        ]).start(({ finished }) => {
            if (finished) {
                onComplete();
            }
        });
    }, []);

    return (
        <Animated.Text
            style={[
                styles.floatingEmoji,
                {
                    transform: [
                        { translateX: position.x },
                        { translateY: position.y },
                        { scale }
                    ],
                    opacity,
                }
            ]}
        >
            {icon}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    floatingEmoji: {
        position: 'absolute',
        fontSize: 45, // Tăng kích thước icon
        bottom: 80, // Điều chỉnh vị trí bắt đầu
        alignSelf: 'center',
        zIndex: 999, // Đảm bảo hiển thị trên cùng
    },
});

export default FloatingReaction;