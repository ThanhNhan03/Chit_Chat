import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../config/constrants';
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { GetUserQuery, UpdateUserInput, UpdateUserMutation } from '../src/API';
import { getUser } from '../src/graphql/queries';
import { updateUser } from '../src/graphql/mutations';
import * as ImagePicker from 'expo-image-picker';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { useFocusEffect } from '@react-navigation/native';
import { themeColors } from '../config/themeColor';
import { useTheme } from '../contexts/ThemeContext';
const client = generateClient();

// Thêm constant cho CloudFront URL
const CLOUDFRONT_URL = 'https://d1uil1dxdmhthh.cloudfront.net';

interface ProfileProps {
    navigation: any;
}
const Profile: React.FC<ProfileProps> = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        profile_picture: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        if (!user?.sub && !user?.userId) return;

        try {
            const response = await client.graphql({
                query: getUser,
                variables: { id: user.sub || user.userId },
            }) as GraphQLResult<{
                getUser: {
                    name: string;
                    profile_picture: string;
                }
            }>;

            if (response.data && response.data.getUser) {
                const fetchedUser = response.data.getUser;
                setUserData({
                    name: fetchedUser.name || '',
                    profile_picture: fetchedUser.profile_picture || '',
                });
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    };

    const handlePickImage = async () => {
        if (!isEditing) return;

        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                const imageUri = result.assets[0].uri;
                
                setUserData(prev => ({
                    ...prev,
                    profile_picture: imageUri
                }));
            }
        } catch (error) {
            console.log('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSave = async () => {
        try {
            let finalImageUrl = userData.profile_picture;

            if (userData.profile_picture && userData.profile_picture.startsWith('file://')) {
                const response = await fetch(userData.profile_picture);
                const blob = await response.blob();
                // Tạo key cho S3 không bao gồm 'private'
                const fileName = `users/${user.sub || user.userId}/profile-pictures/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

                await uploadData({
                    key: fileName,
                    data: blob,
                    options: {
                        contentType: 'image/jpeg',
                    }
                }).result;

                // Tạo CloudFront URL với đường dẫn private
                const cloudFrontUrl = `${CLOUDFRONT_URL}/public/${fileName}`;
                finalImageUrl = cloudFrontUrl;
            }

            const updateUserInput: UpdateUserInput = {
                id: user.sub || user.userId,
                name: userData.name,
                profile_picture: finalImageUrl,
            };

            const response = await client.graphql({
                query: updateUser,
                variables: { input: updateUserInput },
            });

            if (response.data && response.data.updateUser) {
                Alert.alert('Success', 'Profile updated successfully');
                setIsEditing(false);
                navigation.goBack();
            }
        } catch (error) {
            console.log('Error updating user:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textColor }]}>Edit Profile</Text>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                    <Text style={styles.saveButtonText}>
                        {isEditing ? 'Save' : 'Edit'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity 
                        style={styles.avatarContainer}
                        onPress={handlePickImage}
                        disabled={!isEditing}
                    >
                        {userData.profile_picture ? (
                            <Image
                                source={{ uri: userData.profile_picture }}
                                style={styles.avatarImage}
                            />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarText}>
                                    {userData.name?.substring(0, 2).toUpperCase() || 'U'}
                                </Text>
                            </View>
                        )}
                        {isEditing && (
                            <View style={styles.cameraButton}>
                                <Ionicons name="camera" size={20} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>
                    {isEditing && (
                        <Text style={styles.changePhotoText}>Tap to change photo</Text>
                    )}
                </View>

                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textColor }]}>Full Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { 
                                    backgroundColor: theme.cardBackground,
                                    borderColor: theme.borderColor,
                                    color: theme.textColor 
                                },
                                !isEditing && [styles.disabledInput, { 
                                    backgroundColor: theme.backgroundColor,
                                    color: theme.textColor + '80'
                                }]
                            ]}
                            value={userData.name}
                            onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.textColor + '60'}
                            editable={isEditing}
                        />
                    </View>
                </View>
            </View>
        </View>
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
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    saveButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: themeColors.primary,
        borderRadius: 20,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 40,
    },
    avatarContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: themeColors.primary,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarFallback: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.primary,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '600',
        color: '#fff',
    },
    cameraButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: themeColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    changePhotoText: {
        marginTop: 16,
        fontSize: 15,
        color: themeColors.primary,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    formSection: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 24,
        paddingHorizontal: 5,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    input: {
        height: 56,
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    disabledInput: {
        opacity: 0.7,
    },
});

export default Profile; 