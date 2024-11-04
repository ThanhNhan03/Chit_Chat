import React, { useState, createContext, useContext } from "react";
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screen/Login";
import SignUp from "./screen/SignUp";

interface AuthenticatedUserContextType {
  user: any; 
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthenticatedUserContext = createContext<AuthenticatedUserContextType>({
  user: null,
  setUser: () => null,
});

const AuthenticatedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); 

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Login' component={Login} />
    <Stack.Screen name='SignUp' component={SignUp} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
