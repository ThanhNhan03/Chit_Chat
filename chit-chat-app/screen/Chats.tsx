import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, Alert, RefreshControl } from "react-native";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listUserFriendChats, getFriendChat, getUser, listUserGroupChats, getGroupChat } from '../src/graphql/queries';
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
}
interface ChatsProps {
    navigation: any; 
}

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
            fetchChats();
            const subscription = subscribeToChatsUpdates();
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [currentUserId]);

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

            const chatPromises = userFriendChats.map(async (userChat) => {
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

                const otherUserId = (otherUserChat.data.listUserFriendChats as UserFriendChatsConnection).items[0]?.user_id;

                const otherUserResponse = await client.graphql({
                    query: getUser,
                    variables: { id: otherUserId }
                });
                const otherUser = otherUserResponse.data.getUser as UserData;

                return {
                    id: friendChat.id,
                    name: otherUser?.name || 'Unknown User',
                    lastMessage: friendChat.last_message,
                    timestamp: new Date(friendChat.updated_at).toLocaleDateString(),
                    chatId: friendChat.id,
                    userId: otherUserId,
                    profilePicture: otherUser?.profile_picture,
                    type: 'private' as const
                };
            });

            const resolvedChats = (await Promise.all(chatPromises))
                .filter(chat => chat !== null)
                .sort((a, b) => 
                    new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime()
                );

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
                    timestamp: new Date(groupChat.updated_at || groupChat.updatedAt).toLocaleDateString(),
                    chatId: groupChat.id,
                    profilePicture: groupChat.group_picture,
                    type: 'group' as const,
                    members: groupChat.members?.__typename?.length || 0
                };
            });

            const groupChats = (await Promise.all(groupChatPromises)).filter(chat => chat !== null);

            // Combine and sort all chats
            const allChats = [...resolvedChats, ...groupChats].sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            setChats(allChats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            Alert.alert('Error', 'Failed to load chats');
            setLoading(false);
        }
    };

    const subscribeToChatsUpdates = () => {
        return client.graphql({
            query: onUpdateFriendChat
        }).subscribe({
            next: async ({ data }) => {
                if (data?.onUpdateFriendChat) {
                    const updatedChat = data.onUpdateFriendChat;
                    
                    // Fetch other user's details
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
                        if (chatIndex === -1) return prevChats;

                        const updatedChats = [...prevChats];
                        updatedChats[chatIndex] = {
                            ...updatedChats[chatIndex],
                            lastMessage: updatedChat.last_message || 'No messages yet',
                            timestamp: new Date(updatedChat.updated_at).toLocaleDateString()
                        };

                        return updatedChats.sort((a, b) => 
                            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                        );
                    });
                }
            },
            error: (error) => console.warn(error)
        });
    };

    const handleChatPress = (chat: Chat) => {
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

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <Seperator style={styles.separator} />
            
            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingContainer} color={colors.teal} />
            ) : (
                <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    style={styles.chatList}
                >
                    {chats.length === 0 ? (
                        <View style={styles.noChatsContainer}>
                            <Ionicons name="chatbubble-outline" size={50} color={colors.teal} />
                            <Text style={styles.noChatsText}>No messages yet</Text>
                            <Text style={styles.noChatsSubText}>Start a conversation by tapping the chat button below</Text>
                        </View>
                    ) : (
                        chats.map(chat => (
                            <View key={chat.id}>
                                <ContactRow
                                    name={chat.name}
                                    subtitle={chat.lastMessage}
                                    subtitle2={chat.timestamp}
                                    showForwardIcon={false}
                                    onPress={() => handleChatPress(chat)}
                                    onLongPress={() => {}}
                                    style={styles.contactRow}
                                    selected={false}
                                />
                                <Seperator />
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            <Seperator />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerIcon}>
                    <Ionicons name="chatbubble" size={24} color={colors.teal} />
                    <Text style={styles.footerText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerIcon}
                    onPress={() => navigation.navigate('SettingTemp')}
                >
                    <Ionicons name="settings" size={24} color={colors.teal} />
                    <Text style={styles.footerText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Floating Action Button */}
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
        bottom: screenHeight * 0.1,
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
});

export default Chats;