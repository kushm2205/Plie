import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import EventListingScreen from '../screens/EventListingScreen';
import SearchEventScreen from '../screens/SearchEventScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from '../types';
import { scaleFont } from '../utils/responsive';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_BY_ROUTE: Record<keyof MainTabParamList, string> = {
  Search: 'search',
  Events: 'calendar',
  Favourites: 'heart',
  Profile: 'user',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: { fontSize: scaleFont(10), fontWeight: '600' },
        tabBarIcon: ({ color, size }) => (
          <Icon name={ICON_BY_ROUTE[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Search" component={SearchEventScreen} />
      <Tab.Screen name="Events" component={EventListingScreen} />
      <Tab.Screen name="Favourites" component={FavouriteScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
