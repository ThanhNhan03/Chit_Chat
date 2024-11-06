import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const users = [
  { id: '1', name: 'Ali Veli', status: 'User status', online: true },
  { id: '2', name: 'Cemil Tan ', status: 'user status', online: true },
  { id: '3', name: 'John Doe', status: 'User status', online: false, lastSeen: '10m ago' },
];

export default function SelectUserScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NewGroup')}>
        <Icon name="group" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.optionText}>New Group</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NewUser')}>
        <Icon name="person-add" size={24} color="#2196F3" style={styles.icon} />
        <Text style={styles.optionText}>New User</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text>{item.name.charAt(0)}</Text>
              </View>
              {item.online ? (
                <View style={styles.onlineIndicator} />
              ) : (
                <Text style={styles.offlineTime}>{item.lastSeen}</Text>
              )}
            </View>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  optionText: { fontSize: 16, color: '#333', fontWeight: '500' },
  userItem: { flexDirection: 'row', padding: 10, alignItems: 'center' },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  offlineTime: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 5,
    borderRadius: 5,
    fontSize: 10,
    color: '#555',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
