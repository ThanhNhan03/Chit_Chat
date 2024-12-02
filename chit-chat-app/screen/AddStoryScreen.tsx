import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    Modal,
    Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Icon from '@expo/vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { themeColors } from '../config/themeColor';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PhotoItemProps {
    item: {
        uri: string;
        id: string;
    };
    onPress: (uri: string) => void;
}
interface Album {
    id: string;
    title: string;
    assetCount: number;
  }

const AddStoryScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [recentPhotos, setRecentPhotos] = useState<MediaLibrary.Asset[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
    const [showAlbumPicker, setShowAlbumPicker] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                loadRecentPhotos();
            }
        })();
    }, []);

    useEffect(() => {
        loadAlbums();
    }, []);

    useEffect(() => {
        if (recentPhotos.length === 0 && hasMore) {
            loadRecentPhotos();
        }
    }, [recentPhotos.length, hasMore]);

    const loadAlbums = async () => {
        try {
            const albumsResult = await MediaLibrary.getAlbumsAsync();
            setAlbums(albumsResult);
        } catch (error) {
            console.log('Error loading albums:', error);
        }
    };

    const loadRecentPhotos = async () => {
        if (!hasMore || isLoading) return;
        
        try {
            setIsLoading(true);
            const options = {
                mediaType: MediaLibrary.MediaType.photo,
                sortBy: [MediaLibrary.SortBy.creationTime],
                first: 50,
                after: endCursor,
            };

            if (selectedAlbum) {
                const { assets, endCursor: newCursor, hasNextPage } = await MediaLibrary.getAssetsAsync({
                    ...options,
                    album: selectedAlbum,
                });
                setRecentPhotos(prev => [...prev, ...assets]);
                setEndCursor(newCursor);
                setHasMore(hasNextPage);
            } else {
                const { assets, endCursor: newCursor, hasNextPage } = await MediaLibrary.getAssetsAsync(options);
                setRecentPhotos(prev => [...prev, ...assets]);
                setEndCursor(newCursor);
                setHasMore(hasNextPage);
            }
        } catch (error) {
            console.log('Error loading photos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            navigation.navigate('EditStory', { imageUri: result.assets[0].uri });
        }
    };

    const handleTextStory = () => {
        navigation.navigate('EditStory', { 
            mode: 'text', 
            backgroundColor: theme.backgroundColor
        });
    };

    const PhotoItem = memo(({ item, onPress }: PhotoItemProps) => (
        <TouchableOpacity
            style={styles.photoItem}
            onPress={() => onPress(item.uri)}
        >
            <Image
                source={{ uri: item.uri }}
                style={styles.photo}
                fadeDuration={0}
                resizeMode="cover"
            />
        </TouchableOpacity>
    ));

    const handlePhotoPress = useCallback((uri: string) => {
        navigation.navigate('EditStory', { imageUri: uri });
    }, [navigation]);

    const renderPhotoItem = useCallback(({ item }) => (
        <PhotoItem item={item} onPress={handlePhotoPress} />
    ), [handlePhotoPress]);

    const resetPhotoState = useCallback(() => {
        setRecentPhotos([]);
        setEndCursor(undefined);
        setHasMore(true);
    }, []);

    const renderAlbumItem = useCallback(({ item }: { item: Album }) => (
        <TouchableOpacity
            style={[
                styles.albumItem,
                { backgroundColor: selectedAlbum === item.id ? theme.backgroundColor : 'transparent' }
            ]}
            onPress={() => {
                resetPhotoState();
                setSelectedAlbum(item.id);
                setShowAlbumPicker(false);
            }}
        >
            <Text style={styles.albumTitle}>{item.title}</Text>
            <Text style={styles.albumCount}>{item.assetCount} photos</Text>
        </TouchableOpacity>
    ), [selectedAlbum, resetPhotoState]);

    const AllPhotosOption = useCallback(() => (
        <TouchableOpacity
            style={[
                styles.albumItem, 
                styles.allPhotosItem,
                { backgroundColor: selectedAlbum === null ? theme.backgroundColor : 'transparent' }
            ]}
            onPress={() => {
                resetPhotoState();
                setSelectedAlbum(null);
                setShowAlbumPicker(false);
            }}
        >
            <Text style={styles.albumTitle}>All Photos</Text>
        </TouchableOpacity>
    ), [selectedAlbum, resetPhotoState]);

    const keyExtractor = useCallback((item, index) => {
        return `${selectedAlbum || 'all'}-${item.id}-${index}`;
    }, [selectedAlbum]);

    const handleLoadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            loadRecentPhotos();
        }
    }, [isLoading, hasMore]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={themeColors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColors.primary }]}>Add to story</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity 
                        style={styles.headerIcon}
                        onPress={() => setShowAlbumPicker(true)}
                    >
                        <Icon name="albums" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Icon name="checkmark" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity style={styles.optionButton} onPress={handleCamera}>
                    <View style={styles.optionIconContainer}>
                        <Icon name="camera" size={32} color="#fff" />
                    </View>
                    <Text style={[styles.optionText, { color: theme.textColor }]}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton} onPress={handleTextStory}>
                    <View style={styles.optionIconContainer}>
                        <Text style={[styles.textIcon, { color: '#fff' }]} >Aa</Text>
                    </View>
                    <Text style={[styles.optionText, { color: theme.textColor }]}>Text</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.recentPhotosContainer}>
                <FlatList
                    data={recentPhotos}
                    renderItem={renderPhotoItem}
                    keyExtractor={(item, index) => `${selectedAlbum || 'all'}-${item.id}-${index}`}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={15}
                    windowSize={5}
                    initialNumToRender={15}
                    updateCellsBatchingPeriod={30}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    getItemLayout={(data, index) => ({
                        length: screenWidth / 3,
                        offset: (screenWidth / 3) * index,
                        index,
                    })}
                />
            </View>

            <Modal
                visible={showAlbumPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAlbumPicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Album</Text>
                            <TouchableOpacity onPress={() => setShowAlbumPicker(false)}>
                                <Icon name="close" size={24} color={theme.textColor} />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            ListHeaderComponent={<AllPhotosOption />}
                            data={albums}
                            renderItem={renderAlbumItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
         padding: screenHeight * 0.02,
        marginTop: screenHeight * 0.02,
        
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    headerIcon: {
        marginLeft: 16,
    },
    optionsContainer: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-around',
    },
    optionButton: {
        alignItems: 'center',
        width: 100,
    },
    optionIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: themeColors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionText: {
        color: themeColors.text,
        fontSize: 16,
    },
    textIcon: {
        color: themeColors.background,
        fontSize: 32,
        fontWeight: 'bold',
    },
    photoItem: {
        flex: 1 / 3,
        aspectRatio: 1,
        padding: 1,
    },
    photo: {
        flex: 1,
        borderRadius: 4,
    },
    recentPhotosContainer: {
        flex: 1,
        padding: 1,
    },
    modalContainer: {
        flex: 1,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      },
      modalContent: {
        backgroundColor: themeColors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
      },
      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.border,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: themeColors.text,
      },
      albumItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.border,
      },
      albumTitle: {
        fontSize: 16,
        color: themeColors.text,
      },
      albumCount: {
        fontSize: 14,
        color: themeColors.textSecondary,
        marginTop: 4,
      },
      allPhotosItem: {
        borderBottomWidth: 1,
        borderBottomColor: themeColors.border,
    },
});

export default AddStoryScreen;