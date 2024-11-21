import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

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

    const handleMusicPress = () => {
        setShowMusicPicker(true);
        // Thêm logic xử lý music picker ở đây
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    {/* <TouchableOpacity style={styles.headerIcon}>
                        <Icon name="sparkles-outline" size={24} color="#fff" />
                    </TouchableOpacity> */}
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

            {/* Main Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
            </View>

            {/* Bottom Tools */}
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
    musicPickerContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: themeColors.primary,
    },
});

export default EditStoryScreen;