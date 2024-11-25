import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
    Animated,
    Text,
    TouchableWithoutFeedback,
    Alert,
    Easing,
    Modal,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { getStory } from '../src/graphql/queries';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { AuthenticatedUserContext } from '../contexts/AuthContext';
import { deleteStory } from '../src/graphql/mutations';
import { createStoryReaction, deleteStoryReaction } from '../src/graphql/mutations';
import { storyReactionsByUser_id } from '../src/graphql/queries';
import ReactionPicker from '../components/ReactionPicker';
import { onCreateStoryReaction, onDeleteStoryReaction } from '../src/graphql/subscriptions';
import { OnCreateStoryReactionSubscription, OnDeleteStoryReactionSubscription } from '../src/API';
import StoryReactionsList from '../components/StoryReactionsList';
import * as queries from '../src/graphql/queries';
import { ModelSortDirection } from '../src/API';

const client = generateClient();

const { width, height } = Dimensions.get('window');

interface Story {
    id: string;
    user_id: string;
    type: string;
    media_url?: string;
    text_content?: string;
    background_color?: string;
    thumbnail_url?: string;
    duration?: number;
    music_id?: string;
    music?: {
        __typename?: "Music";
        id: string;
        title: string;
        artist?: string;
        url: string;
        duration?: number;
        cover_image?: string;
        created_at?: string;
        createdAt?: string;
        updatedAt?: string;
    };
    created_at?: string;
    expires_at?: string;
    music_start_time?: number;
    music_end_time?: number;
    user?: {
        id: string;
        name: string;
        profile_picture: string;
    };
}

type GetStoryResponse = {
    getStory: Story;
}

interface ViewStoryScreenProps {
    route: {
        params: {
            stories: Story[];
            initialStoryIndex: number;
            username?: string;
            userAvatar?: string;
            previousScreen?: string;
            isCurrentUser?: boolean;
        };
    };
    navigation: any;
}

