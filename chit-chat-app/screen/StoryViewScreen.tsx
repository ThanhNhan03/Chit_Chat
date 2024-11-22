import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
} from 'react-native';
import { themeColors } from '../config/themeColor';

const { width, height } = Dimensions.get('window');

const StoryViewScreen = ({ route, navigation }) => {
  const storyData = route.params;
  
  const reactions = ['❤️', '😆', '😮'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: storyData.avatarUrl }}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.username}>{storyData.username}</Text>
            <Text style={styles.timeAndSource}>
              {storyData.timePosted} • {storyData.source}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity>
            <Text style={styles.iconButton}>🔊</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.iconButton}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Story Content */}
      <View style={styles.storyContent}>
        <Image
          source={{ uri: storyData.storyUrl }}
          style={styles.storyImage}
          resizeMode="contain"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.messageContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Gửi tin nhắn"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>
          <View style={styles.reactionsContainer}>
            {reactions.map((reaction, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.reactionButton}
              >
                <Text style={styles.reactionEmoji}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  timeAndSource: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 20,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: width,
    height: height * 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
  },
  viewerCount: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    padding: 8,
  },
  inputContainer: {
    flex: 1,
    marginRight: 8,
  },
  input: {
    color: '#fff',
    padding: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
  },
  reactionButton: {
    marginLeft: 8,
  },
  reactionEmoji: {
    color: '#fff',
    fontSize: 24,
  },
});

export default StoryViewScreen;
