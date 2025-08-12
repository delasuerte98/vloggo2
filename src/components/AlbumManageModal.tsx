// src/components/AlbumManageModal.tsx
// CHANGED: aggiunta sezione Contributori (add/remove) + badge Owner + uso DataContext helpers

import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DataContext } from "../../App";
import { styles } from "./AlbumManageModal.styles";
import { colors } from "../theme/colors";

type Props = { visible: boolean; onClose: () => void };

export default function AlbumManageModal({ visible, onClose }: Props) {
  const {
    albums,
    groups,
    friends, // NEW
    updateAlbum,
    deleteAlbum,
    addAlbumContributors,   // NEW
    removeAlbumContributor, // NEW
  } = useContext(DataContext);

  const insets = useSafeAreaInsets();

  // NEW: selezioni temporanee per ogni album (add/remove)
  const [toAddByAlbum, setToAddByAlbum] = useState<Record<string, string[]>>({});
  const [toRemoveByAlbum, setToRemoveByAlbum] = useState<Record<string, string[]>>({});

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
    } catch (e) {
      Alert.alert("Errore", "Impossibile selezionare l'immagine.");
    }
  };

  const changeGroup = (albumId: string, groupId: string) => {
    updateAlbum(albumId, { groupId });
  };

  const confirmDelete = (albumId: string) => {
    Alert.alert("Elimina album", "Sei sicuro?", [
      { text: "Annulla", style: "cancel" },
      { text: "Elimina", style: "destructive", onPress: () => deleteAlbum(albumId) },
    ]);
  };

  // NEW: utility toggle selezioni
  const toggleToAdd = (albumId: string, username: string) => {
    setToAddByAlbum(prev => {
      const list = prev[albumId] ?? [];
      const next = list.includes(username) ? list.filter(u => u !== username) : [...list, username];
      return { ...prev, [albumId]: next };
    });
  };
  const toggleToRemove = (albumId: string, username: string) => {
    setToRemoveByAlbum(prev => {
      const list = prev[albumId] ?? [];
      const next = list.includes(username) ? list.filter(u => u !== username) : [...list, username];
      return { ...prev, [albumId]: next };
    });
  };

  const doAddContributors = (albumId: string) => {
    const payload = (toAddByAlbum[albumId] ?? []).filter(Boolean);
    if (payload.length === 0) return;
    addAlbumContributors(albumId, payload);
    setToAddByAlbum(prev => ({ ...prev, [albumId]: [] }));
  };

  const doRemoveContributors = (albumId: string) => {
    const payload = (toRemoveByAlbum[albumId] ?? []).filter(Boolean);
    if (payload.length === 0) return;
    payload.forEach(u => removeAlbumContributor(albumId, u));
    setToRemoveByAlbum(prev => ({ ...prev, [albumId]: [] }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={[styles.headerRow, { paddingTop: 0 }]}>
          <Text style={styles.title} accessibilityRole="header">
            Gestione album
          </Text>

          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Chiudi gestione album"
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Chiudi</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) }}
          contentInsetAdjustmentBehavior="always"
        >
          {albums.map((a) => {
            // NEW: derivati per contributori
            const contributors = a.contributors ?? [];
            const ownerUsername = a.ownerId;
            const nonContributors = friends.filter(
              f => !contributors.includes(f.username) && f.username !== ownerUsername
            );
            const contributorFriends = friends.filter(
              f => contributors.includes(f.username)
            );

            const selectedAdd = toAddByAlbum[a.id] ?? [];
            const selectedRemove = toRemoveByAlbum[a.id] ?? [];

            return (
              <View key={a.id} style={styles.albumCard}>
                {/* Copertina */}
                <Pressable
                  onPress={() => pickImage(a.id)}
                  style={styles.imageWrap}
                  accessibilityRole="button"
                  accessibilityLabel={`Cambia copertina per l'album ${a.title}`}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {a.coverUri ? (
                    <Image source={{ uri: a.coverUri }} style={styles.image} />
                  ) : (
                    <Ionicons name="images-outline" size={50} color={colors.primary} />
                  )}
                </Pressable>

                <Text style={styles.albumTitle} numberOfLines={1}>
                  {a.title}
                </Text>

                {/* NEW: Owner badge */}
                <View style={styles.ownerRow}>
                  <Text style={styles.subTitle}>Owner</Text>
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerBadgeText}>{ownerUsername}</Text>
                  </View>
                </View>

                {/* Gruppo */}
                <Text style={styles.subTitle}>Gruppo</Text>
                <View style={styles.groupsWrap}>
                  {groups.map((g) => (
                    <Pressable
                      key={g.id}
                      onPress={() => changeGroup(a.id, g.id)}
                      style={[
                        styles.groupChip,
                        a.groupId === g.id && styles.groupChipSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: a.groupId === g.id }}
                      accessibilityLabel={`Imposta gruppo ${g.name}`}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.groupText}>{g.name}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* NEW: Contributori */}
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.sectionTitle}>Contributori</Text>

                  {/* Aggiungi */}
                  <Text style={styles.smallLabel}>Aggiungi</Text>
                  <View style={styles.chipsContainer}>
                    {nonContributors.length === 0 ? (
                      <Text style={{ opacity: 0.6 }}>Nessuno disponibile</Text>
                    ) : (
                      nonContributors.map((f) => {
                        const selected = selectedAdd.includes(f.username);
                        return (
                          <Pressable
                            key={f.id}
                            onPress={() => toggleToAdd(a.id, f.username)}
                            style={[styles.chip, selected && styles.chipSelected]}
                            hitSlop={6}
                          >
                            <Text
                              style={[styles.chipText, selected && styles.chipTextSelected]}
                            >
                              {f.fullName || f.username}
                            </Text>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                  <Pressable
                    onPress={() => doAddContributors(a.id)}
                    disabled={selectedAdd.length === 0}
                    style={[
                      styles.btnPrimary,
                      selectedAdd.length === 0 && styles.btnDisabled,
                    ]}
                  >
                    <Text style={styles.btnPrimaryText}>Aggiungi</Text>
                  </Pressable>

                  {/* Rimuovi */}
                  <Text style={[styles.smallLabel, { marginTop: 16 }]}>Rimuovi</Text>
                  <View style={styles.chipsContainer}>
                    {contributorFriends.length === 0 ? (
                      <Text style={{ opacity: 0.6 }}>Nessun contributore</Text>
                    ) : (
                      contributorFriends.map((f) => {
                        const selected = selectedRemove.includes(f.username);
                        return (
                          <Pressable
                            key={f.id}
                            onPress={() => toggleToRemove(a.id, f.username)}
                            style={[styles.chip, selected && styles.chipSelected]}
                            hitSlop={6}
                          >
                            <Text
                              style={[styles.chipText, selected && styles.chipTextSelected]}
                            >
                              {f.fullName || f.username}
                            </Text>
                          </Pressable>
                        );
                      })
                    )}
                  </View>
                  <Pressable
                    onPress={() => doRemoveContributors(a.id)}
                    disabled={selectedRemove.length === 0}
                    style={[
                      styles.btnSecondary,
                      selectedRemove.length === 0 && styles.btnDisabled,
                    ]}
                  >
                    <Text style={styles.btnSecondaryText}>Rimuovi</Text>
                  </Pressable>
                </View>

                {/* Elimina album */}
                <Pressable
                  onPress={() => confirmDelete(a.id)}
                  style={styles.deleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Elimina album ${a.title}`}
                >
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.deleteText}>Elimina</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
