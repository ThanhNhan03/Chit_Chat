import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    ScrollView,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { Dimensions } from 'react-native';
import { solidColors, textColors, getContrastTextColor } from '../config/colorConfig';
import { useFonts } from 'expo-font';
import { Music } from '../src/API';
import { generateClient } from 'aws-amplify/api';
import { listMusic } from '../src/graphql/queries';
import { Audio } from 'expo-av';
import MusicPicker from '../components/MusicPicker';
import { AppState } from 'react-native';

Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false
});

const { width, height } = Dimensions.get('window');

const client = generateClient();

interface EditStoryScreenProps {
    route: {
        params: {
            imageUri?: string;
            mode?: 'text' | 'image';
            backgroundColor?: string;
        };
    };
    navigation: any;
}

interface TextOverlay {
    id: string;
    text: string;
    position: {
        x: number;
        y: number;
    };
}

const EditStoryScreen = ({ route, navigation }: EditStoryScreenProps) => {
    const { imageUri, mode, backgroundColor } = route.params;
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [currentBgColor, setCurrentBgColor] = useState(backgroundColor || themeColors.primary);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showMusicPicker, setShowMusicPicker] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [musicList, setMusicList] = useState<Music[]>([]);
    const [isLoadingMusic, setIsLoadingMusic] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);
    const [isPlayingOnStory, setIsPlayingOnStory] = useState(false);

    // Cleanup function
    const stopSound = useCallback(async () => {
        if (sound) {
            try {
                const status = await sound.getStatusAsync();
                if (status.isLoaded) {
                    await sound.stopAsync();
                }
                await sound.unloadAsync();
                setSound(null);
                setPlayingMusicId(null);
            } catch (error) {
                console.error('Error stopping sound:', error);
                setSound(null);
                setPlayingMusicId(null);
            }
        }
    }, [sound]);

    // Update handleSelectMusic to auto play
    const handleSelectMusic = useCallback(async (music: Music) => {
        try {
            // Stop current sound if any
            await stopSound();
            setSelectedMusic(music);
            setShowMusicPicker(false);

            // Auto play the selected music
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(
                { uri: music.url },
                { shouldPlay: true }  // Auto play
            );
            
            setSound(soundObject);
            setIsPlayingOnStory(true);

            // Add status update listener
            soundObject.setOnPlaybackStatusUpdate((status) => {
                if (status && 'didJustFinish' in status && status.didJustFinish) {
                    setIsPlayingOnStory(false);
                    // Optional: Loop the music
                    // soundObject.replayAsync();
                }
            });
        } catch (error) {
            console.error('Error auto playing selected music:', error);
            setIsPlayingOnStory(false);
        }
    }, [stopSound]);

    // Update cleanup to handle all states
    useEffect(() => {
        return () => {
            if (sound) {
                stopSound();
                setIsPlayingOnStory(false);
            }
        };
    }, [sound, stopSound]);

    // Add background/foreground handling (optional)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                // Pause when app goes to background
                if (sound && isPlayingOnStory) {
                    sound.pauseAsync();
                    setIsPlayingOnStory(false);
                }
            }
        });

        return () => {
            subscription.remove();
        };
    }, [sound, isPlayingOnStory]);

    const fetchMusic = async () => {
        try {
            setIsLoadingMusic(true);
            const result = await client.graphql({
                query: listMusic,
                variables: {
                    limit: 50
                }
            });
            setMusicList(result.data.listMusic.items);
        } catch (error) {
            console.error('Error fetching music:', error);
        } finally {
            setIsLoadingMusic(false);
        }
    };

    const handlePlayPreview = useCallback(async (music: Music) => {
        try {
            // If the same music is playing, stop it
            if (playingMusicId === music.id) {
                await stopSound();
                return;
            }

            // Stop current sound if any
            await stopSound();

            // Create and load new sound
            const soundObject = new Audio.Sound();
            try {
                await soundObject.loadAsync(
                    { uri: music.url },
                    { shouldPlay: false } // Change to false initially
                );
                
                setSound(soundObject);
                setPlayingMusicId(music.id);

                // Start playing after everything is set up
                await soundObject.playAsync();

                // Add status update listener
                soundObject.setOnPlaybackStatusUpdate((status) => {
                    if (status && 'didJustFinish' in status && status.didJustFinish) {
                        setPlayingMusicId(null);
                    }
                });
            } catch (loadError) {
                console.error('Error loading sound:', loadError);
                if (soundObject) {
                    try {
                        await soundObject.unloadAsync();
                    } catch (unloadError) {
                        console.error('Error unloading sound:', unloadError);
                    }
                }
                setSound(null);
                setPlayingMusicId(null);
            }
        } catch (error) {
            console.error('Error in handlePlayPreview:', error);
            setSound(null);
            setPlayingMusicId(null);
        }
    }, [playingMusicId, stopSound]);

    const handleMusicPress = () => {
        setShowMusicPicker(true);
        fetchMusic();
    };

    const handleCloseMusicPicker = async () => {
        await stopSound();
        setShowMusicPicker(false);
    };

    // Update renderSelectedMusic with replay option
    const renderSelectedMusic = () => {
        if (!selectedMusic) return null;
        
        return (
            <View style={styles.selectedMusicContainer}>
                <View style={styles.selectedMusicContent}>
                    <TouchableOpacity 
                        style={[
                            styles.playStoryButton,
                            isPlayingOnStory && styles.playingButton
                        ]}
                        onPress={handlePlayOnStory}
                    >
                        <Icon 
                            name={isPlayingOnStory ? "pause" : "play"} 
                            size={20} 
                            color="#fff" 
                        />
                    </TouchableOpacity>

                    <Image 
                        source={{ uri: selectedMusic.cover_image || undefined }} 
                        style={styles.miniMusicCover}
                        defaultSource={require('../assets/icon.png')}
                    />
                    
                    <View style={styles.selectedMusicInfo}>
                        <Text style={styles.selectedMusicTitle} numberOfLines={1}>
                            {selectedMusic.title}
                        </Text>
                        <Text style={styles.selectedMusicArtist} numberOfLines={1}>
                            {selectedMusic.artist}
                        </Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.removeMusicButton}
                        onPress={() => {
                            stopSound();
                            setSelectedMusic(null);
                            setIsPlayingOnStory(false);
                        }}
                    >
                        <Icon name="close-circle" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderColorPicker = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.colorPickerContainer}
        >
            {solidColors.map((color) => (
                <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => {
                        setCurrentBgColor(color);
                        setTextColor(getContrastTextColor(color));
                    }}
                />
            ))}
        </ScrollView>
    );

    const handlePlayOnStory = async () => {
        if (!selectedMusic) return;

        try {
            if (isPlayingOnStory) {
                if (sound) {
                    await sound.pauseAsync();
                }
                setIsPlayingOnStory(false);
            } else {
                if (sound) {
                    await sound.playAsync();
                } else {
                    const soundObject = new Audio.Sound();
                    await soundObject.loadAsync(
                        { uri: selectedMusic.url },
                        { shouldPlay: true }
                    );
                    setSound(soundObject);

                    // Add status update listener
                    soundObject.setOnPlaybackStatusUpdate((status) => {
                        if (status && 'didJustFinish' in status && status.didJustFinish) {
                            setIsPlayingOnStory(false);
                        }
                    });
                }
                setIsPlayingOnStory(true);
            }
        } catch (error) {
            console.error('Error playing music on story:', error);
        }
    };

    if (mode === 'text') {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: currentBgColor }]}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <TouchableOpacity 
                            style={styles.headerIcon}
                            onPress={() => setShowColorPicker(!showColorPicker)}
                        >
                            <Icon name="color-palette" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.headerIcon}
                            onPress={handleMusicPress}
                        >
                            <Icon name="musical-notes" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Icon name="text" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.textStoryContainer}>
                    <TextInput
                        style={[styles.storyTextInput, { color: textColor }]}
                        placeholder="Type your story..."
                        placeholderTextColor="rgba(255,255,255,0.8)"
                        multiline
                        value={text}
                        onChangeText={setText}
                        autoFocus
                    />
                </View>

                {showColorPicker && renderColorPicker()}

                <View style={styles.bottomTools}>
                    <View style={styles.toolsRow}>
                        <TouchableOpacity style={styles.shareButton}>
                            <Text style={styles.shareButtonText}>Share now</Text>
                            <Icon name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.headerIcon}
                        onPress={handleMusicPress}
                    >
                        <Icon name="musical-notes" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Icon name="text" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Icon name="happy-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                {renderSelectedMusic()}
            </View>

            <View style={styles.bottomTools}>
                <View style={styles.toolsRow}>
                    <TouchableOpacity style={styles.shareButton}>
                        <Text style={styles.shareButtonText}>Share now</Text>
                        <Icon name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {showMusicPicker && (
                <MusicPicker
                    musicList={musicList}
                    playingMusicId={playingMusicId}
                    selectedMusic={selectedMusic}
                    onClose={() => setShowMusicPicker(false)}
                    onPlayPreview={handlePlayPreview}
                    onSelectMusic={handleSelectMusic}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        marginTop: height * 0.02,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 20,
        borderRadius: 100,
        backgroundColor: themeColors.primary,
        padding: 5,
        opacity: 0.8,
     
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    bottomTools: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    toolsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    shareButton: {
        backgroundColor: themeColors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    backButton: {
        borderRadius: 100,
        backgroundColor: themeColors.primary,
        padding: 5,
        opacity: 0.8,
    },
    textInputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: themeColors.primary,
    },
    textInput: {
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: themeColors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    textInputButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textButton: {
        padding: 12,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themeColors.primary,
    },
    addButton: {
        backgroundColor: themeColors.primary,
    },
    textButtonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textOverlay: {
        position: 'absolute',
        padding: 10,
        minWidth: 100,
    },
    overlayText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    textStoryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    storyTextInput: {
        fontSize: 32,
        textAlign: 'center',
        color: '#fff',
        width: '100%',
        maxHeight: '80%',
    },
    colorPickerContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    selectedMusicContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    selectedMusicContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    miniMusicCover: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
    },
    selectedMusicInfo: {
        flex: 1,
    },
    selectedMusicTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedMusicArtist: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    removeMusicButton: {
        padding: 5,
    },
    playStoryButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: themeColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    playingButton: {
        backgroundColor: themeColors.secondary, // Visual feedback for playing state
    },
});

export default EditStoryScreen;