import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, TextInput, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './ProfileEditModal.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  initial: { fullName: string; avatar?: string; bio?: string; location?: string };
  onClose: () => void;
  onSave: (data: { fullName: string; avatar?: string; bio?: string; location?: string }) => void;
};

export default function ProfileEditModal({ visible, initial, onClose, onSave }: Props) {
  const [name, setName] = useState(initial.fullName);
  const [bio, setBio] = useState(initial.bio ?? '');
  const [location, setLocation] = useState(initial.location ?? '');
  const [avatar, setAvatar] = useState<string | undefined>(initial.avatar);
  const [perm, setPerm] = useState<boolean>(true);

  useEffect(() => {
    setName(initial.fullName);
    setBio(initial.bio ?? '');
    setLocation(initial.location ?? '');
    setAvatar(initial.avatar);
  }, [initial, visible]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(status === 'granted');
    })();
  }, []);

  const pickAvatar = async () => {
    if (!perm) { Alert.alert('Permesso richiesto', 'Concedi accesso alla libreria.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.9 });
    if (!res.canceled && res.assets?.length) setAvatar(res.assets[0].uri);
  };

  const save = () => onSave({ fullName: name.trim(), avatar, bio: bio.trim(), location: location.trim() });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.subtitle, styles.title]}>Modifica profilo</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={colors.text} /></Pressable>
          </View>
          <ScrollView style={{ maxHeight: '80%' }} contentContainerStyle={{ gap: 12 }}>
            <Pressable style={styles.avatarWrap} onPress={pickAvatar}>
              {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} /> : <Ionicons name="person-circle-outline" size={72} color={colors.muted} />}
              <Text style={styles.changePhoto}>Cambia foto</Text>
            </Pressable>
            <TextInput style={styles.input} placeholder="Nome e cognome" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />
            <TextInput style={[styles.input, { height: 90 }]} multiline placeholder="Bio" placeholderTextColor={colors.muted} value={bio} onChangeText={setBio} />
            <TextInput style={styles.input} placeholder="Località" placeholderTextColor={colors.muted} value={location} onChangeText={setLocation} />
          </ScrollView>
          <Pressable style={styles.saveBtn} onPress={save}><Text style={styles.saveBtnText}>Salva</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}
