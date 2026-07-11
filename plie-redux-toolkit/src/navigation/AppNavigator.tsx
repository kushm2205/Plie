import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { restoreSession } from '../store/slices/authSlice';
import { loadFavourites } from '../store/slices/favouritesSlice';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import MainTabs from './MainTabs';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useAppDispatch();
  const { token, isGuest, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
    dispatch(loadFavourites());
  }, [dispatch]);

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
