import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './AlbumCreateModal.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; coverUri?: string }) => void;
};

export default function AlbumCreateModal({ visible, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [coverUri, setCoverUri] = useState<string | undefined>(undefined);
  const [perm, setPerm] = useState(true);

  useEffect(() => { if (!visible) { setTitle(''); setCoverUri(undefined); } }, [visible]);
  useEffect(() => { (async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPerm(status === 'granted');
  })(); }, []);

  const pickCover = async () => {
    if (!perm) { Alert.alert('Permesso richiesto', 'Concedi accesso alla libreria.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.9 });
    if (!res.canceled && res.assets?.length) setCoverUri(res.assets[0].uri);
  };

  const create = () => {
    if (!title.trim()) return Alert.alert('Titolo obbligatorio');
    onCreate({ title: title.trim(), coverUri });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.subtitle, styles.title]}>Crea album</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={colors.text} /></Pressable>
          </View>
          <Pressable style={styles.coverPicker} onPress={pickCover}>
            {coverUri ? <Image source={{ uri: coverUri }} style={styles.cover} /> : <Ionicons name="image-outline" size={48} color={colors.muted} />}
            <Text style={styles.coverHint}>{coverUri ? 'Cambia immagine' : 'Scegli immagine album'}</Text>
          </Pressable>
          <TextInput style={styles.input} placeholder="Titolo album" placeholderTextColor={colors.muted} value={title} onChangeText={setTitle} />
          <Pressable style={styles.createBtn} onPress={create}><Text style={styles.createBtnText}>Crea</Text></Pressable>
        </View>
      </View>
    </Modal>
  );
}
