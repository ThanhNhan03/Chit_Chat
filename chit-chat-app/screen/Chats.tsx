import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, Alert, RefreshControl, Animated, Image } from "react-native";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listUserFriendChats, getFriendChat, getUser, listUserGroupChats, getGroupChat, listMessages, listContacts } from '../src/graphql/queries';
import { onUpdateFriendChat, onUpdateGroupChat } from '../src/graphql/subscriptions';
import ContactRow from "../components/ContactRow";
import SearchBar from "../components/SearchBar";
// import Seperator from "../components/Seperator";
import { Ionicons } from '@expo/vector-icons';
// import FriendBar from '../components/FriendBar';
import { colors } from "../config/constrants";
import {
    ListUserFriendChatsQuery,
    ListUserGroupChatsQuery,
    GetGroupChatQuery,
    GetFriendChatQuery,
    GetUserQuery,
    ModelUserGroupChatConnection
} from '../src/API';
import { themeColors } from '../config/themeColor';

const client = generateClient();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alice', profilePicture: null },
    { id: '2', name: 'Bob', profilePicture: null },
    // Add more mock friends here...
]);
interface Friend {
    id: string;
    name: string;
    profilePicture?: string;
}
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

const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        // Today: show time
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        // Yesterday
        return 'Yesterday';
    } else if (diffDays < 7) {
        // Within a week: show day name
        return date.toLocaleDateString([], { weekday: 'short' });
    } else {
        // Older: show date
        return date.toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric'
        });
    }
};



