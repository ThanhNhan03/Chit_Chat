import React, { createContext, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import * as Notifications from 'expo-notifications';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { themeColors } from "./config/themeColor";
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useTheme } from './contexts/ThemeContext';

// Screens
import Login from './screen/Login';
import SignUp from './screen/SignUp';
import ConfirmEmail from './screen/ConfirmEmail';
import Chats from './screen/Chats';
import Chat from './screen/Chat';
import SelectUserScreen from './screen/SelectUserScreen';
import NewGroupScreen from './screen/NewGroupScreen';
import NewUserScreen from './screen/NewUserScreen';
import FriendRequestsScreen from './screen/FriendRequestsScreen';
import StoriesScreen from './screen/StoriesScreen';
import ForgotPassword from './screen/ForgotPassword';


// Contexts and Config
import { AuthenticatedUserContext } from './contexts/AuthContext';
import config from './aws-exports';
import { getExpoPushToken, initializeNotifications, requestNotificationPermissions } from './utils/notificationHelper';
import GroupChat from './screen/GroupChat';
import GroupChatSettings from './screen/GroupChatSettings';
import Settings from './screen/Settings';
import Profile from './screen/Profile';
import AddStoryScreen from './screen/AddStoryScreen';
import EditStoryScreen from './screen/EditStoryScreen';
import ViewStoryScreen from './screen/ViewStoryScreen';
import ResetPassword from './screen/ ResetPassword';
import { updateUser } from './src/graphql/mutations';
import { generateClient } from 'aws-amplify/api';


const client = generateClient();
import { ThemeProvider } from './contexts/ThemeContext';


Amplify.configure(config);
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Chats') {
    iconName = 'chat';
          } else if (route.name === 'Stories') {
        iconName = 'web-stories';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor:  theme.tabBar,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: theme.cardBackground,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: 'transparent',
        },
        tabBarIconStyle: {
          width: 30,
          height: 30,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: theme.textColor,
        },
      })}
    >
      <Tab.Screen 
        name="Chats" 
        component={Chats}
        options={{ 
          headerShown: false,
          title: 'Chats'
        }} 
      />
      <Tab.Screen 
        name="Stories"
        component={StoriesScreen}
        options={{ 
          headerShown: false,
          title: 'Stories'
        }} 
      />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<any>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    setupApp();
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const setupApp = async () => {
    try {
        if (Platform.OS === 'android') {
            const hasPermission = await requestNotificationPermissions();
            console.log('Initial notification permission status:', hasPermission);
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return;
        }

        try {
            await initializeNotifications();
            console.log('Notifications initialized');

            const token = await getExpoPushToken();
            console.log('Push token received:', token);

            if (token && currentUser?.userId) {
                await client.graphql({
                    query: updateUser,
                    variables: {
                        input: {
                            id: currentUser.userId,
                            push_token: token
                        }
                    }
                });
                console.log('Token successfully saved to database');
            }

            // Setup listeners
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                console.log('Received notification:', notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                try {
                    const data = response.notification.request.content.data;
                    console.log('Notification response data:', data);

                    if (data.type === 'message') {
                        navigationRef.current?.navigate('Chat', {
                            chatId: data.chatId,
                            userId: data.userId,
                            name: data.name
                        });
                    } else if (data.type === 'friend_request') {
                        navigationRef.current?.navigate('FriendRequests');
                    } else if (data.type === 'new_story') {
                        navigationRef.current?.navigate('ViewStory', {
                            storyId: data.storyId,
                            userId: data.userId,
                            initialStoryIndex: 0
                        });
                    }
                } catch (error) {
                    console.error('Error handling notification response:', error);
                }
            });

        } catch (error) {
            console.error('Error in notification setup:', error);
        }
    } catch (error) {
        console.error('Error in setupApp:', error);
        setUser(null);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAndUpdateToken = async () => {
      if (user?.userId) {
        try {
          const token = await getExpoPushToken();
          console.log('Checking token on foreground:', token);
          if (token) {
            await client.graphql({
              query: updateUser,
              variables: {
                input: {
                  id: user.userId,
                  push_token: token
                }
              }
            });
            console.log('Token updated on foreground');
          }
        } catch (error) {
          console.error('Error updating token on foreground:', error);
        }
      }
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    checkAndUpdateToken();

    return () => {
      subscription.remove();
    };
  }, [user?.userId]);

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  return (
    <ThemeProvider>
      <ActionSheetProvider>
        <AuthenticatedUserContext.Provider value={{ user, setUser }}>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
              {user ? (
                <>
                  <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{
                      headerShown: false,
                      gestureEnabled: false
                    }}
                  />

                  <Stack.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                      headerShown: false,
                    }}
                  />

                  <Stack.Screen
                    name="Chats"
                    component={Chats}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Chat"
                    component={Chat}
                    options={{
                      headerShown: false,
                      gestureEnabled: true
                    }}
                  />
                  <Stack.Screen
                    name="SelectUser"
                    component={SelectUserScreen}
                    options={{
                      title: 'Friend List',
                      headerShown: false
                    }}
                  />
                  <Stack.Screen
                    name="NewGroup"
                    component={NewGroupScreen}
                    options={{ title: 'New Group', headerShown: false }}
                  />
                  <Stack.Screen
                    name="NewUser"
                    component={NewUserScreen}
                    options={{ title: 'Add Friend', headerShown: false }}
                  />
                  <Stack.Screen 
                    name="FriendRequests"
                    component={FriendRequestsScreen}
                    options={{ title: 'Friend Request', headerShown: false }} 
                  />
                  <Stack.Screen
                    name="GroupChat"
                    component={GroupChat}
                    options={{ title: 'Group Chat', headerShown: false }}
                  />
                  <Stack.Screen
                    name="GroupChatSettings"
                    component={GroupChatSettings}
                    options={{ title: 'Group Settings', headerShown: false }}
                  />
                  <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ title: 'Profile', headerShown: false }}
                  />
                  <Stack.Screen
                    name="AddStory"
                    component={AddStoryScreen}
                    options={{ title: 'Add Story', headerShown: false }}
                  />
                  <Stack.Screen
                    name="EditStory"
                    component={EditStoryScreen}
                    options={{ title: 'Edit Story', headerShown: false }}
                  />
                  <Stack.Screen
                    name="ViewStory"
                    component={ViewStoryScreen}
                    options={{ title: 'View Story', headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                    options={{ 
                      headerShown: false,
                      gestureEnabled: true 
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ title: 'Log In', headerShown: false }}
                  />
                  <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ title: 'Sign Up', headerShown: false }}
                  />
                  <Stack.Screen
                    name="ConfirmEmail"
                    component={ConfirmEmail}
                    options={{ title: 'Confirm Email' }}
                  />
                  <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ title: 'Forgot Password', headerShown: false }}
                  />
                  <Stack.Screen
                    name="ResetPassword"
                    component={ResetPassword}
                    options={{ title: 'Reset Password', headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </AuthenticatedUserContext.Provider>
      </ActionSheetProvider>
    </ThemeProvider>
  );
};

export default App;