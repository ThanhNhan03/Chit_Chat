import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { listContacts, getUser } from "../src/graphql/queries";
import { onCreateContact } from "../src/graphql/subscriptions";
import {
  ActionSheetProvider,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import { deleteContact } from "../src/graphql/mutations";
import {
  createFriendChat,
  createUserFriendChat,
} from "../src/graphql/mutations";
import { listUserFriendChats } from "../src/graphql/queries";
import { themeColors } from "../config/themeColor";
import Ionicons from "react-native-vector-icons/Ionicons";
import { debounce } from "lodash";
import { useTheme } from "../contexts/ThemeContext";

const client = generateClient();

type Friend = {
  id: string;
  name: string;
  status?: string;
  email: string;
  online?: boolean;
  lastSeen?: string;
  avatar?: string;
};

export default function SelectUserScreen({ navigation }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { theme } = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchQuery(text);
    }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    return friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
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
      console.error("Error fetching current user:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const contactsResponse = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            user_id: { eq: currentUserId },
          },
        },
      });

      const contacts = contactsResponse.data.listContacts.items;

      const friendsData = await Promise.all(
        contacts.map(async (contact: any) => {
          const userResponse = await client.graphql({
            query: getUser,
            variables: { id: contact.contact_user_id },
          });

          const userData = userResponse.data.getUser;
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            status: userData.status || "Hey there! I am using ChitChat",
            online: false,
            lastSeen: "Offline",
            avatar: userData.profile_picture,
          };
        })
      );

      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNewContacts = () => {
    return client
      .graphql({
        query: onCreateContact,
        variables: {
          filter: {
            user_id: { eq: currentUserId },
          },
        },
      })
      .subscribe({
        next: async ({ data }) => {
          if (data?.onCreateContact) {
            const userResponse = await client.graphql({
              query: getUser,
              variables: { id: data.onCreateContact.contact_user_id },
            });

            const userData = userResponse.data.getUser;
            const newFriend = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              status: userData.status || "Hey there! I am using ChitChat",
              online: false,
              lastSeen: "Offline",
              avatar: userData.profile_picture,
            };

            setFriends((prev) => [...prev, newFriend]);
          }
        },
        error: (error) => console.warn(error),
      });
  };

  const handleLongPress = (friend: Friend) => {
    const options = ["Delete Friend", "Block User", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: friend.name,
        message: "Choose an action",
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
                  style: "cancel",
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
                              { contact_user_id: { eq: friend.id } },
                            ],
                          },
                        },
                      });

                      const reverseContactsResponse = await client.graphql({
                        query: listContacts,
                        variables: {
                          filter: {
                            and: [
                              { user_id: { eq: friend.id } },
                              { contact_user_id: { eq: currentUserId } },
                            ],
                          },
                        },
                      });

                      await Promise.all([
                        client.graphql({
                          query: deleteContact,
                          variables: {
                            input: {
                              id: contactsResponse.data.listContacts.items[0]
                                .id,
                            },
                          },
                        }),
                        client.graphql({
                          query: deleteContact,
                          variables: {
                            input: {
                              id: reverseContactsResponse.data.listContacts
                                .items[0].id,
                            },
                          },
                        }),
                      ]);

                      setFriends((prev) =>
                        prev.filter((f) => f.id !== friend.id)
                      );
                      Alert.alert("Success", "Friend removed successfully");
                    } catch (error) {
                      console.error("Error deleting friend:", error);
                      Alert.alert("Error", "Failed to remove friend");
                    }
                  },
                },
              ]
            );
            break;
          case 1: // Block User
            Alert.alert(
              "Coming Soon",
              "Block functionality will be implemented soon"
            );
            break;
        }
      }
    );
  };

  const handleUserSelect = async (friend: Friend) => {
    try {
      const existingChatsResponse = await client.graphql({
        query: listUserFriendChats,
        variables: {
          filter: {
            user_id: { eq: currentUserId },
          },
        },
      });

      const existingChats =
        existingChatsResponse.data.listUserFriendChats.items;
      let friendChatId = null;

      for (const chat of existingChats) {
        const otherUserChat = await client.graphql({
          query: listUserFriendChats,
          variables: {
            filter: {
              and: [
                { friend_chat_id: { eq: chat.friend_chat_id } },
                { user_id: { eq: friend.id } },
              ],
            },
          },
        });

        if (otherUserChat.data.listUserFriendChats.items.length > 0) {
          friendChatId = chat.friend_chat_id;
          break;
        }
      }

      if (!friendChatId) {
        const newFriendChat = await client.graphql({
          query: createFriendChat,
          variables: {
            input: {
              chat_id: `${currentUserId}_${friend.id}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          },
        });

        friendChatId = newFriendChat.data.createFriendChat.id;

        await Promise.all([
          client.graphql({
            query: createUserFriendChat,
            variables: {
              input: {
                user_id: currentUserId,
                friend_chat_id: friendChatId,
              },
            },
          }),
          client.graphql({
            query: createUserFriendChat,
            variables: {
              input: {
                user_id: friend.id,
                friend_chat_id: friendChatId,
              },
            },
          }),
        ]);
      }

      navigation.navigate("Chat", {
        userId: friend.id,
        name: friend.name,
        chatId: friendChatId,
      });
    } catch (error) {
      console.error("Error creating/getting chat:", error);
      Alert.alert("Error", "Failed to start chat");
    }
  };

  const renderCustomHeader = () => (
    <View
      style={[styles.headerWrapper, { backgroundColor: theme.backgroundColor }]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={themeColors.primary} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: theme.textColor }]}>
        Select Contact
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { backgroundColor: theme.input }]}>
      <Ionicons name="search" size={20} color={themeColors.text} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        placeholderTextColor={themeColors.text}
        onChangeText={debouncedSearch}
        defaultValue={searchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setSearchQuery("");
            debouncedSearch.cancel();
          }}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color={themeColors.text} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: theme.textColor }]}>
        Start a conversation
      </Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, { backgroundColor: `${theme.selecUser}15` }]}
          onPress={() => navigation.navigate("NewGroup")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Icon name="group" size={24} color="#fff" />
          </View>
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            New Group
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: `${theme.selecUser}15` }]}
          onPress={() => navigation.navigate("NewUser")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.secondary },
            ]}
          >
            <Icon name="person-add" size={24} color="#fff" />
          </View>
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            Add Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, { backgroundColor: `${theme.selecUser}15` }]}
          onPress={() => navigation.navigate("FriendRequests")}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColors.primary },
            ]}
          >
            <Icon name="people" size={24} color="#fff" />
          </View>
          <Text style={[styles.optionText, { color: theme.textColor }]}>
            Friend Requests
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
        Friends
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    headerContainer: {
      padding: 16,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textColor,
      marginBottom: 16,
    },
    optionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    option: {
      flex: 1,
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 4,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    optionText: {
      fontSize: 12,
      color: themeColors.text,
      fontWeight: "500",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: 8,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.cardBackground,
      // Test
      paddingVertical: 10,
      marginHorizontal: 16,
      borderRadius: 12,
    },
    avatarContainer: {
      position: "relative",
      marginRight: 12,
    },
    avatar: {
      width: 65,
      height: 65,
      borderRadius: 35,
      backgroundColor: themeColors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 20,
      color: "#fff",
      fontWeight: "600",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.textColor,
      marginBottom: 4,
    },
    userStatus: {
      fontSize: 15,
      color: theme.textColor,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 16,
      color: themeColors.textSecondary,
      textAlign: "center",
    },
    loadingFooter: {
      padding: 16,
      alignItems: "center",
    },
    onlineIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#4CAF50",
      position: "absolute",
      right: 0,
      bottom: 0,
      borderWidth: 2,
      borderColor: themeColors.surface,
    },
    headerWrapper: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      backgroundColor: themeColors.surface,
      // borderBottomWidth: 1,
      // borderBottomColor: themeColors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerText: {
      flex: 1,
      fontSize: 20,
      fontWeight: "600",
      color: themeColors.text,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${themeColors.primary}10`,
      marginHorizontal: 16,
      marginVertical: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: themeColors.text,
    },
    clearButton: {
      padding: 4,
    },
  });

  return (
    <View style={styles.container}>
      {renderCustomHeader()}
      <FlatList
        data={filteredFriends}
        ListHeaderComponent={() => (
          <View>
            {renderSearchBar()}
            {renderHeader()}
          </View>
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleUserSelect(item)}
            onLongPress={() => handleLongPress(item)}
            delayLongPress={500}
          >
            <View style={styles.avatarContainer}>
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {item.online && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userStatus} numberOfLines={1}>
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No friends yet</Text>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          ) : null
        }
      />
    </View>
  );
}
