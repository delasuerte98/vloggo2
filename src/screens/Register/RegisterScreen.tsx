import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/StackNavigator';
import { styles } from './RegisterScreen.styles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  // campi
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [username,  setUsername]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [secure,    setSecure]    = useState(true);
  const [secure2,   setSecure2]   = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // refs per "Avanti" sulla tastiera
  const lastNameRef   = useRef<TextInput>(null);
  const usernameRef   = useRef<TextInput>(null);
  const emailRef      = useRef<TextInput>(null);
  const passwordRef   = useRef<TextInput>(null);
  const confirmRef    = useRef<TextInput>(null);

  // VALIDAZIONI BASE
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = () => {
    if (!firstName || !lastName || !username || !email || !password || !confirm) return false;
    if (!emailRegex.test(email)) return false;
    if (password.length < 6) return false;
    if (password !== confirm) return false;
    return true;
  };
  const canSubmit = isValid();

  // FLOW DI REGISTRAZIONE (placeholder API)
  const onRegister = async () => {
    if (!canSubmit) {
      Alert.alert('Attenzione', 'Controlla i campi compilati');
      return;
    }
    try {
      // TODO: integra la tua API qui (POST /register)
      await new Promise(r => setTimeout(r, 600));
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Errore', 'Registrazione non riuscita. Riprova.');
    }
  };

  const pickAvatar = () => {
    Alert.alert(
      'Foto profilo',
      'Qui potrai integrare il picker (es. expo-image-picker) per scegliere una foto.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.select({ ios: 8, android: 0 })}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/VloggoIntero2.png')}
              style={styles.logo}
            />
          </View>

          {/* TITOLO CTA */}
          <View style={styles.titleWrapper}>
            <Text style={[typography.title, styles.heroTitle]} numberOfLines={2} allowFontScaling>
              <Text style={styles.heroEmph}>Unisciti ora</Text>
              <Text> e condividi i tuoi video</Text>
            </Text>
          </View>

          {/* AVATAR */}
          <View style={styles.avatarRow}>
            <Pressable style={styles.avatar} onPress={pickAvatar} accessibilityRole="button">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              ) : (
                <Ionicons name="camera-outline" size={26} color={colors.muted} />
              )}
            </Pressable>
            <Text style={styles.avatarHint}>Foto profilo (opzionale)</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  placeholder="Mario"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  returnKeyType="next"
                  autoComplete="given-name"
                  textContentType="givenName"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Cognome</Text>
                <TextInput
                  ref={lastNameRef}
                  placeholder="Rossi"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  returnKeyType="next"
                  autoComplete="family-name"
                  textContentType="familyName"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                />
              </View>
            </View>

            <View>
              <Text style={styles.label}>Username</Text>
              <TextInput
                ref={usernameRef}
                placeholder="mario.rossi"
                placeholderTextColor={colors.muted}
                style={styles.input}
                autoCapitalize="none"
                autoComplete="username-new"
                textContentType="username"
                value={username}
                onChangeText={setUsername}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>

            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                ref={emailRef}
                placeholder="you@example.com"
                placeholderTextColor={colors.muted}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>

            <View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputPwdWrap}>
                <TextInput
                  ref={passwordRef}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.inputPwd]}
                  secureTextEntry={secure}
                  value={password}
                  onChangeText={setPassword}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmRef.current?.focus()}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={secure ? 'Mostra password' : 'Nascondi password'}
                  style={styles.eye}
                  onPress={() => setSecure(!secure)}
                >
                  <Ionicons
                    name={secure ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
              <Text style={styles.passwordHint}>Almeno 6 caratteri</Text>
            </View>

            <View>
              <Text style={styles.label}>Conferma password</Text>
              <View style={styles.inputPwdWrap}>
                <TextInput
                  ref={confirmRef}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  style={[styles.input, styles.inputPwd]}
                  secureTextEntry={secure2}
                  value={confirm}
                  onChangeText={setConfirm}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={onRegister}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={secure2 ? 'Mostra password' : 'Nascondi password'}
                  style={styles.eye}
                  onPress={() => setSecure2(!secure2)}
                >
                  <Ionicons
                    name={secure2 ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* CTA */}
          <Pressable onPress={onRegister} disabled={!canSubmit} style={{ marginTop: 6 }}>
            <LinearGradient
              colors={['#4DA9E9', '#007AFF']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Registrati</Text>
            </LinearGradient>
          </Pressable>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hai già un account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Accedi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
