import {
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CreateStory: React.FC = () => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.chooseContainer}>
        <ChooseItem onPress={pickImage} label="Camera" icon="camera-outline" />
        <ChooseItem onPress={null} label="Văn bản" icon="text-outline" />
      </View>
      <FlatList
        scrollEnabled={false}
        numColumns={3}
        data={data}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return <Image style={styles.image} source={{ uri: item.url }} />;
        }}
      />
    </ScrollView>
  );
};

const ChooseItem = ({ label, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={styles.chooseItem}
    >
      <Ionicons name={icon} size={24} />
      <Text style={styles.chooseItemText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CreateStory;

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 50,
  },
  chooseContainer: {
    flexDirection: "row",
    gap: 20,
    marginHorizontal: 20,
  },
  flatListContent: {
    marginVertical: 20,
  },
  flatListColumn: {
    gap: 4,
  },
  itemSeparator: {
    height: 4,
  },
  image: {
    height: 220,
    width: Dimensions.get("window").width / 3 - 1,
  },
  chooseItem: {
    flex: 1,
    padding: 24,
    backgroundColor: "#7F00FF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    gap: 12,
  },
  chooseItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

const data = [];
