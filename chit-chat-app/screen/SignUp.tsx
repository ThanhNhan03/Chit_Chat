import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { colors } from '../config/constrants';
import { signUp } from 'aws-amplify/auth'; // Sửa lại import từ aws-amplify để dùng signUp từ Auth
const backImage = require("../assets/background.png");

interface SignUpProps {
  navigation: any;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>(''); // Sửa lại từ username thành name
  const [password, setPassword] = useState<string>('');

  const onHandleSignup = async () => {
    try {
      // Đăng ký người dùng với Amplify Auth
      await signUp({
        username: email, // Amplify sử dụng email làm username
        password,
        options: {
          userAttributes: {
            name,
            email
          },
        },
      });
      console.log('Sign up successful');
      Alert.alert('Success', 'Account created successfully. Please check your email for verification.');
      
      // Điều hướng đến trang ConfirmEmail
      navigation.navigate('ConfirmEmail', { username: email }); 
    } catch (error: any) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);  
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          autoCapitalize="words"
          keyboardType="default"
          textContentType="name"
          autoFocus={true}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
          <Text style={{ color: 'gray', fontWeight: '600', fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.pink, fontWeight: '600', fontSize: 14 }}>Log In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: "center",
    paddingTop: 48,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: colors.primary,
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});