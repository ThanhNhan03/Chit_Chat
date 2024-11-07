import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from "react-native";
import ContactRow from "../components/ContactRow";
import Seperator from "../components/Seperator"; 
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constrants"; 

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ChatsProps {
    navigation: any;
}

const Chats: React.FC<ChatsProps> = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setChats([
                { id: '1', name: 'Đỗ Hoàng Gia', message: 'J97 forever', date: '8/14/24' },
                { id: '2', name: 'Nguyễn Minh Khai', message: 'Em yêu Trịnh Trần Phương Tuấn', date: '8/14/24' },
                { id: '3', name: 'Nhân Đoàn *(You)', message: '🤖 Đốm Con', date: '8/13/24' },
                { id: '4', name: 'JACK', message: '5 Củ', date: '7/7/24' }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <Seperator style={styles.separator} />
            
            {loading ? (
                <ActivityIndicator size="large" style={styles.loadingContainer} color={colors.teal} />
            ) : (
                <ScrollView style={styles.chatList}>
                    {chats.map(chat => (
                        <View key={chat.id}>
                            <ContactRow
                                name={chat.name}
                                subtitle={`You: ${chat.message}`}
                                subtitle2={chat.date}
                                showForwardIcon={false}
                                onPress={() => navigation.navigate('Chat', { name: chat.name })}
                                onLongPress={() => {}}
                                style={styles.contactRow}
                                selected={false}
                            />
                            <Seperator />
                        </View>
                    ))}
                </ScrollView>
            )}

            <Seperator />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerIcon}>
                    <Ionicons name="chatbubble" size={24} color={colors.teal} />
                    <Text style={styles.footerText}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.footerIcon}
                    onPress={() => navigation.navigate('SettingTemp')}
                >
                    <Ionicons name="settings" size={24} color={colors.teal} />
                    <Text style={styles.footerText}>Settings</Text>
                </TouchableOpacity>
            </View>

            {/* Floating Action Button */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: screenWidth * 0.06,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.015,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginHorizontal: screenWidth * 0.04,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatList: {
        flex: 1,
    },
    contactRow: {
        paddingHorizontal: screenWidth * 0.04,
        paddingVertical: screenHeight * 0.015,
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: screenHeight * 0.015,
        backgroundColor: '#fff',
    },
    footerIcon: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: screenWidth * 0.03,
        color: colors.teal,
        marginTop: screenHeight * 0.005,
    },
    fab: {
        position: 'absolute',
        bottom: screenHeight * 0.1,
        right: screenWidth * 0.05,
        backgroundColor: colors.teal,
        width: screenWidth * 0.15,
        height: screenWidth * 0.15,
        borderRadius: screenWidth * 0.075,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default Chats;