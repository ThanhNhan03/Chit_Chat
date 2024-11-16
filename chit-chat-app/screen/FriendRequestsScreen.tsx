import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listFriendRequests, getUser } from '../src/graphql/queries';
import { updateFriendRequests, createContact, deleteFriendRequests } from '../src/graphql/mutations';
import { onCreateFriendRequests } from '../src/graphql/subscriptions';
import { sendNotification } from '../utils/notificationHelper';

// Dữ liệu mẫu cho lời mời kết bạn
const client = generateClient();

type FriendRequest = {
  id: string;
  from_user_id: string;
  name: string;
  created_at: string;
  status: string;
  profile_picture?: string;
};

export default function FriendRequestsScreen() {
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
          
          const userData = userResponse.data.getUser;
          return {
            id: request.id,
            from_user_id: request.from_user_id,
            name: userData.name,
            created_at: request.created_at,
            status: request.status,
            profile_picture: userData.profile_picture
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
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No friend requests</Text>
        </View>
      ) : (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <View style={styles.userInfo}>
                {item.profile_picture ? (
                  <Image 
                    source={{ uri: item.profile_picture }} 
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.timestamp}>{formatTimestamp(item.created_at)}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(item)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => handleDecline(item)}
                >
                  <Text style={[styles.buttonText, styles.declineText]}>Decline</Text>
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
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    requestItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    timestamp: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginHorizontal: 4,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    declineButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ff6b6b',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    declineText: {
        color: '#ff6b6b',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
