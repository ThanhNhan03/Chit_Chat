import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const REACTIONS = ['👍', '❤️', '😆', '😮', '😢', '😠'];

interface ReactionMenuProps {
    onSelectReaction: (reaction: string) => void;
}

const ReactionMenu: React.FC<ReactionMenuProps> = ({ onSelectReaction }) => {
    return (
        <View style={styles.container}>
            {REACTIONS.map((reaction) => (
                <TouchableOpacity
                    key={reaction}
                    onPress={() => onSelectReaction(reaction)}
                    style={styles.reactionButton}
                >
                    <Text style={styles.reactionEmoji}>{reaction}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    reactionButton: {
        padding: 5,
        marginHorizontal: 2,
    },
    reactionEmoji: {
        fontSize: 20,
    },
});

export default ReactionMenu;