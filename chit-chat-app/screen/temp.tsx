// import React, { useState, useRef } from 'react';
// import { 
//     StyleSheet, 
//     View, 
//     Text, 
//     TextInput, 
//     TouchableOpacity, 
//     ScrollView, 
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
//     Image,
//     Modal,
//     SafeAreaView,
//     StatusBar
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '../config/constrants';
// import * as ImagePicker from 'expo-image-picker';
// import EmojiPicker from 'rn-emoji-keyboard';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
// const isTablet = screenWidth >= 768;
// const messageBubbleWidth = isTablet ? '50%' : '70%';
// const imageSize = isTablet ? 300 : 200;

// interface Message {
//     id: string;
//     text?: string;
//     image?: string;
//     timestamp: string;
//     type: 'text' | 'image';
// }

// interface ChatProps {
//     route: any;
//     navigation: any;
// }

// const ImageViewer: React.FC<{ uri: string; onClose: () => void }> = ({ uri, onClose }) => (
//     <SafeAreaView style={styles.imageViewerContainer}>
//         <StatusBar backgroundColor="#000" barStyle="light-content" />
//         <View style={styles.imageViewerHeader}>
//             <TouchableOpacity onPress={onClose} style={styles.imageViewerCloseButton}>
//                 <Ionicons name="close" size={28} color="#fff" />
//             </TouchableOpacity>
//         </View>
//         <Image 
//             source={{ uri }} 
//             style={styles.fullScreenImage}
//             resizeMode="contain"
//         />
//     </SafeAreaView>
// );

// const Chat: React.FC<ChatProps> = ({ route, navigation }) => {
//     const { name } = route.params;
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [inputText, setInputText] = useState('');
//     const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const scrollViewRef = useRef<ScrollView>(null);

//     const handleSendMessage = () => {
//         if (inputText.trim()) {
//             const newMessage: Message = {
//                 id: Date.now().toString(),
//                 text: inputText.trim(),
//                 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 type: 'text'
//             };
//             setMessages([...messages, newMessage]);
//             setInputText('');
//             scrollToBottom();
//         }
//     };

//     const handleImagePick = async () => {
//         const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
//         if (permissionResult.granted === false) {
//             alert('Permission to access camera roll is required!');
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             const newMessage: Message = {
//                 id: Date.now().toString(),
//                 image: result.assets[0].uri,
//                 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 type: 'image'
//             };
//             setMessages([...messages, newMessage]);
//             scrollToBottom();
//         }
//     };

//     const handleEmojiSelected = (emoji: any) => {
//         setInputText(prevText => prevText + emoji.emoji);
//     };

//     const scrollToBottom = () => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//     };

//     const handleImagePress = (imageUri: string) => {
//         setSelectedImage(imageUri);
//     };

//     const renderMessage = (message: Message) => (
//         <View key={message.id} style={styles.messageContainer}>
//             <Text style={styles.timestamp}>{message.timestamp}</Text>
//             <View style={styles.message}>
//                 {message.type === 'text' ? (
//                     <Text style={styles.messageText}>{message.text}</Text>
//                 ) : (
//                     <TouchableOpacity 
//                         onPress={() => handleImagePress(message.image!)}
//                         activeOpacity={0.9}
//                     >
//                         <Image 
//                             source={{ uri: message.image }} 
//                             style={styles.messageImage} 
//                             resizeMode="cover"
//                         />
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </View>
//     );

//     return (
//         <KeyboardAvoidingView 
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.container}
//         >
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={24} color="#000" />
//                 </TouchableOpacity>
//                 <View style={styles.headerTitle}>
//                     <Text style={styles.headerName}>{name}</Text>
//                 </View>
//                 <TouchableOpacity>
//                     <Ionicons name="ellipsis-vertical" size={24} color="#000" />
//                 </TouchableOpacity>
//             </View>

//             {/* Chat Messages */}
//             <ScrollView 
//                 ref={scrollViewRef}
//                 style={styles.messagesContainer}
//                 onContentSizeChange={scrollToBottom}
//             >
//                 <View style={styles.dateContainer}>
//                     <Text style={styles.dateText}>
//                         {new Date().toLocaleDateString()}
//                     </Text>
//                 </View>
//                 {messages.map(renderMessage)}
//             </ScrollView>

