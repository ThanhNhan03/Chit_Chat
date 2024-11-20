import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Modal, KeyboardAvoidingView, Platform, Alert, Dimensions, Text, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createMessages, updateFriendChat } from '../src/graphql/mutations';
import { listMessages, messagesByChat_idAndTimestamp, listUserFriendChats } from '../src/graphql/queries';
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
import { themeColors } from '../config/themeColor';


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
    isUploading?: boolean;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../config/constrants';
import { getUrl, uploadData } from 'aws-amplify/storage';

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

const CLOUDFRONT_URL = 'https://d1uil1dxdmhthh.cloudfront.net';

import { useTheme } from '../contexts/ThemeContext';

const Chat: React.FC<any> = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { name, userId, chatId } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
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
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId && chatId) {
            const loadMessages = async () => {
                await fetchMessages();
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: false });
                }, 100);
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

            // Kiểm tra quyền truy cập trước khi fetch messages
            const hasAccess = await client.graphql({
                query: listUserFriendChats,
                variables: {
                    filter: {
                        and: [
                            { friend_chat_id: { eq: chatId } },
                            { user_id: { eq: currentUserId } }
                        ]
                    }
                }
            });

            // Nếu không có quyền truy cập, return ngay
            if (!hasAccess.data.listUserFriendChats.items.length) {
                console.warn('Unauthorized access to chat');
                navigation.goBack();
                return;
            }

            // Nếu có quyền truy cập mới fetch messages
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
        } catch (error) {
            console.error('Error fetching messages:', error);
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

                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100);
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
        
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

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
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: true,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const timestamp = new Date().toISOString();
                const tempId = `temp-${Date.now()}`;

                // Tạo optimistic message với trạng thái isUploading
                const optimisticMessage: Message = {
                    id: tempId,
                    image: imageUri,
                    timestamp: timestamp,
                    type: 'image',
                    isMe: true,
                    isUploading: true
                };

                setMessages(prev => [...prev, optimisticMessage]);
                setUploadingImageId(tempId);
                scrollToBottom();

                try {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    const filename = `chat-images/${chatId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

                    await uploadData({
                        key: filename,
                        data: blob,
                        options: {
                            contentType: 'image/jpeg'
                        }
                    }).result;

                    const cloudFrontUrl = `${CLOUDFRONT_URL}/public/${filename}`;

                    const newMessage = {
                        chat_type: 'private',
                        chat_id: chatId,
                        sender_id: currentUserId,
                        content: '📷 Image',
                        timestamp: timestamp,
                        status: 'sent',
                        attachments: cloudFrontUrl
                    };

                    await Promise.all([
                        client.graphql({
                            query: createMessages,
                            variables: { input: newMessage }
                        }),
                        updateLastMessage('📷 Image')
                    ]);

                    // Cập nhật UI với CloudFront URL và remove trạng thái uploading
                    setMessages(prev => 
                        prev.map(msg => 
                            msg.id === tempId 
                                ? { ...msg, image: cloudFrontUrl, isUploading: false }
                                : msg
                        )
                    );

                } catch (error) {
                    console.error('Error uploading image:', error);
                    setMessages(prev => prev.filter(msg => msg.id !== tempId));
                    Alert.alert('Error', 'Failed to send image');
                } finally {
                    setUploadingImageId(null);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
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
            style={[styles.container, { backgroundColor: theme.backgroundColor }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <Header title={name} onBackPress={() => navigation.goBack()} />
            <View style={styles.chatContainer}>
                <FlatList
                    ref={scrollViewRef}
                    style={[styles.messagesContainer, { backgroundColor: theme.backgroundColor }]}
                    contentContainerStyle={[
                        styles.messagesContentContainer,
                        messages.length === 0 && [
                            styles.emptyContainer,
                            { backgroundColor: theme.backgroundColor }
                        ]
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
                    inverted={false}
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
        backgroundColor: themeColors.background,
    },
    chatContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: themeColors.background,
    },
    messagesContentContainer: {
        padding: 16,
        paddingBottom: 8,
        flexGrow: 1,
    },
    messageGroup: {
        marginBottom: 12,
    },
    messagesWrapper: {
        flexDirection: 'column',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themeColors.background,
    },
    emptyText: {
        color: themeColors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 32,
    },
});

export default Chat;
