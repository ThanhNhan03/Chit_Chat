import React, { useState, useRef, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    Modal, 
    KeyboardAvoidingView, 
    Platform, 
    Alert,
    TouchableOpacity,
    Text,
    Image,
    ActivityIndicator
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createMessages, updateGroupChat } from '../src/graphql/mutations';
import { messagesByChat_idAndTimestamp, getGroupChat, listUserGroupChats, getUser } from '../src/graphql/queries';
import { onCreateMessages } from '../src/graphql/subscriptions';
import Header from '../components/Header';
import MessageItem from '../components/MessageItem';
import InputBar from '../components/InputBar';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from 'rn-emoji-keyboard';
import ImageViewer from '../components/ImageViewer';
import { Ionicons } from '@expo/vector-icons';
import { sendNotification, sendGroupChatNotification } from '../utils/notificationHelper';
// import { ModelSortDirection } from '../src/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageTimestamp from '../components/MessageTimestamp';
import { ModelSortDirection } from '../src/API';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { colors } from '../config/constrants';

const client = generateClient();
const CACHE_EXPIRY_TIME = 1000 * 60 * 60;
const CLOUDFRONT_URL = 'https://d1uil1dxdmhthh.cloudfront.net';

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
    isMe: boolean;
    senderId: string;
    senderName?: string;
    isUploading?: boolean;
}

interface GroupMember {
    id: string;
    name: string;
    profile_picture?: string;
    push_token?: string;
}

interface GroupedMessages {
    timestamp?: string;
    senderName?: string;
    senderId: string;
    senderAvatar?: string;
    messages: Message[];
}

const getGroupChatCacheKey = (chatId: string, userId: string) => `group_chat_messages_${chatId}_${userId}`;

import { useTheme } from '../contexts/ThemeContext';

