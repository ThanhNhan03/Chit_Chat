import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Account, ChatInfo } from "../screen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen
          options={{
            headerLeft: () => {
              return (
                <Ionicons
                  style={{
                    marginRight: 12,
                  }}
                  name="arrow-back-outline"
                  size={24}
                  color="black"
                />
              );
            },
          }}
          name="ChatInfo"
          component={ChatInfo}
        />
        <Stack.Screen
          options={{
            headerLeft: () => {
              return (
                <Ionicons
                  style={{
                    marginRight: 12,
                  }}
                  name="arrow-back-outline"
                  size={24}
                  color="black"
                />
              );
            },
          }}
          name="Account"
          component={Account}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
