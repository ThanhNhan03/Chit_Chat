import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthenticatedUserContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Define the User type
type User = {
  username: string;
  // ... other properties if needed
};

const Profile: React.FC = () => {
  const { user } = useContext(AuthenticatedUserContext) as { user: User | null }; // Allow user to be null
  const navigation = useNavigation(); // Initialize navigation

  const [name, setName] = useState('DT');
  const [email, setEmail] = useState('test@test.com');
  const [about, setAbout] = useState('Available');
  const [isEditing, setIsEditing] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleEdit = (field: string) => {
    setCurrentField(field);
    setNewValue(field === 'Name' ? name : field === 'Email' ? email : about);
    setIsEditing(true);
  };

  const handleSave = () => {
    Alert.alert(
      "Confirm Edit",
      `Are you sure you want to change ${currentField} to "${newValue}"?`,
      [
        {
          text: "Cancel",
          onPress: () => setIsEditing(false),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            if (currentField === 'Name') setName(newValue);
            else if (currentField === 'Email') setEmail(newValue);
            else if (currentField === 'About') setAbout(newValue);
            setIsEditing(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.profilePictureContainer}>
        {user ? (
          <Text style={styles.initials}>{user.username.charAt(0)}</Text>
        ) : (
          <Text style={styles.initials}>?</Text>
        )}
        <TouchableOpacity style={styles.cameraIconContainer}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      {isEditing && (
        <View style={styles.editContainer}>
          <TextInput
            value={newValue}
            onChangeText={setNewValue}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color="#555" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <TouchableOpacity style={styles.editIconButton} onPress={() => handleEdit('Name')}>
            <Ionicons name="create" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={20} color="#555" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <TouchableOpacity style={styles.editIconButton} onPress={() => handleEdit('Email')}>
            <Ionicons name="create" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle" size={20} color="#555" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.label}>About</Text>
            <Text style={styles.value}>{about}</Text>
          </View>
          <TouchableOpacity style={styles.editIconButton} onPress={() => handleEdit('About')}>
            <Ionicons name="create" size={20} color="#555" />
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
    backgroundColor: '#f0f0f0',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  initials: {
    fontSize: 50,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 100,
    height: 100,
    textAlign: 'center',
    lineHeight: 100,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 40,
    height: 40,
  },
  cameraIcon: {
    width: 30,
    height: 30,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  editButton: {
    marginBottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0056b3',
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editIconButton: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIconContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIconText: {
    color: '#555',
    marginLeft: 5,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  editContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Profile;
