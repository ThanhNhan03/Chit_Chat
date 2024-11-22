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
import { listContacts, listStories} from '../src/graphql/queries'
import { getUser } from '../src/graphql/queries'
import { listStoryViews } from '../src/graphql/queries'

const client = generateClient();

const { width, height } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const SPACING = 10;
const ITEM_WIDTH = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

interface Story {
  id: string;
  user_id: string;
  type: string;
  media_url?: string;
  text_content?: string;
  background_color?: string;
  thumbnail_url?: string;
  duration?: number;
  music_id?: string;
  created_at?: string;
  expires_at?: string;
  user?: {
    id: string;
    name: string;
    profile_picture: string;
  };
}

const StoriesScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [userData, setUserData] = useState({
    name: '',
    profile_picture: '',
  });
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [otherStories, setOtherStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendIds, setFriendIds] = useState<string[]>([]);

  useEffect(() => {
    fetchUserData();
    fetchFriends();
  }, []);

  useEffect(() => {
    if (friendIds.length > 0) {
      fetchStories();
    }
  }, [friendIds]);

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

  const fetchFriends = async () => {
    if (!user?.userId) return;

    try {
      const response = await client.graphql({
        query: listContacts,
        variables: {
          filter: {
            user_id: { eq: user.userId }
          }
        }
      });

      if (response.data?.listContacts?.items) {
        const friendIds = response.data.listContacts.items.map(
          contact => contact.contact_user_id
        );
        setFriendIds([...friendIds, user.userId]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchStories = async () => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      
      // 1. Fetch stories với or operator
      const response = await client.graphql({
        query: listStories,
        variables: {
          filter: {
            and: [
              {
                expires_at: {
                  gt: now
                }
              },
              {
                or: friendIds.map(id => ({
                  user_id: { eq: id }
                }))
              }
            ]
          }
        }
      });

      if (response.data?.listStories?.items) {
        const stories = response.data.listStories.items as Story[];
        
        // 2. Fetch user details for friend stories
        const friendUserIds = [...new Set(stories
          .filter(story => story.user_id !== user?.userId)
          .map(story => story.user_id))];

        const userDetailsPromises = friendUserIds.map(userId =>
          client.graphql({
            query: getUser,
            variables: { id: userId }
          })
        );

        const userDetailsResponses = await Promise.all(userDetailsPromises);
        const userDetails = userDetailsResponses.reduce((acc, response) => {
          if (response.data?.getUser) {
            acc[response.data.getUser.id] = response.data.getUser;
          }
          return acc;
        }, {});

        // 3. Map stories with user details
        const currentUserStories = stories
          .filter(story => story.user_id === user?.userId)
          .map(story => ({
            ...story,
            user: {
              id: user?.userId || '',
              name: userData.name,
              profile_picture: userData.profile_picture
            }
          }));

        const friendStories = stories
          .filter(story => story.user_id !== user?.userId && friendIds.includes(story.user_id))
          .map(story => ({
            ...story,
            user: userDetails[story.user_id] ? {
              id: story.user_id,
              name: userDetails[story.user_id].name,
              profile_picture: userDetails[story.user_id].profile_picture
            } : {
              id: story.user_id,
              name: 'Unknown',
              profile_picture: ''
            }
          }));
        
        setUserStories(currentUserStories);
        setOtherStories(friendStories);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAddStoryButton = () => {
    return (
      <TouchableOpacity 
        style={styles.storyContainer}
        onPress={() => navigation.navigate('AddStory')}
      >
        <View style={styles.currentUserContainer}>
          {userData.profile_picture ? (
            <Image 
              source={{ uri: userData.profile_picture }} 
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {userData.name?.charAt(0)?.toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.addButton}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>Add to Story</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const groupStoriesByUser = (stories: Story[]) => {
    const grouped = stories.reduce((acc, story) => {
      if (!acc[story.user_id]) {
        acc[story.user_id] = {
          ...story, // Lấy story đầu tiên làm preview
          allStories: [story]
        };
      } else {
        acc[story.user_id].allStories.push(story);
      }
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const renderStoryItem = ({ item }) => {
    if (item.isAddStory) {
      return renderAddStoryButton();
    }

    return (
      <TouchableOpacity 
        style={styles.storyContainer}
        onPress={() => {
          navigation.navigate('ViewStory', {
            stories: item.allStories,
            initialStoryIndex: 0,
            username: item.user.name,
            userAvatar: item.user.profile_picture,
            previousScreen: 'Stories'
          });
        }}
      >
        {item.type === 'image' ? (
          <Image 
            source={{ uri: item.media_url }} 
            style={styles.storyImage} 
          />
        ) : (
          <View style={[styles.textStoryPreview, { backgroundColor: item.background_color }]}>
            <Text style={styles.textStoryContent} numberOfLines={2}>
              {item.text_content}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.user.name}</Text>
        </View>
        <View style={[
          styles.storyRingContainer,
          item.user_id === user?.userId && styles.activeStoryRing
        ]}>
          <Image 
            source={{ uri: item.user.profile_picture }} 
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
          data={[
            { id: 'add-story', isAddStory: true },
            ...groupStoriesByUser(userStories),
            ...groupStoriesByUser(otherStories)
          ]}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchStories}
          refreshing={isLoading}
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
  textStoryPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textStoryContent: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activeStoryRing: {
    borderColor: themeColors.secondary, 
    borderWidth: 3,
  },
});

export default StoriesScreen;
