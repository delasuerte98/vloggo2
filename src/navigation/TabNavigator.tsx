// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/Home/FeedScreen';
import UploadScreen from '../screens/Upload/UploadScreen';
import ProfileAlbums from '../screens/Profile/ProfileAlbums';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Image } from 'react-native';
import LogoV from '../assets/logo_V_no_halo.png';

export type TabParamList = {
  Feed: undefined;
  Upload: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 15,
        },
        tabBarIcon: ({ focused, color }) => {
          let name: any = 'home-outline';
          if (route.name === 'Feed')
            name = focused ? 'home' : 'home-outline';
          if (route.name === 'Upload')
            name = focused ? 'cloud-upload' : 'cloud-upload-outline';
          if (route.name === 'Profile') {
            return (
              <Image
                source={LogoV}
                style={{ width: 34, height: 34, tintColor: color }}
                resizeMode="contain"
              />
            );
          }
          return <Ionicons name={name} size={28} color={color} />;
        },
        // tabBarShowLabel: false,
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Upload" component={UploadScreen} options={{ title: 'Carica' }} />
      <Tab.Screen name="Profile" component={ProfileAlbums} options={{ title: 'Profilo' }} />
    </Tab.Navigator>
  );
}