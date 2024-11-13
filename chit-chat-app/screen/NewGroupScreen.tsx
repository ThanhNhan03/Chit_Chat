import { getCurrentUser } from '@aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { getUser, listContacts } from '../src/graphql/queries';
import { createGroupChat, createUserGroupChat } from '../src/graphql/mutations';

const client = generateClient();

export default function NewGroupScreen({ navigation }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const user = await getCurrentUser();
      const contactsData = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            user_id: { eq: user.userId }
          }
        }
      });

      const contactPromises = contactsData.data.listContacts.items.map(async (contact) => {
        const userData = await client.graphql({
          query: getUser,
          variables: { id: contact.contact_user_id }
        });
        return userData.data.getUser;
      });

      const contactUsers = await Promise.all(contactPromises);
      setContacts(contactUsers);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      if (selectedUsers.length >= 10) {
        Alert.alert('Limit Reached', 'You can only add up to 10 members in a group.');
        return;
      }
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Required', 'Please enter a group name.');
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert('Required', 'Please select at least one user to create a group.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      
      // Create new group chat
      const newGroupChat = {
        group_name: groupName.trim(),
        created_by: currentUser.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: 'Group created'
      };

      const groupResponse = await client.graphql({
        query: createGroupChat,
        variables: { input: newGroupChat }
      });

      const groupId = groupResponse.data.createGroupChat.id;

      // Add current user to group
      await client.graphql({
        query: createUserGroupChat,
        variables: {
          input: {
            user_id: currentUser.userId,
            group_chat_id: groupId
          }
        }
      });

      // Add selected users to group
      await Promise.all(selectedUsers.map(userId =>
        client.graphql({
          query: createUserGroupChat,
          variables: {
            input: {
              user_id: userId,
              group_chat_id: groupId
            }
          }
        })
      ));

      Alert.alert('Success', `Group "${groupName}" has been created!`);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = contacts.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        placeholderTextColor="#666"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        placeholderTextColor="#666"
        value={searchText}
        onChangeText={setSearchText}
      />
      {selectedUsers.length > 0 && (
        <Text style={styles.selectedCount}>
          Selected: {selectedUsers.length}/10 members
        </Text>
      )}
      <FlatList
        data={selectedUsers.map(id => contacts.find(user => user.id === id))}
        horizontal
        keyExtractor={item => item?.id || ''}
        contentContainerStyle={styles.selectedUsersList}
        renderItem={({ item }) => (
          <View style={styles.selectedUserItem}>
            <View style={styles.selectedAvatar}>
              <Text style={styles.selectedUserText}>{item?.name.charAt(0)}</Text>
            </View>
            <TouchableOpacity onPress={() => handleSelectUser(item?.id || '')}>
              <Text style={styles.removeButton}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleSelectUser(item.id)}
          >
            <View style={styles.avatar}>
              <Text>{item.name.charAt(0)}</Text>
            </View>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.status}</Text>
            </View>
            {selectedUsers.includes(item.id) ? (
              <View style={styles.selectedIcon} />
            ) : (
              <View style={styles.circleIcon} />
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCreateGroup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating...' : 'Create Group'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#ffffff' 
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectedUsersList: {
    paddingVertical: 8,
  },
  selectedUserItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 30,
    padding: 6,
    marginHorizontal: 4,
    width: 60,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUserText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  removeButton: { 
    color: '#f44336', 
    fontWeight: 'bold', 
    fontSize: 14,
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  userItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    marginLeft: 'auto',
    marginRight: 8,
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginLeft: 'auto',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
});
