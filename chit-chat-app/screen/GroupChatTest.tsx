// import React, { useState, useEffect, useRef } from 'react';
// import {
//     View,
//     FlatList,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
//     Modal,
//     ActivityIndicator,
//     SafeAreaView
// } from 'react-native';
// import { generateClient } from 'aws-amplify/api';
// import { getCurrentUser } from 'aws-amplify/auth';
// import { uploadData, getUrl } from 'aws-amplify/storage';
// import * as ImagePicker from 'expo-image-picker';
// import EmojiPicker from 'rn-emoji-keyboard';
// import { listMessages, getUser, getGroupChat } from '../src/graphql/queries';
// import { createMessages, updateGroupChat } from '../src/graphql/mutations';
// import { onCreateMessages } from '../src/graphql/subscriptions';
// import MessageItem from '../components/MessageItem';
// import InputBar from '../components/InputBar';
// import ImageViewer from '../components/ImageViewer';
// import { v4 as uuidv4 } from 'uuid';
// import { ModelSortDirection } from '../src/API';

// const client = generateClient();

// interface GroupChatProps {
//     route: {
//         params: {
//             chatId: string;
//             name: string;
//         };
//     };
//     navigation: any;
// }

// interface Message {
//     id: string;
//     text?: string;
//     image?: string;
//     timestamp: string;
//     type: 'text' | 'image';
//     isMe: boolean;
//     senderName?: string;
//     sender_id: string;
// }

// interface EmojiType {
//     emoji: string;
// }

// const GroupChat: React.FC<GroupChatProps> = ({ route, navigation }) => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [inputText, setInputText] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [currentUserId, setCurrentUserId] = useState<string>('');
//     const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const flatListRef = useRef<FlatList>(null);

//     useEffect(() => {
//         navigation.setOptions({
//             title: route.params.name
//         });
        
//         fetchCurrentUser();
//         fetchMessages();
        
//         const subscription = subscribeToNewMessages();
//         return () => {
//             subscription.unsubscribe();
//         };
//     }, []);

//     const fetchCurrentUser = async () => {
//         try {
//             const user = await getCurrentUser();
//             setCurrentUserId(user.userId);
//         } catch (error) {
//             console.warn('Error fetching current user:', error);
//         }
//     };

//     const fetchMessages = async () => {
//         try {
//             const messagesData = await client.graphql({
//                 query: listMessages,
//                 variables: {
//                     filter: {
//                         and: [
//                             { chat_id: { eq: route.params.chatId } },
//                             { chat_type: { eq: "group" } }
//                         ]
//                     }
//                 }
//             });

//             const formattedMessages = await Promise.all(
//                 messagesData.data.listMessages.items
//                     .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
//                     .map(async (msg) => {
//                         const senderData = await client.graphql({
//                             query: getUser,
//                             variables: { id: msg.sender_id }
//                         });

//                         const messageType: 'text' | 'image' = msg.attachments ? 'image' : 'text';

//                         return {
//                             id: msg.id,
//                             text: messageType === 'text' ? msg.content : undefined,
//                             image: messageType === 'image' ? msg.attachments : undefined,
//                             timestamp: msg.timestamp,
//                             type: messageType,
//                             isMe: msg.sender_id === currentUserId,
//                             senderName: senderData.data.getUser.name,
//                             sender_id: msg.sender_id
//                         } as Message;
//                     })
//             );

//             setMessages(formattedMessages.reverse());
//             setLoading(false);
//         } catch (error) {
//             console.warn('Error fetching messages:', error);
//             setLoading(false);
//         }
//     };

//     const subscribeToNewMessages = () => {
//         return client.graphql({
//             query: onCreateMessages,
//             variables: {
//                 filter: {
//                     chat_id: { eq: route.params.chatId },
//                     chat_type: { eq: "group" }
//                 }
//             }
//         }).subscribe({
//             next: async ({ data }) => {
//                 const newMessage = data.onCreateMessages;
//                 if (newMessage.chat_id === route.params.chatId) {
//                     const senderData = await client.graphql({
//                         query: getUser,
//                         variables: { id: newMessage.sender_id }
//                     });

//                     const messageType: 'text' | 'image' = newMessage.attachments ? 'image' : 'text';

