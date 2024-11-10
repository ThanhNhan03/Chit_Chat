import { Entypo } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import { members } from "./constants";

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
