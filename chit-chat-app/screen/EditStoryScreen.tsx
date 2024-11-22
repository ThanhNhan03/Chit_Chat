import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { themeColors } from '../config/themeColor';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const EditStoryScreen = ({ navigation }) => {
  const tools = [
    { id: 'wave', icon: 'musical-notes', label: 'Music' },
    { id: 'text', icon: 'text', label: 'Text' },
    { id: 'emoji', icon: 'happy', label: 'Emoji' },
    { id: 'crop', icon: 'crop', label: 'Crop' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Right side tools */}
      <View style={styles.toolsContainer}>
        {tools.map((tool) => (
          <TouchableOpacity 
            key={tool.id}
            style={styles.toolButton}
          >
            <Icon name={tool.icon} size={24} color="white" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="settings-outline" size={24} color="white" />
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareText}>Share now</Text>
          <Icon name="arrow-forward" size={20} color="white" style={styles.shareIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
  toolsContainer: {
    position: 'absolute',
    right: 16,
    top: height * 0.15,
    alignItems: 'center',
    gap: 20,
  },
  toolButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  settingsText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0095f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  shareText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  shareIcon: {
    marginLeft: 4,
  },
});

export default EditStoryScreen;