import MainHeader from '../components/MainHeader';

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
            // console.error('Error loading cached chats:', error);
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
            // console.error('Error caching chats:', error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const user = await getCurrentUser();
            setCurrentUserId(user.userId);
        } catch (error) {
            // console.error('Error fetching current user:', error);
        }
    };

    const fetchChats = async () => {
        try {
            const allChats: Chat[] = [];

          
            const contactsResponse = await client.graphql({
                query: listContacts,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId }
                    }
                }
            });
            
            const friendIds = contactsResponse.data.listContacts.items.map(
                contact => contact.contact_user_id
            );

            // Fetch friend chats
            const userChatsResponse = await client.graphql({
                query: listUserFriendChats,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId }
                    }
                }
            });

            const userFriendChats = userChatsResponse.data.listUserFriendChats.items;

            // Process friend chats - thêm kiểm tra friendIds
            const friendChatsPromises = userFriendChats.map(async (userChat) => {
                const friendChatResponse = await client.graphql({
                    query: getFriendChat,
                    variables: { id: userChat.friend_chat_id }
                });
                const friendChat = friendChatResponse.data.getFriendChat;

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
                
                // Kiểm tra xem otherUserId có trong danh sách bạn bè không
                if (!friendIds.includes(otherUserId)) {
                    return null;
                }

                const otherUserResponse = await client.graphql({
                    query: getUser,
                    variables: { id: otherUserId }
                });
                const otherUser = otherUserResponse.data.getUser;

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

                const groupChat = groupChatResponse.data.getGroupChat;

                if (!groupChat) return null;

                // Lấy số lượng thành viên
                const membersResponse = await client.graphql({
                    query: listUserGroupChats,
                    variables: {
                        filter: {
                            group_chat_id: { eq: groupChat.id }
                        }
                    }
                });

                const memberCount = membersResponse.data.listUserGroupChats.items.length;

                return {
                    id: groupChat.id,
                    name: groupChat.group_name || 'Unnamed Group',
                    lastMessage: groupChat.last_message || 'No messages yet',
                    timestamp: groupChat.updated_at || groupChat.updatedAt,
                    chatId: groupChat.id,
                    profilePicture: groupChat.group_picture,
                    type: 'group' as const,
                    members: memberCount,
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
            // Removed console.error
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
                        // Kiểm tra quyền truy cập
                        const hasAccess = await client.graphql({
                            query: listUserFriendChats,
                            variables: {
                                filter: {
                                    and: [
                                        { friend_chat_id: { eq: updatedChat.id } },
                                        { user_id: { eq: currentUserId } }
                                    ]
                                }
                            }
                        });

                        if (!hasAccess.data.listUserFriendChats.items.length) {
                            return;
                        }

                        // Lấy thông tin tin nhắn cuối cùng
                        const lastMessage = await client.graphql({
                            query: listMessages,
                            variables: {
                                filter: {
                                    and: [
                                        { chat_id: { eq: updatedChat.id } },
                                        { chat_type: { eq: "private" } }
                                    ]
                                },
                                limit: 1
                            }
                        });

                        const messages = lastMessage.data.listMessages.items;
                        const lastMessageItem = messages.sort((a, b) =>
                            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        )[0];
                        const lastMessageSenderId = lastMessageItem?.sender_id;

                        // Lấy thông tin người dùng khác trong chat
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
                            const newChat = {
                                id: updatedChat.id,
                                name: otherUser?.name || 'Unknown User',
                                lastMessage: updatedChat.last_message || 'No messages yet',
                                timestamp: updatedChat.updated_at || new Date().toISOString(),
                                chatId: updatedChat.id,
                                userId: otherUserId,
                                profilePicture: otherUser?.profile_picture,
                                type: 'private' as const,
                                isNew: lastMessageSenderId !== currentUserId
                            };

                            const updatedChats = prevChats.filter(chat => chat.id !== updatedChat.id);
                            updatedChats.unshift(newChat);
                            
                            const sortedChats = sortChatsByLatestMessage(updatedChats);
                            cacheChats(sortedChats);
                            return sortedChats;
                        });

                    } catch (error) {
                        console.warn('Error updating private chat:', error);
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
                        // Kiểm tra quyền truy cập
                        const hasAccess = await client.graphql({
                            query: listUserGroupChats,
                            variables: {
                                filter: {
                                    and: [
                                        { group_chat_id: { eq: updatedGroupChat.id } },
                                        { user_id: { eq: currentUserId } }
                                    ]
                                }
                            }
                        });

                        if (!hasAccess.data.listUserGroupChats.items.length) {
                            return;
                        }

                        // Lấy số lượng thành viên hiện tại
                        const membersResponse = await client.graphql({
                            query: listUserGroupChats,
                            variables: {
                                filter: {
                                    group_chat_id: { eq: updatedGroupChat.id }
                                }
                            }
                        });

                        const memberCount = membersResponse.data.listUserGroupChats.items.length;

                        const lastMessage = await client.graphql({
                            query: listMessages,
                            variables: {
                                filter: {
                                    and: [
                                        { chat_id: { eq: updatedGroupChat.id } },
                                        { chat_type: { eq: "group" } }
                                    ]
                                },
                                limit: 1
                            }
                        });

                        const messages = lastMessage.data.listMessages.items;
                        const lastMessageItem = messages.sort((a, b) =>
                            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        )[0];
                        const lastMessageSenderId = lastMessageItem?.sender_id;

                        setChats(prevChats => {
                            const newChat = {
                                id: updatedGroupChat.id,
                                name: updatedGroupChat.group_name || 'Unnamed Group',
                                lastMessage: updatedGroupChat.last_message || 'No messages yet',
                                timestamp: updatedGroupChat.updated_at || new Date().toISOString(),
                                chatId: updatedGroupChat.id,
                                profilePicture: updatedGroupChat.group_picture,
                                type: 'group' as const,
                                members: memberCount,
                                isNew: lastMessageSenderId !== currentUserId
                            };

                            const updatedChats = prevChats.filter(chat => chat.id !== updatedGroupChat.id);
                            updatedChats.unshift(newChat);
                            
                            const sortedChats = sortChatsByLatestMessage(updatedChats);
                            cacheChats(sortedChats);
                            return sortedChats;
                        });

                    } catch (error) {
                        console.warn('Error updating group chat:', error);
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

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item)}
            >
                <View style={styles.chatContent}>
                    {/* Avatar section */}
                    <View style={styles.avatarContainer}>
                        {item.profilePicture ? (
                            <Image
                                source={{ uri: item.profilePicture }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {item.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        {item.type === 'group' && (
                            <View style={styles.memberCount}>
                                <Text style={styles.memberCountText}>{item.members}</Text>
                            </View>
                        )}
                    </View>

                    {/* Chat details section */}
                    <View style={styles.chatDetails}>
                        <View style={styles.chatHeader}>
                            <Text 
                                style={[
                                    styles.chatName, 
                                    item.isNew && styles.newMessageText
                                ]} 
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>
                            <Text style={[
                                styles.timestamp,
                                item.isNew && styles.newMessageTimestamp
                            ]}>
                                {formatTimestamp(item.timestamp)}
                            </Text>
                        </View>
                        <View style={styles.lastMessageContainer}>
                            <Text 
                                style={[
                                    styles.lastMessage, 
                                    item.isNew && styles.newMessageText
                                ]} 
                                numberOfLines={1}
                            >
                                {item.lastMessage}
                            </Text>
                            {item.isNew && (
                                <View style={styles.unreadIndicator}>
                                    <Text style={styles.unreadIndicatorText}>New</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const ListEmptyComponent = () => (
        <View style={styles.noChatsContainer}>
            <Ionicons name="chatbubble-outline" size={50} color={themeColors.primary} />
            <Text style={styles.noChatsText}>No messages yet</Text>
            <Text style={styles.noChatsSubText}>
                Start a conversation by tapping the chat button below
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <MainHeader title="Chats" />
       <SearchBar
   placeholder="Search chats"
    value={null}
        onChangeText={null}/>
      {/* <FriendBar
    friends={friends}
    onFriendPress={(friend) => console.log('Friend pressed:', friend)}
/> */}
            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingContainer} color={themeColors.primary} />
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

            {/* <Seperator /> */}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('SelectUser')}
            >
                <Ionicons name="chatbubble-ellipses" size={24} color={themeColors.surface} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
        // paddingTop: screenHeight * 0.02,
    },
    // header: {
    //     fontSize: screenWidth * 0.06,
    //     fontWeight: '600',
    //     color: themeColors.text,
    //     paddingHorizontal: screenWidth * 0.04,
    //     paddingVertical: screenHeight * 0.02,
    //     backgroundColor: themeColors.surface,
    //     marginTop: screenHeight * 0.02,
    // },
    separator: {
        height: 1,
        backgroundColor: themeColors.border,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatList: {
        flex: 1,
    },
    chatItem: {
        padding: 16,
        backgroundColor: themeColors.surface,
        // borderBottomWidth: 1,
        // borderBottomColor: '#eee',
    },
    chatContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 15,
    },
    avatar: {
        width: screenWidth * 0.12,
        height: screenWidth * 0.12,
        borderRadius: screenWidth * 0.06,
        backgroundColor: themeColors.primary,
    },
    avatarPlaceholder: {
        width: screenWidth * 0.12,
        height: screenWidth * 0.12,
        borderRadius: screenWidth * 0.06,
        backgroundColor: themeColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: screenWidth * 0.05,
        fontWeight: 'bold',
    },
    memberCount: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: themeColors.secondary,
        borderRadius: 12,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: themeColors.surface,
        paddingHorizontal: 4,
    },
    memberCountText: {
        color: themeColors.surface,
        fontSize: 11,
        fontWeight: '600',
    },
    chatDetails: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatName: {
        fontSize: screenWidth * 0.042,
        fontWeight: '600',
        color: themeColors.text,
        flex: 1,
        marginRight: 10,
    },
    timestamp: {
        fontSize: screenWidth * 0.035,
        color: themeColors.textSecondary,
    },
    lastMessage: {
        fontSize: screenWidth * 0.038,
        color: themeColors.textSecondary,
        marginTop: 4,
        flex: 1,
    },
    newMessageText: {
        fontWeight: '600',
        color: themeColors.secondary,
    },
    newMessageTimestamp: {
        color: themeColors.secondary,
        fontWeight: '600',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unreadIndicator: {
        backgroundColor: themeColors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginLeft: 8,
    },
    unreadIndicatorText: {
        color: themeColors.surface,
        fontSize: 12,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: screenHeight * 0.05,
        right: screenWidth * 0.05,
        backgroundColor: themeColors.secondary,
        width: screenWidth * 0.14,
        height: screenWidth * 0.14,
        borderRadius: screenWidth * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: themeColors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    noChatsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: screenHeight * 0.2,
    },
    noChatsText: {
        fontSize: screenWidth * 0.045,
        color: themeColors.text,
        marginTop: 20,
        fontWeight: '600',
    },
    noChatsSubText: {
        fontSize: screenWidth * 0.035,
        color: themeColors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
   

});

export default Chats;