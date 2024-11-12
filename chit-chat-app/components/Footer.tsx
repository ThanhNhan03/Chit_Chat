import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constrants";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FooterProps {
    navigation: any;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerIcon}
                onPress={() => navigation.navigate('Chats')}
            >
                <Ionicons name="chatbubble" size={24} color={colors.teal} />
                <Text style={styles.footerText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.footerIcon}
                onPress={() => navigation.navigate('Settings')}
            >
                <Ionicons name="settings" size={24} color={colors.teal} />
                <Text style={styles.footerText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: screenHeight * 0.015,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerIcon: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: screenWidth * 0.03,
        color: colors.teal,
        marginTop: screenHeight * 0.005,
    },
});

export default Footer; 