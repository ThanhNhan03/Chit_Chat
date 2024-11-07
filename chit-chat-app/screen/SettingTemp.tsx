import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { signOut } from 'aws-amplify/auth';

type AuthContextType = {
    user: any;
    setUser: (user: any) => void;
};

interface SettingTempProps {
    navigation: any;
}

const SettingTemp: React.FC<SettingTempProps> = ({ navigation }) => {
    const { user, setUser } = useContext(AuthenticatedUserContext);

    console.log('Entire user object:', user);

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null); 
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    console.log('User attributes:', user?.signInDetails?.loginId || user?.username);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Setting Screen</Text>
            <Text style={styles.userText}>
                Logged in as: {user?.signInDetails?.loginId || user?.username}
            </Text>
            <Button title="Logout" onPress={handleSignOut} />
        </View>
    );
};

export default SettingTemp;

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
