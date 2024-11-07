import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageViewerProps {
    uri: string;
    onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ uri, onClose }) => (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default ImageViewer;
