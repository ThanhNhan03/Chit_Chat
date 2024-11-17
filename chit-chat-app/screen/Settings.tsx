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


const { width: screenWidth } = Dimensions.get('window');
const client = generateClient();

interface SettingsProps {
  navigation: any;
}


const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [userData, setUserData] = useState<GetUserQuery['getUser']>(null);

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

  const getInitials = (email: string) => {
    return email?.substring(0, 2).toUpperCase() || 'U';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.userInfo} onPress={handleProfilePress}>
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
              <Text style={styles.username}>
                {userData?.name || 'User Name'}
              </Text>
              <Text style={styles.email}>
                {userData?.email || ''}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.option}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="information-circle-outline" size={22} color="#666" style={styles.optionIcon} />
              <Text style={styles.optionText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}
            onPress={() => navigation.navigate('Account')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="person-outline" size={22} color="#666" style={styles.optionIcon} />
              <Text style={styles.optionText}>Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.option, styles.logoutOption]}
            onPress={handleSignOut}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="log-out-outline" size={22} color="#ff3b30" style={styles.optionIcon} />
              <Text style={[styles.optionText, styles.logoutText]}>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  avatar: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderRadius: screenWidth * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  initials: {
    color: '#fff',
    fontSize: 20,
    // fontWeight: ,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  githubLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007bff',
  },
  scrollContainer: {
    flex: 1,
  },
  bottomNav: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  navText: {
    fontSize: 16,
    color: '#000',
  },
  section: {
    marginBottom: 20,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10,
  },
  logoutOption: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff3b30',
  },
});

export default Settings;
