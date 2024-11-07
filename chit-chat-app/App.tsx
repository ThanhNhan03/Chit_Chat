import React, { createContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screen/Login';
// import HomeScreen from './screen/Home';
import SignUp from './screen/SignUp';
import ConfirmEmail from './screen/ConfirmEmail';
import { getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { AuthenticatedUserContext } from './contexts/AuthContext';
import Chats from './screen/Chats';
import { ActivityIndicator } from 'react-native';
import SettingTemp from './screen/SettingTemp';
import Chat from './screen/Chat';


Amplify.configure(config);

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
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
  );
};

export default App;
