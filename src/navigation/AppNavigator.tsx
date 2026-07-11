import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { token, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <SplashScreen />
        <ActivityIndicator
          style={{ position: 'absolute', bottom: 80, alignSelf: 'center' }}
        />
      </View>
    );
  }

  const isAuthenticated = Boolean(token) || isGuest;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{ presentation: 'card' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
