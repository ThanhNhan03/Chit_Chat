import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';
import { createReactions, deleteReactions } from '../src/graphql/mutations';
import { reactionsByMessage_id, getUser } from '../src/graphql/queries';
import MessageReactions from './MessageReactions';
import { getCurrentUser } from '@aws-amplify/auth';
import { onCreateReactions, onDeleteReactions } from '../src/graphql/subscriptions';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

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

interface MessageItemProps {
    message: {
        id: string;
        text?: string;
        image?: string;
        timestamp: string;
        type: 'text' | 'image';
        isMe: boolean;
        senderName?: string;
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

    const fetchReactions = async () => {
        try {
            const response = await client.graphql({
                query: reactionsByMessage_id,
                variables: {
                    message_id: message.id
                }
            });
            
            const reactionsWithUserInfo = await Promise.all(
                response.data.reactionsByMessage_id.items.map(async (reaction: Reaction) => {
                    try {
                        const userResponse = await client.graphql({
                            query: getUser,
                            variables: { id: reaction.user_id }
                        });
                        return {
                            ...reaction,
                            userName: userResponse.data.getUser?.name || reaction.user_id
                        };
                    } catch (error) {
                        console.error('Error fetching user info:', error);
                        return reaction;
                    }
                })
            );
            
            setReactions(reactionsWithUserInfo);
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleReaction = async (icon: string) => {
        try {
            const currentUser = await getCurrentUser();
            
            // Check if user already reacted with this icon
            const existingReaction = reactions.find(
                r => r.user_id === currentUser.userId && r.icon === icon
            );

            if (existingReaction) {
                // Remove reaction
                await client.graphql({
                    query: deleteReactions,
                    variables: {
                        input: { id: existingReaction.id }
                    }
                });
            } else {
                // Add reaction
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

            // Refresh reactions
            fetchReactions();
            setShowReactionMenu(false);
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };

    const handleReactionPress = (reaction: Reaction) => {
        setSelectedReaction(reaction);
        // Tự động ẩn tooltip sau 2 giây
        setTimeout(() => setSelectedReaction(null), 2000);
    };

    return (
        <View>
            {showSender && !message.isMe && message.senderName && (
                <Text style={styles.senderName}>{message.senderName}</Text>
            )}

            <Pressable onLongPress={() => setShowReactionMenu(true)}>
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
                        <TouchableOpacity onPress={() => onImagePress(message.image!)}>
                            <Image
                                source={{ uri: message.image }}
                                style={styles.messageImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
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
                <View style={[
                    styles.reactionMenuContainer,
                    message.isMe ? styles.reactionMenuRight : styles.reactionMenuLeft
                ]}>
                    {['👍', '❤️', '😂', '😮', '😢', '😡','😆'].map((icon) => (
                        <TouchableOpacity
                            key={icon}
                            onPress={() => handleReaction(icon)}
                            style={styles.reactionButton}
                        >
                            <Text style={styles.reactionIcon}>{icon}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        marginLeft: 12,
        fontWeight: '500'
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 15,
        elevation: 2,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        marginLeft: '20%',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        marginRight: '20%',
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#000000',
    },
    theirMessageText: {
        color: '#000000',
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    timestamp: {
        fontSize: 12,
        color: '#666666',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    myTimestamp: {
        color: '#666666',
    },
    otherTimestamp: {
        color: '#666666',
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
    reactionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
    },
    reaction: {
        fontSize: 14,
        marginRight: 4,
    },
    reactionMenuContainer: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: 10,
        zIndex: 1000,
    },
    reactionMenuRight: {
        right: 0,
    },
    reactionMenuLeft: {
        left: 0,
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
    reactionMenu: {
        position: 'absolute',
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        bottom: '100%',
        marginBottom: 8,
    },
    reactionButton: {
        padding: 8,
    },
    reactionIcon: {
        fontSize: 20,
    },
});

export default MessageItem;
