import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { colors } from "../config/constrants";
import { signIn, getCurrentUser } from 'aws-amplify/auth';
import { AuthenticatedUserContext } from "../contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons';
// const backImage = require("../assets/background.png");

interface LoginProps {
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

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { setUser } = useContext(AuthenticatedUserContext);

  const onHandleLogin = async () => {
    try {
      const signInResult = await signIn({
        username: email,
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      // Kiểm tra trạng thái xác thực
      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        // Nếu tài khoản chưa xác thực, chuyển đến màn hình xác thực
        navigation.navigate('ConfirmEmail', { username: email });
        return;
      }

      // Nếu đã xác thực, tiếp tục flow đăng nhập bình thường
      const user = await getCurrentUser();
      setUser(user);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.error("Error signing in", error);
      
      // Xử lý các trường hợp lỗi cụ thể
      if (error.name === 'UserNotConfirmedException') {
        Alert.alert(
          'Account Not Verified',
          'Please verify your email address',
          [
            {
              text: 'Verify Now',
              onPress: () => navigation.navigate('ConfirmEmail', { username: email })
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert("Login Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
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
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;

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
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    height: 52,
    justifyContent: 'center',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: customColors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
