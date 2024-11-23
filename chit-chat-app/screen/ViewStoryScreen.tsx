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
import { getStory } from '../src/graphql/queries';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { AuthenticatedUserContext } from '../contexts/AuthContext';
import { deleteStory } from '../src/graphql/mutations';

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

    const currentStory = stories[currentIndex];

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
});

export default ViewStoryScreen;
