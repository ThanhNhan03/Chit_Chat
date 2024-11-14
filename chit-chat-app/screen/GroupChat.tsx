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
    Image
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { createMessages, updateGroupChat } from '../src/graphql/mutations';
import { messagesByChat_id, getGroupChat, listUserGroupChats, getUser } from '../src/graphql/queries';
import { onCreateMessages } from '../src/graphql/subscriptions';
import Header from '../components/Header';
import MessageItem from '../components/MessageItem';
import InputBar from '../components/InputBar';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from 'rn-emoji-keyboard';
import ImageViewer from '../components/ImageViewer';
import { Ionicons } from '@expo/vector-icons';
import { sendNotification } from '../utils/notificationHelper';
// import { ModelSortDirection } from '../src/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageTimestamp from '../components/MessageTimestamp';

const client = generateClient();

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
    isMe: boolean;
    senderName?: string;
    senderId: string;
}

interface GroupMember {
    id: string;
    name: string;
    profile_picture?: string;
}

interface GroupedMessages {
    timestamp?: string;
    senderName?: string;
    senderId: string;
    senderAvatar?: string;
    messages: Message[];
}





const GroupChat: React.FC<any> = ({ route, navigation }) => {
    const { name, chatId, shouldScrollToBottom } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    // const [showMembersList, setShowMembersList] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const [lastCacheUpdate, setLastCacheUpdate] = useState<number>(0);

    useEffect(() => {
        fetchCurrentUser();
        fetchGroupMembers();
    }, []);

    useEffect(() => {
        if (currentUserId && chatId) {
            const loadMessages = async () => {
                await fetchMessages();
                if (shouldScrollToBottom) {
                    scrollToBottomWithDelay();
                }
            };
            loadMessages();
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

    const fetchGroupMembers = async () => {
        try {
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
                        profile_picture: userResponse.data.getUser.profile_picture
                    };
                }
            );

            const members = await Promise.all(memberPromises);
            setGroupMembers(members);
        } catch (error) {
            console.error('Error fetching group members:', error);
        }
    };

    const cacheMessages = async (messages: Message[]) => {
        try {
            await AsyncStorage.setItem(
                `chat_messages_${chatId}`,
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
            const cachedData = await AsyncStorage.getItem(`chat_messages_${chatId}`);
            if (cachedData) {
                const { messages: cachedMessages, timestamp } = JSON.parse(cachedData);
                setMessages(cachedMessages);
                setLastCacheUpdate(timestamp);
            }

            const messagesResponse = await client.graphql({
                query: messagesByChat_id,
                variables: {
                    chat_id: chatId,
                    filter: {
                        chat_type: { eq: 'group' }
                    }
                }
            });

            if (messagesResponse.data.messagesByChat_id?.items) {
                const sortedMessages = messagesResponse.data.messagesByChat_id.items
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                const fetchedMessages = await Promise.all(
                    sortedMessages.map(async (msg) => {
                        const senderResponse = await client.graphql({
                            query: getUser,
                            variables: { id: msg.sender_id }
                        });
                        const senderName = senderResponse.data.getUser.name;

                        return {
                            id: msg.id,
                            text: msg.content || undefined,
                            image: msg.attachments || undefined,
                            timestamp: msg.timestamp,
                            type: msg.attachments ? 'image' as const : 'text' as const,
                            isMe: msg.sender_id === currentUserId,
                            senderName: msg.sender_id === currentUserId ? undefined : senderName,
                            senderId: msg.sender_id
                        };
                    })
                );

                const newMessages = fetchedMessages.reverse();
                setMessages(newMessages);
                await cacheMessages(newMessages);
                scrollToBottomWithDelay();
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            Alert.alert('Error', 'Failed to load messages');
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
                    
                    if (newMsg.sender_id === currentUserId) {
                        return;
                    }

                    const senderResponse = await client.graphql({
                        query: getUser,
                        variables: { id: newMsg.sender_id }
                    });
                    const senderName = senderResponse.data.getUser.name;

                    const messageObj: Message = {
                        id: newMsg.id,
                        text: newMsg.content,
                        image: newMsg.attachments,
                        timestamp: newMsg.timestamp,
                        type: newMsg.attachments ? 'image' : 'text',
                        isMe: false,
                        senderName,
                        senderId: newMsg.sender_id
                    };

                    setMessages(prev => {
                        const newMessages = [...prev, messageObj];
                        cacheMessages(newMessages);
                        return newMessages;
                    });
                    scrollToBottom();

                    await sendNotification({
                        title: `${name} (${senderName})`,
                        body: newMsg.content || '📷 Sent an image',
                        data: {
                            type: 'group_message',
                            chatId,
                            groupName: name
                        }
                    });
                }
            },
            error: (error) => console.warn(error)
        });
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
        if (inputText.trim()) {
            const messageText = inputText.trim();
            setInputText('');

            const timestamp = new Date().toISOString();
            const optimisticMessage: Message = {
                id: `temp-${Date.now()}`,
                text: messageText,
                timestamp: timestamp,
                type: 'text',
                isMe: true,
                senderId: currentUserId!
            };

            setMessages(prev => [...prev, optimisticMessage]);
            scrollToBottom();

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
            } catch (error) {
                console.error('Error sending message:', error);
                setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
                Alert.alert('Error', 'Failed to send message');
                setInputText(messageText);
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
                const imageUrl = result.assets[0].uri;
                
                const newMessage = {
                    chat_type: 'group',
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

    const groupMessages = (msgs: Message[]): GroupedMessages[] => {
        const groups: GroupedMessages[] = [];
        let currentGroup: GroupedMessages | null = null;

        msgs.forEach((msg, index) => {
            const sender = groupMembers.find(member => member.id === msg.senderId);
            
            const currentMsgTime = new Date(msg.timestamp).getTime();
            const prevMsgTime = index > 0 ? new Date(msgs[index - 1].timestamp).getTime() : 0;
            
            const shouldShowTimestamp = index === 0 || 
                Math.abs(currentMsgTime - prevMsgTime) > 900000; // 15 phút

            if (shouldShowTimestamp || 
                !currentGroup || 
                msg.isMe !== (currentGroup.senderId === currentUserId)) {
                
                const date = new Date(msg.timestamp);
                const formattedTimestamp = date.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                
                currentGroup = {
                    timestamp: shouldShowTimestamp ? formattedTimestamp : undefined,
                    senderName: msg.senderName,
                    senderId: msg.isMe ? currentUserId! : msg.senderId,
                    senderAvatar: sender?.profile_picture || undefined,
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
                        <Image 
                            source={{ uri: group.senderAvatar }} 
                            style={styles.avatar} 
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {group.senderName?.[0]?.toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Text style={styles.senderName}>{group.senderName}</Text>
                </View>
            )}
            <View style={[
                styles.messagesWrapper,
                !group.messages[0].isMe && styles.messagesWithAvatar
            ]}>
                {group.messages.map((message, index) => (
                    <MessageItem 
                        key={message.id}
                        message={message}
                        onImagePress={setSelectedImage}
                        showSender={false}
                        isFirstInGroup={index === 0}
                        isLastInGroup={index === group.messages.length - 1}
                    />
                ))}
            </View>
        </View>
    );

   

    return (
        <KeyboardAvoidingView 
            style={styles.container}
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
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </TouchableOpacity>
                }
            />
            <View style={styles.chatContainer}>
                <FlatList
                    ref={flatListRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={[
                        styles.messagesContentContainer,
                        { flexGrow: 1, justifyContent: 'flex-end' }
                    ]}
                    data={groupMessages(messages)}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `group-${index}`}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottomWithDelay}
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
    },
    messagesWithAvatar: {
        marginLeft: 36,
    },
});

export default GroupChat;
