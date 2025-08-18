import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  Pressable,
  Alert,
  Animated,
  Easing,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { styles } from './LoginScreen.styles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  /** Animazioni logo */
  const fadeAnim   = useRef(new Animated.Value(1)).current;
  const scaleAnim  = useRef(new Animated.Value(0.96)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 720,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, rotateAnim]);

  const spinY = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Attenzione', 'Inserisci email e password');
      return;
    }
    navigation.replace('Main');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          justifyContent: 'flex-start',
          paddingTop: 36,
        },
      ]}
    >
      {/* LOGO */}
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ perspective: 800 }, { scale: scaleAnim }, { rotateY: spinY }],
          }}
        >
          <Image
            source={require('../../assets/logo_V_no_halo.png')}
            style={{ width: 180, height: 180, resizeMode: 'contain' }}
          />
        </Animated.View>
      </View>

      {/* TITOLO */}
      <Text
        style={[
          typography.title,
          styles.title,
          { textAlign: 'center', marginBottom: 32, marginTop: 10 },
        ]}
      >
        Accedi
      </Text>

      {/* FORM */}
      <View style={{ gap: 14, marginTop: -10 }}>
        <View>
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
        </View>

        <View>
          <Text style={styles.label}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={[styles.input, { paddingRight: 40 }]}
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              style={{ position: 'absolute', right: 12, top: 14 }}
              onPress={() => setSecure(!secure)}
            >
              <Ionicons
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.muted}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* CTA */}
      <Pressable onPress={onLogin} style={{ marginTop: 24 }}>
        <LinearGradient
          colors={['#4DA9E9', '#007AFF']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Accedi</Text>
        </LinearGradient>
      </Pressable>

      {/* FOOTER LINK */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Non hai un account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Registrati</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}