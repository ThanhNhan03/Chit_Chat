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
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';

const { width, height } = Dimensions.get('window');

interface ViewStoryScreenProps {
    route: {
        params: {
            imageUri?: string;
            mode?: 'text' | 'image';
            backgroundColor?: string;
            duration?: number;
            username?: string;
            userAvatar?: string;
            previousScreen?: string;
        };
    };
    navigation: any;
}

const ViewStoryScreen = ({ route, navigation }: ViewStoryScreenProps) => {
    const { 
        imageUri, 
        mode, 
        backgroundColor, 
        duration = 5000,
        username,
        userAvatar,
        previousScreen 
    } = route.params;
    const [progress] = useState(new Animated.Value(0));

    const handleBack = () => {
        if (previousScreen === 'Stories') {
            navigation.navigate('MainTabs', {
                screen: 'Stories'
            });
        } else {
            navigation.goBack();
        }
    };

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
        }).start(() => {
            handleBack();
        });
    }, []);

    return (
        <SafeAreaView style={[
            styles.container, 
            mode === 'text' ? { backgroundColor } : { backgroundColor: '#000' }
        ]}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <Animated.View 
                    style={[
                        styles.progress,
                        {
                            width: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]} 
                />
            </View>

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
                    <TouchableOpacity style={styles.headerIcon}>
                        <Icon name="volume-high" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.headerIcon}
                        onPress={handleBack}
                    >
                        <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {mode === 'image' && (
                <Image 
                    source={{ uri: imageUri }} 
                    style={styles.image}
                    resizeMode="contain"
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressContainer: {
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginTop: height * 0.02,
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
});

export default ViewStoryScreen;
