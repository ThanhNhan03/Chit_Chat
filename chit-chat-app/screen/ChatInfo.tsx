import { Entypo } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatInfo = () => {
  const renderMember = ({ item }) => (
    <View style={styles.memberContainer}>
      <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
      <View>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </View>
  );

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
    <SafeAreaView style={styles.container}>
      <View style={styles.groupImage}>
        <Text style={styles.name}>NTH</Text>
      </View>
      <Text style={styles.title}>Group {" | "} Cats of the Day</Text>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {}}
        style={styles.containerInfo}
      >
        <Entypo style={styles.iconInfo} name="info" size={24} color="black" />
        <View style={{ flex: 1 }}>
          <Text style={styles.titleAbout}>About</Text>
          <Text style={styles.description}>Available</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Members</Text>
      <FlatList
        data={members}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={(_) => _.id}
        renderItem={renderMember}
      />
    </SafeAreaView>
  );
};

export default ChatInfo;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginVertical: 20,
  },
  groupImage: {
    width: 180,
    height: 180,
    marginTop: 20,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    backgroundColor: "#007bff",
  },
  name: {
    fontWeight: "700",
    fontSize: 20,
  },
  containerInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    padding: 20,
    backgroundColor: "white",
  },
  iconInfo: {
    height: 24,
    width: 24,
    marginRight: 12,
  },
  titleAbout: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
  },
  memberContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  memberAvatar: {
    height: 40,
    width: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "700",
  },
  memberEmail: { fontSize: 14 },
});

export const members = [
  {
    id: "1",
    name: "John Doe",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrD6noYONQypf6kKFymROMJF4qzyNEtylsRw&s",
    email: "JohnDoe@gmail.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrD6noYONQypf6kKFymROMJF4qzyNEtylsRw&s",
    email: "JaneSmith@gmail.com",
  },
  {
    id: "3",
    name: "Michael Johnson",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrD6noYONQypf6kKFymROMJF4qzyNEtylsRw&s",
    email: "MichaelJohnson@gmail.com",
  },
  {
    id: "4",
    name: "Donal Trump",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrD6noYONQypf6kKFymROMJF4qzyNEtylsRw&s",
    email: "DonalTrump@gmail.com",
  },
];
