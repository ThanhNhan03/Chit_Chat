import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Settings: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>CT</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.username}>Cemil Tan</Text>
            <Text style={styles.email}>test@test.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </View>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Account</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Help</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Invite a friend</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomNav}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="chatbubbles-outline" size={24} color="#000" />
            <Text style={styles.navText}>Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="settings-outline" size={24} color="#007bff" />
            <Text style={styles.navText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initials: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  githubLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007bff',
  },
  scrollContainer: {
    flex: 1,
  },
  bottomNav: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Settings;
