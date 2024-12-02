import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { colors } from '../config/constrants';
import { signUp } from 'aws-amplify/auth'; 
import { generateClient } from 'aws-amplify/api';
import { createUser } from '../src/graphql/mutations';
import { Ionicons } from '@expo/vector-icons';
// const backImage = require("../assets/background.png");

interface SignUpProps {
  navigation: any;
}

const customColors = {
  primary: '#8c7ae6',
  secondary: '#a29bfe',
  text: '#2d3436',
  lightText: '#636e72',
  background: '#ffffff',
  inputBackground: '#f5f5f5',
};

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onHandleSignup = async () => {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            name,
            email
          }
        },
      });

      // Tạo user trong DynamoDB
      const client = generateClient();
      await client.graphql({
        query: createUser,
        variables: {
          input: {
            id: userId,
            email: email,
            name: name,
            password: "HASHED_PASSWORD",
          }
        }
      });

      console.log('Sign up successful', isSignUpComplete, userId, nextStep);
      Alert.alert('Success', 'Account created successfully. Please check your email for verification.');
      
      navigation.navigate('ConfirmEmail', { username: email }); 
    } catch (error: any) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);  
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            autoCapitalize="words"
            keyboardType="default"
            textContentType="name"
            autoFocus={true}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
              textContentType="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color={customColors.lightText}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.background,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: customColors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: customColors.lightText,
    marginBottom: 32,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: customColors.secondary,
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
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    backgroundColor: customColors.inputBackground,
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: customColors.text,
    borderWidth: 1,
    borderColor: customColors.secondary,
    flex: 1,
    paddingRight: 50, // Để icon không đè lên text
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    height: 52,
    justifyContent: 'center',
  },
});