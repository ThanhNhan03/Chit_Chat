import React, { createContext, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import * as Notifications from 'expo-notifications';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

// Screens
import Login from './screen/Login';
import SignUp from './screen/SignUp';
import ConfirmEmail from './screen/ConfirmEmail';
import Chats from './screen/Chats';
import SettingTemp from './screen/SettingTemp';
import Chat from './screen/Chat';
import SelectUserScreen from './screen/SelectUserScreen';
import NewGroupScreen from './screen/NewGroupScreen';
import NewUserScreen from './screen/NewUserScreen';
import FriendRequestsScreen from './screen/FriendRequestsScreen';

// Contexts and Config
import { AuthenticatedUserContext } from './contexts/AuthContext';
import config from './aws-exports';
import { initializeNotifications, requestNotificationPermissions } from './utils/notificationHelper';
import GroupChat from './screen/GroupChat';

Amplify.configure(config);
const Stack = createNativeStackNavigator();

// Cấu hình notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

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

        // Lắng nghe khi user nhấn vào notification
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
    return <ActivityIndicator size="large" />;
  }

  return (
    <ActionSheetProvider>
      <AuthenticatedUserContext.Provider value={{ user, setUser }}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
            {user ? (
              <>
                <Stack.Screen
                  name="Chats"
                  component={Chats}
                  options={{
                    headerShown: false,
                    gestureEnabled: false
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
                  name="SettingTemp"
                  component={SettingTemp}
                  options={{
                    headerShown: true,
                    title: 'Settings',
                    gestureEnabled: true
                  }}
                />
                <Stack.Screen
                  name="SelectUser"
                  component={SelectUserScreen}
                  options={{
                    title: 'Friend List',
                    headerShown: true
                  }}
                />
                <Stack.Screen
                  name="NewGroup"
                  component={NewGroupScreen}
                  options={{ title: 'New Group', headerShown: true }}
                />
                <Stack.Screen
                  name="NewUser"
                  component={NewUserScreen}
                  options={{ title: 'Add Friend', headerShown: true }}
                />
                <Stack.Screen 
                  name="FriendRequests"
                  component={FriendRequestsScreen}
                  options={{ title: 'Friend Request', headerShown: true }} 
                />
                <Stack.Screen
                  name="GroupChat"
                  component={GroupChat}
                  options={{ title: 'Group Chat', headerShown: true }}
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
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthenticatedUserContext.Provider>
    </ActionSheetProvider>
  );
};

export default App;