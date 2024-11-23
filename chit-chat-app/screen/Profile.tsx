import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../config/constrants";
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { generateClient, GraphQLResult } from "aws-amplify/api";
import { GetUserQuery, UpdateUserInput, UpdateUserMutation } from "../src/API";
import { getUser } from "../src/graphql/queries";
import { updateUser } from "../src/graphql/mutations";
import * as ImagePicker from "expo-image-picker";
import { uploadData, getUrl } from "aws-amplify/storage";
import { useFocusEffect } from "@react-navigation/native";
import { themeColors } from "../config/themeColor";
const client = generateClient();

// Thêm constant cho CloudFront URL
const CLOUDFRONT_URL = "https://d1uil1dxdmhthh.cloudfront.net";

interface ProfileProps {
  navigation: any;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    profile_picture: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user?.sub && !user?.userId) return;

    try {
      const response = (await client.graphql({
        query: getUser,
        variables: { id: user.sub || user.userId },
      })) as GraphQLResult<{
        getUser: {
          name: string;
          profile_picture: string;
        };
      }>;

      if (response.data && response.data.getUser) {
        const fetchedUser = response.data.getUser;
        setUserData({
          name: fetchedUser.name || "",
          profile_picture: fetchedUser.profile_picture || "",
        });
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  const handlePickImage = async () => {
    if (!isEditing) return;

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
        const imageUri = result.assets[0].uri;

        setUserData((prev) => ({
          ...prev,
          profile_picture: imageUri,
        }));
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    try {
      let finalImageUrl = userData.profile_picture;

      if (
        userData.profile_picture &&
        userData.profile_picture.startsWith("file://")
      ) {
        const response = await fetch(userData.profile_picture);
        const blob = await response.blob();
        // Tạo key cho S3 không bao gồm 'private'
        const fileName = `users/${
          user.sub || user.userId
        }/profile-pictures/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.jpg`;

        await uploadData({
          key: fileName,
          data: blob,
          options: {
            contentType: "image/jpeg",
          },
        }).result;

        // Tạo CloudFront URL với đường dẫn private
        const cloudFrontUrl = `${CLOUDFRONT_URL}/public/${fileName}`;
        finalImageUrl = cloudFrontUrl;
      }

      const updateUserInput: UpdateUserInput = {
        id: user.sub || user.userId,
        name: userData.name,
        profile_picture: finalImageUrl,
      };

      const response = await client.graphql({
        query: updateUser,
        variables: { input: updateUserInput },
      });

      if (response.data && response.data.updateUser) {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error updating user:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            disabled={!isEditing}
          >
            {userData.profile_picture ? (
              <Image
                source={{ uri: userData.profile_picture }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>
                  {userData.name?.substring(0, 2).toUpperCase() || "U"}
                </Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.cameraButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {isEditing && (
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          )}
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={userData.name}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, name: text }))
              }
              editable={isEditing}
              placeholder="Enter your name"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: themeColors.text,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: themeColors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: themeColors.primary,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: themeColors.primary,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "600",
    color: "#fff",
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    color: themeColors.primary,
    fontWeight: "500",
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: themeColors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: themeColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: themeColors.text,
  },
  disabledInput: {
    backgroundColor: themeColors.background,
    color: themeColors.textSecondary,
  },
});

export default Profile;
