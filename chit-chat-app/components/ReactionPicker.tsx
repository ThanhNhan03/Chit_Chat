import React, { useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import FloatingReaction from './FloatingReaction';

const REACTIONS = [
    { icon: '👍', label: 'Like' },
    { icon: '❤️', label: 'Love' },
    { icon: '😆', label: 'Haha' },
    { icon: '😮', label: 'Wow' },
    { icon: '😢', label: 'Sad' },
    { icon: '😡', label: 'Angry' },
];

interface ReactionPickerProps {
    onSelectReaction: (reaction: string) => void;
    currentReaction: string | null;
    onClose: () => void;
    isCurrentUser: boolean;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({
    onSelectReaction,
    currentReaction,
    onClose,
    isCurrentUser,
}) => {
    const [floatingReactions, setFloatingReactions] = useState<Array<{ id: number; icon: string }>>([]);
    const nextIdRef = useRef(0);

    const handleReactionPress = (icon: string) => {
        // Tạo hiệu ứng nổi cho reaction
        const newReactions = Array(5).fill(null).map(() => ({
            id: nextIdRef.current++,
            icon,
        }));
        
        setFloatingReactions(prev => [...prev, ...newReactions]);
        onSelectReaction(icon);
    };

    const removeFloatingReaction = (id: number) => {
        setFloatingReactions(prev => prev.filter(reaction => reaction.id !== id));
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

            {/* Reaction buttons */}
            <View style={styles.reactionsRow}>
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
                        <Text style={styles.reactionLabel}>{reaction.label}</Text>
                    </TouchableOpacity>
                ))}
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
    reactionsRow: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 8,
    },
    reactionButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 12,
        borderRadius: 30,
        alignItems: 'center',
    },
    selectedReaction: {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    reactionEmoji: {
        fontSize: 24,
    },
    reactionLabel: {
        color: '#fff',
        fontSize: 10,
        marginTop: 4,
    },
});

export default ReactionPicker;