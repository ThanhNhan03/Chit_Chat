import { getCurrentUser } from "@aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { getUser, listContacts } from "../src/graphql/queries";
import { createGroupChat, createUserGroupChat } from "../src/graphql/mutations";
import { themeColors } from "../config/themeColor";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { uploadData } from "aws-amplify/storage";
import { useTheme } from "../contexts/ThemeContext";

const client = generateClient();
const CLOUDFRONT_URL = "https://d1uil1dxdmhthh.cloudfront.net";

export default function NewGroupScreen({ navigation }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const user = await getCurrentUser();
      const contactsData = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            user_id: { eq: user.userId },
          },
        },
      });

      const contactPromises = contactsData.data.listContacts.items.map(
        async (contact) => {
          const userData = await client.graphql({
            query: getUser,
            variables: { id: contact.contact_user_id },
          });
          return {
            ...userData.data.getUser,
            avatar: userData.data.getUser.profile_picture,
          };
        }
      );

      const contactUsers = await Promise.all(contactPromises);
      setContacts(contactUsers);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      if (selectedUsers.length >= 10) {
        Alert.alert(
          "Limit Reached",
          "You can only add up to 10 members in a group."
        );
        return;
      }
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setGroupAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleCreateGroup = async () => {
    if (groupName.trim() === "") {
      Alert.alert("Required", "Please enter a group name.");
      return;
    }

    if (selectedUsers.length === 0) {
      Alert.alert(
        "Required",
        "Please select at least 1 member to create a group."
      );
      return;
    }

    setLoading(true);
    try {
      const currentUser = await getCurrentUser();

      // Upload group avatar if exists
      let groupPictureUrl = "";
      if (groupAvatar && groupAvatar.startsWith("file://")) {
        const response = await fetch(groupAvatar);
        const blob = await response.blob();
        const fileName = `groups/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.jpg`;

        await uploadData({
          key: fileName,
          data: blob,
          options: {
            contentType: "image/jpeg",
          },
        }).result;

        groupPictureUrl = `${CLOUDFRONT_URL}/public/${fileName}`;
      }

      // Create new group chat theo đúng schema
      const newGroupChat = {
        group_name: groupName.trim(),
        created_by: currentUser.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message: "Group created",
        group_picture: groupPictureUrl || null,
        description: "", // Optional
      };

      const groupResponse = await client.graphql({
        query: createGroupChat,
        variables: { input: newGroupChat },
      });

      const groupId = groupResponse.data.createGroupChat.id;

      // Add current user to group
      await client.graphql({
        query: createUserGroupChat,
        variables: {
          input: {
            user_id: currentUser.userId,
            group_chat_id: groupId,
          },
        },
      });

      // Add selected users to group
      await Promise.all(
        selectedUsers.map((userId) =>
          client.graphql({
            query: createUserGroupChat,
            variables: {
              input: {
                user_id: userId,
                group_chat_id: groupId,
              },
            },
          })
        )
      );

      Alert.alert("Success", `Group "${groupName}" has been created!`);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = contacts.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderHeader = () => (
    <View style={[styles.headerWrapper, { backgroundColor: theme.backgroundColor }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.textColor} />
      </TouchableOpacity>
      <Text style={[styles.headerText, { color: theme.textColor }]}>New Group</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {renderHeader()}
      <View style={styles.contentContainer}>
        <View style={styles.groupInfoContainer}>
          <TouchableOpacity
            style={styles.groupAvatarContainer}
            onPress={handlePickImage}
          >
            {groupAvatar ? (
              <Image source={{ uri: groupAvatar }} style={styles.groupAvatar} />
            ) : (
              <View style={styles.groupAvatar}>
                <Ionicons name="people" size={32} color={theme.textColor} />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <TextInput
            style={[styles.groupNameInput, { color: theme.textColor }]}
            placeholder="Group Name"
            placeholderTextColor={theme.textInput}
            value={groupName}
            onChangeText={setGroupName}
          />
          <Text style={[styles.selectedCount, { color: theme.textColor }]}>
            Selected: {selectedUsers.length}/10 members
          </Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor:  themeColors.border }]}>
          <Ionicons name="search" size={20} color={theme.textInput} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search users..."
            placeholderTextColor={theme.textInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.textInput}
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.userItem, { backgroundColor: theme.backgroundColor }]}
              onPress={() => handleSelectUser(item.id)}
            >
              <View style={styles.avatar}>
                {item.profile_picture ? (
                  <Image
                    source={{ uri: item.profile_picture }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={[styles.avatarText, { color: theme.textColor }]}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.textColor }]}>{item.name}</Text>
                <Text style={[styles.userEmail, { color: theme.textInput }]} numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
              <View
                style={[
                  styles.checkBox,
                  selectedUsers.includes(item.id) && styles.checkBoxSelected,
                ]}
              >
                {selectedUsers.includes(item.id) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: themeColors.primary },
            (!groupName.trim() || selectedUsers.length === 0 || loading) &&
            styles.buttonDisabled,
          ]}
          onPress={handleCreateGroup}
          disabled={!groupName.trim() || selectedUsers.length === 0 || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Create Group"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: themeColors.surface,
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  groupInfoContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupAvatarContainer: {
    marginBottom: 16,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: themeColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  groupNameInput: {
    width: "100%",
    fontSize: 24,
    fontWeight: "600",
    color: themeColors.text,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${themeColors.primary}10`,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: themeColors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: themeColors.text,
    marginBottom: 12,
  },
  selectedUsersList: {
    paddingVertical: 12,
  },
  selectedUserItem: {
    alignItems: "center",
    marginRight: 16,
    width: 64,
  },
  selectedAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  selectedUserText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  selectedUserName: {
    fontSize: 12,
    color: themeColors.text,
    textAlign: "center",
    width: "100%",
  },
  removeButton: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: themeColors.surface,
    borderRadius: 12,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    backgroundColor: themeColors.surface,
    borderRadius: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: themeColors.primary,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: themeColors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: themeColors.textSecondary,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: themeColors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxSelected: {
    backgroundColor: themeColors.primary,
    borderWidth: 0,
  },
  createButton: {
    margin: 16,
    padding: 16,
    backgroundColor: themeColors.primary,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity:1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedCount: {
    fontSize: 14,
    color: themeColors.textSecondary,
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  clearButton: {
    padding: 4,
  },
  cameraIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: themeColors.primary,
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
