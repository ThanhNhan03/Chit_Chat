import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { accounts } from "./constants";

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
