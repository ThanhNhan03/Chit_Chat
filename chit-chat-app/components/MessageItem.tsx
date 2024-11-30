import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Pressable, Modal, TouchableWithoutFeedback, ScrollView, Alert, Linking } from 'react-native';
import { themeColors } from '../config/themeColor';
import { generateClient } from 'aws-amplify/api';
import { GraphQLQuery } from '@aws-amplify/api';
import { messageReactionsByMessage_id, getUser } from '../src/graphql/queries';
import { createMessageReaction, deleteMessageReaction } from '../src/graphql/mutations';
import { onCreateMessageReaction, onDeleteMessageReaction } from '../src/graphql/subscriptions';
import { getCachedMessageReactions, cacheMessageReactions } from '../utils/cacheUtils';

const client = generateClient();

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MessageItemProps {
    message: {
        id: string;
        text?: string;
        image?: string;
        timestamp: string;
        type: 'text' | 'image';
        isMe: boolean;
        senderName?: string;
        senderAvatar?: string;
        isUploading?: boolean;
    };
    onImagePress: (uri: string) => void;
    showSender?: boolean;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
    currentUserId?: string;
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

// Helper function để nhóm và đếm reactions
const getGroupedReactions = (reactions: any[]) => {
    const grouped = reactions.reduce((acc, reaction) => {
        acc[reaction.icon] = (acc[reaction.icon] || 0) + 1;
        return acc;
    }, {});
    
    return Object.entries(grouped)
        .map(([icon, count]) => ({ icon, count: count as number }))
        .sort((a, b) => b.count - a.count);
};

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    onImagePress,
    showSender,
    isFirstInGroup,
    isLastInGroup,
    currentUserId
}) => {
    const [showReactions, setShowReactions] = useState(false);
    const [reactions, setReactions] = useState<any[]>([]);
    const [showReactionDetails, setShowReactionDetails] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const longPressRef = useRef<any>(null);

    // Fetch reactions khi component mount
    useEffect(() => {
        fetchReactions();
        const subscriptions = subscribeToReactions();
        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    }, [message.id]);

    const fetchReactions = async () => {
        try {
            // Kiểm tra cache trước
            const cachedReactions = await getCachedMessageReactions(message.id);
            if (cachedReactions) {
                setReactions(cachedReactions);
                return;
            }

            const result = await client.graphql({
                query: messageReactionsByMessage_id,
                variables: { message_id: message.id }
            });
            
            // Lấy thông tin user cho mỗi reaction
            const reactionsWithUserInfo = await Promise.all(
                result.data?.messageReactionsByMessage_id?.items.map(async (reaction) => {
                    try {
                        const userResult = await client.graphql({
                            query: getUser,
                            variables: { id: reaction.user_id }
                        });
                        return {
                            ...reaction,
                            user: userResult.data.getUser
                        };
                    } catch (error) {
                        console.error('Error fetching user info:', error);
                        return {
                            ...reaction,
                            user: { name: 'Unknown User' }
                        };
                    }
                }) || []
            );
            
            // Lưu vào cache
            await cacheMessageReactions(message.id, reactionsWithUserInfo);
            setReactions(reactionsWithUserInfo);
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const subscribeToReactions = () => {
        const subs = [];
        
        // Subscribe to new reactions
        const createSub = client.graphql({
            query: onCreateMessageReaction,
            variables: { filter: { message_id: { eq: message.id } } }
        }).subscribe({
            next: ({ data }: any) => {
                const newReaction = data.onCreateMessageReaction;
                setReactions(prev => {
                    const exists = prev.some(r => r.id === newReaction.id);
                    if (exists) return prev;
                    return [...prev, newReaction];
                });
            }
        });
        subs.push(createSub);

        // Subscribe to deleted reactions
        const deleteSub = client.graphql({
            query: onDeleteMessageReaction,
            variables: { filter: { message_id: { eq: message.id } } }
        }).subscribe({
            next: ({ data }: any) => {
                const deletedReaction = data.onDeleteMessageReaction;
                setReactions(prev => prev.filter(r => r.id !== deletedReaction.id));
            }
        });
        subs.push(deleteSub);

        return subs;
    };

    const handleLongPress = () => {
        setShowReactions(true);
    };

    const handleReaction = async (icon: string) => {
        if (!currentUserId) {
            console.error('No user ID available');
            Alert.alert('Error', 'Unable to react to message. Please try again.');
            return;
        }

        try {
            setIsAnimating(true);
            const existingReaction = reactions.find(
                r => r.user_id === currentUserId
            );

            let updatedReactions = [...reactions];

            if (existingReaction && existingReaction.icon === icon) {
                // Xóa reaction
                updatedReactions = reactions.filter(r => r.id !== existingReaction.id);
                await client.graphql({
                    query: deleteMessageReaction,
                    variables: { input: { id: existingReaction.id } }
                });
            } else {
                // Thêm/cập nhật reaction
                if (existingReaction) {
                    updatedReactions = reactions.filter(r => r.id !== existingReaction.id);
                    await client.graphql({
                        query: deleteMessageReaction,
                        variables: { input: { id: existingReaction.id } }
                    });
                }

                
                const userResult = await client.graphql({
                    query: getUser,
                    variables: { id: currentUserId }
                });

                const input = {
                    id: `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    message_id: message.id,
                    user_id: currentUserId,
                    icon,
                    created_at: new Date().toISOString()
                };

                const newReaction = {
                    ...input,
                    user: userResult.data.getUser 
                };
                
                updatedReactions.push(newReaction);
                await client.graphql({
                    query: createMessageReaction,
                    variables: { input }
                });
            }

            // Cập nhật cache với reactions mới
            await cacheMessageReactions(message.id, updatedReactions);
            setReactions(updatedReactions);
        } catch (error) {
            console.error('Error handling reaction:', error);
        } finally {
            setShowReactions(false);
            setTimeout(() => setIsAnimating(false), 30);
        }
    };

    const renderMessageText = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <Text
                        key={index}
                        style={styles.linkText}
                        onPress={() => Linking.openURL(part)}
                    >
                        {part}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <View>
            {showSender && !message.isMe && (
                <View style={styles.senderInfoContainer}>
                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        {message.senderAvatar ? (
                            <Image 
                                source={{ uri: message.senderAvatar }} 
                                style={styles.avatar} 
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {message.senderName?.charAt(0)?.toUpperCase() || '?'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Thông tin người gửi */}
                    <View style={styles.senderDetails}>
                        <View style={styles.senderNameRow}>
                            <Text style={styles.senderName}>
                                {message.senderName || 'Unknown User'}
                            </Text>
                            {/* Icon verified hoặc role nếu có */}
                            <Text style={styles.verifiedIcon}>✓</Text>
                        </View>
                        <Text style={styles.userStatus}>Online</Text>
                    </View>
                </View>
            )}

            <Pressable 
                onLongPress={handleLongPress}
                delayLongPress={200}
                style={[
                    styles.messageContainer,
                    message.isMe ? styles.myMessage : styles.theirMessage,
                    isFirstInGroup && (message.isMe ? styles.firstMyMessage : styles.firstTheirMessage),
                    isLastInGroup && (message.isMe ? styles.lastMyMessage : styles.lastTheirMessage),
                    !isFirstInGroup && { marginTop: 2 },
                    !isLastInGroup && { marginBottom: 2 },
                    reactions.length > 0 && styles.messageWithReactions
                ]}
            >
                {message.type === 'text' ? (
                    <Text style={[
                        styles.messageText,
                        message.isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>
                        {renderMessageText(message.text || '')}
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
                    <TouchableOpacity 
                        style={[
                            styles.reactionsContainer,
                            message.isMe ? styles.myReactionsContainer : styles.theirReactionsContainer
                        ]}
                        onPress={() => setShowReactionDetails(true)}
                    >
                        {getGroupedReactions(reactions).slice(0, 2).map((reaction, index) => (
                            <Text key={index} style={styles.reactionBadge}>
                                {reaction.icon} {reaction.count > 1 ? reaction.count : ''}
                            </Text>
                        ))}
                    </TouchableOpacity>
                )}
            </Pressable>

            {/* Reaction picker modal */}
            <Modal
                visible={showReactions || isAnimating}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setShowReactions(false);
                    setIsAnimating(false);
                }}
                hardwareAccelerated
            >
                <TouchableWithoutFeedback 
                    onPress={() => {
                        setShowReactions(false);
                        setTimeout(() => setIsAnimating(false), 30);
                    }}
                >
                    <View style={[
                        styles.modalOverlay,
                        { backgroundColor: 'transparent' }
                    ]}>
                        <TouchableWithoutFeedback>
                            <View style={[
                                styles.reactionPicker,
                                styles.reactionPickerAnimation
                            ]}>
                                {['❤️', '👍', '😆', '😮', '😢', '😠'].map((icon) => {
                                    const isSelected = reactions.some(
                                        r => r.user_id === currentUserId && r.icon === icon
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={icon}
                                            onPress={() => handleReaction(icon)}
                                            style={[
                                                styles.reactionButton,
                                                isSelected && styles.selectedReactionButton
                                            ]}
                                        >
                                            <Text style={styles.reactionIcon}>{icon}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Reaction details modal */}
            <Modal
                visible={showReactionDetails}
                transparent
            animationType="fade"
                onRequestClose={() => setShowReactionDetails(false)}
            >
                <View style={styles.detailsModal}>
                    <View style={styles.detailsHeader}>
                        <Text style={styles.detailsTitle}>Reactions</Text>
                        <TouchableOpacity 
                            onPress={() => setShowReactionDetails(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.detailsContent}>
                        {reactions.map((reaction) => (
                            <View key={reaction.id} style={styles.reactionDetail}>
                                {/* Avatar */}
                                <View style={styles.avatarContainer}>
                                    {reaction.user?.profile_picture ? (
                                        <Image 
                                            source={{ uri: reaction.user.profile_picture }} 
                                            style={styles.avatar} 
                                        />
                                    ) : (
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.avatarText}>
                                                {reaction.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.reactionUserName}>
                                        {reaction.user?.name || 'Unknown User'}
                                    </Text>
                                    <Text style={styles.reactionTime}>
                                        {formatMessageTime(reaction.created_at)}
                                    </Text>
                                </View>
                                <Text style={styles.reactionDetailIcon}>{reaction.icon}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    senderName: {
        fontSize: 12,
        color: themeColors.textSecondary,
        fontWeight: '500',
        marginBottom: 4,
        marginLeft: 12,
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
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
        backgroundColor: '#4CAF50', // hoặc màu bạn muốn
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    messageWithReactions: {
        marginBottom: 24,
    },
    reactionsContainer: {
        position: 'absolute',
        bottom: -20,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 4,
        paddingHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    myReactionsContainer: {
        right: 8,
    },
    theirReactionsContainer: {
        left: 8,
    },
    reactionBadge: {
        fontSize: 12,
        marginHorizontal: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactionPicker: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 8,
    },
    reactionPickerAnimation: {
        transform: [{ scale: 1 }],
        opacity: 1,
    },
    reactionButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    reactionIcon: {
        fontSize: 24,
    },
    detailsModal: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 500,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    detailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 16,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 150,
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#666',
    },
    userInfo: {
        flex: 1,
    },
    reactionUserName: {
        fontSize: 16,
        fontWeight: '500',
        color: themeColors.text,
    },
    reactionTime: {
        fontSize: 12,
        color: themeColors.textSecondary,
        marginTop: 2,
    },
    reactionDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
    },
    avatarContainer: {
        marginRight: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: themeColors.border,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
    },
    detailsContent: {
        flex: 1,
    },
    reactionDetailIcon: {
        fontSize: 20,
        marginLeft: 8,
    },
    selectedReactionButton: {
        backgroundColor: '#E8F5E9',
        borderRadius: 20,
    },
    senderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        marginLeft: 12,
    },
    senderInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 12,
        paddingVertical: 4,
    },
 
   
    senderDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    senderNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
  
    verifiedIcon: {
        fontSize: 12,
        color: '#2196F3',
        marginTop: 1,
    },
    userStatus: {
        fontSize: 12,
        color: '#4CAF50',
        marginTop: 2,
    },
    linkText: {
        color: '#1E90FF', // Link color
        textDecorationLine: 'underline',
    },
});

export default MessageItem;
