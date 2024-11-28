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

interface StoryReaction {
    id: string;
    created_at: string;
    icon: string;
    user?: {
        id: string;
        name: string;
        profile_picture?: string;
    };
}

interface StoryViewersProps {
    isVisible: boolean;
    viewers: StoryViewer[];
    reactions: StoryReaction[];
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
    const [activeTab, setActiveTab] = useState<'views' | 'reactions'>('views');

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.header}>
                    <View style={styles.tabs}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'views' && styles.activeTab]}
                            onPress={() => setActiveTab('views')}
                        >
                            <Text style={[styles.tabText, activeTab === 'views' && styles.activeTabText]}>
                                Views ({viewers.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'reactions' && styles.activeTab]}
                            onPress={() => setActiveTab('reactions')}
                        >
                            <Text style={[styles.tabText, activeTab === 'reactions' && styles.activeTabText]}>
                                Reactions ({reactions.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <Icon name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.viewersList}>
                    {activeTab === 'views' ? (
                        viewers.map((viewer) => (
                            <View key={viewer.id} style={styles.viewerItem}>
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
                                    <Text style={styles.viewerName}>
                                        {viewer.user?.name || 'Unknown User'}
                                    </Text>
                                    <Text style={styles.viewTime}>
                                        {formatTimeAgo(viewer.viewed_at)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        reactions.map((reaction) => (
                            <View key={reaction.id} style={styles.viewerItem}>
                                {reaction.user?.profile_picture ? (
                                    <Image 
                                        source={{ uri: reaction.user.profile_picture }} 
                                        style={styles.viewerAvatar}
                                        defaultSource={require('../assets/default-avatar.png')}
                                    />
                                ) : (
                                    <View style={[styles.viewerAvatar, styles.defaultAvatar]}>
                                        <Text style={styles.avatarText}>
                                            {reaction.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.viewerInfo}>
                                    <Text style={styles.viewerName}>
                                        {reaction.user?.name || 'Unknown User'}
                                    </Text>
                                    <View style={styles.reactionInfo}>
                                        <Text style={styles.reactionEmoji}>{reaction.icon}</Text>
                                        <Text style={styles.viewTime}>
                                            {formatTimeAgo(reaction.created_at)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
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
    tabs: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#f0f0f0',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#000',
        fontWeight: '600',
    },
    viewersList: {
        padding: 20,
    },
    viewerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
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
    viewerName: {
        fontSize: 16,
        fontWeight: '500',
    },
    viewTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    reactionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    reactionEmoji: {
        fontSize: 16,
        marginRight: 8,
    },
});

export default StoryViewers;