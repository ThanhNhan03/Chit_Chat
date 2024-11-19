import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MessageReactionMenuProps {
    isMe: boolean;
    onReaction: (icon: string) => void;
    isReactionSelected: (icon: string) => boolean;
}

const MessageReactionMenu: React.FC<MessageReactionMenuProps> = ({
    isMe,
    onReaction,
    isReactionSelected
}) => {
    return (
        <View style={[
            styles.reactionMenuContainer,
            isMe ? styles.reactionMenuRight : styles.reactionMenuLeft,
            { zIndex: 1000 }
        ]}>
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map((icon) => (
                <TouchableOpacity
                    key={icon}
                    onPress={(e) => {
                        e.stopPropagation();
                        onReaction(icon);
                    }}
                    style={[
                        styles.reactionButton,
                        isReactionSelected(icon) && styles.selectedReactionButton
                    ]}
                >
                    <Text style={styles.reactionIcon}>{icon}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    reactionMenuContainer: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: 10,
        zIndex: 9999,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    reactionMenuRight: {
        right: 0,
    },
    reactionMenuLeft: {
        left: 0,
    },
    reactionButton: {
        padding: 8,
        marginHorizontal: 2,
    },
    reactionIcon: {
        fontSize: 20,
    },
    selectedReactionButton: {
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
    },
});

export default MessageReactionMenu;