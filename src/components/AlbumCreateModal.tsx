// src/components/AlbumCreateModal.tsx
// CHANGED: aggiunti toggle "Condiviso" + multi-selezione amici e passaggio contributors a onCreate

import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './AlbumCreateModal.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { DataContext } from '../../App'; // NEW

type Props = {
  visible: boolean;
  onClose: () => void;
  // CHANGED: esteso per supportare contributors iniziali
  onCreate: (data: { title: string; coverUri?: string; contributors?: string[] }) => void;
};

export default function AlbumCreateModal({ visible, onClose, onCreate }: Props) {
  const { friends } = useContext(DataContext); // NEW
  const [title, setTitle] = useState('');
  const [coverUri, setCoverUri] = useState<string | undefined>(undefined);
  const [perm, setPerm] = useState(true);

  // NEW: condivisione
  const [shared, setShared] = useState(false);
  const [selectedContribs, setSelectedContribs] = useState<string[]>([]); // usernames

  useEffect(() => {
    if (!visible) {
      setTitle('');
      setCoverUri(undefined);
      setShared(false);                // NEW
      setSelectedContribs([]);         // NEW
    }
  }, [visible]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(status === 'granted');
    })();
  }, []);

  const pickCover = async () => {
    if (!perm) {
      Alert.alert('Permesso richiesto', 'Concedi accesso alla libreria.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled && res.assets?.length) setCoverUri(res.assets[0].uri);
  };

  const toggleContributor = (username: string) => {
    setSelectedContribs(prev =>
      prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username],
    );
  };

  const create = () => {
    if (!title.trim()) return Alert.alert('Titolo obbligatorio');
    onCreate({
      title: title.trim(),
      coverUri,
      contributors: shared ? selectedContribs : [], // NEW
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.subtitle, styles.title]}>Crea album</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Pressable style={styles.coverPicker} onPress={pickCover}>
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.cover} />
            ) : (
              <Ionicons name="image-outline" size={48} color={colors.muted} />
            )}
            <Text style={styles.coverHint}>{coverUri ? 'Cambia immagine' : 'Scegli immagine album'}</Text>
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder="Titolo album"
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
          />

          {/* NEW: toggle Condiviso */}
          <View style={styles.sharedRow}>
            <Text style={styles.sharedLabel}>Condiviso</Text>
            <Pressable onPress={() => setShared(s => !s)} hitSlop={8} style={{ padding: 6 }}>
              <Ionicons
                name={shared ? 'toggle' : 'toggle-outline'}
                size={32}
                color={shared ? colors.primary : colors.muted}
              />
            </Pressable>
          </View>

          {/* NEW: selezione multi-amici */}
          {shared && (
            <View style={styles.contributorsBox}>
              <Text style={styles.sectionTitle}>Contributori iniziali</Text>
              <View style={styles.chipsContainer}>
                {friends.map(f => {
                  const selected = selectedContribs.includes(f.username);
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => toggleContributor(f.username)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {f.fullName || f.username}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <Pressable
            style={[styles.createBtn, (!title.trim() || (shared && selectedContribs.length === 0)) && styles.btnDisabled]}
            onPress={create}
            disabled={!title.trim() || (shared && selectedContribs.length === 0)}
          >
            <Text style={styles.createBtnText}>Crea</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
