import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, Alert, RefreshControl, Animated } from "react-native";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listUserFriendChats, getFriendChat, getUser, listUserGroupChats, getGroupChat, listMessages } from '../src/graphql/queries';
import { onUpdateFriendChat, onUpdateGroupChat } from '../src/graphql/subscriptions';
import ContactRow from "../components/ContactRow";
import Seperator from "../components/Seperator"; 
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constrants"; 
import { 
    ListUserFriendChatsQuery,
    ListUserGroupChatsQuery,
    GetGroupChatQuery,
    GetFriendChatQuery,
    GetUserQuery,
    ModelUserGroupChatConnection
} from '../src/API';

const client = generateClient();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface UserFriendChat {
    id: string;
    user_id: string;
    friend_chat_id: string;
}

interface UserGroupChat {
    id: string;
    user_id: string;
    group_chat_id: string;
}

interface FriendChatData {
    id: string;
    last_message?: string;
    updated_at: string;
}

interface GroupChatData {
    id: string;
    group_name: string;
    last_message?: string;
    updated_at: string;
    group_picture?: string;
    members?: ModelUserGroupChatConnection;
}

interface UserData {
    id: string;
    name: string;
    profile_picture?: string;
}

interface UserFriendChatsConnection {
    items: UserFriendChat[];
    nextToken?: string;
}

interface UserGroupChatsConnection {
    items: UserGroupChat[];
    nextToken?: string;
}

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    chatId: string;
    userId?: string;
    profilePicture?: string;
    type: 'private' | 'group';
    members?: number;
    isNew?: boolean;
}
interface ChatsProps {
    navigation: any; 
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_EXPIRY_TIME = 1000 * 60 * 60; 

const getChatsCacheKey = (userId: string) => `CACHED_CHATS_${userId}`;

const sortChatsByLatestMessage = (chats: Chat[]) => {
    return [...chats].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
    });
};

const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toUpperCase(); 
};

