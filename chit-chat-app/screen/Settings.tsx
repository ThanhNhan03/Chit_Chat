import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';

interface SettingsProps {
  navigation: any;
}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Thêm tiêu đề */}
        <Text style={styles.title}>Chat-chit-app</Text>
        
        <View style={styles.section}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>CT</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>Cemil Tan</Text>
              <Text style={styles.email}>test@test.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.option}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#666" style={styles.optionIcon} />
              <Text style={styles.optionText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}
            onPress={() => navigation.navigate('Account')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="person-outline" size={22} color="#666" style={styles.optionIcon} />
              <Text style={styles.optionText}>Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.option, styles.logoutOption]}
            onPress={() => {
              // Xử lý logic logout ở đây
              navigation.navigate('Login');
            }}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="log-out-outline" size={22} color="#ff3b30" style={styles.optionIcon} />
              <Text style={[styles.optionText, styles.logoutText]}>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff3b30',
  },
});

export default Settings;
