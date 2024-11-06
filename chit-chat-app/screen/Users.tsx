// import React, { useState, useEffect, useCallback } from "react";
// import { SafeAreaView, StyleSheet, View, Text, ScrollView } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import ContactRow from '../components/ContactRow';
// import Seperator from "../components/Seperator";
// import { colors } from "../config/constrants";
// import Cell from "../components/Cell";
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// const Users = () => {
//     const navigation = useNavigation();
//     const [users, setUsers] = useState([]);
//     const [existingChats, setExistingChats] = useState([]);

//     useEffect(() => {
//         // Giả lập dữ liệu người dùng
//         const fakeUsers = [
//             { id: '1', name: 'John Doe', email: 'john@example.com' },
//             { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
//             { id: '3', name: 'Yourself', email: 'you@example.com' } // Người dùng hiện tại
//         ];
//         setUsers(fakeUsers);

//         // Giả lập dữ liệu các cuộc trò chuyện đã tồn tại
//         const fakeChats = [
//             {
//                 chatId: 'chat1',
//                 userEmails: [
//                     { email: 'you@example.com', name: 'Yourself' },
//                     { email: 'john@example.com', name: 'John Doe' }
//                 ]
//             }
//         ];
//         setExistingChats(fakeChats);
//     }, []);

//     // const handleNewGroup = useCallback(() => {
//     //     navigation.navigate('Group');
//     // }, [navigation]);

//     const handleNewUser = useCallback(() => {
//         alert('New user feature coming soon');
//     }, []);

//     const handleNavigate = useCallback((user) => {
//         let navigationChatID = '';

//         existingChats.forEach(existingChat => {
//             if (existingChat.userEmails.some(e => e.email === user.email)) {
//                 navigationChatID = existingChat.chatId;
//             }
//         });

//         if (navigationChatID) {
//             navigation.navigate('Chat', { id: navigationChatID, chatName: handleName(user) });
//         } else {
//             // Giả lập tạo cuộc trò chuyện mới
//             const newChatId = `chat${Date.now()}`;
//             setExistingChats(prev => [
//                 ...prev,
//                 {
//                     chatId: newChatId,
//                     userEmails: [
//                         { email: 'you@example.com', name: 'Yourself' },
//                         { email: user.email, name: user.name }
//                     ]
//                 }
//             ]);
//             navigation.navigate('Chat', { id: newChatId, chatName: handleName(user) });
//         }
//     }, [existingChats, navigation]);

//     const handleSubtitle = useCallback((user) => {
//         return user.email === 'you@example.com' ? 'Message yourself' : 'User status';
//     }, []);

//     const handleName = useCallback((user) => {
//         const { name, email } = user;
//         return email === 'you@example.com' ? `${name}*(You)` : name;
//     }, []);

//     return (
//         <SafeAreaView style={styles.container}>
//             <Cell
//                 title='New group'
//                 icon='people'
//                 tintColor={colors.teal}
//                 onPress={handleNewGroup}
//                 style={{ marginTop: 5 }}
//             />
//             <Cell
//                 title='New user'
//                 icon='person-add'
//                 tintColor={colors.teal}
//                 onPress={handleNewUser}
//                 style={{ marginBottom: 10 }}
//             />

//             {users.length === 0 ? (
//                 <View style={styles.blankContainer}>
//                     <Text style={styles.textContainer}>
//                         No registered users yet
//                     </Text>
//                 </View>
//             ) : (
//                 <ScrollView>
//                     <View>
//                         <Text style={styles.textContainer}>
//                             Registered users
//                         </Text>
//                     </View>
//                     {users.map(user => (
//                         <ContactRow
//                             key={user.id}
//                             name={handleName(user)}
//                             subtitle={handleSubtitle(user)}
//                             onPress={() => handleNavigate(user)}
//                             showForwardIcon={false}
//                         />
//                     ))}
//                 </ScrollView>
//             )}
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//     blankContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     textContainer: {
//         marginLeft: 16,
//         fontSize: 16,
//         fontWeight: "300",
//     }
// });

// export default Users;
