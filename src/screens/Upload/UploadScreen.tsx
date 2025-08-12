// src/screens/Upload/UploadScreen.tsx
// CHANGED: mostra solo album caricabili (permessi) + badge "Condiviso" e creazione album con contributors

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './UploadScreen.styles';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { DataContext } from '../../../App';
import DropdownMulti from '../../components/DropdownMulti';
import AlbumCreateModal from '../../components/AlbumCreateModal';
import GroupCreateModal from '../../components/GroupCreateModal';
import { SafeAreaView } from 'react-native-safe-area-context';

type AlbumOption = { id: string; title: string; isShared?: boolean };

export default function UploadScreen() {
  const {
    groups,
    albums,
    friends,
    addFeedItem,
    createAlbum,
    addVideoToAlbum,
    createGroup,
    canUserUploadToAlbum, // NEW
    currentUser,          // NEW
  } = useContext(DataContext);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | 'none' | 'create'>('none');
  const [albumModal, setAlbumModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickVideo = async () => {
    if (hasPermission === false) {
      Alert.alert('Permesso necessario', 'Concedi accesso alla libreria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets?.length) setVideoUri(result.assets[0].uri);
  };

  // NEW: solo album su cui l'utente può caricare
  const allowedAlbums = useMemo(
    () => albums.filter(a => canUserUploadToAlbum(currentUser, a)),
    [albums, currentUser, canUserUploadToAlbum]
  );

  // NEW: opzioni con badge "Condiviso" (contributors > 0)
  const albumOptions: AlbumOption[] = useMemo(
    () => [
      { id: 'none', title: 'Nessun album' },
      { id: 'create', title: 'Crea nuovo album…' },
      ...allowedAlbums.map(a => ({
        id: a.id,
        title: a.title,
        isShared: (a.contributors?.length ?? 0) > 0,
      })),
    ],
    [allowedAlbums]
  );

  const onUpload = () => {
    if (!videoUri) return Alert.alert('Seleziona un video');
    if (!title.trim()) return Alert.alert('Titolo mancante');

    let albumIdToUse: string | undefined = undefined;

    if (selectedAlbumId !== 'none' && selectedAlbumId !== 'create') {
      // Guard rail extra (anche se già filtriamo)
      const chosen = albums.find(a => a.id === selectedAlbumId);
      if (chosen && !canUserUploadToAlbum(currentUser, chosen)) {
        Alert.alert('Non hai i permessi', 'Non puoi caricare in questo album.');
        return;
      }
      albumIdToUse = selectedAlbumId as string;
      addVideoToAlbum({
        albumId: albumIdToUse,
        video: { id: `v_${Date.now()}`, uri: videoUri, title: title.trim(), description },
      });
    }

    const groupId = selectedGroups[0] ?? groups[0]?.id;
    if (groupId)
      addFeedItem({
        uri: videoUri,
        title: title.trim(),
        description,
        groupId,
        albumId: albumIdToUse,
      });

    setVideoUri(null);
    setTitle('');
    setDescription('');
    setSelectedGroups([]);
    setSelectedAlbumId('none');
    Alert.alert('Caricato', 'Video aggiunto (album e feed).');
  };

  // CHANGED: supporta contributors dalla modal
  const onCreateAlbum = (data: { title: string; coverUri?: string; contributors?: string[] }) => {
    const newAlbum = createAlbum(data); // createAlbum setta ownerId=currentUser e contributors
    setAlbumModal(false);
    setSelectedAlbumId(newAlbum.id);
  };

  const onCreateGroup = (data: { name: string; image?: string; memberUsernames: string[] }) => {
    const g = createGroup(data);
    setGroupModal(false);
    setSelectedGroups(prev => [...prev, g.id]); // seleziona subito il gruppo creato
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.title, styles.screenTitle]}>Carica video</Text>

        <Pressable style={styles.selectBtn} onPress={pickVideo}>
          <Ionicons name="folder-open-outline" size={20} color={colors.white} />
          <Text style={styles.selectBtnText}>Seleziona un video dalla galleria</Text>
        </Pressable>

        {videoUri && (
          <View style={styles.preview}>
            <Video
              source={{ uri: videoUri }}
              style={styles.previewVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
          </View>
        )}

        <Text style={styles.label}>Titolo</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Titolo del video"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Descrizione</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descrizione (facoltativa)"
          placeholderTextColor={colors.muted}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        {/* Gruppi + pulsante + */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.label}>Gruppi</Text>
          <Pressable
            onPress={() => setGroupModal(true)}
            style={{ padding: 6, borderRadius: 999, backgroundColor: colors.primaryLight }}
          >
            <Ionicons name="add" size={18} color={colors.primaryDark} />
          </Pressable>
        </View>
        <DropdownMulti groups={groups} selected={selectedGroups} onChange={setSelectedGroups} />

        <Text style={styles.label}>Album</Text>
        <View style={styles.albumControl}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {albumOptions.map(opt => {
              const sel = selectedAlbumId === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => {
                    if (opt.id === 'create') {
                      setAlbumModal(true);
                      return;
                    }
                    // NEW: guard rail su selezione album
                    if (opt.id !== 'none') {
                      const album = albums.find(a => a.id === opt.id);
                      if (album && !canUserUploadToAlbum(currentUser, album)) {
                        Alert.alert('Accesso negato', 'Non puoi caricare video in questo album.');
                        return;
                      }
                    }
                    setSelectedAlbumId(opt.id as any);
                  }}
                  style={[styles.albumChip, sel && styles.albumChipSelected]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={[styles.albumChipText, sel && styles.albumChipTextSel]}
                      numberOfLines={1}
                    >
                      {opt.title}
                    </Text>
                    {/* NEW: badge "Condiviso" sugli album con contributors */}
                    {opt.isShared && (
                      <Text
                        style={{
                          fontSize: 10,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 10,
                          backgroundColor: '#eef2ff',
                        }}
                      >
                        Condiviso
                      </Text>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <Pressable style={styles.uploadBtn} onPress={onUpload}>
          <Ionicons name="cloud-upload" size={20} color={colors.white} />
          <Text style={styles.uploadBtnText}>Carica video</Text>
        </Pressable>
      </ScrollView>

      <AlbumCreateModal
        visible={albumModal}
        onClose={() => setAlbumModal(false)}
        onCreate={onCreateAlbum} // CHANGED: accetta contributors
      />
      <GroupCreateModal
        visible={groupModal}
        friends={friends}
        onClose={() => setGroupModal(false)}
        onCreate={onCreateGroup}
      />
    </SafeAreaView>
  );
}
