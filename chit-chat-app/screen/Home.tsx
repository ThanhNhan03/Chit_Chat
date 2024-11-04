import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthenticatedUserContext } from "../App"; // Update import to get the context, not the component

type AuthContextType = {
    user: any; // Replace 'any' with your actual user type if available
};

const HomeScreen: React.FC = () => {
const { user } = useContext(AuthenticatedUserContext);

return (
    <View style={styles.container}>
    <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
    <Text style={styles.userText}>
        Logged in as: {user?.attributes?.email || "User"}
    </Text>
    </View>
);
};

export default HomeScreen;

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
},
welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
},
userText: {
    fontSize: 18,
    color: "#333",
},
});
