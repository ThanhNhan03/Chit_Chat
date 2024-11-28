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
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { getStory, storyReactionsByStory_id } from '../src/graphql/queries';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { AuthenticatedUserContext } from '../contexts/AuthContext';
import { createStoryReaction, deleteStory, deleteStoryReaction } from '../src/graphql/mutations';
import StoryViewers from '../components/StoryViewers';
import ViewsCounter from '../components/ViewsCounter';
import ReactionPicker from '../components/ReactionPicker';
import { StoryReaction as APIStoryReaction } from '../src/API';
import { onCreateStoryReaction } from '../src/graphql/subscriptions';

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

const CREATE_STORY_VIEW = `
  mutation CreateStoryView(
    $input: CreateStoryViewInput!
  ) {
    createStoryView(input: $input) {
      id
      story_id
      user_id
      viewed_at
      user {
        id
        name
        profile_picture
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

interface StoryViewsResponse {
    listStoryViews: {
        items: Array<{
            id: string;
            viewed_at: string;
            user?: {
                id: string;
                name: string;
                profile_picture?: string;
            };
        }>;
    };
}

// Update the local StoryReaction interface
interface StoryReaction {
    id: string;
    story_id: string;
    user_id: string;
    icon: string;  // Make icon required
    created_at: string;
    createdAt?: string;
    updatedAt?: string;
}

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
    
    const [stories, setStories] = useState(() => 
        [...originalStories].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    );
    const [currentIndex, setCurrentIndex] = useState(() => {
        if (initialStoryIndex === 0) return 0;
        const targetStory = originalStories[initialStoryIndex];
        return stories.findIndex(story => story.id === targetStory.id);
    });

    // Di chuyển khai báo currentStory lên đây
    const currentStory = stories[currentIndex];

    const [progress] = useState(new Animated.Value(0));
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [storyViews, setStoryViews] = useState<Array<{
        id: string;
        viewed_at: string;
        user?: {
            id: string;
            name: string;
            profile_picture?: string;
        };
    }>>([]);
    const [showViewers, setShowViewers] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);
    const isMountedRef = useRef(true);

    const createStoryView = async () => {
        if (!user?.userId || isCurrentUser) return;

        try {
        
            const checkResponse = await client.graphql({
                query: GET_STORY_VIEWS,
                variables: { 
                    story_id: currentStory.id 
                },
                authMode: 'apiKey'
            }) as GraphQLResult<StoryViewsResponse>;

            const existingView = checkResponse.data?.listStoryViews?.items.find(
                view => view.user?.id === user.userId
            );

            if (!existingView) {
                const input = {
                    story_id: currentStory.id,
                    user_id: user.userId,
                    viewed_at: new Date().toISOString()
                };

                await client.graphql({
                    query: CREATE_STORY_VIEW,
                    variables: { input },
                    authMode: 'apiKey'
                });
            } else {
                
            }

        } catch (error) {
            console.error('Error handling story view:', error);
        }
    };

    useEffect(() => {
        if (currentStory?.id) {
            createStoryView();
        }
    }, [currentStory?.id]);

    // Thêm query để lấy story views
    const GET_STORY_VIEWS = `
        query GetStoryViews($story_id: ID!) {
            listStoryViews(
                filter: {story_id: {eq: $story_id}}
                limit: 1000  # Tăng limit nếu cần
            ) {
                items {
                    id
                    viewed_at
                    user {
                        id
                        name
                        profile_picture
                    }
                }
            }
        }
    `;

    // Thêm function để fetch story views với type annotation
    const fetchStoryViews = async () => {
        if (!isCurrentUser) return;
        
        try {
            const response = await client.graphql({
                query: GET_STORY_VIEWS,
                variables: { 
                    story_id: currentStory.id 
                },
                authMode: 'apiKey'
            }) as GraphQLResult<StoryViewsResponse>;
            
            if (response.data?.listStoryViews?.items) {
                const sortedViews = response.data.listStoryViews.items.sort((a, b) => 
                    new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
                );
                setStoryViews(sortedViews);
            }
        } catch (error) {
            console.error('Error fetching story views:', error);
        }
    };

    useEffect(() => {
        if (isCurrentUser && currentStory?.id) {
            fetchStoryViews();
        }
    }, [currentStory?.id, isCurrentUser]);

    const toggleViewers = () => {
        setShowViewers(!showViewers);
    };

    const handleNext = async () => {
        if (currentIndex < stories.length - 1) {
            await cleanupSound();
            setCurrentIndex(currentIndex + 1);
            setShowReactions(false);
            setCurrentReaction(null);
        } else {
            handleBack();
        }
    };

    const handlePrevious = async () => {
        if (currentIndex > 0) {
            await cleanupSound();
            setCurrentIndex(currentIndex - 1);
            setShowReactions(false);
            setCurrentReaction(null);
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
        if (!user?.userId || !currentStory || user.userId !== currentStory.user_id) {
            console.log('Unauthorized to delete this story');
            return;
        }

        Alert.alert(
            "Delete Story",
            "Are you sure you want to delete this story?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Store necessary data before deletion
                            const storyIdToDelete = currentStory.id;
                            const newStories = stories.filter(s => s.id !== storyIdToDelete);
                            
                            // Navigate back if this is the last story
                            if (newStories.length === 0) {
                                await cleanupSound();
                                progress.stopAnimation();
                                navigation.goBack();
                                
                                // Delete after navigation
                                await client.graphql({
                                    query: deleteStory,
                                    variables: {
                                        input: { id: storyIdToDelete }
                                    }
                                });
                                return;
                            }

                            // Update state first
                            const newIndex = currentIndex >= newStories.length ? newStories.length - 1 : currentIndex;
                            setCurrentIndex(newIndex);
                            setStories(newStories);

                            // Then delete from backend
                            await client.graphql({
                                query: deleteStory,
                                variables: {
                                    input: { id: storyIdToDelete }
                                }
                            });

                        } catch (error) {
                            console.error('Error deleting story:', error);
                            Alert.alert("Error", "Failed to delete story. Please try again.");
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

    const [showReactions, setShowReactions] = useState(false);
    const [currentReaction, setCurrentReaction] = useState<string | null>(null);
    const [storyReactions, setStoryReactions] = useState<StoryReaction[]>([]);

    // Fetch reactions khi component mount
    useEffect(() => {
        if (currentStory?.id) {
            fetchStoryReactions();
        }
    }, [currentStory?.id]);

    const fetchStoryReactions = async () => {
        try {
            const response = await client.graphql({
                query: storyReactionsByStory_id,
                variables: { story_id: currentStory.id },
                authMode: 'apiKey'
            });
            
            if (response.data?.storyReactionsByStory_id?.items) {
                setStoryReactions(response.data.storyReactionsByStory_id.items
                    .filter(item => item.icon) // Filter out items without icon
                    .map(item => ({
                        ...item,
                        icon: item.icon!, // Assert icon is non-null
                        created_at: item.created_at || item.createdAt
                    }))
                );
                // Set current user's reaction if exists
                const userReaction = response.data.storyReactionsByStory_id.items
                    .find(reaction => reaction.user_id === user?.userId);
                setCurrentReaction(userReaction?.icon || null);
            }
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleReaction = async (icon: string) => {
        if (!user?.userId || user.userId === currentStory.user_id) return;
        
        try {
            if (currentReaction === icon) {
                const existingReaction = storyReactions.find(
                    r => r.user_id === user.userId
                );
                
                if (existingReaction) {
                    await client.graphql({
                        query: deleteStoryReaction,
                        variables: { 
                            input: { id: existingReaction.id }
                        },
                        authMode: 'apiKey'
                    });
                    
                    setCurrentReaction(null);
                    setStoryReactions(prev => 
                        prev.filter(r => r.id !== existingReaction.id)
                    );
                }
            } else {
                const input = {
                    story_id: currentStory.id,
                    user_id: user.userId,
                    icon: icon,
                    created_at: new Date().toISOString()
                };

                const response = await client.graphql({
                    query: createStoryReaction,
                    variables: { input },
                    authMode: 'apiKey'
                });

                if (response.data?.createStoryReaction) {
                    setCurrentReaction(icon);
                    setStoryReactions(prev => [...prev, {
                        id: response.data.createStoryReaction.id,
                        story_id: response.data.createStoryReaction.story_id,
                        user_id: response.data.createStoryReaction.user_id,
                        icon: response.data.createStoryReaction.icon,
                        created_at: response.data.createStoryReaction.created_at || response.data.createStoryReaction.createdAt
                    }]);
                }
            }
            setShowReactions(false);
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };

    // Add subscription for real-time updates
    useEffect(() => {
        const sub = client.graphql({
            query: onCreateStoryReaction,
            variables: { filter: { story_id: { eq: currentStory.id } } }
        }).subscribe({
            next: ({ data }) => {
                if (data?.onCreateStoryReaction && data.onCreateStoryReaction.icon) {
                    setStoryReactions(prev => [...prev, {
                        ...data.onCreateStoryReaction,
                        icon: data.onCreateStoryReaction.icon,
                        created_at: data.onCreateStoryReaction.created_at || data.onCreateStoryReaction.createdAt
                    }]);
                }
            },
            error: error => console.error('Subscription error:', error)
        });

        return () => {
            sub.unsubscribe();
        };
    }, [currentStory.id]);

    // Thêm useEffect để kiểm tra reaction hiện tại khi story thay đổi
    useEffect(() => {
        if (currentStory && user?.userId) {
            const userReaction = storyReactions.find(r => r.user_id === user.userId);
            setCurrentReaction(userReaction?.icon || null);
        }
    }, [currentStory, storyReactions]);

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
            <TouchableWithoutFeedback onPress={handleTouchStart}>
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

            {/* Story Views Counter */}
            {isCurrentUser && (
                <ViewsCounter 
                    count={storyViews.length}
                    onPress={toggleViewers}
                />
            )}

            {/* Story Viewers Modal */}
            <StoryViewers 
                isVisible={showViewers}
                viewers={storyViews}
                reactions={storyReactions}
                onClose={toggleViewers}
                formatTimeAgo={formatTimeAgo}
            />

            {/* Add reaction button */}
            <TouchableOpacity 
                style={styles.reactionButton}
                onPress={() => setShowReactions(true)}
            >
                <Icon name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Reaction picker modal */}
            {showReactions && (
                <ReactionPicker
                    isVisible={showReactions}
                    onSelectReaction={handleReaction}
                    currentReaction={currentReaction}
                    onClose={() => setShowReactions(false)}
                    isCurrentUser={currentStory?.user_id === user?.userId}
                />
            )}

            {/* Show reactions count for story owner */}
            {user?.userId === currentStory.user_id && (
                <TouchableOpacity 
                    style={styles.reactionsCounter}
                    onPress={() => setShowReactions(true)}
                >
                    <Text style={styles.reactionsText}>
                        {storyReactions.length} reactions
                    </Text>
                </TouchableOpacity>
            )}
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
    closeButton: {
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
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    reactionsCounter: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
    },
    reactionsText: {
        color: '#fff',
        fontSize: 12,
    },
});

export default ViewStoryScreen;
