import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { confirmSignUp, autoSignIn, resendSignUpCode } from 'aws-amplify/auth';
import { Ionicons } from '@expo/vector-icons';

const customColors = {
  primary: '#8c7ae6',
  secondary: '#a29bfe',
  text: '#2d3436',
  lightText: '#636e72',
  background: '#ffffff',
  inputBackground: '#f5f5f5',
};

interface ConfirmEmailProps {
  route: any;
  navigation: any;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ route, navigation }) => {
  const { username } = route.params;
  const [code, setCode] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);

  const onConfirm = async () => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({ 
        username, 
        confirmationCode: code 
      });
      
      Alert.alert(
        'Success', 
        'Email confirmed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await resendSignUpCode({ username });
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={60} color={customColors.primary} />
        </View>

        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={styles.emailText}>{username}</Text>
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={styles.buttonText}>Verify Email</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          <TouchableOpacity 
            onPress={handleResendCode}
            disabled={isResending}
          >
            <Text style={[
              styles.linkText,
              isResending && styles.disabledLink
            ]}>
              {isResending ? 'Sending...' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ConfirmEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: customColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: customColors.lightText,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailText: {
    color: customColors.text,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: customColors.inputBackground,
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: customColors.text,
    borderWidth: 1,
    borderColor: customColors.secondary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: customColors.primary,
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: customColors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: customColors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: customColors.lightText,
  },
  linkText: {
    fontSize: 14,
    color: customColors.primary,
    fontWeight: '600',
  },
  disabledLink: {
    opacity: 0.5,
  },
});