//             {/* Input Area */}
//             <View style={styles.inputContainer}>
//                 <TouchableOpacity 
//                     style={styles.emojiButton}
//                     onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
//                 >
//                     <Ionicons name="happy-outline" size={24} color={colors.teal} />
//                 </TouchableOpacity>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Type a message..."
//                     placeholderTextColor="#999"
//                     value={inputText}
//                     onChangeText={setInputText}
//                     multiline
//                 />
//                 <TouchableOpacity 
//                     style={styles.attachButton}
//                     onPress={handleImagePick}
//                 >
//                     <Ionicons name="attach" size={24} color={colors.teal} />
//                 </TouchableOpacity>
//                 {inputText.trim() && (
//                     <TouchableOpacity 
//                         style={styles.sendButton}
//                         onPress={handleSendMessage}
//                     >
//                         <Ionicons name="send" size={24} color={colors.teal} />
//                     </TouchableOpacity>
//                 )}
//             </View>

//             {/* Image Viewer Modal */}
//             <Modal
//                 visible={!!selectedImage}
//                 transparent={false}
//                 animationType="fade"
//                 onRequestClose={() => setSelectedImage(null)}
//             >
//                 {selectedImage && (
//                     <ImageViewer 
//                         uri={selectedImage} 
//                         onClose={() => setSelectedImage(null)} 
//                     />
//                 )}
//             </Modal>

//             <EmojiPicker
//                 onEmojiSelected={handleEmojiSelected}
//                 open={isEmojiPickerOpen}
//                 onClose={() => setIsEmojiPickerOpen(false)}
//             />
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         paddingHorizontal: isTablet ? 20 : 0,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: isTablet ? 20 : 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     headerTitle: {
//         flex: 1,
//         marginLeft: 16,
//     },
//     headerName: {
//         fontSize: isTablet ? 22 : 18,
//         fontWeight: 'bold',
//     },
//     messagesContainer: {
//         flex: 1,
//         padding: isTablet ? 20 : 16,
//         maxWidth: isTablet ? 800 : '100%',
//         alignSelf: 'center',
//         width: '100%',
//     },
//     dateContainer: {
//         alignItems: 'center',
//         marginVertical: 8,
//     },
//     dateText: {
//         color: '#666',
//         fontSize: 12,
//     },
//     messageContainer: {
//         alignItems: 'flex-end',
//         marginBottom: 8,
//     },
//     message: {
//         backgroundColor: colors.teal,
//         borderRadius: 20,
//         padding: isTablet ? 16 : 12,
//         maxWidth: messageBubbleWidth,
//     },
//     timestamp: {
//         color: '#666',
//         fontSize: 12,
//         marginBottom: 4,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: isTablet ? 16 : 8,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//         maxWidth: isTablet ? 800 : '100%',
//         alignSelf: 'center',
//         width: '100%',
//     },
//     emojiButton: {
//         padding: isTablet ? 12 : 8,
//     },
//     input: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 20,
//         paddingHorizontal: isTablet ? 20 : 16,
//         paddingVertical: isTablet ? 12 : 8,
//         marginHorizontal: isTablet ? 12 : 8,
//         fontSize: isTablet ? 18 : 16,
//     },
//     attachButton: {
//         padding: isTablet ? 12 : 8,
//     },
//     messageText: {
//         color: '#fff',
//         fontSize: isTablet ? 18 : 16,
//     },
//     messageImage: {
//         width: imageSize,
//         height: imageSize,
//         borderRadius: 20,
//     },
//     sendButton: {
//         padding: isTablet ? 12 : 8,
//     },
//     imageViewerContainer: {
//         flex: 1,
//         backgroundColor: '#000',
//     },
//     imageViewerHeader: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1,
//         padding: 16,
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//     },
//     imageViewerCloseButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: 'rgba(0,0,0,0.5)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     fullScreenImage: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//     },
// });

// export default Chat;