import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { StoryReaction as APIStoryReaction } from '../src/API';

const { height } = Dimensions.get('window');

interface StoryViewer {
    id: string;
    viewed_at: string;
    user?: {
        id: string;
        name: string;
        profile_picture?: string;
    };
}

interface StoryViewersProps {
    isVisible: boolean;
    viewers: StoryViewer[];
    reactions: APIStoryReaction[];
    onClose: () => void;
    formatTimeAgo: (date: string) => string;
}

const StoryViewers: React.FC<StoryViewersProps> = ({
    isVisible,
    viewers,
    reactions,
    onClose,
    formatTimeAgo,
}) => {
    if (!isVisible) return null;

    // Tạo map để lưu tất cả reaction của mỗi user
    const userReactions = new Map();
    reactions.forEach(reaction => {
        if (reaction.user_id) {
            if (!userReactions.has(reaction.user_id)) {
                userReactions.set(reaction.user_id, []);
            }
            userReactions.get(reaction.user_id).push(reaction.icon);
        }
    });

    // Kết hợp thông tin viewer và tất cả reactions
    const viewersWithReactions = viewers.map(viewer => ({
        ...viewer,
        reactions: viewer.user?.id ? userReactions.get(viewer.user.id) || [] : []
    }));

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Story Views</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.viewersList}>
                    {viewersWithReactions.map((viewer) => (
                        <View key={viewer.id} style={styles.viewerItem}>
                            <View style={styles.viewerMain}>
                                {viewer.user?.profile_picture ? (
                                    <Image 
                                        source={{ uri: viewer.user.profile_picture }} 
                                        style={styles.viewerAvatar}
                                        defaultSource={require('../assets/default-avatar.png')}
                                    />
                                ) : (
                                    <View style={[styles.viewerAvatar, styles.defaultAvatar]}>
                                        <Text style={styles.avatarText}>
                                            {viewer.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.viewerInfo}>
                                    <View style={styles.viewerNameContainer}>
                                        <Text style={styles.viewerName}>
                                            {viewer.user?.name || 'Unknown User'}
                                        </Text>
                                        {viewer.reactions.length > 0 && (
                                            <View style={styles.reactionsContainer}>
                                                {viewer.reactions.map((icon, index) => (
                                                    <Text 
                                                        key={`${viewer.id}-${index}`}
                                                        style={styles.reactionEmoji}
                                                    >
                                                        {icon}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.viewTime}>
                                        {formatTimeAgo(viewer.viewed_at)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        maxHeight: height * 0.7,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    viewersList: {
        padding: 20,
    },
    viewerItem: {
        marginBottom: 20,
    },
    viewerMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    defaultAvatar: {
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    viewerInfo: {
        flex: 1,
    },
    viewerNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    viewerName: {
        fontSize: 16,
        fontWeight: '500',
    },
    viewTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    reactionEmoji: {
        fontSize: 16,
    },
    reactionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

export default StoryViewers;