import React, { useState } from 'react';
import { Text, TextInput, Pressable, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { styles } from './LoginScreen.styles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Attenzione', 'Inserisci email e password');
      return;
    }
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.title, styles.title]}>Accedi</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="you@example.com"
        placeholderTextColor={colors.muted}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="••••••••"
        placeholderTextColor={colors.muted}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Accedi</Text>
      </Pressable>
    </SafeAreaView>
  );
}
