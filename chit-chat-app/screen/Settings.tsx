import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../config/constrants';
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { signOut, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { GetUserQuery } from '../src/API';
import { getUser } from '../src/graphql/queries';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeColors } from '../config/themeColor';
import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
const client = generateClient();

interface SettingsProps {
  navigation: any;
}


const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [userData, setUserData] = useState<GetUserQuery['getUser']>(null);
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  const fetchUserData = async () => {
    if (!user?.sub && !user?.userId) return;
    
    try {
      const response = await client.graphql<GetUserQuery>({
        query: getUser,
        variables: { id: user.sub || user.userId },
      });
      
      if ('data' in response) {
        const result = response as GraphQLResult<GetUserQuery>;
        if (result.data?.getUser) {
          setUserData(result.data.getUser);
        }
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleChangePassword = () => {
    navigation.navigate('ResetPassword');
  };

  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.textColor} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Settings </Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            {userData?.profile_picture ? (
              <Image 
                source={{ uri: userData.profile_picture }} 
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.initials}>
                  {getInitials(userData?.name || userData?.email || '')}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={[styles.username, { color: theme.textColor }]}>
                {userData?.name || 'User Name'}
              </Text>
              <Text style={[styles.email, { color: theme.textColor }]}>
                {userData?.email || ''}
              </Text>
            </View>
            <View style={styles.editButton}>
              <Ionicons name="chevron-forward" size={20} color={theme.textColor} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Options Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>General</Text>
          <View style={[styles.optionsCard, { backgroundColor: theme.cardBackground }]}>
            {/* Dark Mode Toggle */}
            <TouchableOpacity 
              style={styles.option}
              onPress={toggleDarkMode}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F2FF' }]}>
                  <Ionicons 
                    name={isDarkMode ? "moon" : "sunny"} 
                    size={22} 
                    color="#007AFF" 
                  />
                </View>
                <Text style={[styles.optionText, { color: theme.textColor }]}>
                  Dark Mode
                </Text>
              </View>
              <View style={styles.darkModeSwitch}>
                <View style={styles.switchTrack}>
                  <View style={[
                    styles.switchKnob,
                    isDarkMode ? styles.switchKnobOn : styles.switchKnobOff
                  ]} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => navigation.navigate('Help')}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="information-circle-outline" size={22} color="#4CAF50" />
                </View>
                <Text style={[styles.optionText, { color: theme.textColor }]}>Help</Text> 
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textColor} />
            </TouchableOpacity>

            {/* Account Dropdown */}
            <TouchableOpacity 
              style={styles.option}
              onPress={() => setIsAccountExpanded(!isAccountExpanded)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="person-outline" size={22} color="#2196F3" />
                </View>
                <Text style={[styles.optionText, { color: theme.textColor }]}>Account</Text>
              </View>
              <Ionicons 
                name={isAccountExpanded ? "chevron-down" : "chevron-forward"} 
                size={20} 
                color={theme.textColor} 
              />
            </TouchableOpacity>

            {/* Account Suboptions */}
            {isAccountExpanded && (
              <View style={[styles.subOptions, { backgroundColor: theme.backgroundColor }]}>
                <TouchableOpacity 
                  style={[styles.subOption, { borderBottomColor: theme.borderColor }]}
                  onPress={handleChangePassword}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                      <Ionicons name="key-outline" size={22} color="#FF9800" />
                    </View>
                    <Text style={[styles.optionText, { color: theme.textColor }]}>Change Password</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.subOption, { borderBottomColor: theme.borderColor }]}
                  onPress={() => navigation.navigate('BlockedUsers')}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                      <Ionicons name="person-remove-outline" size={22} color="#E91E63" />
                    </View>
                    <Text style={[styles.optionText, { color: theme.textColor }]}>Blocked Users</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',  
    alignItems: 'center', 
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: themeColors.text,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.textSecondary,
    marginBottom: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: themeColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: themeColors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.error,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginRight: 16,      
    padding: 4,           
  },
  subOptions: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  darkModeSwitch: {
    padding: 2,
  },
  switchTrack: {
    width: 51,
    height: 31,
    borderRadius: 31,
    backgroundColor: '#E9E9EA',
    justifyContent: 'center',
  },
  switchKnob: {
    width: 27,
    height: 27,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
  switchKnobOn: {
    transform: [{ translateX: 22 }],
  },
  switchKnobOff: {
    transform: [{ translateX: 2 }],
  },

});

export default Settings;
