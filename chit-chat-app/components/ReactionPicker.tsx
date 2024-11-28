import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import FloatingReaction from './FloatingReaction';

const { width } = Dimensions.get('window');

const REACTIONS = [
    { icon: '❤️', label: 'Love' },
    { icon: '😆', label: 'Haha' },
    { icon: '😮', label: 'Wow' },
    { icon: '😢', label: 'Sad' },
    { icon: '😡', label: 'Angry' },
    { icon: '👍', label: 'Like' },
    // Thêm các reaction khác nếu cần
];

interface ReactionPickerProps {
    isVisible: boolean;
    onSelectReaction: (icon: string) => Promise<void>;
    currentReaction: string | null;
    isCurrentUser: boolean;
}

// Cập nhật interface ReactionPickerProps
interface ReactionPickerProps {
    isVisible: boolean;
    onSelectReaction: (icon: string) => Promise<void>;
    currentReaction: string | null;
    isCurrentUser: boolean;
}

// Cập nhật interface ReactionPickerProps
interface ReactionPickerProps {
    isVisible: boolean;
    onSelectReaction: (icon: string) => Promise<void>;
    currentReaction: string | null;
    isCurrentUser: boolean;
    onAnimationComplete: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({
    isVisible,
    onSelectReaction,
    currentReaction,
    isCurrentUser,
    onAnimationComplete,
}) => {
    const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; icon: string }>>([]);
    const nextIdRef = useRef(0);

    // Kiểm tra khi tất cả animation hoàn thành
    useEffect(() => {
        if (floatingReactions.length === 0 && nextIdRef.current > 0) {
            onAnimationComplete();
            nextIdRef.current = 0;
        }
    }, [floatingReactions]);

    const handleReactionPress = async (icon: string) => {
        // Tăng số lượng bong bóng lên
        const newReactions = Array(8).fill(null).map(() => ({
            id: nextIdRef.current++,
            icon,
        }));
        
        setFloatingReactions(prev => [...prev, ...newReactions]);
        await onSelectReaction(icon);
    };

    const removeFloatingReaction = (id: number) => {
        setFloatingReactions(prev => 
            prev.filter(reaction => reaction.id !== id)
        );
    };

    if (isCurrentUser) return null;

    return (
        <View style={styles.container}>
            {/* Floating reactions */}
            {floatingReactions.map(reaction => (
                <FloatingReaction
                    key={reaction.id}
                    icon={reaction.icon}
                    onComplete={() => removeFloatingReaction(reaction.id)}
                />
            ))}

            {/* Thanh reaction luôn hiển thị ở dưới */}
            <View style={styles.reactionsContainer}>
                <ScrollView 
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.inputField}>
                        <Text style={styles.inputText}>Gửi tin nhắn</Text>
                    </View>
                    {REACTIONS.map((reaction) => (
                        <TouchableOpacity
                            key={reaction.icon}
                            style={[
                                styles.reactionButton,
                                currentReaction === reaction.icon && styles.selectedReaction
                            ]}
                            onPress={() => handleReactionPress(reaction.icon)}
                        >
                            <Text style={styles.reactionEmoji}>{reaction.icon}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    reactionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    inputField: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 15,
    },
    inputText: {
        color: '#fff',
        opacity: 0.7,
    },
    reactionButton: {
        marginHorizontal: 8,
        padding: 5,
    },
    selectedReaction: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    reactionEmoji: {
        fontSize: 24,
    },
});

export default ReactionPicker;