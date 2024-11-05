import React, { useState, createContext, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screen/Login";
import SignUp from "./screen/SignUp";
import HomeScreen from './screen/Home'; 

import { Amplify } from 'aws-amplify';
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import awsconfig from './aws-exports';
import ConfirmEmail from "./screen/ConfirmEmail";

// Cấu hình Amplify
Amplify.configure(awsconfig);

interface AuthenticatedUserContextType {
  user: any; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthenticatedUserContext = createContext<AuthenticatedUserContextType>({
  user: null,
  setUser: () => null,
});

// Provider để quản lý trạng thái người dùng
const AuthenticatedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

// Tạo Stack Navigator
const Stack = createStackNavigator();

// AuthStack chứa màn hình đăng nhập và đăng ký
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='SignUp' component={SignUp} />
    <Stack.Screen name='ConfirmEmail' component={ConfirmEmail} />
  </Stack.Navigator>
);

// MainStack chứa màn hình chính sau khi đăng nh��p
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

// RootNavigator điều hướng giữa AuthStack và MainStack
const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log('No user signed in');
      } finally {
        setLoading(false); // Kết thúc quá trình tải
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // Nếu user tồn tại, chuyển đến MainStack (màn hình chính)
        <MainStack />
      ) : (
        // Nếu user chưa đăng nhập, hiển thị AuthStack
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

// App chính
const App: React.FC = () => {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
};

export default App;

// Style
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

