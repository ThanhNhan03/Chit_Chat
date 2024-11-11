import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Account: React.FC = () => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <AntDesign
          style={{ marginRight: 12 }}
          name={item.icon.name}
          size={24}
          color={item.icon.color || "black"}
        />
        <Text
          style={{
            fontSize: 16,
          }}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorComponent = React.useCallback(() => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: "grey",
        }}
      ></View>
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={accounts}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default Account;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});

export const accounts = [
  {
    icon: {
      name: "closesquareo",
    },
    label: "Blocked Users",
  },
  {
    icon: {
      name: "logout",
    },
    label: "Logout",
  },
  {
    icon: {
      name: "delete",
      color: "red",
    },
    label: "Delete my account",
  },
];
