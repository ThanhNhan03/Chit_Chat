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
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>
          {user ? 'Change Password' : 'Reset Password'}
        </Text>
        {!user && (
          <Text style={styles.subtitle}>Enter the code sent to your email</Text>
        )}

        {!user && (
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />
        )}

        {user && (
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  form: {
    flex: 1,
  },
  resendButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#8c7ae6',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#8c7ae6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});

export default ResetPassword;