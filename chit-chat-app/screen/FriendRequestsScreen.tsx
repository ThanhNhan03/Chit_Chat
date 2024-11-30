import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listFriendRequests, getUser } from '../src/graphql/queries';
import { updateFriendRequests, createContact, deleteFriendRequests } from '../src/graphql/mutations';
import { onCreateFriendRequests } from '../src/graphql/subscriptions';
import { sendNotification } from '../utils/notificationHelper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { themeColors } from '../config/themeColor';
import { useTheme } from '../contexts/ThemeContext';

const client = generateClient();

type FriendRequest = {
  id: string;
  from_user_id: string;
  name: string;
  created_at: string;
  status: string;
};

export default function FriendRequestsScreen({ navigation }) {
  const { theme } = useTheme();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    return () => {
      // Cleanup subscription if needed
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFriendRequests();
      subscribeToNewRequests();
    }
  }, [currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUserId(user.userId);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await client.graphql({
        query: listFriendRequests,
        variables: {
          filter: {
            and: [
              { to_user_id: { eq: currentUserId } },
              { status: { eq: 'PENDING' } }
            ]
          }
        }
      });

      const requests = await Promise.all(
        response.data.listFriendRequests.items.map(async (request: any) => {
          const userResponse = await client.graphql({
            query: getUser,
            variables: { id: request.from_user_id }
          });
          
          return {
            id: request.id,
            from_user_id: request.from_user_id,
            name: userResponse.data.getUser.name,
            created_at: request.created_at,
            status: request.status
          };
        })
      );

      setFriendRequests(requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const subscribeToNewRequests = () => {
    const subscription = client.graphql({
      query: onCreateFriendRequests,
      variables: {
        filter: {
          to_user_id: { eq: currentUserId }
        }
      }
    }).subscribe({
      next: async ({ data }) => {
        if (data?.onCreateFriendRequests) {
          const newRequest = data.onCreateFriendRequests;
          
          // Lấy thông tin người gửi lời mời
          const userResponse = await client.graphql({
            query: getUser,
            variables: { id: newRequest.from_user_id }
          });
          const sender = userResponse.data.getUser;

          // Gửi thông báo
          await sendNotification({
            title: 'New Friend Request',
            body: `${sender.name} sent you a friend request`,
            data: {
              type: 'friend_request',
              requestId: newRequest.id,
              senderId: newRequest.from_user_id,
              senderName: sender.name
            },
            channelId: 'friend-requests'
          });

          fetchFriendRequests();
        }
      },
      error: (error) => console.warn(error)
    });

    return () => subscription.unsubscribe();
  };

  const handleAccept = async (request: FriendRequest) => {
    try {
      // Update friend request status
      await client.graphql({
        query: updateFriendRequests,
        variables: {
          input: {
            id: request.id,
            status: 'ACCEPTED'
          }
        }
      });

      // Create mutual contacts
      await Promise.all([
        client.graphql({
          query: createContact,
          variables: {
            input: {
              user_id: currentUserId!,
              contact_user_id: request.from_user_id,
              created_at: new Date().toISOString()
            }
          }
        }),
        client.graphql({
          query: createContact,
          variables: {
            input: {
              user_id: request.from_user_id,
              contact_user_id: currentUserId!,
              created_at: new Date().toISOString()
            }
          }
        })
      ]);

      setFriendRequests(prev => prev.filter(item => item.id !== request.id));
      Alert.alert('Success', `You are now friends with ${request.name}`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleDecline = async (request: FriendRequest) => {
    try {
      await client.graphql({
        query: deleteFriendRequests,
        variables: {
          input: {
            id: request.id
          }
        }
      });

      setFriendRequests(prev => prev.filter(item => item.id !== request.id));
      Alert.alert('Success', `Friend request from ${request.name} declined`);
    } catch (error) {
      console.error('Error declining friend request:', error);
      Alert.alert('Error', 'Failed to decline friend request');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Friend Requests</Text>
      </View>

      {friendRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color={theme.textColor} />
          <Text style={[styles.emptyText, { color: theme.textColor }]}>No friend requests yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.textColor }]}>When someone sends you a friend request, it will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={[styles.requestItem, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.name, { color: theme.textColor }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.timestamp, { color: theme.textColor }]}>
                    <Ionicons name="time-outline" size={14} color={theme.textColor} />
                    {' '}{formatTimestamp(item.created_at)}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(item)}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => handleDecline(item)}
                >
                  <Ionicons name="close" size={20} color={themeColors.error} />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: themeColors.text,
  },
  listContainer: {
    padding: 16,
  },
  requestItem: {
    backgroundColor: '#fff',
    
    padding: 16,
    marginBottom: 12,
  
    
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: themeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: themeColors.text,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: themeColors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  acceptButton: {
    backgroundColor: themeColors.primary,
  },
  declineButton: {
    backgroundColor: `${themeColors.error}30`,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  declineText: {
    color: themeColors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: themeColors.text,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: themeColors.textSecondary,
    textAlign: 'center',
  },
});
