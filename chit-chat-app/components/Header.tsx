import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    title: string;
    onBackPress: () => void;
    rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, rightComponent }) => (
    <View style={styles.header}>
        <TouchableOpacity onPress={onBackPress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
            <Text style={styles.headerName}>{title}</Text>
        </View>
        <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        flex: 1,
        marginLeft: 16,
    },
    headerName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Header;
