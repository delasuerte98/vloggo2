// src/components/AlbumManageModal.tsx
import React, { useContext } from 'react';
import { View, Text, Modal, Pressable, Image, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import { DataContext } from '../../App';
import { styles } from './AlbumManageModal.styles';
import { colors } from '../theme/colors';

type Props = { 
  visible: boolean; 
  onClose: () => void; 
  onEditAlbum: (id: string) => void;   // 👈 nuovo
  onCreateAlbum: () => void;           // 👈 nuovo
};

export default function AlbumManageModal({ visible, onClose, onEditAlbum, onCreateAlbum }: Props) {
  const insets = useSafeAreaInsets();
  const { albums, updateAlbum, groups } = useContext(DataContext);

  const pickImage = async (albumId: string) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        updateAlbum(albumId, { coverUri: res.assets[0].uri });
      }
    } catch {}
  };

  const groupName = (gid?: string) =>
    groups.find(g => g.id === gid)?.name ?? '—';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={onCreateAlbum}   // 👈 apre editor "create"
            hitSlop={8}
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#007fff', '#00a5f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Ionicons name="add" size={16} color={colors.white} />
              <Text style={{ color: colors.white, fontWeight: '700' }}>Nuovo</Text>
            </LinearGradient>
          </Pressable>

          <Text style={styles.title}>Gestione album</Text>

          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Text style={styles.closeText}>Chiudi</Text>
          </Pressable>
        </View>

        {/* Lista album */}
        <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          {albums.map(a => (
            <View key={a.id} style={styles.albumCard}>
              <Pressable onPress={() => pickImage(a.id)} style={styles.imageWrap} hitSlop={8}>
                {a.coverUri ? (
                  <Image source={{ uri: a.coverUri }} style={styles.image} />
                ) : (
                  <Ionicons name="images-outline" size={46} color={colors.primary} />
                )}
              </Pressable>

              <Text style={styles.albumTitle} numberOfLines={1}>{a.title}</Text>

              <View style={styles.summaryRow}>
                <Ionicons name="people-outline" size={16} color={colors.muted} />
                <Text style={styles.summaryText}>Gruppo: {groupName(a.groupId)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="person-add-outline" size={16} color={colors.muted} />
                <Text style={styles.summaryText}>
                  Contributori: {(a.contributors?.length ?? 0)}
                </Text>
              </View>

              {/* Bottone Gestisci */}
              <LinearGradient colors={['#007fff', '#00a5f2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.manageBtn}>
                <Pressable onPress={() => onEditAlbum(a.id)} style={styles.manageBtnInner} hitSlop={6}>
                  <Ionicons name="settings-outline" size={18} color={colors.white} />
                  <Text style={styles.manageBtnText}>Gestisci</Text>
                </Pressable>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}