const GET_STORY_WITH_MUSIC = `
  query GetStory($id: ID!) {
    getStory(id: $id) {
      id
      music_id
      music_start_time
      music_end_time
      music {
        id
        title
        artist
        url
        duration
        cover_image
        created_at
      }
    }
  }
`;

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} days ago`;
    }
};

// Thêm component hiển thị reactions
const ReactionsList = ({ reactions }: { reactions: Record<string, string> }) => (
    <View style={styles.reactionsList}>
        {Object.entries(reactions).map(([userId, icon], index) => (
            <View key={userId} style={styles.reactionItem}>
                <Text style={styles.reactionEmoji}>{icon}</Text>
            </View>
        ))}
    </View>
);

// Thêm interface cho animated reaction
interface AnimatedReaction {
    id: string;
    icon: string;
    position: {
        x: Animated.Value;
        y: Animated.Value;
    };
    scale: Animated.Value;
    opacity: Animated.Value;
}

type StoryViewsResponse = {
    storyViewsByStory_id: {
        items: Array<{
            id: string;
            user_id: string;
            createdAt: string;
            user: {
                id: string;
                name: string;
                profile_picture: string;
            };
        }>;
    };
};

type StoryReactionsResponse = {
    storyReactionsByStory_id: {
        items: Array<{
            id: string;
            user_id: string;
            icon: string;
            user: {
                id: string;
                name: string;
            };
        }>;
    };
};

const ViewStoryScreen = ({ route, navigation }: ViewStoryScreenProps) => {
    const { user } = useContext(AuthenticatedUserContext);
    const { 
        stories: originalStories, 
        initialStoryIndex, 
        username, 
        userAvatar, 
        previousScreen,
        isCurrentUser 
    } = route.params;
    
    // Thay đổi từ useState readonly sang useState có thể update
    const [stories, setStories] = useState(() => 
        [...originalStories].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    );
    const [currentIndex, setCurrentIndex] = useState(() => {
        // If initialStoryIndex is provided, find the corresponding index in sorted array
        if (initialStoryIndex === 0) return 0;
        const targetStory = originalStories[initialStoryIndex];
        return stories.findIndex(story => story.id === targetStory.id);
    });
    const [progress] = useState(new Animated.Value(0));
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const soundRef = useRef<Audio.Sound | null>(null);
    const isMountedRef = useRef(true);
    const [showReactions, setShowReactions] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
    const reactionAnim = useRef(new Animated.Value(0)).current;
    const reactionScaleAnim = useRef(new Animated.Value(1)).current;
    const [currentReaction, setCurrentReaction] = useState<{id: string, icon: string} | null>(null);
    const [storyReactions, setStoryReactions] = useState<any[]>([]);
    const [userReactions, setUserReactions] = useState<{[key: string]: string}>({});
    const [animatedReactions, setAnimatedReactions] = useState<AnimatedReaction[]>([]);
    const [selectedTab, setSelectedTab] = useState<'reactions' | 'views'>('reactions');
    const [storyViews, setStoryViews] = useState<any[]>([]);

    const currentStory = stories[currentIndex];
    
    // Kiểm tra xem story hiện tại có phải của user đang đăng nhập không
    const isCurrentUserStory = currentStory?.user_id === user?.userId;

    const handleNext = async () => {
        if (currentIndex < stories.length - 1) {
            await cleanupSound(); // Cleanup trước khi chuyển story
            setCurrentIndex(currentIndex + 1);
        } else {
            handleBack();
        }
    };

    const handlePrevious = async () => {
        if (currentIndex > 0) {
            await cleanupSound(); // Cleanup trước khi chuyển story
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Add touch handlers
    const handleTouchStart = async (evt: any) => {
        const x = evt.nativeEvent.pageX;
        const screenWidth = Dimensions.get('window').width;
        
        if (x < screenWidth / 2) {
            await handlePrevious();
        } else {
            await handleNext();
        }
    };

    const createFloatingReaction = (reaction: string) => {
        // Tạo nhiều icon cùng lúc
        const numberOfIcons = 15; // Số lượng icon muốn tạo
        const newReactions: AnimatedReaction[] = [];

        for (let i = 0; i < numberOfIcons; i++) {
            const id = `${Date.now()}-${i}`;
            // Random vị trí bắt đầu theo chiều ngang
            const startX = Math.random() * width;
            // Random vị trí bắt đầu theo chiều dọc
            const startY = height + Math.random() * 100;
            // Random tốc độ bay lên
            const duration = 2000 + Math.random() * 2000;
            // Random kích thước
            const startScale = 0.5 + Math.random() * 0.5;

            const position = {
                x: new Animated.Value(startX),
                y: new Animated.Value(startY)
            };
            const scale = new Animated.Value(startScale);
            const opacity = new Animated.Value(1);

            newReactions.push({
                id,
                icon: reaction,
                position,
                scale,
                opacity
            });

            // Animate mỗi icon
            Animated.parallel([
                Animated.timing(position.y, {
                    toValue: -100 - Math.random() * height,
                    duration,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease)
                }),
                // Thêm chuyển động ngang nhẹ
                Animated.timing(position.x, {
                    toValue: startX + (Math.random() - 0.5) * 100,
                    duration,
                    useNativeDriver: true
                }),
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1 + Math.random(),
                        duration: duration * 0.3,
                        useNativeDriver: true
                    }),
                    Animated.timing(scale, {
                        toValue: 0.5,
                        duration: duration * 0.7,
                        useNativeDriver: true
                    })
                ]),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration,
                    useNativeDriver: true
                })
            ]).start(() => {
                setAnimatedReactions(prev => prev.filter(r => r.id !== id));
            });
        }

        setAnimatedReactions(prev => [...prev, ...newReactions]);
    };

    // Người xem story chỉ có thể thả reaction
    const handleReactionPress = async (reaction: string) => {
        if (!user?.userId || !currentStory) return;
        
        try {
            createFloatingReaction(reaction);

            if (currentReaction) {
                await client.graphql({
                    query: deleteStoryReaction,
                    variables: {
                        input: { id: currentReaction.id }
                    }
                });
                const newReactions = { ...userReactions };
                delete newReactions[user.userId];
                setUserReactions(newReactions);
            }

            if (!currentReaction || currentReaction.icon !== reaction) {
                const response = await client.graphql({
                    query: createStoryReaction,
                    variables: {
                        input: {
                            story_id: currentStory.id,
                            user_id: user.userId,
                            icon: reaction,
                            created_at: new Date().toISOString()
                        }
                    }
                });

                setUserReactions(prev => ({
                    ...prev,
                    [user.userId]: reaction
                }));

                setCurrentReaction({
                    id: response.data.createStoryReaction.id,
                    icon: reaction
                });
            } else {
                setCurrentReaction(null);
            }

            hideReactionBar();
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };

    const showReactionBar = () => {
        setShowReactions(true);
        Animated.spring(reactionAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const hideReactionBar = () => {
        Animated.spring(reactionAnim, {
            toValue: 0,
            useNativeDriver: true,
        }).start(() => setShowReactions(false));
    };

    const startProgress = () => {
        progress.setValue(0);
        Animated.timing(progress, {
            toValue: 1,
            duration: currentStory.duration * 1000 || 5000,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                handleNext();
            }
        });
    };

    const cleanupSound = async () => {
        try {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    await soundRef.current.stopAsync();
                    await soundRef.current.unloadAsync();
                }
                soundRef.current = null;
                setSound(null);
                setIsPlaying(true);
            }
        } catch (error) {
            // Bỏ qua lỗi nếu sound đã được unload
            console.log('Cleanup warning:', error);
        }
    };

    const loadAndPlayMusic = async () => {
        if (!currentStory.music_id || !isMountedRef.current) return;

        try {
            await cleanupSound();

            const response = await client.graphql({
                query: GET_STORY_WITH_MUSIC,
                variables: { id: currentStory.id },
                authMode: 'apiKey'
            }) as GraphQLResult<GetStoryResponse>;

            if (!isMountedRef.current) return;

            const musicData = response.data?.getStory?.music;
            if (musicData) {
                currentStory.music = {
                    ...musicData,
                    __typename: "Music"
                };

                if (musicData.url) {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: musicData.url },
                        { 
                            positionMillis: (response.data.getStory.music_start_time || 0) * 1000,
                            shouldPlay: true,
                            volume: 1.0
                        },
                        (status) => {
                            // Callback khi trạng thái phát nhạc thay đổi
                            if (status.isLoaded) {
                                setIsPlaying(status.isPlaying);
                            }
                        }
                    );

                    if (!isMountedRef.current) {
                        await newSound.unloadAsync();
                        return;
                    }

                    soundRef.current = newSound;
                    setSound(newSound);

                    // Xử lý loop nhạc
                    newSound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
                        if (!status.isLoaded || !isMountedRef.current) return;
                        
                        const endTime = response.data.getStory.music_end_time || 0;
                        const startTime = response.data.getStory.music_start_time || 0;
                        
                        if (status.positionMillis >= endTime * 1000) {
                            try {
                                await newSound.setPositionAsync(startTime * 1000);
                                if (status.isPlaying) await newSound.playAsync();
                            } catch (error) {
                                console.log('Playback update warning:', error);
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.log('Load music warning:', error);
        }
    };

    useEffect(() => {
        isMountedRef.current = true;

        const loadStory = async () => {
            if (!isMountedRef.current) return;
            await cleanupSound();
            startProgress();
            await loadAndPlayMusic();
        };

        loadStory();

        return () => {
            isMountedRef.current = false;
            const cleanup = async () => {
                progress.stopAnimation();
                await cleanupSound();
            };
            cleanup();
        };
    }, [currentIndex]);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            cleanupSound();
        };
    }, []);

    const handleBack = async () => {
        // Cleanup sound trước khi navigate
        await cleanupSound();
        if (previousScreen) {
            navigation.navigate(previousScreen);
        } else {
            navigation.goBack();
        }
    };

    const toggleSound = async () => {
        if (sound) {
            try {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    if (status.isPlaying) {
                        await sound.pauseAsync();
                    } else {
                        await sound.playAsync();
                    }
                    setIsPlaying(!isPlaying);
                }
            } catch (error) {
                console.error('Error toggling sound:', error);
            }
        }
    };

    const handleDeleteStory = async () => {
        if (!user?.userId || user.userId !== currentStory.user_id) {
            console.log('Unauthorized to delete this story');
            return;
        }

        Alert.alert(
            "Delete Story",
            "Are you sure you want to delete this story?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Cleanup trước khi xóa
                            await cleanupSound();
                            progress.stopAnimation();

                            await client.graphql({
                                query: deleteStory,
                                variables: {
                                    input: {
                                        id: currentStory.id
                                    }
                                }
                            });

                            // Xóa story khỏi danh sách và xử lý navigation
                            const newStories = stories.filter(s => s.id !== currentStory.id);

                            if (newStories.length === 0) {
                                // Nếu không còn story nào, quay về màn hình trước
                                handleBack();
                            } else {
                                // Cập nhật stories trước
                                setStories(newStories);
                                
                                // Sau đó mới cập nhật currentIndex nếu cần
                                if (currentIndex >= newStories.length) {
                                    setCurrentIndex(newStories.length - 1);
                                }
                            }

                        } catch (error) {
                            console.error('Error deleting story:', error);
                            Alert.alert(
                                "Error",
                                "Failed to delete story. Please try again."
                            );
                        }
                    }
                }
            ]
        );
    };

    // Thêm useEffect để xử lý khi stories hoặc currentIndex thay đổi
    useEffect(() => {
        if (stories.length === 0) {
            handleBack();
        }
    }, [stories, currentIndex]);

    // Fetch current user's reaction for this story
    useEffect(() => {
        const fetchCurrentReaction = async () => {
            if (!user?.userId || !currentStory) return;
            
            try {
                const response = await client.graphql({
                    query: storyReactionsByUser_id,
                    variables: {
                        user_id: user.userId,
                        filter: {
                            story_id: { eq: currentStory.id }
                        }
                    }
                });

                const reactions = response.data.storyReactionsByUser_id.items;
                if (reactions.length > 0) {
                    setCurrentReaction({
                        id: reactions[0].id,
                        icon: reactions[0].icon
                    });
                } else {
                    setCurrentReaction(null);
                }
            } catch (error) {
                console.error('Error fetching reaction:', error);
            }
        };

        fetchCurrentReaction();
    }, [currentStory?.id, user?.userId]);

    useEffect(() => {
        if (!currentStory) return;

        // Subscribe to new reactions
        const createSubscription = client.graphql({
            query: onCreateStoryReaction,
            variables: {
                filter: {
                    story_id: { eq: currentStory.id }
                }
            }
        }).subscribe({
            next: (payload) => {
                const data = payload.data as OnCreateStoryReactionSubscription;
                if (data.onCreateStoryReaction) {
                    console.log('New reaction:', data.onCreateStoryReaction);
                    // Handle new reaction
                }
            },
            error: (error) => console.error(error)
        });

        // Subscribe to deleted reactions
        const deleteSubscription = client.graphql({
            query: onDeleteStoryReaction,
            variables: {
                filter: {
                    story_id: { eq: currentStory.id }
                }
            }
        }).subscribe({
            next: (payload) => {
                const data = payload.data as OnDeleteStoryReactionSubscription;
                if (data.onDeleteStoryReaction) {
                    console.log('Deleted reaction:', data.onDeleteStoryReaction);
                    // Handle deleted reaction
                }
            },
            error: (error) => console.error(error)
        });

        return () => {
            createSubscription.unsubscribe();
            deleteSubscription.unsubscribe();
        };
    }, [currentStory?.id]);

    const fetchStoryReactions = async () => {
        if (!currentStory?.id) return;
        
        try {
            const newLocal = `query StoryReactions($story_id: ID!) {
                    storyReactionsByStory_id(story_id: $story_id) {
                        items {
                            id
                            user_id
                            icon
                            user {
                                id
                                name
                            }
                        }
                    }
                }`;
            const response = await client.graphql({
                query: newLocal,
                variables: {
                    story_id: currentStory.id
                }
            }) as GraphQLResult<StoryReactionsResponse>;

            setStoryReactions(response.data?.storyReactionsByStory_id.items || []);
        } catch (error) {
            console.error('Error fetching story reactions:', error);
        }
    };

    const fetchStoryViews = async () => {
        try {
            const response = await client.graphql({
                query: `query StoryViews($story_id: ID!) {
                    storyViewsByStory_id(story_id: $story_id) {
                        items {
                            id
                            user_id
                            createdAt
                            user {
                                id
                                name
                                profile_picture
                            }
                        }
                    }
                }`,
                variables: {
                    story_id: currentStory.id,
                },
            }) as GraphQLResult<StoryViewsResponse>;
            
            setStoryViews(response.data?.storyViewsByStory_id.items || []);
        } catch (error) {
            console.error('Error fetching story views:', error);
        }
    };

    // Chỉ người đăng story mới có thể xem chi tiết
    const handleViewDetails = async () => {
        if (isCurrentUserStory) {
            await Promise.all([
                fetchStoryReactions(),
                fetchStoryViews()
            ]);
            setShowReactions(true);
        }
    };

    // Thêm modal hiển thị danh sách reactions
    const renderReactionsModal = () => (
        <Modal
            visible={showReactions}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowReactions(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Story Details</Text>
                        <TouchableOpacity onPress={() => setShowReactions(false)}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Tab buttons */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity 
                            style={[styles.tabButton, selectedTab === 'reactions' && styles.activeTab]}
                            onPress={() => setSelectedTab('reactions')}
                        >
                            <Text style={styles.tabText}>Reactions ({storyReactions.length})</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tabButton, selectedTab === 'views' && styles.activeTab]}
                            onPress={() => setSelectedTab('views')}
                        >
                            <Text style={styles.tabText}>Views ({storyViews.length})</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {selectedTab === 'reactions' ? (
                        <View style={styles.listContainer}>
                            {storyReactions.map((reaction) => (
                                <View key={reaction.id} style={styles.listItem}>
                                    <Text style={styles.reactionEmoji}>{reaction.icon}</Text>
                                    <Text style={styles.userName}>{reaction.user?.name || 'Unknown User'}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.listContainer}>
                            {storyViews.map((view) => (
                                <View key={view.id} style={styles.listItem}>
                                    <Text style={styles.userName}>{view.user?.name || 'Unknown User'}</Text>
                                    <Text style={styles.timeStamp}>
                                        {formatTimeAgo(view.createdAt)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[
            styles.container, 
            currentStory.type === 'text' 
                ? { backgroundColor: currentStory.background_color } 
                : { backgroundColor: '#000' }
        ]}>
            {/* Progress Bars */}
            <View style={styles.progressContainer}>
                {stories.map((story, index) => (
                    <View key={story.id} style={styles.progressBar}>
                        <Animated.View 
                            style={[
                                styles.progress,
                                {
                                    width: index === currentIndex 
                                        ? progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                        : index < currentIndex ? '100%' : '0%'
                                }
                            ]} 
                        />
                    </View>
                ))}
            </View>

            {/* Touch Areas */}
            <TouchableWithoutFeedback 
                onPress={handleTouchStart}
            >
                <View style={styles.content}>
                    {currentStory.type === 'image' ? (
                        <Image 
                            source={{ uri: currentStory.media_url }} 
                            style={styles.image}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.textContainer}>
                            <Text style={styles.storyText}>
                                {currentStory.text_content}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>

            {/* Header with User Info */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {userAvatar && userAvatar.trim() !== '' ? (
                        <Image 
                            source={{ uri: userAvatar }} 
                            style={styles.userAvatar}
                            defaultSource={require('../assets/default-avatar.png')}
                        />
                    ) : (
                        <View style={[styles.userAvatar, styles.defaultAvatar]}>
                            <Text style={styles.avatarText}>
                                {isCurrentUser ? 'Y' : username ? username.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </View>
                    )}
                    <View style={styles.userTextContainer}>
                        <Text style={styles.username}>
                            {isCurrentUser ? 'You' : username || 'User'}
                        </Text>
                        {currentStory.created_at && (
                            <Text style={styles.timeAgo}>
                                {formatTimeAgo(currentStory.created_at)}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.headerRight}>
                    {currentStory.music_id && (
                        <TouchableOpacity 
                            style={styles.headerIcon}
                            onPress={toggleSound}
                        >
                            <Icon 
                                name={isPlaying ? "volume-high" : "volume-mute"} 
                                size={24} 
                                color="#fff" 
                            />
                        </TouchableOpacity>
                    )}
                    {user?.userId === currentStory.user_id && (
                        <TouchableOpacity 
                            style={styles.headerIcon}
                            onPress={handleDeleteStory}
                        >
                            <Icon name="trash-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={styles.headerIcon}
                        onPress={handleBack}
                    >
                        <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Music Info */}
            {currentStory.music_id && currentStory.music && (
                <View style={styles.musicInfo}>
                    <View style={styles.musicInfoLeft}>
                        {currentStory.music.cover_image ? (
                            <Image 
                                source={{ uri: currentStory.music.cover_image }} 
                                style={styles.musicCover}
                                // defaultSource={require('../assets/default-music-cover.png')}
                            />
                        ) : (
                            <View style={styles.musicIcon}>
                                <Icon name="musical-notes" size={16} color="#fff" />
                            </View>
                        )}
                        <View style={styles.musicTextContainer}>
                            <Text style={styles.musicTitle} numberOfLines={1}>
                                {currentStory.music.title || 'Unknown Title'}
                            </Text>
                            <Text style={styles.musicArtist} numberOfLines={1}>
                                {currentStory.music.artist || 'Unknown Artist'}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Nút reaction cho người xem story */}
            {currentStory.user_id !== user?.userId && (
                <TouchableOpacity 
                    style={styles.reactionButton}
                    onPress={showReactionBar}
                >
                    <Icon 
                        name={currentReaction ? "heart" : "heart-outline"} 
                        size={24} 
                        color={currentReaction ? "#ff4b4b" : "#fff"} 
                    />
                </TouchableOpacity>
            )}

            {/* Nút View Details chỉ hiện cho người đăng story */}
            {currentStory.user_id === user?.userId && (
                <TouchableOpacity 
                    style={styles.reactionsButton}
                    onPress={handleViewDetails}
                >
                    <Text style={styles.reactionsButtonText}>View Details</Text>
                </TouchableOpacity>
            )}

            {/* Hiển thị reactions đã thả ở bên trái cho tất cả người dùng */}
            {Object.keys(userReactions).length > 0 && (
                <ReactionsList reactions={userReactions} />
            )}

            {/* Reaction Bar */}
            {showReactions && !isCurrentUserStory && (
                <Animated.View 
                    style={[
                        styles.reactionBar,
                        {
                            transform: [
                                { scale: reactionAnim },
                                { translateY: reactionAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                })}
                            ],
                            opacity: reactionAnim
                        }
                    ]}
                >
                    <ReactionPicker 
                        onSelectReaction={handleReactionPress}
                        currentReaction={currentReaction?.icon}
                        onClose={hideReactionBar}
                        userReactions={userReactions}
                        currentUserId={user?.userId}
                    />
                </Animated.View>
            )}

            {/* Hiển thị số lượng reaction cho tất cả người dùng */}
            <View style={styles.reactionStats}>
                {storyReactions.length > 0 && (
                    <Text style={styles.reactionCount}>
                        {storyReactions.length} {storyReactions.length === 1 ? 'reaction' : 'reactions'}
                    </Text>
                )}
            </View>

            {/* Add floating reactions */}
            {animatedReactions.map(reaction => (
                <Animated.Text
                    key={reaction.id}
                    style={[
                        styles.floatingReaction,
                        {
                            transform: [
                                { translateX: reaction.position.x },
                                { translateY: reaction.position.y },
                                { scale: reaction.scale }
                            ],
                            opacity: reaction.opacity
                        }
                    ]}
                >
                    {reaction.icon}
                </Animated.Text>
            ))}

            {/* Modal chi tiết chỉ hiện khi người đăng story bấm View Details */}
            {isCurrentUserStory && renderReactionsModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressContainer: {
        flexDirection: 'row',
        padding: 10,
        gap: 5,
    },
    progressBar: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginTop: height * 0.05,
    },
    progress: {
        height: '100%',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        position: 'absolute',
        top: height * 0.02,
        left: 0,
        right: 0,
        zIndex: 1,
        marginTop: height * 0.05,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 20,
        opacity: 0.8,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 2,
        borderColor: '#fff',
    },
    username: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    storyText: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
        fontWeight: '600',
    },
    musicInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    musicInfoLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    musicCover: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    musicIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    musicTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    musicTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    musicArtist: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    defaultAvatar: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    userTextContainer: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    timeAgo: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    reactionButton: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 25,
        zIndex: 100,
    },
    storyReactionPicker: {
        position: 'absolute',
        right: 20,
        bottom: 140,
        zIndex: 100,
    },
    reactionStats: {
        position: 'absolute',
        left: 20,
        bottom: 80,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 15,
    },
    reactionCount: {
        color: '#fff',
        fontSize: 12,
    },
    reactionBar: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 30,
        padding: 8,
        zIndex: 100,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    reactionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    reactionItem: {
        marginRight: 4,
        marginBottom: 4,
    },
    reactionEmoji: {
        fontSize: 20,
    },
    floatingReaction: {
        position: 'absolute',
        fontSize: 40,
        zIndex: 1000,
    },
    reactionsButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
    },
    reactionsButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    closeButton: {
        fontSize: 20,
        color: '#999',
        padding: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: themeColors.primary,
    },
    tabText: {
        fontSize: 14,
        color: '#333',
    },
    listContainer: {
        flex: 1,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userName: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    timeStamp: {
        fontSize: 12,
        color: '#999',
    },
});

export default ViewStoryScreen;
