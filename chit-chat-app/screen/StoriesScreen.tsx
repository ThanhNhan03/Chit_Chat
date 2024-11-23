import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native";
import { themeColors } from "../config/themeColor";
import MainHeader from "../components/MainHeader";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const SPACING = 10;
const ITEM_WIDTH = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

// Data mẫu
const DUMMY_STORIES = [
  {
    id: "1",
    username: "John Doe",
    imageUrl: "https://picsum.photos/seed/1/300/450",
    hasStory: true,
  },
  {
    id: "2",
    username: "Sarah Smith",
    imageUrl: "https://picsum.photos/seed/2/300/450",
    hasStory: true,
  },
  {
    id: "3",
    username: "Mike Johnson",
    imageUrl: "https://picsum.photos/seed/3/300/450",
    hasStory: true,
  },
  {
    id: "4",
    username: "Emily Brown",
    imageUrl: "https://picsum.photos/seed/4/300/450",
    hasStory: true,
  },
  {
    id: "5",
    username: "Alex Wilson",
    imageUrl: "https://picsum.photos/seed/5/300/450",
    hasStory: true,
  },
  {
    id: "6",
    username: "Lisa Anderson",
    imageUrl: "https://picsum.photos/seed/6/300/450",
    hasStory: true,
  },
  {
    id: "7",
    username: "David Taylor",
    imageUrl: "https://picsum.photos/seed/7/300/450",
    hasStory: true,
  },
  {
    id: "8",
    username: "Emma Davis",
    imageUrl: "https://picsum.photos/seed/8/300/450",
    hasStory: true,
  },
  {
    id: "9",
    username: "James Wilson",
    imageUrl: "https://picsum.photos/seed/9/300/450",
    hasStory: true,
  },
  {
    id: "10",
    username: "Sophie Moore",
    imageUrl: "https://picsum.photos/seed/10/300/450",
    hasStory: true,
  },
];

const CURRENT_USER = {
  id: "current",
  username: "Your Story",
  imageUrl:
    "https://i.pinimg.com/736x/48/7f/80/487f80f8f2ec327633ad5e54c2a5cbe6.jpg",
  hasStory: false,
  isCurrentUser: true,
};

const STORIES_DATA = [CURRENT_USER, ...DUMMY_STORIES];

const StoriesScreen = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleChooseStory = (item) => {
    if (item.isCurrentUser) {
      setIsVisible(true);
    }
  };

  const handlePickImage = async () => {
    setIsVisible(false);
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
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const renderStoryItem = ({ item }) => {
    if (item.isCurrentUser) {
      return (
        <TouchableOpacity
          onPress={() => handleChooseStory(item)}
          style={styles.storyContainer}
        >
          {item.hasStory ? (
            <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
          ) : (
            <View style={styles.currentUserContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.avatarImage}
              />
              <View style={styles.addButton}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>Add to Story</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.storyContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <View style={styles.storyRingContainer}>
          <Image source={{ uri: item.imageUrl }} style={styles.avatarInRing} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        onDismiss={() => {
          console.log("he");
        }}
        onRequestClose={() => {
          console.log("chay");

          setIsVisible(false);
        }}
        visible={isVisible}
        style={{
          backgroundColor: "red",
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#00000080",
              borderRadius: 12,
            }}
          >
            <Ionicons
              onPress={() => {
                setIsVisible(false);
              }}
              style={{
                padding: 12,
                alignSelf: "flex-end",
              }}
              size={28}
              name="close"
              color="red"
            />
            <View
              style={{
                paddingHorizontal: 20,
                gap: 20,
                paddingBottom: 20,
                flexDirection: "row",
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChooseItem
                onPress={handlePickImage}
                label="Camera"
                icon="camera-outline"
              />
              <ChooseItem onPress={null} label="Văn bản" icon="text-outline" />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const ChooseItem = ({ label, icon, onPress }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.chooseItem}
      >
        <Ionicons name={icon} size={24} />
        <Text style={styles.chooseItemText}>{label}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      {isVisible && renderModal()}
      <View style={styles.container}>
        <MainHeader title="Stories" />
        <FlatList
          data={STORIES_DATA}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    // paddingTop: height * 0.02,
  },
  listContainer: {
    paddingHorizontal: SPACING,
    marginLeft: -SPACING / 2,
    // borderWidth: 1,
    // borderColor: themeColors.text,
  },
  storyContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: SPACING / 2,
    marginBottom: SPACING,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: themeColors.surface,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // borderWidth: 1,
    // borderColor: themeColors.text,
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  userInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: themeColors.text,
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  storyRingContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: themeColors.primary,
    overflow: "hidden", // Đảm bảo avatar không tràn ra ngoài
    backgroundColor: themeColors.surface,
    elevation: 4, // Thêm độ nổi
  },
  avatarInRing: {
    width: "100%",
    height: "100%",
    borderRadius: 20, // Làm tròn avatar
  },
  currentUserContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themeColors.surface,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  addButton: {
    position: "absolute",
    top: ITEM_HEIGHT * 0.05,
    left: ITEM_WIDTH * 0.08,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: themeColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: themeColors.surface,
    elevation: 4,
    zIndex: 2,
  },

  plusIcon: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -2,
  },
  chooseItem: {
    padding: 24,
    backgroundColor: "#9B59B6",
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
    borderRadius: 18,
    gap: 12,
  },
  chooseItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default StoriesScreen;
