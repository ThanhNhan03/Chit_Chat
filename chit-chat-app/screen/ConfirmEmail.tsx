import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { confirmSignUp, autoSignIn } from 'aws-amplify/auth';

interface ConfirmEmailProps {
  route: any;
  navigation: any;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ route, navigation }) => {
  const { username } = route.params; // Nhận email từ SignUp
  const [code, setCode] = useState<string>(''); 

  const onConfirm = async () => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({ username, confirmationCode: code });
      Alert.alert('Success', 'Email confirmed successfully!');
      console.log("ket qua confirm:::: ",isSignUpComplete, nextStep);

      navigation.navigate('Login'); // Chuyển đến màn hình đăng nhập sau khi xác nhận
    } catch (error: any) {
      console.error('Error confirming sign up', error);
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter confirmation code"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={onConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
