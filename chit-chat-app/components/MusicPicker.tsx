import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ScrollView, Dimensions, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { Music } from '../src/API';

const { height } = Dimensions.get('window');

interface MusicPickerProps {
    musicList: Music[];
    playingMusicId: string | null;
    selectedMusic: Music | null;
    onClose: () => void;
    onPlayPreview: (music: Music) => void;
    onSelectMusic: (music: Music) => void;
}

const MusicPicker = ({
    musicList,
    playingMusicId,
    selectedMusic,
    onClose,
    onPlayPreview,
    onSelectMusic,
}: MusicPickerProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredMusicList = musicList.filter(music => 
        music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        music.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.musicPickerContainer}>
            <View style={styles.musicPickerHeader}>
                <Text style={styles.musicPickerTitle}>Choose Music</Text>
                <TouchableOpacity onPress={onClose}>
                    <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search music or artist..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            
            <ScrollView style={styles.musicList}>
                {filteredMusicList.map((music) => (
                    <TouchableOpacity 
                        key={music.id} 
                        style={[
                            styles.musicItem,
                            selectedMusic?.id === music.id && styles.selectedMusicItem
                        ]}
                        onPress={() => onSelectMusic(music)}
                    >
                        <TouchableOpacity 
                            style={[
                                styles.playButton,
                                playingMusicId === music.id && styles.playingButton
                            ]}
                            onPress={(e) => {
                                e.stopPropagation();
                                onPlayPreview(music);
                            }}
                        >
                            <Icon 
                                name={playingMusicId === music.id ? "pause" : "play"} 
                                size={24} 
                                color="#fff" 
                            />
                        </TouchableOpacity>
                        
                        <Image 
                            source={{ uri: music.cover_image || undefined }} 
                            style={styles.musicCover}
                            defaultSource={require('../assets/icon.png')}
                        />
                        
                        <View style={styles.musicInfo}>
                            <Text style={styles.musicTitle}>{music.title}</Text>
                            <Text style={styles.musicArtist}>{music.artist}</Text>
                        </View>
                        
                        {selectedMusic?.id === music.id && (
                            <Icon 
                                name="checkmark-circle" 
                                size={24} 
                                color={themeColors.primary} 
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    musicPickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        height: height * 0.7,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    musicPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    musicPickerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    musicList: {
        flex: 1,
    },
    musicItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    musicCover: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
    },
    musicInfo: {
        flex: 1,
    },
    musicTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    musicArtist: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 4,
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    playingButton: {
        
    },
    selectedMusicItem: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        paddingVertical: 10,
        paddingLeft: 10,
        fontSize: 16,
    },
});

export default MusicPicker; 