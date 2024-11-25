import React, { useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';

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
    userReactions: {[key: string]: string};
    currentUserId: string;
}

const ReactionPicker = ({ 
    onSelectReaction, 
    currentReaction, 
    onClose,
    userReactions,
    currentUserId
}: ReactionPickerProps) => {
    // Hiển thị reaction đã chọn
    const isSelected = (reactionIcon: string) => {
        return currentUserId && userReactions[currentUserId] === reactionIcon;
    };

    return (
        <View style={styles.container}>
            {REACTIONS.map((reaction) => (
                <TouchableOpacity
                    key={reaction.icon}
                    style={[
                        styles.reactionButton,
                        isSelected(reaction.icon) && styles.selectedReaction
                    ]}
                    onPress={() => onSelectReaction(reaction.icon)}
                >
                    <Text style={styles.reactionEmoji}>{reaction.icon}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        gap: 4,
    },
    reactionWrapper: {
        padding: 4,
    },
    reactionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 20,
    },
    selectedReaction: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    reactionEmoji: {
        fontSize: 24,
        marginBottom: 2,
    },
    reactionLabel: {
        color: '#fff',
        fontSize: 10,
        marginTop: 2,
    },
});

export default ReactionPicker;