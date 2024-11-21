// import React from 'react';
// import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { themeColors } from '../config/themeColor';

// const { width: screenWidth } = Dimensions.get('window');

// interface Friend {
//     id: string;
//     name: string;
//     profilePicture?: string;
// }

// interface FriendBarProps {
//     friends: Friend[];
//     onFriendPress: (friend: Friend) => void;
// }

// const FriendBar: React.FC<FriendBarProps> = ({ friends, onFriendPress }) => {
//     const renderFriend = ({ item }: { item: Friend }) => (
//         <TouchableOpacity onPress={() => onFriendPress(item)} style={styles.friendItem}>
//             <Image
//                 source={item.profilePicture ? { uri: item.profilePicture } : require('../assets/avatar-placeholder.png')}
//                 style={styles.friendAvatar}
//             />
//             <Text style={styles.friendName} numberOfLines={1}>
//                 {item.name}
//             </Text>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={friends}
//                 renderItem={renderFriend}
//                 keyExtractor={(item) => item.id}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.friendList}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         paddingVertical: 10,
//         backgroundColor: themeColors.surface,
//     },
//     friendList: {
//         paddingHorizontal: 10,
//     },
//     friendItem: {
//         alignItems: 'center',
//         marginHorizontal: 10,
//     },
//     friendAvatar: {
//         width: screenWidth * 0.15,
//         height: screenWidth * 0.15,
//         borderRadius: screenWidth * 0.075,
//         backgroundColor: themeColors.primary,
//     },
//     friendName: {
//         marginTop: 5,
//         fontSize: screenWidth * 0.035,
//         color: themeColors.text,
//         textAlign: 'center',
//         width: screenWidth * 0.15,
//     },
// });

// export default FriendBar;