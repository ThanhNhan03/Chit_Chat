import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Modal, KeyboardAvoidingView, Platform, Alert, Dimensions, Text, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createMessages, updateFriendChat } from '../src/graphql/mutations';
import { listMessages, messagesByChat_idAndTimestamp } from '../src/graphql/queries';
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
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CACHE_EXPIRY_TIME = 1000 * 60 * 60;

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

const getChatCacheKey = (chatId: string, userId: string) => `private_chat_messages_${chatId}_${userId}`;

const Chat: React.FC<any> = ({ route, navigation }) => {
    const { name, userId, chatId } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);
    const scrollViewRef = useRef<FlatList>(null);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const scrollOffset = useRef(0);
    const contentHeight = useRef(0);
    const scrollViewHeight = useRef(0);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId && chatId) {
            const loadMessages = async () => {
                await fetchMessages();
                if (isInitialLoad.current) {
                    requestAnimationFrame(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: false });
                        isInitialLoad.current = false;
                    });
                }
            };
            loadMessages();
            const subscription = subscribeToNewMessages();
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUserId, chatId]);

    const cacheMessages = async (messages: Message[]) => {
        try {
            if (!currentUserId) return;
            
            await AsyncStorage.setItem(
                getChatCacheKey(chatId, currentUserId),
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
            if (!currentUserId) return;
            setLoading(true);

            const messagesResponse = await client.graphql({
                query: messagesByChat_idAndTimestamp,
                variables: {
                    chat_id: chatId,
                    sortDirection: ModelSortDirection.DESC,
                    filter: {
                        chat_type: { eq: 'private' }
                    }
                }
            });

            if (messagesResponse.data.messagesByChat_idAndTimestamp?.items) {
                const fetchedMessages = messagesResponse.data.messagesByChat_idAndTimestamp.items
                    .map(msg => ({
                        id: msg.id,
                        text: msg.content || undefined,
                        image: msg.attachments || undefined,
                        timestamp: msg.timestamp,
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId
                    }));

                const sortedMessages = [...fetchedMessages].reverse();
                setMessages(sortedMessages);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setLoading(false);
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
                    
                    if (newMsg.sender_id === currentUserId) return;

                    const messageObj: Message = {
                        id: newMsg.id,
                        text: newMsg.content,
                        image: newMsg.attachments,
                        timestamp: newMsg.timestamp,
                        type: newMsg.attachments ? 'image' : 'text',
                        isMe: false
                    };

                    setMessages(prev => [...prev, messageObj]);

                    if (shouldAutoScroll) {
                        setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }
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
        if (!inputText.trim()) return;
        
        const messageText = inputText.trim();
        setInputText('');

        const timestamp = new Date().toISOString();
        const tempId = `temp-${Date.now()}`;
        
        const optimisticMessage: Message = {
            id: tempId,
            text: messageText,
            timestamp: timestamp,
            type: 'text',
            isMe: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });

        try {
            const newMessage = {
                chat_type: 'private',
                chat_id: chatId,
                sender_id: currentUserId,
                content: messageText,
                timestamp: timestamp,
                status: 'sent'
            };

            await Promise.all([
                client.graphql({
                    query: createMessages,
                    variables: { input: newMessage }
                }),
                updateLastMessage(messageText)
            ]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            Alert.alert('Error', 'Failed to send message');
            setInputText(messageText);
        }
    };

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUrl = result.assets[0].uri;
            const timestamp = new Date().toISOString();

            const optimisticMessage: Message = {
                id: `temp-${Date.now()}`,
                image: imageUrl,
                timestamp: timestamp,
                type: 'image',
                isMe: true
            };

            setMessages(prev => [...prev, optimisticMessage]);
            scrollToBottom();

            try {
                const newMessage = {
                    chat_type: 'private',
                    chat_id: chatId,
                    sender_id: currentUserId,
                    content: '',
                    timestamp: timestamp,
                    status: 'sent',
                    attachments: imageUrl
                };

                await Promise.all([
                    client.graphql({
                        query: createMessages,
                        variables: { input: newMessage }
                    }),
                    updateLastMessage('📷 Image')
                ]);
            } catch (error) {
                console.error('Error sending image:', error);
                setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
                Alert.alert('Error', 'Failed to send image');
            }
        }
    };

    const scrollToBottom = () => {
        if (messages.length > 0) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
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

    const isCloseToBottom = () => {
        const threshold = 100; 
        const isClose = (scrollViewHeight.current + scrollOffset.current + threshold) >= contentHeight.current;
        return isClose;
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        scrollOffset.current = offsetY;
        
        setShouldAutoScroll(isCloseToBottom());
    };

    const handleLayout = (event: any) => {
        scrollViewHeight.current = event.nativeEvent.layout.height;
    };

    const handleContentSizeChange = (width: number, height: number) => {
        contentHeight.current = height;
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Header title={name} onBackPress={() => navigation.goBack()} />
            <View style={styles.chatContainer}>
                <FlatList
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={[
                        styles.messagesContentContainer,
                        messages.length === 0 && styles.emptyContainer
                    ]}
                    data={groupMessages(messages)}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onScroll={handleScroll}
                    onLayout={handleLayout}
                    onContentSizeChange={(w, h) => {
                        handleContentSizeChange(w, h);
                        if (isInitialLoad.current) {
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                            isInitialLoad.current = false;
                        }
                    }}
                    initialNumToRender={20}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    removeClippedSubviews={true}
                    maintainVisibleContentPosition={{
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 10
                    }}
                    ListFooterComponent={loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#999" />
                        </View>
                    ) : null}
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
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageGroup: {
        marginBottom: 8,
    },
    messagesWrapper: {
        flexDirection: 'column',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center'
    }
});

export default Chat;
