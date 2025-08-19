// src/navigation/StackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import AlbumDetail from '../screens/Profile/AlbumDetail';

// Nuova schermata
import GroupManageScreen from '../screens/Groups/GroupManageScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
  AlbumDetail: { albumId: string };
  GroupManage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AlbumDetail"
        component={AlbumDetail}
        options={{ title: 'Dettagli Album' }}
      />

      {/* Gestione gruppi: header interno -> headerShown false */}
      <Stack.Screen
        name="GroupManage"
        component={GroupManageScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}