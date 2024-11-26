import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { confirmResetPassword, updatePassword } from 'aws-amplify/auth';
import { AuthenticatedUserContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
interface ResetPasswordProps {
  route: any;
  navigation: any;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ route, navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const { email } = route.params || {};
  const [code, setCode] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleResetPassword = async () => {
    if (user) {
      // For logged in users
      if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    } else {
      // For non-logged in users
      if (!code || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      if (user) {
        // Change password for logged in user
        await updatePassword({
          oldPassword,
          newPassword
        });
      } else {
        // Reset password for non-logged in user
        await confirmResetPassword({
          username: email,
          confirmationCode: code,
          newPassword,
        });
      }
      
      Alert.alert(
        'Success',
        'Password has been changed successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              if (!user) {
                navigation.navigate('Login');
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Error in password change:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <SafeAreaView style={styles.form}>
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            {user ? 'Change Password' : 'Reset Password'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {!user && (
            <Text style={[styles.subtitle, { color: theme.textColor }]}>
              Enter the code sent to your email
            </Text>
          )}

          {!user && (
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.input,
                color: theme.textInput
              }]}
              placeholder="Verification Code"
              placeholderTextColor={theme.textInput}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
          )}

          {user && (
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.input,
                color: theme.textInput
              }]}
              placeholder="Current Password"
              placeholderTextColor={theme.textInput}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          )}

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.input,
              color: theme.textInput
            }]}
            placeholder="New Password"
            placeholderTextColor={theme.textInput}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.input,
              color: theme.textInput
            }]}
            placeholder="Confirm New Password"
            placeholderTextColor={theme.textInput}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity 
            style={styles.button}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Processing...' : (user ? 'Change Password' : 'Reset Password')}
            </Text>
          </TouchableOpacity>

          {!user && (
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={() => navigation.replace('ForgotPassword')}
            >
              <Text style={styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  resendButton: {
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#8c7ae6',
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#8c7ae6',
    padding: height * 0.02,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.03,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: height * 0.016,
    borderRadius: 8,
    marginBottom: height * 0.02,
    width: '100%',
    fontSize: Math.min(width * 0.04, 16),
  },
  title: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#666',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
  },
});

export default ResetPassword;