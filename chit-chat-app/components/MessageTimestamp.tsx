import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    timestamp: string;
}

const MessageTimestamp: React.FC<Props> = ({ timestamp }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{timestamp}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    text: {
        color: '#666',
        fontSize: 12,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
});

export default MessageTimestamp; 