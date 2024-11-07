import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import MessageItem from '../components/MessageItem';
import InputBar from '../components/InputBar';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from 'rn-emoji-keyboard';
import ImageViewer from '../components/ImageViewer';

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
}

const Chat: React.FC<any> = ({ route, navigation }) => {
    const { name } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
            };
            setMessages([...messages, newMessage]);
            setInputText('');
            scrollToBottom();
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const newMessage: Message = {
                id: Date.now().toString(),
                image: result.assets[0].uri,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'image',
            };
            setMessages([...messages, newMessage]);
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const handleEmojiSelected = (emoji: any) => {
        setInputText(prevText => prevText + emoji.emoji);
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <Header title={name} onBackPress={() => navigation.goBack()} />
            <ScrollView ref={scrollViewRef} style={styles.messagesContainer} onContentSizeChange={scrollToBottom}>
                {messages.map(message => (
                    <MessageItem key={message.id} message={message} onImagePress={setSelectedImage} />
                ))}
            </ScrollView>
            <InputBar
                inputText={inputText}
                setInputText={setInputText}
                onSend={handleSendMessage}
                onImagePick={handleImagePick}
                onEmojiToggle={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                showSendButton={!!inputText.trim()}
            />
            <Modal visible={!!selectedImage} transparent={false} animationType="fade" onRequestClose={() => setSelectedImage(null)}>
                {selectedImage && <ImageViewer uri={selectedImage} onClose={() => setSelectedImage(null)} />}
            </Modal>
            <EmojiPicker onEmojiSelected={handleEmojiSelected} open={isEmojiPickerOpen} onClose={() => setIsEmojiPickerOpen(false)} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
});

export default Chat;
