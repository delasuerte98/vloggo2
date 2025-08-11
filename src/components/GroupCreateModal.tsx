import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, Image, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './GroupCreateModal.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { Friend } from '../../App';

type Props = {
  visible: boolean;
  friends: Friend[];
  onClose: () => void;
  onCreate: (data: { name: string; image?: string; memberUsernames: string[] }) => void;
};

export default function GroupCreateModal({ visible, friends, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [coverUri, setCoverUri] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [perm, setPerm] = useState(true);

  useEffect(() => { (async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setPerm(status === 'granted');
  })(); }, []);

  useEffect(() => { if (!visible) { setName(''); setCoverUri(undefined); setSelected({}); } }, [visible]);

  const pickCover = async () => {
    if (!perm) { Alert.alert('Permesso richiesto', 'Concedi accesso alla libreria.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.9 });
    if (!res.canceled && res.assets?.length) setCoverUri(res.assets[0].uri);
  };

  const members = useMemo(() => Object.keys(selected).filter(u => selected[u]), [selected]);

  const toggle = (u: string) => setSelected(prev => ({ ...prev, [u]: !prev[u] }));

  const create = () => {
    if (!name.trim()) return Alert.alert('Nome gruppo obbligatorio');
    onCreate({ name: name.trim(), image: coverUri, memberUsernames: members });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.subtitle, styles.title]}>Crea gruppo</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={colors.text} /></Pressable>
          </View>

          <Pressable style={styles.coverPicker} onPress={pickCover}>
            {coverUri ? <Image source={{ uri: coverUri }} style={styles.cover} /> : <Ionicons name="people-circle-outline" size={48} color={colors.muted} />}
            <Text style={styles.coverHint}>{coverUri ? 'Cambia immagine' : 'Scegli immagine gruppo'}</Text>
          </Pressable>

          <TextInput style={styles.input} placeholder="Nome gruppo" placeholderTextColor={colors.muted} value={name} onChangeText={setName} />

          <Text style={styles.subLabel}>Aggiungi amici</Text>
          <FlatList
            style={styles.list}
            data={friends}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => toggle(item.username)}>
                <Ionicons name="person-circle-outline" size={24} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fullName}>{item.fullName}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
                <Ionicons name={selected[item.username] ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={selected[item.username] ? colors.primary : colors.muted} />
              </Pressable>
            )}
          />

          <Pressable style={styles.createBtn} onPress={create}>
            <Text style={styles.createBtnText}>Crea</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
