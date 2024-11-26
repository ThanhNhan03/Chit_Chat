import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { themeColors } from '../config/themeColor';

interface Props {
    timestamp: string;
    style?: object;
}

const MessageTimestamp: React.FC<Props> = ({ timestamp, style }) => (
    <View style={styles.container}>
        <Text style={style}>{timestamp}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    text: {
        color: themeColors.textSecondary,
        fontSize: 12,
        backgroundColor: `${themeColors.primary}15`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
});

export default MessageTimestamp; 