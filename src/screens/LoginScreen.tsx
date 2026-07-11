import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

interface LoginErrorResponse {
  message?: string;
}

export default function LoginScreen() {
  const { login, continueAsGuest } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      const axiosError = error as AxiosError<LoginErrorResponse>;
      const message =
        axiosError?.response?.data?.message ||
        'Login failed. Please check your credentials.';

      Alert.alert('Login Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/splash.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Plié</Text>

            <Text style={styles.subtitle}>ELEVATE THE MOVEMENT</Text>

            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor="#888"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Not a member? <Text style={styles.signupLink}>Sign Up Here</Text>
            </Text>

            <Text style={styles.orText}>or Sign in with</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialLetter}>G</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialLetter}></Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialLetter}>f</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={continueAsGuest}
            >
              <Text style={styles.guestText}>Enter as Guest</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.70)',
  },

  scroll: {
    flexGrow: 1,
    padding: scaleWidth(24),
    justifyContent: 'center',
  },

  title: {
    fontSize: scaleFont(40),
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
  },

  subtitle: {
    textAlign: 'center',
    color: '#444',
    letterSpacing: 2,
    marginBottom: scaleHeight(40),
    marginTop: scaleHeight(8),
  },

  label: {
    fontSize: scaleFont(14),
    color: '#222',
    marginBottom: scaleHeight(6),
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: scaleWidth(10),
    padding: scaleWidth(15),
    marginBottom: scaleHeight(16),
    fontSize: scaleFont(16),
  },

  forgotText: {
    textAlign: 'right',
    color: '#333',
    marginBottom: scaleHeight(25),
  },

  button: {
    backgroundColor: '#111',
    padding: scaleWidth(16),
    borderRadius: scaleWidth(10),
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: scaleFont(16),
  },

  signupText: {
    textAlign: 'center',
    marginTop: scaleHeight(20),
    color: '#333',
  },

  signupLink: {
    fontWeight: '700',
    color: '#111',
  },

  orText: {
    textAlign: 'center',
    marginTop: scaleHeight(30),
    marginBottom: scaleHeight(15),
    color: '#555',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  socialButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(25),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scaleWidth(10),
  },

  socialLetter: {
    fontSize: scaleFont(22),
    fontWeight: '700',
  },

  guestButton: {
    marginTop: scaleHeight(30),
    alignItems: 'center',
  },

  guestText: {
    color: '#111',
    fontWeight: '600',
    fontSize: scaleFont(15),
  },
});
