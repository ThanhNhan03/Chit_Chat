import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
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
    ScrollView,
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
import { sendReactionNotification } from '../utils/notificationHelper';

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
    user?: {
        id: string;
        name: string;
        profile_picture?: string;
    };
}

interface ReactionsDisplayProps {
    reactions: StoryReaction[];
    isStoryOwner: boolean;
    currentUserId: string;
}

interface GetUserResponse {
    getUser: {
        id: string;
        push_token?: string;
    };
}


const ReactionsDisplay = React.memo(({ reactions, isStoryOwner, currentUserId }: ReactionsDisplayProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Sử dụng useMemo để tránh tính toán lại không cần thiết
    const myReactions = useMemo(() => {
        const userReactions = reactions.filter(reaction => reaction.user_id === currentUserId);
        return userReactions.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [reactions, currentUserId]);

    useEffect(() => {
        // Reset và chạy animation khi reactions thay đổi
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [myReactions.length]); // Chỉ chạy khi số lượng reactions thay đổi

    if (isStoryOwner || myReactions.length === 0) return null;

    return (
        <Animated.View style={[styles.reactionsContainer]}>
            <View style={styles.reactionsBubble}>
                <View style={styles.emojisContainer}>
                    {myReactions.map((reaction, index) => (
                        <Text 
                            key={`${reaction.id}-${index}`}
                            style={styles.reactionEmoji}
                        >
                            {reaction.icon}
                        </Text>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
});

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

    // Thêm ref để lưu giá trị progress hiện tại
    const progressValue = useRef(0);

    // Thêm state để lưu progress của từng story
    const [storyProgresses] = useState<{ [key: string]: number }>({});

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
                limit: 1000  # Tăng limit nếu cn
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
        // Tạm dừng khi mở modal
        if (!showViewers) {
            setIsPaused(true);
            progress.stopAnimation(value => {
                progressRef.current = value;
            });
            if (sound) {
                sound.pauseAsync();
            }
        } else {
            // Tiếp tục khi đóng modal
            setIsPaused(false);
            if (sound) {
                sound.playAsync();
            }
            startProgress();
        }
    };

    const handlePrevious = async () => {
        if (currentIndex > 0) {
            // Reset animation state
            setIsAnimating(false);
            
            // Stop current progress animation
            progress.stopAnimation();
            progress.setValue(0);
            
            // Cleanup current sound
            await cleanupSound();
            
            // Update index
            setCurrentIndex(currentIndex - 1);
            setShowReactions(false);
            setCurrentReaction(null);
            
            // Reset progress for new story
            storyProgresses[currentStory.id] = 0;
        }
    };

    const handleNext = async () => {
        if (currentIndex < stories.length - 1) {
            // Reset animation state
            setIsAnimating(false);
            
            // Stop current progress animation
            progress.stopAnimation();
            progress.setValue(0);
            
            // Cleanup current sound
            await cleanupSound();
            
            // Update index
            setCurrentIndex(currentIndex + 1);
            setShowReactions(false);
            setCurrentReaction(null);
            
            // Reset progress for new story
            storyProgresses[currentStory.id] = 0;
        } else {
            handleBack();
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

    // Thêm state để theo dõi trạng thái tạm dừng
    const [isPaused, setIsPaused] = useState(false);
    const [hasFloatingReactions, setHasFloatingReactions] = useState(false);
    const progressRef = useRef(0);

    // Thêm hàm xử lý khi animation hoàn thành
    const handleAnimationComplete = () => {
        if (!hasFloatingReactions) {
            setIsPaused(false);
            if (sound) {
                sound.playAsync();
            }
        }
    };

    // Sửa lại hàm startProgress để đảm bảo animation luôn bắt đầu từ đầu
    const startProgress = () => {
        if (isAnimating) return;
        
        progress.setValue(0);
        
        Animated.timing(progress, {
            toValue: 1,
            duration: (currentStory.duration || 5) * 1000,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished && !isAnimating) {
                handleNext();
            }
        });
    };

    // Thêm listener cho progress
    useEffect(() => {
        const listener = progress.addListener(({ value }) => {
            progressValue.current = value;
        });

        return () => {
            progress.removeListener(listener);
        };
    }, []);

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

                    // X lý loop nhạc
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

    // Thêm state đ theo dõi trạng thái animation
    const [isAnimating, setIsAnimating] = useState(false);

    // Thêm state để theo dõi trạng thái animation của reaction
    const [isReactionAnimating, setIsReactionAnimating] = useState(false);

    // Sửa lại hàm handleReaction
    const handleReaction = async (icon: string) => {
        if (!user?.userId || user.userId === currentStory.user_id) return;
        
        try {
            if (notifiedStories.has(currentStory.id)) {
                // console.log('Notification already sent for this story.');
                return;
            }

            // Tạm dừng progress và âm thanh khi bắt đầu animation
            setIsReactionAnimating(true);
            progress.stopAnimation(value => {
                progressRef.current = value;
            });
            if (sound) {
                await sound.pauseAsync();
            }

            // Kiểm tra xem reaction đã tồn tại chưa
            const existingReaction = storyReactions.find(
                reaction => reaction.user_id === user.userId && reaction.icon === icon
            );

            if (existingReaction) {
                setStoryReactions(prev => [
                    {
                        ...existingReaction,
                        created_at: new Date().toISOString()
                    },
                    ...prev.filter(r => r.id !== existingReaction.id)
                ]);
                setCurrentReaction(icon);
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
                    setStoryReactions(prev => [
                        {
                            id: response.data.createStoryReaction.id,
                            story_id: response.data.createStoryReaction.story_id,
                            user_id: response.data.createStoryReaction.user_id,
                            icon: response.data.createStoryReaction.icon,
                            created_at: response.data.createStoryReaction.created_at || response.data.createStoryReaction.createdAt
                        },
                        ...prev
                    ]);

                    // Thêm logs để debug
                    console.log('Getting story owner push token...');
                    const storyOwnerPushToken = await getStoryOwnerPushToken(currentStory.user_id);
                    console.log('Story owner push token:', storyOwnerPushToken);

                    if (storyOwnerPushToken) {
                        console.log('Sending reaction notification...');
                        const GET_USER_NAME = `
                            query GetUser($id: ID!) {
                                getUser(id: $id) {
                                    id
                                    name
                                }
                            }
                        `;

                        const userResponse = await client.graphql({
                            query: GET_USER_NAME,
                            variables: { id: user.userId },
                            authMode: 'apiKey'
                        }) as GraphQLResult<{ getUser: { name: string } }>;

                        const userName = userResponse.data?.getUser?.name || 'Someone';

                        await sendReactionNotification({
                            expoPushToken: storyOwnerPushToken,
                            reactorName: userName,
                            storyId: currentStory.id,
                            storyOwnerId: currentStory.user_id
                        });
                        // console.log('Reaction notification sent successfully');

                        // Add story ID to the set to prevent future notifications
                        setNotifiedStories(prev => new Set(prev).add(currentStory.id));
                    } else {
                        console.log('No push token found for story owner');
                    }
                }
            }
        } catch (error) {
            console.error('Error handling reaction:', error);
            // Nếu có lỗi, vẫn tiếp tục phát story
            setIsReactionAnimating(false);
            if (sound) {
                await sound.playAsync();
            }
            startProgress();
        }
    };

    // Function to get the story owner's push token
    const getStoryOwnerPushToken = async (userId: string) => {
        try {
            // Thêm query để lấy push token của user
            const GET_USER_PUSH_TOKEN = `
                query GetUser($id: ID!) {
                    getUser(id: $id) {
                        id
                        push_token
                    }
                }
            `;

            const response = await client.graphql({
                query: GET_USER_PUSH_TOKEN,
                variables: { id: userId },
                authMode: 'apiKey'
            }) as GraphQLResult<GetUserResponse>;

            return response.data?.getUser?.push_token || null;
        } catch (error) {
            console.error('Error getting user push token:', error);
            return null;
        }
    };

    // Sửa lại useEffect để theo dõi isReactionAnimating
    useEffect(() => {
        if (!isReactionAnimating && currentStory?.id) {
            // Tiếp tục phát story khi animation kết thúc
            if (sound) {
                sound.playAsync();
            }
            progress.setValue(progressRef.current);
            Animated.timing(progress, {
                toValue: 1,
                duration: (currentStory.duration || 5) * 1000 * (1 - progressRef.current),
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished) {
                    handleNext();
                }
            });
        }
    }, [isReactionAnimating, currentStory]);

    // Sửa lại useEffect subscription
    useEffect(() => {
        const sub = client.graphql({
            query: onCreateStoryReaction,
            variables: { filter: { story_id: { eq: currentStory.id } } }
        }).subscribe({
            next: ({ data }) => {
                if (data?.onCreateStoryReaction && data.onCreateStoryReaction.icon) {
                    setStoryReactions(prev => {
                        // Kiểm tra nếu reaction đã tồn tại (cùng user và cùng icon)
                        const exists = prev.some(r => 
                            r.user_id === data.onCreateStoryReaction.user_id && 
                            r.icon === data.onCreateStoryReaction.icon
                        );
                        
                        // Nếu đã tồn tại, không thêm vào nữa
                        if (exists) return prev;

                        // Nếu chưa tồn tại, thêm vào đầu mảng
                        return [{
                            id: data.onCreateStoryReaction.id,
                            story_id: data.onCreateStoryReaction.story_id,
                            user_id: data.onCreateStoryReaction.user_id,
                            icon: data.onCreateStoryReaction.icon,
                            created_at: data.onCreateStoryReaction.created_at || data.onCreateStoryReaction.createdAt,
                            user: data.onCreateStoryReaction.user ? {
                                id: data.onCreateStoryReaction.user.id,
                                name: data.onCreateStoryReaction.user.name || 'Unknown',
                                profile_picture: data.onCreateStoryReaction.user.profile_picture
                            } : undefined
                        }, ...prev];
                    });
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

    
    // Sửa lại useEffect để theo dõi isPaused
    useEffect(() => {
        if (!isPaused && currentStory?.id) {
            if (sound) {
                sound.playAsync();
            }
            startProgress();
        }
    }, [isPaused, currentStory]);

    // Sửa lại useEffect để theo dõi progress
    useEffect(() => {
        if (!isPaused && currentStory?.id) {
            const duration = (currentStory.duration || 5) * 1000 * (1 - progressRef.current);
            progress.setValue(progressRef.current);
            
            Animated.timing(progress, {
                toValue: 1,
                duration: duration,
                useNativeDriver: false,
            }).start(({ finished }) => {
                if (finished && !isPaused) {
                    handleNext();
                }
            });
        } else {
            progress.stopAnimation(value => {
                progressRef.current = value;
            });
        }
    }, [isPaused, currentStory]);

    const [notifiedStories, setNotifiedStories] = useState<Set<string>>(new Set());

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
                        <Text style={styles.storyUsername}>
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
                <View style={styles.musicInfoContainer}>
                    {currentStory.music.cover_image ? (
                        <Image
                            source={{ uri: currentStory.music.cover_image }}
                            style={styles.musicCover}
                        />
                    ) : (
                        <View style={styles.musicIcon}>
                            <Icon name="musical-notes" size={20} color="#fff" />
                        </View>
                    )}
                    <View style={styles.musicTextContainer}>
                        <Text numberOfLines={1} style={styles.musicTitle}>
                            {currentStory.music.title}
                        </Text>
                        {currentStory.music.artist && (
                            <Text numberOfLines={1} style={styles.musicArtist}>
                                {currentStory.music.artist}
                            </Text>
                        )}
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
                reactions={storyReactions as APIStoryReaction[]}
                onClose={toggleViewers}
                formatTimeAgo={formatTimeAgo}
            />

            {/* Reaction picker modal - only show for non-owners */}
            {user?.userId !== currentStory.user_id && (
                <ReactionPicker
                    isVisible={true}
                    onSelectReaction={handleReaction}
                    currentReaction={currentReaction}
                    isCurrentUser={currentStory?.user_id === user?.userId}
                    onAnimationComplete={() => {
                        setIsReactionAnimating(false);
                    }}
                />
            )}

            {/* Display Reactions in bottom left */}
            <ReactionsDisplay 
                reactions={storyReactions}
                isStoryOwner={currentStory?.user_id === user?.userId}
                currentUserId={user?.userId}
            />
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
    storyUsername: {
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
    musicInfoContainer: {
        position: 'absolute',
        bottom: 100,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
        maxWidth: 200,
    },
    musicCover: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    musicIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    musicTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    musicTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    musicArtist: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
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
    reactionsContainer: {
        position: 'absolute',
        bottom: 70,
        left: 2,
        zIndex: 999,
    },
    reactionsBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    emojisContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reactionText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 4,
    },
    reactionEmoji: {
        fontSize: 16,
    },
});

export default ViewStoryScreen;