const GroupChat: React.FC<any> = ({ route, navigation }) => {
    const { name, chatId, shouldScrollToBottom } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    // const [showMembersList, setShowMembersList] = useState(false);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);
    const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const scrollViewRef = useRef<FlatList>(null);
    const scrollOffset = useRef(0);
    const contentHeight = useRef(0);
    const scrollViewHeight = useRef(0);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const isInitialLoad = useRef(true);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
    const { theme } = useTheme();
    const [memberPushTokens, setMemberPushTokens] = useState<string[]>([]);
    const [currentUserName, setCurrentUserName] = useState('');

    useEffect(() => {
        fetchCurrentUser();
        fetchGroupMembers();
    }, []);

    useEffect(() => {
        if (currentUserId && chatId && !isLoadingMembers) {
            const loadMessages = async () => {
                await fetchMessages();
                if (isFirstLoad) {
                    setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: false });
                        setIsFirstLoad(false);
                    }, 100);
                }
            };
            loadMessages();
            const subscription = subscribeToNewMessages();
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUserId, chatId, isLoadingMembers]);

    const fetchCurrentUser = async () => {
        try {
            const user = await getCurrentUser();
            setCurrentUserId(user.userId);
            
            const userData = await client.graphql({
                query: getUser,
                variables: { id: user.userId }
            });
            
            if (userData.data.getUser) {
                setCurrentUserName(userData.data.getUser.name);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchGroupMembers = async () => {
        try {
            setIsLoadingMembers(true);
            const groupMembersResponse = await client.graphql({
                query: listUserGroupChats,
                variables: {
                    filter: { group_chat_id: { eq: chatId } }
                }
            });

            const memberPromises = groupMembersResponse.data.listUserGroupChats.items.map(
                async (member) => {
                    const userResponse = await client.graphql({
                        query: getUser,
                        variables: { id: member.user_id }
                    });
                    return {
                        id: userResponse.data.getUser.id,
                        name: userResponse.data.getUser.name,
                        profile_picture: userResponse.data.getUser.profile_picture,
                        push_token: userResponse.data.getUser.push_token
                    };
                }
            );

            const members = await Promise.all(memberPromises);
            setGroupMembers(members);
            
            const tokens = members
                .filter(member => member.id !== currentUserId)
                .map(member => member.push_token)
                .filter(token => token);
            setMemberPushTokens(tokens);
            
            setIsLoadingMembers(false);
        } catch (error) {
            console.error('Error fetching group members:', error);
            setIsLoadingMembers(false);
        }
    };

    const clearGroupChatCache = async () => {
        try {
            if (currentUserId && chatId) {
                await AsyncStorage.removeItem(getGroupChatCacheKey(chatId, currentUserId));
            }
        } catch (error) {
            console.error('Error clearing group chat cache:', error);
        }
    };

    const cacheMessages = async (messages: Message[]) => {
        try {
            if (!currentUserId) return;
            
            await AsyncStorage.setItem(
                getGroupChatCacheKey(chatId, currentUserId),
                JSON.stringify({
                    messages,
                    timestamp: Date.now()
                })
            );
        } catch (error) {
            console.error('Error caching messages:', error);
        }
    };

    const scrollToBottomWithDelay = () => {
        setTimeout(() => {
            if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: false });
            }
        }, 100);
    };

    const fetchMessages = async () => {
        try {
            if (!currentUserId) return;

            const messagesResponse = await client.graphql({
                query: messagesByChat_idAndTimestamp,
                variables: {
                    chat_id: chatId,
                    sortDirection: ModelSortDirection.DESC,
                    limit: 20,
                    filter: {
                        chat_type: { eq: 'group' }
                    }
                }
            });

            // console.log('Fetched messages response:', messagesResponse.data.messagesByChat_idAndTimestamp.items);

            if (messagesResponse.data.messagesByChat_idAndTimestamp?.items) {
                const fetchedMessages = messagesResponse.data.messagesByChat_idAndTimestamp.items
                    .map(msg => ({
                        id: msg.id,
                        text: msg.content || undefined,
                        image: msg.attachments || undefined,
                        timestamp: msg.timestamp,
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId,
                        senderId: msg.sender_id,
                        senderName: groupMembers.find(member => member.id === msg.sender_id)?.name
                    }))
                    .reverse();

                // console.log('Processed messages:', fetchedMessages);
                setMessages(fetchedMessages);
                setNextToken(messagesResponse.data.messagesByChat_idAndTimestamp.nextToken);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const subscribeToNewMessages = () => {
        const subscription = client.graphql({
            query: onCreateMessages,
            variables: {
                filter: {
                    chat_id: { eq: chatId }
                }
            }
        }).subscribe({
            next: async({ data }) => {
                const newMessage = data.onCreateMessages;
                if (newMessage.sender_id !== currentUserId) {
                    const sender = groupMembers.find(member => member.id === newMessage.sender_id);
                    const messageToAdd: Message = {
                        id: newMessage.id,
                        text: newMessage.content || undefined,
                        image: newMessage.attachments || undefined,
                        timestamp: newMessage.timestamp,
                        type: newMessage.attachments ? 'image' : 'text',
                        isMe: false,
                        senderId: newMessage.sender_id,
                        senderName: sender?.name
                    };

                    setMessages(prev => [...prev, messageToAdd]);
                    
                    if (shouldAutoScroll) {
                        requestAnimationFrame(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                        });
                    }
                }
            },
            error: (error) => console.error('Subscription error:', error)
        });

        return subscription;
    };

    const updateLastMessage = async (content: string) => {
        try {
            await client.graphql({
                query: updateGroupChat,
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
            isMe: true,
            senderId: currentUserId!,
            senderName: groupMembers.find(member => member.id === currentUserId)?.name
        };

        setMessages(prev => [...prev, optimisticMessage]);
        
        requestAnimationFrame(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        });

        try {
            const newMessage = {
                chat_type: 'group',
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

            if (memberPushTokens.length > 0) {
                await sendGroupChatNotification({
                    expoPushTokens: memberPushTokens,
                    senderName: currentUserName,
                    message: messageText,
                    chatId: chatId,
                    senderId: currentUserId || '',
                    groupName: name
                });
            }
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

                const optimisticMessage: Message = {
                    id: tempId,
                    image: imageUri,
                    timestamp: timestamp,
                    type: 'image',
                    isMe: true,
                    senderId: currentUserId!,
                    senderName: groupMembers.find(member => member.id === currentUserId)?.name,
                    isUploading: true
                };

                setMessages(prev => [...prev, optimisticMessage]);
                setUploadingImageId(tempId);
                scrollToBottom();

                try {
                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    const filename = `group-images/${chatId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

                    await uploadData({
                        key: filename,
                        data: blob,
                        options: {
                            contentType: 'image/jpeg'
                        }
                    }).result;

                    const cloudFrontUrl = `${CLOUDFRONT_URL}/public/${filename}`;

                    const newMessage = {
                        chat_type: 'group',
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

                    setMessages(prev => 
                        prev.map(msg => 
                            msg.id === tempId 
                                ? { ...msg, image: cloudFrontUrl, isUploading: false }
                                : msg
                        )
                    );

                    if (memberPushTokens.length > 0) {
                        await sendGroupChatNotification({
                            expoPushTokens: memberPushTokens,
                            senderName: currentUserName,
                            message: '📷 Sent a photo',
                            chatId: chatId,
                            senderId: currentUserId || '',
                            groupName: name
                        });
                    }

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
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleEmojiSelected = (emoji: any) => {
        setInputText(prevText => prevText + emoji.emoji);
    };

    const groupMessages = (msgs: Message[]): GroupedMessages[] => {
        const groups: GroupedMessages[] = [];
        let currentGroup: GroupedMessages | null = null;

        msgs.forEach((msg, index) => {
            const sender = groupMembers.find(member => member.id === msg.senderId);
            const currentMsgTime = new Date(msg.timestamp).getTime();
            const prevMsg = index > 0 ? msgs[index - 1] : null;
            
            const needNewGroup = 
                !currentGroup || 
            
                currentGroup.senderId !== msg.senderId ||
         
                (prevMsg && (currentMsgTime - new Date(prevMsg.timestamp).getTime() > 900000));

            if (needNewGroup) {
                const date = new Date(msg.timestamp);
                const formattedTimestamp = date.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                
                currentGroup = {
                    timestamp: !prevMsg || 
                        (currentMsgTime - new Date(prevMsg.timestamp).getTime() > 900000) 
                        ? formattedTimestamp 
                        : undefined,
                    senderName: msg.senderName || sender?.name,
                    senderId: msg.senderId,
                    senderAvatar: sender?.profile_picture,
                    messages: []
                };
                groups.push(currentGroup);
            }
            
            currentGroup.messages.push(msg);
        });

        return groups;
    };

    const renderItem = ({ item: group }: { item: GroupedMessages }) => (
        <View style={styles.messageGroup}>
            {group.timestamp && (
                <MessageTimestamp timestamp={group.timestamp} />
            )}
            {!group.messages[0].isMe && (
                <View style={styles.senderInfo}>
                    {group.senderAvatar ? (
                        <Image source={{ uri: group.senderAvatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {group.senderName?.substring(0, 1).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.senderName}>{group.senderName}</Text>
                </View>
            )}
            <View style={[
                styles.messagesWrapper,
                !group.messages[0].isMe && styles.messagesWithAvatar,
                group.messages[0].isMe && styles.myMessagesWrapper
            ]}>
                {group.messages.map((message, index) => (
                    <MessageItem 
                        key={message.id}
                        message={message}
                        onImagePress={setSelectedImage}
                        isFirstInGroup={index === 0}
                        isLastInGroup={index === group.messages.length - 1}
                        showSender={false}
                    />
                ))}
            </View>
        </View>
    );

    const loadMoreMessages = async () => {
        if (loading || !messages.length) return;
        
        try {
            const oldestMessage = messages[0];
            const messagesResponse = await client.graphql({
                query: messagesByChat_idAndTimestamp,
                variables: {
                    chat_id: chatId,
                    sortDirection: ModelSortDirection.DESC,
                    limit: 20,
                    filter: {
                        and: [
                            { chat_type: { eq: 'group' } },
                            { timestamp: { lt: oldestMessage.timestamp } }
                        ]
                    }
                }
            });

            if (messagesResponse.data.messagesByChat_idAndTimestamp?.items) {
                const olderMessages = messagesResponse.data.messagesByChat_idAndTimestamp.items
                    .map(msg => ({
                        id: msg.id,
                        text: msg.content || undefined,
                        image: msg.attachments || undefined,
                        timestamp: msg.timestamp,
                        type: msg.attachments ? 'image' as const : 'text' as const,
                        isMe: msg.sender_id === currentUserId,
                        senderId: msg.sender_id,
                        senderName: groupMembers.find(member => member.id === msg.sender_id)?.name
                    }));

                setMessages(prev => [...olderMessages.reverse(), ...prev]);
            }
        } catch (error) {
            console.error('Error loading more messages:', error);
        }
    };

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
            <Header 
                title={name} 
                onBackPress={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('GroupChatSettings', {
                            chatId: chatId,
                            initialGroupName: name
                        })}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color={theme.textColor} />
                    </TouchableOpacity>
                }
            />
            <View style={[styles.chatContainer, { backgroundColor: theme.cardBackground }]}>
                <FlatList
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={[
                        styles.messagesContentContainer,
                        messages.length === 0 && styles.emptyContainer
                    ]}
                    data={groupMessages(messages)}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `group-${index}`}
                    onScroll={handleScroll}
                    onLayout={handleLayout}
                    onContentSizeChange={(w, h) => {
                        handleContentSizeChange(w, h);
                        if (isInitialLoad.current) {
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                            isInitialLoad.current = false;
                        }
                    }}
                    onEndReached={nextToken ? loadMoreMessages : undefined}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={20}
                    maxToRenderPerBatch={10}
                    windowSize={21}
                    removeClippedSubviews={false}
                    maintainVisibleContentPosition={{
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 10
                    }}
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
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    memberName: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    messageGroup: {
        marginBottom: 16,
        width: '100%',
    },
    senderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        marginLeft: 12,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    messagesWrapper: {
        flexDirection: 'column',
        width: '100%',
    },
    messagesWithAvatar: {
        marginLeft: 36,
        width: '80%',
    },
    myMessagesWrapper: {
        alignItems: 'flex-end',
        paddingRight: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    emptyText: {
        color: '#666',
        fontSize: 16
    },
});

export default GroupChat;
