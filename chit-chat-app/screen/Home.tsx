import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthenticatedUserContext } from "../App";
import { signOut } from 'aws-amplify/auth';

type AuthContextType = {
    user: any;
};

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { user } = useContext(AuthenticatedUserContext);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
            <Text style={styles.userText}>
                Logged in as: {user?.attributes?.email || "User"}
            </Text>
            <Button title="Logout" onPress={handleSignOut} />
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
 