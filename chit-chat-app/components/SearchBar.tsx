import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../config/themeColor';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
    placeholder = 'Search...', 
    value, 
    onChangeText 
}) => {
    const handleClear = () => {
        onChangeText('');
    };

    return (
        <View style={styles.container}>
            <Ionicons 
                name="search" 
                size={20} 
                color={themeColors.textSecondary} 
                style={styles.icon} 
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={themeColors.textSecondary}
                value={value}
                onChangeText={onChangeText}
            />
            {value ? (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons 
                        name="close-circle" 
                        size={20} 
                        color={themeColors.textSecondary} 
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.surface,
        borderRadius: 8,
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: themeColors.border,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: themeColors.text,
        padding: 0, 
    },
});

export default SearchBar;