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
    Image
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

const client = generateClient();

interface GroupMember {
    id: string;
    name: string;
    profile_picture?: string;
}

import { useTheme } from '../contexts/ThemeContext';

const GroupChatSettings: React.FC<any> = ({ route, navigation }) => {
    const { theme } = useTheme();
    const { chatId, initialGroupName } = route.params;
    const [groupName, setGroupName] = useState(initialGroupName);
    const [isEditingName, setIsEditingName] = useState(false);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [isCreator, setIsCreator] = useState(false);
    const [contacts, setContacts] = useState<GroupMember[]>([]);
    const [showAddMember, setShowAddMember] = useState(false);

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
        if (groupName.trim() === initialGroupName) {
            setIsEditingName(false);
            return;
        }

        try {
            await client.graphql({
                query: updateGroupChat,
                variables: {
                    input: {
                        id: chatId,
                        group_name: groupName.trim()
                    }
                }
            });
            
            setIsEditingName(false);
            navigation.navigate('GroupChat', {
                chatId: chatId,
                name: groupName.trim()
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
            <Text style={styles.memberName}>{item.name}</Text>
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

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Header 
                title="Group Settings" 
                onBackPress={() => navigation.goBack()} 
            />
            
            <View style={[styles.content, { backgroundColor: theme.backgroundColor }]}>
                {/* Group Name Section */}
                <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Group Name</Text>
                        <TouchableOpacity onPress={() => setIsEditingName(true)}>
                            <Ionicons name="pencil" size={20} color={theme.textColor} />
                        </TouchableOpacity>
                    </View>
                    {isEditingName ? (
                        <View style={styles.editNameContainer}>
                            <TextInput
                                style={[styles.nameInput, { 
                                    backgroundColor: theme.input,
                                    color: theme.textInput,
                                    borderColor: theme.borderColor 
                                }]}
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

                {/* Members Section */}
                <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                            Members ({members.length})
                        </Text>
                        {isCreator && (
                            <TouchableOpacity onPress={handleAddMemberPress}>
                                <Ionicons name="person-add" size={20} color={theme.textColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <FlatList
                        data={members}
                        renderItem={({ item }) => (
                            <View style={[styles.memberItem, { borderBottomColor: theme.borderColor }]}>
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
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.button, styles.leaveButton]}
                        onPress={handleLeaveGroup}
                    >
                        <Text style={styles.buttonText}>Leave Group</Text>
                    </TouchableOpacity>

                    {isCreator && (
                        <TouchableOpacity 
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDeleteGroup}
                        >
                            <Text style={styles.buttonText}>Delete Group</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Add Member Modal */}
            <Modal
                visible={showAddMember}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddMember(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                        <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add Members</Text>
                        <FlatList
                            data={contacts}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[styles.contactItem, { borderBottomColor: theme.borderColor }]}
                                    onPress={() => handleAddMember(item.id)}
                                >
                                    {item.profile_picture ? (
                                        <Image 
                                            source={{ uri: item.profile_picture }} 
                                            style={styles.contactAvatar} 
                                        />
                                    ) : (
                                        <View style={styles.contactAvatarPlaceholder}>
                                            <Text style={styles.avatarText}>
                                                {item.name[0].toUpperCase()}
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={[styles.contactName, { color: theme.textColor }]}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                        />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setShowAddMember(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    editNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameInput: {
        flex: 1,
        fontSize: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginRight: 8,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    groupName: {
        fontSize: 16,
        color: '#333',
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    memberAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    memberName: {
        flex: 1,
        fontSize: 16,
    },
    removeButton: {
        padding: 4,
    },
    actionButtons: {
        marginTop: 'auto',
        padding: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    leaveButton: {
        backgroundColor: '#FF9500',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    contactAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    contactAvatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactName: {
        flex: 1,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
});

export default GroupChatSettings;
