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

const client = generateClient();

interface ProfileProps {
    navigation: any;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);
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
            // Yêu cầu quyền truy cập thư viện ảnh
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library');
                return;
            }

            // Mở thư viện ảnh
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                // Upload ảnh lên S3
                const imageUri = result.assets[0].uri;
                const response = await fetch(imageUri);
                const blob = await response.blob();

                const fileName = `profile-pictures/${user.sub || user.userId}-${Date.now()}.jpg`;

                await uploadData({
                    key: fileName,
                    data: blob,
                    options: {
                        contentType: 'image/jpeg',
                        accessLevel: 'private',
                    }
                });

                // Lấy URL của ảnh
                const imageUrl = await getUrl({
                    key: fileName,
                    options: {
                        accessLevel: 'private',
                        expiresIn: 3600 // URL hết hạn sau 1 giờ
                    }
                });

                // Cập nhật state với URL mới
                setUserData(prev => ({
                    ...prev,
                    profile_picture: imageUrl.url.toString()
                }));
            }
        } catch (error) {
            console.log('Error picking/uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        }
    };

    const handleSave = async () => {
        try {
            const updateUserInput: UpdateUserInput = {
                id: user.sub || user.userId,
                name: userData.name,
                profile_picture: userData.profile_picture,
            };

            const response = await client.graphql({
                query: updateUser,
                variables: { input: updateUserInput },
            }) as GraphQLResult<{
                updateUser: {
                    id: string;
                    name: string;
                    profile_picture: string;
                }
            }>;

            if (response.data && response.data.updateUser) {
                Alert.alert('Success', 'Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            console.log('Error updating user:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
                    <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <TouchableOpacity onPress={handlePickImage}>
                    {userData.profile_picture ? (
                        <Image
                            source={{ uri: userData.profile_picture }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.initials}>
                                {userData.name?.substring(0, 2).toUpperCase() || 'U'}
                            </Text>
                        </View>
                    )}
                    {isEditing && (
                        <View style={styles.editIconContainer}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.disabledInput]}
                        value={userData.name}
                        onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                        editable={isEditing}
                        placeholder="Enter your name"
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        color: colors.primary,
        fontSize: 16,
    },
    profileSection: {
        padding: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    initials: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
    },
    editIconContainer: {
        position: 'absolute',
        right: 0,
        bottom: 20,
        backgroundColor: colors.primary,
        padding: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default Profile; 