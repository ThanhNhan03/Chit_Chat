import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { listFriendRequests, listUsers, listContacts } from '../src/graphql/queries';
import { createFriendRequests, deleteFriendRequests } from '../src/graphql/mutations';
import { getCurrentUser } from 'aws-amplify/auth';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { themeColors } from '../config/themeColor';
import { sendFriendRequestNotification } from '../utils/notificationHelper';
import { getUser } from '../src/graphql/queries';


// Tạo client GraphQL
const client = generateClient();

export default function NewUserScreen() {
  const { theme } = useTheme();
  const [searchEmail, setSearchEmail] = useState('');
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.userId);

      const userData = await client.graphql({
        query: getUser,
        variables: { id: user.userId }
      });
      
      if (userData.data.getUser) {
        setCurrentUserName(userData.data.getUser.name);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const checkExistingRequest = async (userId: string) => {
    if (!currentUserId) return false;
    
    try {
      console.log('Checking request for:', { currentUserId, userId });
      
      const response = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            and: [
              { from_user_id: { eq: currentUserId } },
              { to_user_id: { eq: userId } },
              { status: { eq: 'PENDING' } }
            ]
          }
        }
      });

      console.log('Existing requests:', response.data.listFriendRequests.items);

      const existingRequest = response.data.listFriendRequests.items[0];
      if (existingRequest) {
        setPendingRequests([userId]);
        setPendingRequestId(existingRequest.id);
        return true;
      }
      
      setPendingRequests([]);
      setPendingRequestId(null);
      return false;
    } catch (error) {
      console.error('Error checking existing request:', error);
      return false;
    }
  };

  const checkIfAlreadyFriends = async (userId: string) => {
    if (!currentUserId) return false;
    
    try {
      const response = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            and: [
              { user_id: { eq: currentUserId } },
              { contact_user_id: { eq: userId } }
            ]
          }
        }
      });

      return response.data.listContacts.items.length > 0;
    } catch (error) {
      console.error('Error checking friend status:', error);
      return false;
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    setIsSearching(true);
    try {
      const searchTerm = searchEmail.trim();
      
      const response = await client.graphql({
        query: listUsers,
        variables: {
          filter: {
            or: [
              { email: { eq: searchTerm } },
              { email: { eq: searchTerm.toLowerCase() } },
              { email: { contains: searchTerm } }
            ]
          }
        }
      });

      const users = response.data.listUsers.items;
      if (users && users.length > 0) {
        if (users[0].id === currentUserId) {
          Alert.alert('Notice', 'You cannot add yourself as a friend');
          setFoundUser(null);
          setPendingRequests([]);
          setPendingRequestId(null);
        } else {
          const isAlreadyFriend = await checkIfAlreadyFriends(users[0].id);
          
          if (isAlreadyFriend) {
            Alert.alert('Notice', 'You are already friends with this user');
            setFoundUser(null);
            setPendingRequests([]);
            setPendingRequestId(null);
          } else {
            setFoundUser(users[0]);
            const hasExistingRequest = await checkExistingRequest(users[0].id);
          }
        }
      } else {
        Alert.alert('Not Found', 'No user found with this email address');
        setFoundUser(null);
        setPendingRequests([]);
        setPendingRequestId(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      Alert.alert('Error', 'Failed to search for user');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!pendingRequestId) {
      Alert.alert('Error', 'No pending request found');
      return;
    }

    try {
      await client.graphql({
        query: deleteFriendRequests,
        variables: {
          input: {
            id: pendingRequestId
          }
        }
      });

      setPendingRequests([]);
      setPendingRequestId(null);
      setFoundUser(null);
      setSearchEmail('');
      Alert.alert('Success', 'Friend request cancelled successfully');
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      Alert.alert('Error', 'Failed to cancel friend request. Please try again.');
    }
  };

  const handleSendRequest = async (toUser: any) => {
    if (!currentUserId) {
      Alert.alert('Error', 'You must be logged in to send friend requests');
      return;
    }

    try {
      const input = {
        from_user_id: currentUserId,
        to_user_id: toUser.id,
        status: 'PENDING',
        created_at: new Date().toISOString(),
      };

      const response = await client.graphql({
        query: createFriendRequests,
        variables: { input }
      });

      const newRequestId = response.data.createFriendRequests.id;
      setPendingRequestId(newRequestId);
      setPendingRequests([toUser.id]);

      if (toUser.push_token) {
        await sendFriendRequestNotification({
          expoPushToken: toUser.push_token,
          senderName: currentUserName,
          senderId: currentUserId,
          requestId: newRequestId
        });
      }

      Alert.alert('Success', `Friend request sent to ${toUser.name}.`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Add New Friend</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textColor }]}>Find your friends by their email address</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="mail-outline" size={30} color={theme.textColor} />
          <TextInput
            style={[styles.input, { color: theme.textInput, backgroundColor: theme.input }]}
            placeholder="Enter email address"
      placeholderTextColor={themeColors.text}
            value={searchEmail}
            onChangeText={setSearchEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {searchEmail.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchEmail('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={theme.textColor} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.searchButton, isSearching && styles.searchingButton]}
          onPress={handleSearch}
          disabled={isSearching || !searchEmail.trim()}
        >
          <Ionicons 
            name={isSearching ? "hourglass-outline" : "search-outline"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {foundUser && (
        <View style={styles.resultContainer}>
          <View style={[styles.userItem, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.avatarContainer}>
              {foundUser.profile_picture ? (
                <Image 
                  source={{ uri: foundUser.profile_picture }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {foundUser.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.textColor }]}>{foundUser.name}</Text>
              <Text style={[styles.userEmail, { color: theme.textColor }]}>{foundUser.email}</Text>
            </View>
            {pendingRequests.includes(foundUser.id) ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelRequest}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleSendRequest(foundUser)}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  header: {
    padding: 20,
    paddingTop: 40,
    
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: themeColors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: themeColors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${themeColors.primary}10`,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: themeColors.text,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: themeColors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingButton: {
    opacity: 0.7,
  },
  resultContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: themeColors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: themeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: themeColors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
