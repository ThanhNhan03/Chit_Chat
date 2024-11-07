import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
}

interface MessageItemProps {
    message: Message;
    onImagePress: (uri: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onImagePress }) => (
    <View style={styles.messageContainer}>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
        <View style={styles.message}>
            {message.type === 'text' ? (
                <Text style={styles.messageText}>{message.text}</Text>
            ) : (
                <TouchableOpacity onPress={() => onImagePress(message.image!)} activeOpacity={0.9}>
                    <Image source={{ uri: message.image }} style={styles.messageImage} resizeMode="cover" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    messageContainer: {
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    message: {
        backgroundColor: '#008080',
        borderRadius: 20,
        padding: 12,
        maxWidth: '70%',
    },
    timestamp: {
        color: '#666',
        fontSize: 12,
        marginBottom: 4,
    },
    messageText: {
        color: '#fff',
        fontSize: 16,
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
    },
});

export default MessageItem;
