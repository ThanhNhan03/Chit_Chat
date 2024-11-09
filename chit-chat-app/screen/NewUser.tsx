import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

const allUsers = [
  { id: '1', name: 'Domdom' },
  { id: '2', name: 'J97' },
  { id: '3', name: 'John Nhan' },
  { id: '4', name: 'Phan Thi le thuyen' },
  { id: '5', name: 'Nvv' },
  { id: '6', name: 'Jack' },
  { id: '7', name: 'Đàm Sky' },
];

export default function NewUser() {
  const [username, setUsername] = useState('');
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState(allUsers);
  const [showPending, setShowPending] = useState(false);

  const handleSearch = (text: string) => {
    setUsername(text);
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSendRequest = (name: string) => {
    if (pendingRequests.includes(name)) {
      Alert.alert('Thông báo', `Yêu cầu kết bạn đến ${name} đã được gửi.`);
      return;
    }
    setPendingRequests([...pendingRequests, name]);
    Alert.alert('Thành công', `Đã gửi yêu cầu kết bạn đến ${name}.`);
  };

  const handleCancelRequest = (name: string) => {
    setPendingRequests(pendingRequests.filter(request => request !== name));
    Alert.alert('Đã hủy', `Đã hủy yêu cầu kết bạn đến ${name}.`);
  };

  const togglePendingList = () => {
    setShowPending(!showPending);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pendingButton} onPress={togglePendingList}>
        <Text style={styles.pendingButtonText}>Đang xử lý ({pendingRequests.length})</Text>
      </TouchableOpacity>

      {showPending && (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.pendingItem}>
              <Text style={styles.pendingText}>{item}</Text>
              <TouchableOpacity onPress={() => handleCancelRequest(item)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Text style={styles.title}>Thêm Bạn</Text>
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm bạn bè"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.name}</Text>
            {pendingRequests.includes(item.name) ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRequest(item.name)}
              >
                <Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleSendRequest(item.name)}
              >
                <Text style={styles.addButtonText}>Thêm</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  input: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  pendingButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  pendingButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  pendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f0fe',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  pendingText: { color: '#333', fontSize: 16 },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: { color: '#333', fontSize: 16 },
  requestSentText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold' },
});