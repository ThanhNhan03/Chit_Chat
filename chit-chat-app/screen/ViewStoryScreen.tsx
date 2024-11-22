import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { getStory } from '../src/graphql/queries';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { generateClient } from 'aws-amplify/api';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

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

  
  interface ViewStoryScreenProps {
      route: {
          params: {
              stories: Story[];
              initialStoryIndex: number;
              username?: string;
              userAvatar?: string;
              previousScreen?: string;
          };
      };
      navigation: any;
  }
  

const ViewStoryScreen = ({ route, navigation }: ViewStoryScreenProps) => {
    const { stories, initialStoryIndex, username, userAvatar, previousScreen } = route.params;
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [progress] = useState(new Animated.Value(0));
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

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

    useEffect(() => {
        const loadStory = async () => {
            await cleanupSound(); 
            startProgress();
            await loadAndPlayMusic();
        };
        
        loadStory();

        // Thêm cleanup function cho useEffect
        return () => {
            cleanupSound();
            progress.stopAnimation();
            // Đảm bảo sound được cleanup khi component unmount
            if (sound) {
                sound.stopAsync().then(() => {
                    sound.unloadAsync();
                }).catch(error => {
                    console.error('Error cleaning up sound:', error);
                });
            }
        };
    }, [currentIndex]);

    const cleanupSound = async () => {
        if (sound) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
                setIsPlaying(true); // Reset trạng thái playing
            } catch (error) {
                console.error('Error cleaning up sound:', error);
            }
        }
    };

    const loadAndPlayMusic = async () => {
        if (currentStory.music_id) {
            try {
                const response = await client.graphql({
                    query: getStory,
                    variables: { id: currentStory.id },
                    authMode: 'apiKey'
                });

                const storyWithMusic = response.data.getStory;
                
                if (storyWithMusic?.music) {
                    currentStory.music = storyWithMusic.music;
                }

                if (storyWithMusic?.music?.url) {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: storyWithMusic.music.url },
                        { 
                            positionMillis: (storyWithMusic.music_start_time || 0) * 1000,
                            shouldPlay: true,
                            volume: 1.0
                        }
                    );
                    setSound(newSound);

                    // Thêm cleanup khi story kết thúc
                    const storyDuration = currentStory.duration * 1000 || 5000;
                    setTimeout(async () => {
                        if (newSound) {
                            await newSound.stopAsync();
                            await newSound.unloadAsync();
                        }
                    }, storyDuration);

                    newSound.setOnPlaybackStatusUpdate(async (status: AVPlaybackStatus) => {
                        if (!status.isLoaded) return;
                        
                        if (status.positionMillis >= (storyWithMusic.music_end_time || 0) * 1000) {
                            await newSound.setPositionAsync((storyWithMusic.music_start_time || 0) * 1000);
                            if (status.isPlaying) await newSound.playAsync();
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading music:', error);
            }
        }
    };

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
                    <Image 
                        source={{ uri: userAvatar }} 
                        style={styles.userAvatar} 
                    />
                    <Text style={styles.username}>{username}</Text>
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
                    <View style={styles.musicIcon}>
                        <Icon name="musical-notes" size={16} color="#fff" />
                    </View>
                    <Text style={styles.musicText} numberOfLines={1}>
                        {currentStory.music.title} {currentStory.music.artist ? `- ${currentStory.music.artist}` : ''}
                    </Text>
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
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },
    musicText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    musicIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ViewStoryScreen;
