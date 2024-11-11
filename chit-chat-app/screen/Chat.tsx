import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createMessages, updateFriendChat } from '../src/graphql/mutations';
import { listMessages, messagesByChat_id } from '../src/graphql/queries';
import { onCreateMessages } from '../src/graphql/subscriptions';
import { ModelSortDirection } from '../src/API';
import Header from '../components/Header';
import MessageItem from '../components/MessageItem';
import InputBar from '../components/InputBar';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from 'rn-emoji-keyboard';
import ImageViewer from '../components/ImageViewer';

const client = generateClient();

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
    isMe: boolean;
}

const Chat: React.FC<any> = ({ route, navigation }) => {
    const { name, userId, chatId } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId && chatId) {
            fetchMessages();
            const subscription = subscribeToNewMessages();
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUserId, chatId]);

    const fetchCurrentUser = async () => {
        try {
            const user = await getCurrentUser();
            setCurrentUserId(user.userId);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const messagesResponse = await client.graphql({
                query: listMessages,
                variables: {
                    filter: {
                        and: [
                            { chat_id: { eq: chatId } },
                            { chat_type: { eq: 'private' } }
                        ]
                    },
                    limit: 100
                }
            });

            if (messagesResponse.data.listMessages?.items) {
                const fetchedMessages = messagesResponse.data.listMessages.items
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map(msg => ({
                        id: msg.id,
                        text: msg.content || undefined,
                        image: msg.attachments || undefined,
                        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }),
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId
                    }));

                setMessages(fetchedMessages);
                scrollToBottom();
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            Alert.alert('Error', 'Failed to load messages');
        }
    };

    const loadMoreMessages = async (nextToken: string) => {
        try {
            const messagesResponse = await client.graphql({
                query: listMessages,
                variables: {
                    filter: {
                        and: [
                            { chat_id: { eq: chatId } },
                            { chat_type: { eq: 'private' } }
                        ]
                    },
                    limit: 20,
                    nextToken
                }
            });

            if (messagesResponse.data.listMessages?.items) {
                const olderMessages = messagesResponse.data.listMessages.items
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map(msg => ({
                        id: msg.id,
                        text: msg.content || undefined,
                        image: msg.attachments || undefined,
                        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        }),
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId
                    }));

                setMessages(prev => [...olderMessages, ...prev]);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        }
    };

    const onRefresh = async () => {
        if (messages.length > 0) {
            const oldestMessage = messages[0];
            // Implement logic to load messages older than oldestMessage
            // Use oldestMessage.timestamp as a reference
        }
    };

    const subscribeToNewMessages = () => {
        return client.graphql({
            query: onCreateMessages,
            variables: {
                filter: {
                    chat_id: { eq: chatId }
                }
            }
        }).subscribe({
            next: ({ data }) => {
                if (data?.onCreateMessages) {
                    const newMsg = data.onCreateMessages;
                    const messageObj: Message = {
                        id: newMsg.id,
                        text: newMsg.content,
                        image: newMsg.attachments,
                        timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        type: newMsg.attachments ? 'image' as const : 'text' as const,
                        isMe: newMsg.sender_id === currentUserId
                    };
                    setMessages(prev => [...prev, messageObj]);
                    scrollToBottom();
                }
            },
            error: (error) => console.warn(error)
        });
    };

    const updateLastMessage = async (content: string) => {
        try {
            await client.graphql({
                query: updateFriendChat,
                variables: {
                    input: {
                        id: chatId,
                        last_message: content,
                        updated_at: new Date().toISOString()
                    }
                }
            });
        } catch (error) {
            console.error('Error updating last message:', error);
        }
    };

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            try {
                const newMessage = {
                    chat_type: 'private',
                    chat_id: chatId,
                    sender_id: currentUserId,
                    content: inputText.trim(),
                    timestamp: new Date().toISOString(),
                    status: 'sent'
                };

                await client.graphql({
                    query: createMessages,
                    variables: { input: newMessage }
                });

                await updateLastMessage(inputText.trim());
                setInputText('');
            } catch (error) {
                console.error('Error sending message:', error);
                Alert.alert('Error', 'Failed to send message');
            }
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            try {
                // TODO: Upload image to S3 first
                const imageUrl = result.assets[0].uri; // Should be S3 URL in production
                
                const newMessage = {
                    chat_type: 'private',
                    chat_id: chatId,
                    sender_id: currentUserId,
                    content: '',
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                    attachments: imageUrl
                };

                await client.graphql({
                    query: createMessages,
                    variables: { input: newMessage }
                });

                await updateLastMessage('📷 Image');
            } catch (error) {
                console.error('Error sending image:', error);
                Alert.alert('Error', 'Failed to send image');
            }
        }
    };

    const scrollToBottom = () => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleEmojiSelected = (emoji: any) => {
        setInputText(prevText => prevText + emoji.emoji);
    };

    const renderItem = ({ item: message }) => (
        <MessageItem 
            message={message} 
            onImagePress={setSelectedImage} 
        />
    );

    const keyExtractor = (item: Message) => item.id;

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Header title={name} onBackPress={() => navigation.goBack()} />
            <View style={styles.chatContainer}>
                <FlatList
                    ref={flatListRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContentContainer}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
                    inverted={false}
                    onEndReached={onRefresh}
                    onEndReachedThreshold={0.5}
                />
                <InputBar
                    inputText={inputText}
                    setInputText={setInputText}
                    onSend={handleSendMessage}
                    onImagePick={handleImagePick}
                    onEmojiToggle={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                    showSendButton={!!inputText.trim()}
                />
            </View>
            <Modal 
                visible={!!selectedImage} 
                transparent={false} 
                animationType="fade" 
                onRequestClose={() => setSelectedImage(null)}
            >
                {selectedImage && (
                    <ImageViewer 
                        uri={selectedImage} 
                        onClose={() => setSelectedImage(null)} 
                    />
                )}
            </Modal>
            <EmojiPicker 
                onEmojiSelected={handleEmojiSelected} 
                open={isEmojiPickerOpen} 
                onClose={() => setIsEmojiPickerOpen(false)} 
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContentContainer: {
        padding: 16,
        paddingBottom: 8,
    },
});

export default Chat;