//                     const formattedMessage: Message = {
//                         id: newMessage.id,
//                         text: messageType === 'text' ? newMessage.content : undefined,
//                         image: messageType === 'image' ? newMessage.attachments : undefined,
//                         timestamp: newMessage.timestamp,
//                         type: messageType,
//                         isMe: newMessage.sender_id === currentUserId,
//                         senderName: senderData.data.getUser.name,
//                         sender_id: newMessage.sender_id
//                     };

//                     setMessages(prev => [...prev, formattedMessage]);
//                 }
//             },
//             error: error => console.warn(error)
//         });
//     };

//     const sendMessage = async (content: string, type: 'text' | 'image' = 'text') => {
//         try {
//             const timestamp = new Date().toISOString();
            
//             const messageInput = {
//                 chat_type: "group",
//                 chat_id: route.params.chatId,
//                 sender_id: currentUserId,
//                 content: content,
//                 timestamp: timestamp,
//                 status: "sent",
//                 attachments: type === 'image' ? content : null
//             };

//             await client.graphql({
//                 query: createMessages,
//                 variables: { input: messageInput }
//             });

//             // Update group chat's last message
//             await client.graphql({
//                 query: updateGroupChat,
//                 variables: {
//                     input: {
//                         id: route.params.chatId,
//                         last_message: type === 'text' ? content : '📷 Image',
//                         updated_at: timestamp
//                     }
//                 }
//             });

//         } catch (error) {
//             console.warn('Error sending message:', error);
//         }
//     };

//     const handleSend = async () => {
//         if (inputText.trim()) {
//             await sendMessage(inputText.trim());
//             setInputText('');
//         }
//     };

//     const handleImagePick = async () => {
//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             try {
//                 const response = await fetch(result.assets[0].uri);
//                 const blob = await response.blob();
//                 const filename = `group-chat/${route.params.chatId}/${uuidv4()}.jpg`;
                
//                 await uploadData({
//                     key: filename,
//                     data: blob,
//                     options: {
//                         contentType: 'image/jpeg'
//                     }
//                 });

//                 const imageUrl = await getUrl({
//                     key: filename
//                 });
                
//                 await sendMessage(imageUrl.toString(), 'image');
//             } catch (error) {
//                 console.warn('Error uploading image:', error);
//             }
//         }
//     };

//     const handleEmojiSelected = (emojiObject: EmojiType) => {
//         setInputText(prev => prev + emojiObject.emoji);
//         setIsEmojiPickerOpen(false);
//     };

//     const renderMessage = ({ item, index }) => {
//         const prevMessage = index > 0 ? messages[index - 1] : null;
//         const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
        
//         const isFirstInGroup = !prevMessage || prevMessage.sender_id !== item.sender_id;
//         const isLastInGroup = !nextMessage || nextMessage.sender_id !== item.sender_id;
        
//         return (
//             <MessageItem
//                 message={item}
//                 onImagePress={(uri) => setSelectedImage(uri)}
//                 showSender={!item.isMe && isFirstInGroup}
//                 isFirstInGroup={isFirstInGroup}
//                 isLastInGroup={isLastInGroup}
//             />
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#008080" />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <KeyboardAvoidingView
//                 style={styles.container}
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
//             >
//                 <FlatList
//                     ref={flatListRef}
//                     data={messages}
//                     renderItem={renderMessage}
//                     keyExtractor={item => item.id}
//                     onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
//                     onLayout={() => flatListRef.current?.scrollToEnd()}
//                 />

//                 <InputBar
//                     inputText={inputText}
//                     setInputText={setInputText}
//                     onSend={handleSend}
//                     onImagePick={handleImagePick}
//                     onEmojiToggle={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
//                     showSendButton={inputText.trim().length > 0}
//                 />

//                 <EmojiPicker
//                     onEmojiSelected={handleEmojiSelected}
//                     open={isEmojiPickerOpen}
//                     onClose={() => setIsEmojiPickerOpen(false)}
//                     enableRecentlyUsed
//                     enableSearchBar
//                     theme={{
//                         backdrop: '#00000055',
//                         knob: '#008080',
//                         container: '#F5F5F5',
//                         header: '#008080',
//                         category: {
//                             icon: '#008080',
//                             iconActive: '#006666',
//                             container: '#008080',
//                             containerActive: '#006666',
//                         }
//                     }}
//                 />

//                 <Modal visible={!!selectedImage} transparent={true}>
//                     {selectedImage && (
//                         <ImageViewer
//                             uri={selectedImage}
//                             onClose={() => setSelectedImage(null)}
//                         />
//                     )}
//                 </Modal>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default GroupChat;
