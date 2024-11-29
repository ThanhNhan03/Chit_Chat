import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { themeColors } from '../config/themeColor';
import { generateClient } from 'aws-amplify/api';
import { listUserFriendChats } from '../src/graphql/queries';
import { useTheme } from '../contexts/ThemeContext';

const client = generateClient();
const { width: screenWidth } = Dimensions.get('window');

interface Friend {
    id: string;
    name: string;
    profilePicture?: string;
    status?: string;
}

interface FriendBarProps {
    friends: Friend[];
    currentUserId: string;
    navigation: any;
}

const FriendBar: React.FC<FriendBarProps> = ({ friends, currentUserId, navigation }) => {
    const { theme } = useTheme();

    const handleFriendPress = async (friend: Friend) => {
        try {
            const existingChatsResponse = await client.graphql({
                query: listUserFriendChats,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId },
                    }
                }
            });

            const existingChats = existingChatsResponse.data.listUserFriendChats.items;
            let friendChatId = null;

            for (const chat of existingChats) {
                const otherUserChat = await client.graphql({
                    query: listUserFriendChats,
                    variables: {
                        filter: {
                            and: [
                                { friend_chat_id: { eq: chat.friend_chat_id } },
                                { user_id: { eq: friend.id } }
                            ]
                        }
                    }
                });

                if (otherUserChat.data.listUserFriendChats.items.length > 0) {
                    friendChatId = chat.friend_chat_id;
                    break;
                }
            }

            if (friendChatId) {
                navigation.navigate('Chat', { 
                    userId: friend.id, 
                    name: friend.name,
                    chatId: friendChatId
                });
            }
        } catch (error) {
            console.error('Error navigating to chat:', error);
        }
    };

    const renderFriend = ({ item }: { item: Friend }) => (
        <TouchableOpacity 
            onPress={() => handleFriendPress(item)} 
            style={styles.friendItem}
        >
            <Image
                source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/default-avatar.png')}
                style={styles.friendAvatar}
            />
            <Text 
                style={[
                    styles.friendName,
                    { color: theme.textColor }
                ]} 
                numberOfLines={1}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.backgroundColor }
        ]}>
            <FlatList
                data={friends}
                renderItem={renderFriend}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.friendList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: themeColors.surface,
    },
    friendList: {
        paddingHorizontal: 8,
    },
    friendItem: {
        alignItems: 'center',
        paddingHorizontal: screenWidth * 0.02,
    },
    friendAvatar: {
        width: screenWidth * 0.15,
        height: screenWidth * 0.15,
        borderRadius: screenWidth * 0.07,
        backgroundColor: themeColors.primary,
    },
    friendName: {
        marginTop: 5,
        fontSize: screenWidth * 0.035,
        color: themeColors.text,
        textAlign: 'center',
        width: screenWidth * 0.15,
    },
});

export default FriendBar;