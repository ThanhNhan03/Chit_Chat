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
    Text
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
import { ModelSortDirection } from '../src/API';

const client = generateClient();

interface Message {
    id: string;
    text?: string;
    image?: string;
    timestamp: string;
    type: 'text' | 'image';
    isMe: boolean;
    senderName?: string;
}

interface GroupMember {
    id: string;
    name: string;
    profile_picture?: string;
}

const GroupChat: React.FC<any> = ({ route, navigation }) => {
    const { name, chatId } = route.params;
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [showMembersList, setShowMembersList] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchCurrentUser();
        fetchGroupMembers();
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

    const fetchMessages = async () => {
        try {
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
                        // Get sender name
                        const senderResponse = await client.graphql({
                            query: getUser,
                            variables: { id: msg.sender_id }
                        });
                        const senderName = senderResponse.data.getUser.name;

                        return {
                            id: msg.id,
                            text: msg.content || undefined,
                            image: msg.attachments || undefined,
                            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            }),
                            type: msg.attachments ? 'image' as const : 'text' as const,
                            isMe: msg.sender_id === currentUserId,
                            senderName: msg.sender_id === currentUserId ? undefined : senderName
                        };
                    })
                );

                setMessages(fetchedMessages.reverse());
                scrollToBottom();
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
                    
                    // Get sender name for new message
                    const senderResponse = await client.graphql({
                        query: getUser,
                        variables: { id: newMsg.sender_id }
                    });
                    const senderName = senderResponse.data.getUser.name;

                    const messageObj: Message = {
                        id: newMsg.id,
                        text: newMsg.content,
                        image: newMsg.attachments,
                        timestamp: new Date(newMsg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        type: newMsg.attachments ? 'image' : 'text',
                        isMe: newMsg.sender_id === currentUserId,
                        senderName: newMsg.sender_id === currentUserId ? undefined : senderName
                    };
                    setMessages(prev => [...prev, messageObj]);
                    scrollToBottom();

                    // Send notifications to other group members
                    if (newMsg.sender_id !== currentUserId) {
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
            try {
                const newMessage = {
                    chat_type: 'group',
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

    const renderItem = ({ item: message }) => (
        <MessageItem 
            message={message} 
            onImagePress={setSelectedImage}
            showSender={true}
        />
    );

    const renderMembersList = () => (
        <Modal
            visible={showMembersList}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowMembersList(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Group Members ({groupMembers.length})</Text>
                    <FlatList
                        data={groupMembers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.memberItem}>
                                <View style={styles.memberAvatar}>
                                    <Text>{item.name.charAt(0)}</Text>
                                </View>
                                <Text style={styles.memberName}>{item.name}</Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setShowMembersList(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
                    <TouchableOpacity onPress={() => setShowMembersList(true)}>
                        <Ionicons name="people" size={24} color="#000" />
                    </TouchableOpacity>
                }
            />
            <View style={styles.chatContainer}>
                <FlatList
                    ref={flatListRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContentContainer}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onContentSizeChange={scrollToBottom}
                    onLayout={scrollToBottom}
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
            {renderMembersList()}
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
});

export default GroupChat;
