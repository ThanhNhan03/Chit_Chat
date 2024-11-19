import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Pressable, TouchableWithoutFeedback } from 'react-native';
import { themeColors } from '../config/themeColor';
import { createReactions, deleteReactions } from '../src/graphql/mutations';
import { reactionsByMessage_id, getUser } from '../src/graphql/queries';
import MessageReactions from './MessageReactions';
import { getCurrentUser } from '@aws-amplify/auth';
import { onCreateReactions, onDeleteReactions } from '../src/graphql/subscriptions';
import { generateClient } from 'aws-amplify/api';
import MessageReactionMenu from './MessageReactionMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = generateClient();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Reaction {
    id: string;
    icon?: string;
    user_id: string;
    userName?: string;
    message_id: string;
    created_at?: string;
    createdAt?: string;
    updatedAt?: string;
    __typename?: string;
}

interface CachedUser {
    id: string;
    name: string;
    timestamp: number;
}

interface MessageItemProps {
    message: {
        id: string;
        text?: string;
        image?: string;
        timestamp: string;
        type: 'text' | 'image';
        isMe: boolean;
        senderName?: string;
        isUploading?: boolean;
        reactions?: {
            id: string;
            icon: string;
            userId: string;
        }[];
    };
    onImagePress: (uri: string) => void;
    onReaction: (messageId: string, reaction: string) => void;
    showSender?: boolean;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return '';
};

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    onImagePress,
    onReaction,
    showSender,
    isFirstInGroup,
    isLastInGroup
}) => {
    const [reactions, setReactions] = useState<any[]>([]);
    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoadingReactions, setIsLoadingReactions] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        fetchReactions();
    }, [message.id]);

    useEffect(() => {
        const subscriptions = [
            client.graphql({ query: onCreateReactions })
                .subscribe({
                    next: ({ data }) => {
                        if (data.onCreateReactions.message_id === message.id) {
                            fetchReactions();
                        }
                    },
                    error: error => console.warn(error)
                }),

            client.graphql({ query: onDeleteReactions })
                .subscribe({
                    next: ({ data }) => {
                        if (data.onDeleteReactions.message_id === message.id) {
                            fetchReactions();
                        }
                    },
                    error: error => console.warn(error)
                })
        ];

        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, [message.id]);

    const getCachedUser = async (userId: string): Promise<CachedUser | null> => {
        try {
            const cached = await AsyncStorage.getItem(`user_${userId}`);
            if (cached) {
                const userData = JSON.parse(cached);
                if (Date.now() - userData.timestamp < 3600000) {
                    return userData;
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const setCachedUser = async (userData: CachedUser) => {
        try {
            await AsyncStorage.setItem(
                `user_${userData.id}`, 
                JSON.stringify({ ...userData, timestamp: Date.now() })
            );
        } catch (error) {
            console.error('Error caching user:', error);
        }
    };

    const fetchReactions = async () => {
        if (isLoadingReactions) return;
        
        setIsLoadingReactions(true);
        try {
            const response = await client.graphql({
                query: reactionsByMessage_id,
                variables: { message_id: message.id }
            });
            
            const userIds = [...new Set(
                response.data.reactionsByMessage_id.items.map((r: Reaction) => r.user_id)
            )];
            
            const userMap: { [key: string]: string } = {};
            
            await Promise.all(userIds.map(async (userId) => {
                const cachedUser = await getCachedUser(userId);
                if (cachedUser) {
                    userMap[userId] = cachedUser.name;
                    return;
                }
                
                try {
                    const userResponse = await client.graphql({
                        query: getUser,
                        variables: { id: userId }
                    });
                    
                    if (userResponse.data.getUser) {
                        userMap[userId] = userResponse.data.getUser.name;
                        await setCachedUser({
                            id: userId,
                            name: userResponse.data.getUser.name,
                            timestamp: Date.now()
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }));

            const reactionsWithUserInfo = response.data.reactionsByMessage_id.items.map(
                (reaction: Reaction) => ({
                    ...reaction,
                    userName: userMap[reaction.user_id] || reaction.user_id
                })
            );
            
            setReactions(reactionsWithUserInfo);
        } catch (error) {
            console.error('Error fetching reactions:', error);
        } finally {
            setIsLoadingReactions(false);
        }
    };

    const handleReaction = async (icon: string) => {
        try {
            const currentUser = await getCurrentUser();
            
            const existingReaction = reactions.find(
                r => r.user_id === currentUser.userId
            );

            if (existingReaction) {
                if (existingReaction.icon === icon) {
                    await client.graphql({
                        query: deleteReactions,
                        variables: {
                            input: { id: existingReaction.id }
                        }
                    });
                } else {
                    await client.graphql({
                        query: deleteReactions,
                        variables: {
                            input: { id: existingReaction.id }
                        }
                    });
                    await client.graphql({
                        query: createReactions,
                        variables: {
                            input: {
                                message_id: message.id,
                                user_id: currentUser.userId,
                                icon: icon,
                                created_at: new Date().toISOString()
                            }
                        }
                    });
                }
            } else {
                await client.graphql({
                    query: createReactions,
                    variables: {
                        input: {
                            message_id: message.id,
                            user_id: currentUser.userId,
                            icon: icon,
                            created_at: new Date().toISOString()
                        }
                    }
                });
            }

            fetchReactions();
            setShowReactionMenu(false);
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };

    const handleReactionPress = (reaction: Reaction) => {
        setSelectedReaction(reaction);
        setTimeout(() => setSelectedReaction(null), 2000);
    };

    const isReactionSelected = (icon: string) => {
        return reactions.some(r => r.icon === icon && r.user_id === currentUser?.userId);
    };

    return (
        <>
            {showReactionMenu && (
                <Pressable 
                    style={styles.overlay}
                    onPress={() => setShowReactionMenu(false)}
                />
            )}
            
            <View style={{ flex: 1 }}>
                {showSender && !message.isMe && message.senderName && (
                    <Text style={styles.senderName}>{message.senderName}</Text>
                )}

                <View style={styles.messageWrapper}>
                    <Pressable 
                        onLongPress={() => setShowReactionMenu(true)}
                    >
                        <View style={[
                            styles.messageContainer,
                            message.isMe ? styles.myMessage : styles.theirMessage,
                            isFirstInGroup && (message.isMe ? styles.firstMyMessage : styles.firstTheirMessage),
                            isLastInGroup && (message.isMe ? styles.lastMyMessage : styles.lastTheirMessage),
                            !isFirstInGroup && { marginTop: 2 },
                            !isLastInGroup && { marginBottom: 2 }
                        ]}>
                            {message.type === 'text' ? (
                                <Text style={[
                                    styles.messageText,
                                    message.isMe ? styles.myMessageText : styles.theirMessageText
                                ]}>
                                    {message.text}
                                </Text>
                            ) : (
                                <View style={styles.imageWrapper}>
                                    <TouchableOpacity 
                                        onPress={() => !message.isUploading && onImagePress(message.image!)}
                                        disabled={message.isUploading}
                                    >
                                        <Image
                                            source={{ uri: message.image }}
                                            style={[
                                                styles.messageImage,
                                                message.isUploading && styles.uploadingImage
                                            ]}
                                            resizeMode="cover"
                                        />
                                        {message.isUploading && (
                                            <View style={styles.uploadingOverlay}>
                                               <ActivityIndicator size="small" color="#4CAF50" />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                            <Text style={[
                                styles.timestamp,
                                message.isMe ? styles.myTimestamp : styles.otherTimestamp
                            ]}>
                                {formatMessageTime(message.timestamp)}
                            </Text>

                            {reactions.length > 0 && (
                                <MessageReactions 
                                    reactions={reactions}
                                    onPressReaction={handleReactionPress}
                                />
                            )}
                        </View>
                    </Pressable>

                    {selectedReaction && (
                        <View style={[
                            styles.tooltipContainer,
                            message.isMe ? styles.tooltipRight : styles.tooltipLeft
                        ]}>
                            <Text style={styles.tooltipText}>
                                {selectedReaction.userName || selectedReaction.user_id}
                            </Text>
                        </View>
                    )}

                    {showReactionMenu && (
                        <MessageReactionMenu
                            isMe={message.isMe}
                            onReaction={handleReaction}
                            isReactionSelected={isReactionSelected}
                        />
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    senderName: {
        fontSize: 12,
        color: themeColors.textSecondary,
        marginBottom: 4,
        marginLeft: 12,
        fontWeight: '500'
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 12,
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: themeColors.primary,
        marginLeft: '20%',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: themeColors.surface,
        marginRight: '20%',
        borderWidth: 1,
        borderColor: themeColors.border,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#FFFFFF',
    },
    theirMessageText: {
        color: themeColors.text,
    },
    timestamp: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    myTimestamp: {
        color: 'rgba(255,255,255,0.8)',
    },
    otherTimestamp: {
        color: themeColors.textSecondary,
    },
    firstMyMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 15,
    },
    lastMyMessage: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    firstTheirMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 5,
    },
    lastTheirMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    imageWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    messageImage: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.6,
        borderRadius: 16,
    },
    uploadingImage: {
        opacity: 0.7,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingBar: {
        height: 3,
        backgroundColor: '#4CAF50',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    reactionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    reaction: {
        fontSize: 14,
        marginRight: 4,
    },
    tooltipContainer: {
        position: 'absolute',
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 4,
        bottom: '100%',
        marginBottom: 8,
    },
    tooltipRight: {
        right: 0,
    },
    tooltipLeft: {
        left: 0,
    },
    tooltipText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    absoluteFillObject: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 999,
        width: '100%',
        height: '100%'
    },
    messageWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
});

export default MessageItem;
