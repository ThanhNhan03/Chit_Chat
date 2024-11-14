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
import { sendNotification } from '../utils/notificationHelper';
import MessageTimestamp from '../components/MessageTimestamp';

const client = generateClient();

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
    isMe: boolean;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroupedMessages {
    timestamp?: string;
    messages: Message[];
}

const groupMessages = (msgs: Message[]): GroupedMessages[] => {
    const groups: GroupedMessages[] = [];
    let currentGroup: GroupedMessages | null = null;

    msgs.forEach((msg, index) => {
        const currentMsgTime = new Date(msg.timestamp).getTime();
        const prevMsgTime = index > 0 ? new Date(msgs[index - 1].timestamp).getTime() : 0;
        
        const shouldShowTimestamp = index === 0 || 
            Math.abs(currentMsgTime - prevMsgTime) > 900000; 

        if (shouldShowTimestamp || !currentGroup || msg.isMe !== currentGroup.messages[0].isMe) {
            const date = new Date(msg.timestamp);
            const formattedTimestamp = date instanceof Date && !isNaN(date.getTime()) 
                ? date.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
                : '';

            currentGroup = {
                timestamp: shouldShowTimestamp ? formattedTimestamp : undefined,
                messages: []
            };
            groups.push(currentGroup);
        }
        
        currentGroup.messages.push(msg);
    });

    return groups;
};

const Chat: React.FC<any> = ({ route, navigation }) => {
    const { name, userId, chatId } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);
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

    const cacheMessages = async (messages: Message[]) => {
        try {
            await AsyncStorage.setItem(
                `private_chat_messages_${chatId}`,
                JSON.stringify({
                    messages,
                    timestamp: Date.now()
                })
            );
        } catch (error) {
            console.error('Error caching messages:', error);
        }
    };

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
            const cachedData = await AsyncStorage.getItem(`private_chat_messages_${chatId}`);
            if (cachedData) {
                const { messages: cachedMessages, timestamp } = JSON.parse(cachedData);
                setMessages(cachedMessages);
                setLastCacheUpdate(timestamp);
            }

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
                        timestamp: msg.timestamp,
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId
                    }));

                setMessages(fetchedMessages);
                await cacheMessages(fetchedMessages);
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

                setMessages(prev => {
                    const newMessages = [...olderMessages, ...prev];
                    cacheMessages(newMessages);
                    return newMessages;
                });
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
            next: async ({ data }) => {
                if (data?.onCreateMessages) {
                    const newMsg = data.onCreateMessages;
                    
                    if (newMsg.sender_id !== currentUserId) {
                        await sendNotification({
                            title: name,
                            body: newMsg.content || '📷 Sent an image',
                            data: {
                                type: 'message',
                                chatId,
                                userId: newMsg.sender_id,
                                name
                            }
                        });
                    }

                    const messageObj: Message = {
                        id: newMsg.id,
                        text: newMsg.content,
                        image: newMsg.attachments,
                        timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        type: newMsg.attachments ? 'image' : 'text',
                        isMe: newMsg.sender_id === currentUserId
                    };

                    setMessages(prev => {
                        const newMessages = [...prev, messageObj];
                        cacheMessages(newMessages);
                        return newMessages;
                    });
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

    const renderItem = ({ item: group }: { item: GroupedMessages }) => (
        <View style={styles.messageGroup}>
            {group.timestamp && (
                <MessageTimestamp timestamp={group.timestamp} />
            )}
            <View style={styles.messagesWrapper}>
                {group.messages.map((message, index) => (
                    <MessageItem 
                        key={message.id}
                        message={message}
                        onImagePress={setSelectedImage}
                        isFirstInGroup={index === 0}
                        isLastInGroup={index === group.messages.length - 1}
                    />
                ))}
            </View>
        </View>
    );

    const keyExtractor = (item: GroupedMessages, index: number) => `group-${index}`;

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
                    data={groupMessages(messages)}
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
    messageGroup: {
        marginBottom: 8,
    },
    messagesWrapper: {
        flexDirection: 'column',
    },
});

export default Chat;
