import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    ActivityIndicator,
    Image,
    ScrollView
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { 
    updateGroupChat, 
    deleteGroupChat,
    deleteUserGroupChat,
    createUserGroupChat 
} from '../src/graphql/mutations';
import { 
    getGroupChat,
    listUserGroupChats,
    getUser,
    listContacts
} from '../src/graphql/queries';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { uploadData } from 'aws-amplify/storage';
import { themeColors } from '../config/themeColor';
import AddMemberModal from '../components/AddMemberModal';

const client = generateClient();
const CLOUDFRONT_URL = "https://d1uil1dxdmhthh.cloudfront.net";

interface GroupMember {
    id: string;
    name: string;
    profile_picture?: string;
}

interface GroupChatSettings {
    chatId: string;
    initialGroupName: string;
    group_image?: string;
}

const GroupChatSettings: React.FC<any> = ({ route, navigation }) => {
    const { chatId, initialGroupName } = route.params;
    const [groupName, setGroupName] = useState(initialGroupName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isCreator, setIsCreator] = useState(false);
    const [contacts, setContacts] = useState<GroupMember[]>([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const { theme } = useTheme();
    const [groupImage, setGroupImage] = useState<string | undefined>();

    useEffect(() => {
        // Tải dữ liệu song song
        Promise.all([
            getCurrentUser(),
            client.graphql({
                query: getGroupChat,
                variables: { id: chatId }
            }),
            fetchMembersData()
        ]).then(([user, groupResponse, membersData]) => {
            setCurrentUserId(user.userId);
            setIsCreator(groupResponse.data.getGroupChat.created_by === user.userId);
            setMembers(membersData);
            setGroupImage(groupResponse.data.getGroupChat.group_picture);
        }).catch(error => {
            console.error('Error initializing data:', error);
            Alert.alert('Error', 'Failed to load group details');
        });
    }, []);

    const fetchMembersData = async () => {
        try {
            const membersResponse = await client.graphql({
                query: listUserGroupChats,
                variables: {
                    filter: { group_chat_id: { eq: chatId } }
                }
            });

            const memberPromises = membersResponse.data.listUserGroupChats.items.map(
                async (member) => {
                    const userResponse = await client.graphql({
                        query: getUser,
                        variables: { id: member.user_id }
                    });
                    return {
                        id: userResponse.data.getUser.id,
                        name: userResponse.data.getUser.name,
                        profile_picture: userResponse.data.getUser.profile_picture
                    };
                }
            );

            return Promise.all(memberPromises);
        } catch (error) {
            console.error('Error fetching members:', error);
            return [];
        }
    };

    const handleUpdateGroupName = async () => {
        const trimmedName = groupName.trim();
        if (trimmedName === '') {
            Alert.alert('Error', 'Group name cannot be empty');
            setGroupName(initialGroupName);
            setIsEditingName(false);
            return;
        }

        if (trimmedName === initialGroupName) {
            setIsEditingName(false);
            return;
        }

        try {
            await client.graphql({
                query: updateGroupChat,
                variables: {
                    input: {
                        id: chatId,
                        group_name: trimmedName
                    }
                }
            });
            
            setIsEditingName(false);
            navigation.navigate('GroupChat', {
                chatId: chatId,
                name: trimmedName
            });
        } catch (error) {
            console.error('Error updating group name:', error);
            Alert.alert('Error', 'Failed to update group name');
        }
    };

    const handleLeaveGroup = async () => {
        Alert.alert(
            'Leave Group',
            'Are you sure you want to leave this group?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const userGroupChatResponse = await client.graphql({
                                query: listUserGroupChats,
                                variables: {
                                    filter: {
                                        user_id: { eq: currentUserId },
                                        group_chat_id: { eq: chatId }
                                    }
                                }
                            });
                            
                            const userGroupChatId = userGroupChatResponse.data.listUserGroupChats.items[0].id;
                            
                            await client.graphql({
                                query: deleteUserGroupChat,
                                variables: {
                                    input: { id: userGroupChatId }
                                }
                            });
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'MainTabs' }],
                            });
                        } catch (error) {
                            console.error('Error leaving group:', error);
                            Alert.alert('Error', 'Failed to leave group');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteGroup = async () => {
        Alert.alert(
            'Delete Group',
            'Are you sure you want to delete this group? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await client.graphql({
                                query: deleteGroupChat,
                                variables: { input: { id: chatId } }
                            });
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'MainTabs' }],
                            });
                        } catch (error) {
                            console.error('Error deleting group:', error);
                            Alert.alert('Error', 'Failed to delete group');
                        }
                    }
                }
            ]
        );
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!isCreator || memberId === currentUserId) return;

        Alert.alert(
            'Remove Member',
            'Are you sure you want to remove this member?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // First find the UserGroupChat record
                            const userGroupChatResponse = await client.graphql({
                                query: listUserGroupChats,
                                variables: {
                                    filter: {
                                        user_id: { eq: memberId },
                                        group_chat_id: { eq: chatId }
                                    }
                                }
                            });
                            
                            const userGroupChatId = userGroupChatResponse.data.listUserGroupChats.items[0].id;
                            
                            await client.graphql({
                                query: deleteUserGroupChat,
                                variables: {
                                    input: { id: userGroupChatId }
                                }
                            });
                            await fetchMembersData().then(setMembers);
                        } catch (error) {
                            console.error('Error removing member:', error);
                            Alert.alert('Error', 'Failed to remove member');
                        }
                    }
                }
            ]
        );
    };

    const fetchContacts = async () => {
        try {
            const contactsData = await client.graphql({
                query: listContacts,
                variables: {
                    filter: {
                        user_id: { eq: currentUserId }
                    }
                }
            });

            const contactPromises = contactsData.data.listContacts.items.map(async (contact) => {
                const userData = await client.graphql({
                    query: getUser,
                    variables: { id: contact.contact_user_id }
                });
                return {
                    id: userData.data.getUser.id,
                    name: userData.data.getUser.name,
                    profile_picture: userData.data.getUser.profile_picture
                };
            });

            const contactUsers = await Promise.all(contactPromises);
            // Filter out users who are already members
            const filteredContacts = contactUsers.filter(
                contact => !members.some(member => member.id === contact.id)
            );
            setContacts(filteredContacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleAddMemberPress = () => {
        // Tải contacts khi cần thiết
        if (contacts.length === 0) {
            fetchContacts();
        }
        setShowAddMember(true);
    };

    const handleAddMember = async (userId: string) => {
        try {
            await client.graphql({
                query: createUserGroupChat,
                variables: {
                    input: {
                        user_id: userId,
                        group_chat_id: chatId
                    }
                }
            });
            setShowAddMember(false);
            const newMembers = await fetchMembersData();
            setMembers(newMembers);
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', 'Failed to add member');
        }
    };

    const handleChangeGroupImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permission Required", "Please allow access to your photo library");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                const fileName = `groups/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

                await uploadData({
                    key: fileName,
                    data: blob,
                    options: {
                        contentType: "image/jpeg",
                    },
                }).result;

                const imageUrl = `${CLOUDFRONT_URL}/public/${fileName}`;

                await client.graphql({
                    query: updateGroupChat,
                    variables: {
                        input: {
                            id: chatId,
                            group_picture: imageUrl
                        }
                    }
                });

                setGroupImage(imageUrl);
            }
        } catch (error) {
            console.error('Error updating group image:', error);
            Alert.alert('Error', 'Failed to update group image');
        }
    };

    const renderMemberItem = ({ item }: { item: GroupMember }) => (
        <View style={styles.memberItem}>
            {item.profile_picture ? (
                <Image 
                    source={{ uri: item.profile_picture }} 
                    style={styles.memberAvatar} 
                />
            ) : (
                <View style={styles.memberAvatarPlaceholder}>
                    <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
                </View>
            )}
            <Text style={[styles.memberName, { color: theme.textColor }]}>{item.name}</Text>
            {isCreator && item.id !== currentUserId && (
                <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveMember(item.id)}
                >
                    <Ionicons name="remove-circle-outline" size={24} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );

    const renderSections = () => {
        return [
            // Group Image Section
            {
                type: 'image',
                data: { groupImage, groupName }
            },
            // Group Name Section
            {
                type: 'name',
                data: { groupName, isEditingName }
            },
            // Members Section
            {
                type: 'members',
                data: { members }
            },
            // Action Buttons Section
            {
                type: 'actions',
                data: { isCreator }
            }
        ];
    };

    const renderItem = ({ item }) => {
        switch (item.type) {
            case 'image':
                return (
                    <TouchableOpacity 
                        style={styles.imageSection} 
                        onPress={handleChangeGroupImage}
                    >
                        {item.data.groupImage ? (
                            <Image 
                                source={{ uri: item.data.groupImage }} 
                                style={styles.groupImage} 
                            />
                        ) : (
                            <View style={styles.groupImagePlaceholder}>
                                <Text style={styles.groupImagePlaceholderText}>
                                    {item.data.groupName && item.data.groupName.length > 0 
                                        ? item.data.groupName[0].toUpperCase() 
                                        : '#'}
                                </Text>
                            </View>
                        )}
                        <View style={styles.editImageButton}>
                            <Ionicons name="camera" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                );
            case 'name':
                return (
                    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
                        <View style={[styles.sectionHeader, { backgroundColor: theme.cardBackground }]}>
                            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Group Name</Text>
                            <TouchableOpacity onPress={() => setIsEditingName(true)}>
                                <Ionicons name="pencil" size={20} color='#a29bfe' />
                            </TouchableOpacity>
                        </View>
                        {item.data.isEditingName ? (
                            <View style={styles.editNameContainer}>
                                <TextInput
                                    style={[styles.nameInput, { color: theme.textColor }]}
                                    value={groupName}
                                    onChangeText={setGroupName}
                                    autoFocus
                                />
                                <TouchableOpacity 
                                    style={styles.saveButton}
                                    onPress={handleUpdateGroupName}
                                >
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Text style={[styles.groupName, { color: theme.textColor }]}>{groupName}</Text>
                        )}
                    </View>
                );
            case 'members':
                return (
                    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                                Members ({item.data.members.length})
                            </Text>
                            <TouchableOpacity onPress={handleAddMemberPress}>
                                <Ionicons name="person-add" size={20} color="#a29bfe" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={item.data.members}
                            renderItem={renderMemberItem}
                            keyExtractor={member => member.id}
                            scrollEnabled={false}
                        />
                    </View>
                );
            case 'actions':
                return (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={[styles.button, styles.leaveButton]}
                            onPress={handleLeaveGroup}
                        >
                            <Text style={[styles.buttonText, { color: theme.textColor }]}>Leave Group</Text>
                        </TouchableOpacity>

                        {item.data.isCreator && (
                            <TouchableOpacity 
                                style={[styles.button, styles.deleteButton]}
                                onPress={handleDeleteGroup}
                            >
                                <Text style={[styles.buttonText, { color: theme.textColor }]}>Delete Group</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Header 
                title="Group Settings" 
                onBackPress={() => navigation.goBack()} 
            />
            
            <FlatList
                data={renderSections()}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.type + index}
                showsVerticalScrollIndicator={false}
            />

            <AddMemberModal
                visible={showAddMember}
                contacts={contacts}
                onClose={() => setShowAddMember(false)}
                onAddMember={handleAddMember}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        position: 'relative',
    },
    groupImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: themeColors.primary,
    },
    groupImagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: themeColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupImagePlaceholderText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    editImageButton: {
        position: 'absolute',
        bottom: 28,
        right: '35%',
        backgroundColor: themeColors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: 'transparent',
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    editNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameInput: {
        flex: 1,
        fontSize: 16,
        padding: 12,
        backgroundColor: 'rgba(162, 155, 254, 0.1)',
        borderRadius: 12,
    },
    saveButton: {
        backgroundColor: '#a29bfe',
        padding: 12,
        borderRadius: 12,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    groupName: {
        fontSize: 16,
        paddingVertical: 8,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginBottom: 8,
    },
    memberAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    memberAvatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(162, 155, 254, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#a29bfe',
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    removeButton: {
        padding: 8,
    },
    actionButtons: {
        padding: 16,
        gap: 12,
    },
    button: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    leaveButton: {
        backgroundColor: themeColors.error,
    },
    deleteButton: {
        backgroundColor: '#ff4757',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
});

export default GroupChatSettings;
