import React, { createContext, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import * as Notifications from 'expo-notifications';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { themeColors } from "./config/themeColor";

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
import { initializeNotifications, requestNotificationPermissions } from './utils/notificationHelper';
import GroupChat from './screen/GroupChat';
import GroupChatSettings from './screen/GroupChatSettings';
import Settings from './screen/Settings';
import Profile from './screen/Profile';
import AddStoryScreen from './screen/AddStoryScreen';
import EditStoryScreen from './screen/EditStoryScreen';
import ViewStoryScreen from './screen/ViewStoryScreen';
import ResetPassword from './screen/ ResetPassword';


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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Chats') {
            iconName = 'chatbubble';
          } else if (route.name === 'Stories') {
            iconName = 'aperture';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor: themeColors.text,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          shadowColor: 'transparent',
        },
        tabBarIconStyle: {
          width: 30,
          height: 30,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: 'bold',
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
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      await initializeNotifications();
      const hasPermission = await requestNotificationPermissions();
      
      if (hasPermission) {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          // console.log('Received notification:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          const data = response.notification.request.content.data;

          if (data.type === 'message') {
            navigationRef.current?.navigate('Chat', {
              chatId: data.chatId,
              userId: data.userId,
              name: data.name
            });
          } else if (data.type === 'friend_request') {
            navigationRef.current?.navigate('FriendRequests');
          }
        });
      }
    } catch (error) {
      console.error('Error setting up app:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator/>;
  }

  return (
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
  );
};

export default App;