const Chats: React.FC<ChatsProps> = ({ navigation }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId) {
            loadCachedChats();
            fetchChats();
            const subscriptions = [
                subscribeToPrivateChatsUpdates(),
                subscribeToGroupChatsUpdates()
            ];
            return () => {
                subscriptions.forEach(sub => sub.unsubscribe());
            };
        }
    }, [currentUserId]);

    const loadCachedChats = async () => {
        try {
            if (!currentUserId) return;
            
            const cachedData = await AsyncStorage.getItem(getChatsCacheKey(currentUserId));
            if (cachedData) {
                const { chats: cachedChats, timestamp } = JSON.parse(cachedData);
                const isExpired = Date.now() - timestamp > CACHE_EXPIRY_TIME;
                
                if (!isExpired) {
                    setChats(cachedChats);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error loading cached chats:', error);
        }
    };

    const cacheChats = async (chatsToCache: Chat[]) => {
        try {
            if (!currentUserId) return;
            
            const cacheData = {
                chats: chatsToCache,
                timestamp: Date.now()
            };
            await AsyncStorage.setItem(getChatsCacheKey(currentUserId), JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error caching chats:', error);
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

    const fetchChats = async () => {
        try {
            const allChats: Chat[] = [];

            // Fetch friend chats
            const userChatsResponse = await client.graphql({
                query: listUserFriendChats,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId }
                    }
                }
            });

            const userFriendChats = (userChatsResponse.data.listUserFriendChats as UserFriendChatsConnection).items;

            // Process friend chats
            const friendChatsPromises = userFriendChats.map(async (userChat) => {
                const friendChatResponse = await client.graphql({
                    query: getFriendChat,
                    variables: { id: userChat.friend_chat_id }
                });
                const friendChat = friendChatResponse.data.getFriendChat as FriendChatData;
                
                if (!friendChat.last_message) {
                    return null;
                }

                const otherUserChat = await client.graphql({
                    query: listUserFriendChats,
                    variables: {
                        filter: {
                            and: [
                                { friend_chat_id: { eq: friendChat.id } },
                                { user_id: { ne: currentUserId } }
                            ]
                        }
                    }
                });

                const otherUserId = otherUserChat.data.listUserFriendChats.items[0]?.user_id;
                const otherUserResponse = await client.graphql({
                    query: getUser,
                    variables: { id: otherUserId }
                });
                const otherUser = otherUserResponse.data.getUser as UserData;

                return {
                    id: friendChat.id,
                    name: otherUser?.name || 'Unknown User',
                    lastMessage: friendChat.last_message || '',
                    timestamp: friendChat.updated_at,
                    chatId: friendChat.id,
                    userId: otherUserId,
                    profilePicture: otherUser?.profile_picture,
                    type: 'private' as const
                };
            });

            const friendChats = (await Promise.all(friendChatsPromises)).filter(Boolean);
            allChats.push(...friendChats);

            // Fetch group chats
            const userGroupChatsResponse = await client.graphql({
                query: listUserGroupChats,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId }
                    }
                }
            });

            const userGroupChats = (userGroupChatsResponse.data.listUserGroupChats as UserGroupChatsConnection).items;

            const groupChatPromises = userGroupChats.map(async (userGroupChat) => {
                const groupChatResponse = await client.graphql({
                    query: getGroupChat,
                    variables: { id: userGroupChat.group_chat_id }
                });
                
                const groupChat = groupChatResponse.data.getGroupChat as GetGroupChatQuery['getGroupChat'];

                if (!groupChat) return null;

                return {
                    id: groupChat.id,
                    name: groupChat.group_name || 'Unnamed Group',
                    lastMessage: groupChat.last_message || 'No messages yet',
                    timestamp: groupChat.updated_at || groupChat.updatedAt,
                    chatId: groupChat.id,
                    profilePicture: groupChat.group_picture,
                    type: 'group' as const,
                    members: groupChat.members?.__typename?.length || 0,
                    isNew: false
                };
            });

            const groupChats = (await Promise.all(groupChatPromises)).filter(chat => chat !== null);
            allChats.push(...groupChats);

            const sortedChats = sortChatsByLatestMessage(allChats);
            setChats(sortedChats);
            cacheChats(sortedChats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setLoading(false);
        }
    };

    const subscribeToPrivateChatsUpdates = () => {
        return client.graphql({
            query: onUpdateFriendChat
        }).subscribe({
            next: async ({ data }) => {
                if (data?.onUpdateFriendChat) {
                    const updatedChat = data.onUpdateFriendChat;
                    
                    try {
                        // Lấy tin nhắn cuối cùng để kiểm tra sender
                        const lastMessage = await client.graphql({
                            query: listMessages,
                            variables: {
                                filter: {
                                    and: [
                                        { chat_id: { eq: updatedChat.id } },
                                        { chat_type: { eq: "private" } }
                                    ]
                                }
                            }
                        });

                        // Lấy tin nhắn cuối cùng từ danh sách đã sắp xếp
                        const messages = lastMessage.data.listMessages.items;
                        const lastMessageItem = messages.sort((a, b) => 
                            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        )[0];

                        const lastMessageSenderId = lastMessageItem?.sender_id;

                        const otherUserChat = await client.graphql({
                            query: listUserFriendChats,
                            variables: {
                                filter: {
                                    and: [
                                        { friend_chat_id: { eq: updatedChat.id } },
                                        { user_id: { ne: currentUserId } }
                                    ]
                                }
                            }
                        });
                        
                        const otherUserId = otherUserChat.data.listUserFriendChats.items[0]?.user_id;
                        const otherUserResponse = await client.graphql({
                            query: getUser,
                            variables: { id: otherUserId }
                        });
                        const otherUser = otherUserResponse.data.getUser;

                        setChats(prevChats => {
                            const chatIndex = prevChats.findIndex(chat => chat.id === updatedChat.id);
                            const newChat = {
                                id: updatedChat.id,
                                name: otherUser?.name || 'Unknown User',
                                lastMessage: updatedChat.last_message || 'No messages yet',
                                timestamp: updatedChat.updated_at,
                                chatId: updatedChat.id,
                                userId: otherUserId,
                                profilePicture: otherUser?.profile_picture,
                                type: 'private' as const,
                                // Chỉ đánh dấu là tin nhắn mới nếu người gửi KHÔNG phải là người dùng hiện tại
                                isNew: lastMessageSenderId && lastMessageSenderId !== currentUserId
                            };

                            let updatedChats;
                            if (chatIndex === -1) {
                                updatedChats = [newChat, ...prevChats];
                            } else {
                                updatedChats = prevChats.filter(chat => chat.id !== updatedChat.id);
                                updatedChats.unshift(newChat);
                            }

                            const sortedChats = sortChatsByLatestMessage(updatedChats);
                            cacheChats(sortedChats);
                            return sortedChats;
                        });

                    } catch (error) {
                        console.error('Error updating private chat:', error);
                    }
                }
            },
            error: (error) => console.warn(error)
        });
    };

    const subscribeToGroupChatsUpdates = () => {
        return client.graphql({
            query: onUpdateGroupChat
        }).subscribe({
            next: async ({ data }) => {
                if (data?.onUpdateGroupChat) {
                    const updatedGroupChat = data.onUpdateGroupChat;
                    
                    try {
                        // Lấy số lượng thành viên
                        const membersResponse = await client.graphql({
                            query: listUserGroupChats,
                            variables: {
                                filter: {
                                    group_chat_id: { eq: updatedGroupChat.id }
                                }
                            }
                        });

                        const lastMessage = await client.graphql({
                            query: listMessages,
                            variables: {
                                filter: {
                                    and: [
                                        { chat_id: { eq: updatedGroupChat.id } },
                                        { chat_type: { eq: "group" } }
                                    ]
                                }
                            }
                        });

                        const messages = lastMessage.data.listMessages.items;
                        const lastMessageItem = messages.sort((a, b) => 
                            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        )[0];

                        const lastMessageSenderId = lastMessageItem?.sender_id;

                        setChats(prevChats => {
                            const chatIndex = prevChats.findIndex(chat => chat.id === updatedGroupChat.id);
                            const newChat = {
                                id: updatedGroupChat.id,
                                name: updatedGroupChat.group_name || 'Unnamed Group',
                                lastMessage: updatedGroupChat.last_message || 'No messages yet',
                                timestamp: updatedGroupChat.updated_at,
                                chatId: updatedGroupChat.id,
                                profilePicture: updatedGroupChat.group_picture,
                                type: 'group' as const,
                                members: membersResponse.data.listUserGroupChats.items.length,
                                isNew: lastMessageSenderId && lastMessageSenderId !== currentUserId
                            };

                            let updatedChats;
                            if (chatIndex === -1) {
                                updatedChats = [newChat, ...prevChats];
                            } else {
                                updatedChats = prevChats.filter(chat => chat.id !== updatedGroupChat.id);
                                updatedChats.unshift(newChat);
                            }

                            const sortedChats = sortChatsByLatestMessage(updatedChats);
                            cacheChats(sortedChats);
                            return sortedChats;
                        });

                    } catch (error) {
                        console.error('Error updating group chat:', error);
                    }
                }
            },
            error: (error) => console.warn(error)
        });
    };

    const handleChatPress = (chat: Chat) => {
        setChats(prevChats => 
            prevChats.map(c => 
                c.id === chat.id ? { ...c, isNew: false } : c
            )
        );

        if (chat.type === 'group') {
            navigation.navigate('GroupChat', {
                name: chat.name,
                chatId: chat.chatId,
                members: chat.members
            });
        } else {
            navigation.navigate('Chat', {
                name: chat.name,
                userId: chat.userId,
                chatId: chat.chatId
            });
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchChats();
        setRefreshing(false);
    };

    const renderItem = ({ item: chat }) => (
        <View>
            <ContactRow
                name={chat.name}
                subtitle={chat.lastMessage}
                subtitle2={formatMessageTime(chat.timestamp)}
                showForwardIcon={false}
                onPress={() => handleChatPress(chat)}
                onLongPress={() => {}}
                style={styles.contactRow}
                selected={false}
                isNew={chat.isNew}
            />
            <Seperator />
        </View>
    );

    const ListEmptyComponent = () => (
        <View style={styles.noChatsContainer}>
            <Ionicons name="chatbubble-outline" size={50} color={colors.teal} />
            <Text style={styles.noChatsText}>No messages yet</Text>
            <Text style={styles.noChatsSubText}>Start a conversation by tapping the chat button below</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <Seperator style={styles.separator} />
            
            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingContainer} color={colors.teal} />
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={styles.chatList}
                    ListEmptyComponent={ListEmptyComponent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Seperator />

            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('SelectUser')}
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: screenWidth * 0.06,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.015,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: screenWidth * 0.04,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatList: {
        flex: 1,
    },
    contactRow: {
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.015,
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: screenHeight * 0.015,
        backgroundColor: '#fff',
    },
    footerIcon: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: screenWidth * 0.03,
        color: colors.teal,
        marginTop: screenHeight * 0.005,
    },
    fab: {
        position: 'absolute',
        bottom: screenHeight * 0.05,
        right: screenWidth * 0.05,
        backgroundColor: colors.teal,
        width: screenWidth * 0.15,
        height: screenWidth * 0.15,
        borderRadius: screenWidth * 0.075,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: screenHeight * 0.2,
    },
    noChatsText: {
        fontSize: screenWidth * 0.045,
        color: '#333',
        marginTop: 20,
        fontWeight: '600',
    },
    noChatsSubText: {
        fontSize: screenWidth * 0.035,
        color: '#666',
        marginTop: 10,
    },
    newMessageRow: {
        backgroundColor: '#E7F3FF', 
    },
});

export default Chats;