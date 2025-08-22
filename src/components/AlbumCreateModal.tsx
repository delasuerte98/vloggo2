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
  // 👉 nuove callback verso il parent
  onRequestCreate: () => void;
  onRequestEdit: (albumId: string) => void;
  // 👉 trigger quando la modale ha finito di chiudersi (per aprire l'editor dopo)
  onDismiss?: () => void;
};

export default function AlbumManageModal({
  visible,
  onClose,
  onRequestCreate,
  onRequestEdit,
  onDismiss,
}: Props) {
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
      onDismiss={onDismiss} // 👈 importantissimo: il parent apre l'editor QUI
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          {/* NUOVO: “Nuovo” chiede al parent di aprire l'editor (modal Upload-style) */}
          <Pressable
            onPress={onRequestCreate}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Crea nuovo album"
            style={{ borderRadius: 12, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={colors.gradients?.primary ?? ['#007fff', '#00a5f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}
          contentInsetAdjustmentBehavior="always"
        >
          {albums.map(a => (
            <View key={a.id} style={styles.albumCard}>
              {/* Cover (tap per cambiare immagine) */}
              <Pressable onPress={() => pickImage(a.id)} style={styles.imageWrap} hitSlop={8}>
                {a.coverUri ? (
                  <Image source={{ uri: a.coverUri }} style={styles.image} />
                ) : (
                  <Ionicons name="images-outline" size={46} color={colors.primary} />
                )}
              </Pressable>

              <Text style={styles.albumTitle} numberOfLines={1}>
                {a.title}
              </Text>

              {/* Riassunto */}
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

              {/* CTA Gestisci → chiede al parent di aprire editor in modalità edit */}
              <LinearGradient
                colors={colors.gradients?.primary ?? ['#007fff', '#00a5f2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.manageBtn}
              >
                <Pressable
                  onPress={() => onRequestEdit(a.id)}
                  style={styles.manageBtnInner}
                  hitSlop={6}
                >
                  <Ionicons name="settings-outline" size={18} color={colors.white} />
                  <Text style={styles.manageBtnText}>Gestisci</Text>
                </Pressable>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

        {/* FAB nuovo album */}
        <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
          <Pressable
            onPress={onRequestCreate}
            style={{ borderRadius: 28, overflow: 'hidden' }}
            accessibilityRole="button"
            accessibilityLabel="Crea nuovo album"
          >
            <LinearGradient
              colors={colors.gradients?.primary ?? ['#007fff', '#00a5f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.22,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 8,
              }}
            >
              <Ionicons name="add" size={26} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}