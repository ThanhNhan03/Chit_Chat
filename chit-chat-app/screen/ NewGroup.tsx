import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';

const groupUsers = [
  { id: '1', name: 'Gia hoàng', avatar: '', status: 'User status' },
  { id: '2', name: 'Thành Nhân', avatar: '', status: 'User status' },
  { id: '3', name: 'John Doe', avatar: '', status: 'User status' },
  { id: '4', name: 'Jack', avatar: '', status: 'User status' },
  { id: '5', name: 'Trịnh Trần Phương Tuấn', avatar: '', status: 'User status' },
];

export default function NewGroup() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên nhóm.');
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một người dùng để tạo nhóm.');
      return;
    }

    Alert.alert('Thành công', `Nhóm "${groupName}" đã được tạo với ${selectedUsers.length} thành viên!`);
    setGroupName('');
    setSelectedUsers([]);
  };

  const filteredUsers = groupUsers.filter(user =>
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
        data={selectedUsers.map(id => groupUsers.find(user => user.id === id))}
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