import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from '../config/themeColor';
import { useTheme } from '../contexts/ThemeContext';

interface InputBarProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSend: () => void;
    onImagePick: () => void;
    onEmojiToggle: () => void;
    showSendButton: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ inputText, setInputText, onSend, onImagePick, onEmojiToggle, showSendButton }) => {
    // Thêm hook useTheme
    const { theme } = useTheme();
    
    return (
        <View style={[styles.inputContainer, { 
            backgroundColor: theme.backgroundColor,
            borderTopColor: theme.borderColor
        }]}>
            <TouchableOpacity style={styles.emojiButton} onPress={onEmojiToggle}>
                <Ionicons name="happy-outline" size={24} color={themeColors.primary} />
            </TouchableOpacity>
            <TextInput
                style={[styles.input, {
                    backgroundColor: theme.input,
                    color: theme.textInput
                }]}
                placeholder="Type a message..."
                placeholderTextColor={theme.textInput + '100'}
                value={inputText}
                onChangeText={setInputText}
                multiline
            />
            <TouchableOpacity style={styles.attachButton} onPress={onImagePick}>
                <Ionicons name="attach" size={26} color={themeColors.primary} />
            </TouchableOpacity>
            {showSendButton && (
                <TouchableOpacity style={styles.sendButton} onPress={onSend}>
                    <Ionicons name="send" size={24} color={themeColors.secondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: themeColors.surface,
        borderTopWidth: 1,
        borderTopColor: themeColors.border,
    },
    emojiButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        fontSize: 16,
        
    },
    attachButton: {
        padding: 8,
    },
    sendButton: {
        padding: 8,
    },
});

export default InputBar;