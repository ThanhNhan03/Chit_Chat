import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { listContacts, getUser } from '../src/graphql/queries';
import { onCreateContact } from '../src/graphql/subscriptions';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { deleteContact } from '../src/graphql/mutations';
import { createFriendChat, createUserFriendChat } from '../src/graphql/mutations';
import { listUserFriendChats } from '../src/graphql/queries';


const client = generateClient();

type Friend = {
  id: string;
  name: string;
  status?: string;
  email: string;
  online?: boolean;
  lastSeen?: string;
  profile_picture?: string;
};

export default function SelectUserScreen({ navigation }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
      const subscription = subscribeToNewContacts();
      return () => {
        subscription.unsubscribe();
      };
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

  const fetchFriends = async () => {
    try {
      // Fetch all contacts for current user
      const contactsResponse = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            user_id: { eq: currentUserId }
          }
        }
      });

      const contacts = contactsResponse.data.listContacts.items;

      // Fetch detailed information for each friend
      const friendsData = await Promise.all(
        contacts.map(async (contact: any) => {
          const userResponse = await client.graphql({
            query: getUser,
            variables: { id: contact.contact_user_id }
          });
          
          const userData = userResponse.data.getUser;
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            status: userData.status || 'Hey there! I am using ChitChat',
            online: false, // You can implement online status logic here
            lastSeen: 'Offline', // You can implement last seen logic here
            profile_picture: userData.profile_picture
          };
        })
      );

      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewContacts = () => {
    return client.graphql({
      query: onCreateContact,
      variables: {
        filter: {
          user_id: { eq: currentUserId }
        }
      }
    }).subscribe({
      next: async ({ data }) => {
        if (data?.onCreateContact) {
          // Fetch the new friend's details and add to the list
          const userResponse = await client.graphql({
            query: getUser,
            variables: { id: data.onCreateContact.contact_user_id }
          });
          
          const userData = userResponse.data.getUser;
          const newFriend = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            status: userData.status || 'Hey there! I am using ChitChat',
            online: false,
            lastSeen: 'Offline',
            profile_picture: userData.profile_picture
          };
          
          setFriends(prev => [...prev, newFriend]);
        }
      },
      error: (error) => console.warn(error)
    });
  };

  const handleLongPress = (friend: Friend) => {
    const options = ['Delete Friend', 'Block User', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: friend.name,
        message: 'Choose an action',
      },
      async (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // Delete Friend
            Alert.alert(
              "Delete Friend",
              `Are you sure you want to remove ${friend.name} from your friends list?`,
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const contactsResponse = await client.graphql({
                        query: listContacts,
                        variables: {
                          filter: {
                            and: [
                              { user_id: { eq: currentUserId } },
                              { contact_user_id: { eq: friend.id } }
                            ]
                          }
                        }
                      });

                      const reverseContactsResponse = await client.graphql({
                        query: listContacts,
                        variables: {
                          filter: {
                            and: [
                              { user_id: { eq: friend.id } },
                              { contact_user_id: { eq: currentUserId } }
                            ]
                          }
                        }
                      });

                      await Promise.all([
                        client.graphql({
                          query: deleteContact,
                          variables: {
                            input: {
                              id: contactsResponse.data.listContacts.items[0].id
                            }
                          }
                        }),
                        client.graphql({
                          query: deleteContact,
                          variables: {
                            input: {
                              id: reverseContactsResponse.data.listContacts.items[0].id
                            }
                          }
                        })
                      ]);

                      setFriends(prev => prev.filter(f => f.id !== friend.id));
                      Alert.alert("Success", "Friend removed successfully");
                    } catch (error) {
                      console.error('Error deleting friend:', error);
                      Alert.alert("Error", "Failed to remove friend");
                    }
                  }
                }
              ]
            );
            break;
          case 1: // Block User
            Alert.alert("Coming Soon", "Block functionality will be implemented soon");
            break;
        }
      }
    );
  };

  const handleUserSelect = async (friend: Friend) => {
    try {
      // Check if chat already exists
      const existingChatsResponse = await client.graphql({
        query: listUserFriendChats,
        variables: {
          filter: {
            user_id: { eq: currentUserId },
          }
        }
      });

      const existingChats = existingChatsResponse.data.listUserFriendChats.items;
      let friendChatId = null;

      // Find if there's an existing chat with this friend
      for (const chat of existingChats) {
        const otherUserChat = await client.graphql({
          query: listUserFriendChats,
          variables: {
            filter: {
              and: [
                { friend_chat_id: { eq: chat.friend_chat_id } },
                { user_id: { eq: friend.id } }
              ]
            }
          }
        });

        if (otherUserChat.data.listUserFriendChats.items.length > 0) {
          friendChatId = chat.friend_chat_id;
          break;
        }
      }

      if (!friendChatId) {
        // Create new FriendChat
        const newFriendChat = await client.graphql({
          query: createFriendChat,
          variables: {
            input: {
              chat_id: `${currentUserId}_${friend.id}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        });

        friendChatId = newFriendChat.data.createFriendChat.id;

        // Create UserFriendChat entries for both users
        await Promise.all([
          client.graphql({
            query: createUserFriendChat,
            variables: {
              input: {
                user_id: currentUserId,
                friend_chat_id: friendChatId
              }
            }
          }),
          client.graphql({
            query: createUserFriendChat,
            variables: {
              input: {
                user_id: friend.id,
                friend_chat_id: friendChatId
              }
            }
          })
        ]);
      }

      navigation.navigate('Chat', { 
        userId: friend.id, 
        name: friend.name,
        chatId: friendChatId
      });
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const renderHeader = () => (
    <>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NewGroup')}>
        <Icon name="group" size={24} color="#4CAF50" style={styles.icon} />
        <Text style={styles.optionText}>New Group</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('NewUser')}>
        <Icon name="person-add" size={24} color="#2196F3" style={styles.icon} />
        <Text style={styles.optionText}>Add Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('FriendRequests')}>
        <Icon name="people" size={24} color="#FF9800" style={styles.icon} />
        <Text style={styles.optionText}>Friends Request</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => handleUserSelect(item)}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
          >
            <View style={styles.avatarContainer}>
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
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userStatus}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No friends yet</Text>
          </View>
        )}
        ListFooterComponent={loading ? (
          <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color="#2196F3" />
          </View>
        ) : null}
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
    overflow: 'hidden',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingFooter: {
    padding: 10,
    alignItems: 'center',
  },
});
