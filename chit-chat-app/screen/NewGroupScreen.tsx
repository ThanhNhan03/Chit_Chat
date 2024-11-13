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
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên nhóm.');
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một người dùng để tạo nhóm.');
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

      Alert.alert('Thành công', `Nhóm "${groupName}" đã được tạo!`);
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
        placeholder="Tên nhóm (không bắt buộc)"
        placeholderTextColor="#aaa"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm"
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Tạo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
  },
  searchInput: {
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedUsersList: {
    paddingVertical: 5, // Giảm khoảng cách thừa
  },
  selectedUserItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1e7ff',
    borderRadius: 25, // Hình tròn nhỏ hơn
    padding: 5,
    marginHorizontal: 5, // Giảm khoảng cách giữa các phần tử
    width: 50, 
    height: 50,
  },
  selectedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedUserText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  removeButton: { color: '#ff0000', fontWeight: 'bold', fontSize: 12 },
  userItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#ddd',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    marginLeft: 'auto',
    marginRight: 10,
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    marginLeft: 'auto',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
