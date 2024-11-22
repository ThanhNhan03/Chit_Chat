import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
} from "react-native";
import { themeColors } from "../config/themeColor";
import MainHeader from '../components/MainHeader';
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { GetUserQuery } from '../src/API';
import { getUser } from '../src/graphql/queries'

const client = generateClient();

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
  imageUrl: "https://i.pinimg.com/736x/48/7f/80/487f80f8f2ec327633ad5e54c2a5cbe6.jpg", 
  hasStory: false,
  isCurrentUser: true,
};

const STORIES_DATA = [CURRENT_USER, ...DUMMY_STORIES];

const StoriesScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [userData, setUserData] = useState({
    name: '',
    profile_picture: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user?.userId) return;

    try {
      const response = await client.graphql({
        query: getUser,
        variables: { id: user.userId },
      }) as GraphQLResult<{
        getUser: {
          name: string;
          profile_picture: string;
        }
      }>;

      if (response.data && response.data.getUser) {
        const fetchedUser = response.data.getUser;
        setUserData({
          name: fetchedUser.name || '',
          profile_picture: fetchedUser.profile_picture || '',
        });
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const CURRENT_USER = {
    id: "current",
    username: userData.name || "Your Story",
    imageUrl: userData.profile_picture,
    hasStory: false,
    isCurrentUser: true,
  };

  const STORIES_DATA = [CURRENT_USER, ...DUMMY_STORIES];

  const renderStoryItem = ({ item }) => {
    if (item.isCurrentUser) {
      return (
        <TouchableOpacity 
          style={styles.storyContainer}
          onPress={() => navigation.navigate('AddStory')}
        >
          {item.hasStory ? (
            <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
          ) : (
            <View style={styles.currentUserContainer}>
              <Image 
                source={{ 
                  uri: userData.profile_picture
                }} 
                style={styles.avatarImage}
              />
              <View style={styles.addButton}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  Add to Story
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.storyContainer}
        onPress={() => {
          navigation.navigate('ViewStory', {
            imageUri: item.imageUrl,
            mode: 'image',
            username: item.username,
            userAvatar: item.imageUrl,
            duration: 5000,
            previousScreen: 'Stories'
          })
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <View style={styles.storyRingContainer}>
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.avatarInRing} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
    overflow: 'hidden',    // Đảm bảo avatar không tràn ra ngoài
    backgroundColor: themeColors.surface,
    elevation: 4,         // Thêm độ nổi
  },
  avatarInRing: {
    width: '100%',
    height: '100%',
    borderRadius: 20,     // Làm tròn avatar
  },
  currentUserContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeColors.surface,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  addButton: {
    position: 'absolute',
    top: ITEM_HEIGHT * 0.05,
    left: ITEM_WIDTH * 0.08,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: themeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeColors.surface,
    elevation: 4,
    zIndex: 2,
  },

  plusIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.primary,
    borderRadius: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StoriesScreen;
