import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { listFriendRequests, listUsers, listContacts } from '../src/graphql/queries';
import { createFriendRequests, deleteFriendRequests } from '../src/graphql/mutations';
import { getCurrentUser } from 'aws-amplify/auth';

// Tạo client GraphQL
const client = generateClient();

export default function NewUserScreen() {
  const [searchEmail, setSearchEmail] = useState('');
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.userId);
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
      console.log('Searching for email:', searchTerm);
      
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

      console.log('Search response:', response.data.listUsers.items);

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
            console.log('Existing request check:', hasExistingRequest);
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

      setPendingRequestId(response.data.createFriendRequests.id);
      setPendingRequests([toUser.id]);
      Alert.alert('Success', `Friend request sent to ${toUser.name}.`);
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friend by Email</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter friend's email"
          placeholderTextColor="#aaa"
          value={searchEmail}
          onChangeText={setSearchEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isSearching}
        >
          <Text style={styles.searchButtonText}>
            {isSearching ? 'Searching...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>

      {foundUser && (
        <View style={styles.userItem}>
          <View>
            <Text style={styles.userName}>{foundUser.name}</Text>
            <Text style={styles.userEmail}>{foundUser.email}</Text>
          </View>
          {pendingRequests.includes(foundUser.id) ? (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelRequest}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleSendRequest(foundUser)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333', 
    marginVertical: 20 
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: { 
    color: '#333', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});
