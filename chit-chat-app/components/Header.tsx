import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../config/themeColor';

interface HeaderProps {
    title: string;
    onBackPress: () => void;
    rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBackPress, rightComponent }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={onBackPress}
                activeOpacity={0.7}
            >
                <Ionicons 
                    name="arrow-back" 
                    size={24} 
                    color={themeColors.primary} 
                />
            </TouchableOpacity>
            
            <View style={styles.headerTitle}>
                <Text 
                    style={styles.headerName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
            
            {rightComponent ? (
                <View style={styles.rightComponent}>
                    {rightComponent}
                </View>
            ) : (
                <View style={styles.placeholderRight} />
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: themeColors.surface,
        ...Platform.select({
            ios: {
                shadowColor: themeColors.text,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                // elevation: 2,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: themeColors.surface,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    headerTitle: {
        flex: 1,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: themeColors.text,
        textAlign: 'center',
    },
    rightComponent: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderRight: {
        width: 40, 
    }
});

export default Header;
