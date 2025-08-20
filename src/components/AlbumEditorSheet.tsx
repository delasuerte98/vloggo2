// src/components/AlbumEditorSheet.tsx
import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  FlatList,
  Pressable,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DataContext } from '../../App';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

import ContributorsPickerSheet from './ContributorsPickerSheet';

type Mode = 'create' | 'edit';

type Props = {
  visible: boolean;
  mode?: Mode;
  albumId?: string | null;
  onClose: () => void;
  onCreated?: (album: any) => void;
  onSaved?: (albumId: string) => void;
};

export default function AlbumEditorSheet({
  visible,
  mode = 'edit',
  albumId,
  onClose,
  onCreated,
  onSaved,
}: Props) {
  const {
    albums,
    groups,
    friends,
    currentUser,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addAlbumContributors,
    removeAlbumContributor,
  } = useContext(DataContext);

  const album = useMemo(() => albums.find(a => a.id === albumId), [albums, albumId]);
  const ownerUsername = mode === 'create'
    ? currentUser?.username
    : (album?.ownerId ?? currentUser?.username);

  const [name, setName] = useState('');
  const [coverUri, setCoverUri] = useState<string | undefined>(undefined);
  const [groupIdSel, setGroupIdSel] = useState<string | undefined>(undefined);
  const [contributorsSel, setContributorsSel] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);

  // hydrate on open
  useEffect(() => {
    if (!visible) return;
    if (mode === 'create') {
      setName('');
      setCoverUri(undefined);
      setGroupIdSel(undefined);
      setContributorsSel([]);
      return;
    }
    if (album) {
      setName(album.title ?? '');
      setCoverUri(album.coverUri);
      setGroupIdSel(album.groupId);
      setContributorsSel(album.contributors ?? []);
    }
  }, [mode, album, visible]);

  const isDirty = mode === 'create'
    ? name.trim().length > 0
    : !!album && (
        name.trim() !== (album.title ?? '') ||
        coverUri !== album.coverUri ||
        groupIdSel !== album.groupId ||
        JSON.stringify([...contributorsSel].sort()) !== JSON.stringify([...(album.contributors ?? [])].sort())
      );

  const pickCover = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        setCoverUri(res.assets[0].uri);
      }
    } catch {}
  };

  const removeContributorChip = (username: string) => {
    setContributorsSel(prev => prev.filter(u => u !== username));
  };

  const confirmDelete = () => {
    if (!album) return;
    Alert.alert('Elimina album', 'Sei sicuro?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () => {
          deleteAlbum(album.id);
          onClose();
        },
      },
    ]);
  };

  const doCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Titolo richiesto', 'Inserisci un titolo.');
      return;
    }
    const created = createAlbum({
      title: trimmed,
      coverUri,
      contributors: contributorsSel,
      groupId: groupIdSel,
    });
    onCreated?.(created);
    onClose();
  };

  const doSave = () => {
    if (!album) return;
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Titolo richiesto', 'Inserisci un titolo.');
      return;
    }

    const before = new Set(album.contributors ?? []);
    const after = new Set(contributorsSel);

    const toAdd: string[] = [];
    const toRemove: string[] = [];
    after.forEach(u => { if (!before.has(u)) toAdd.push(u); });
    before.forEach(u => { if (!after.has(u)) toRemove.push(u); });

    if (toAdd.length) addAlbumContributors(album.id, toAdd);
    if (toRemove.length) toRemove.forEach(u => removeAlbumContributor(album.id, u));

    updateAlbum(album.id, { title: trimmed, coverUri, groupId: groupIdSel });
    onSaved?.(album.id);
    onClose();
  };

  const headerCtaEnabled = isDirty;
  const headerCtaText = mode === 'create' ? 'Crea' : 'Salva';
  const headerCtaOnPress = mode === 'create' ? doCreate : doSave;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        {/* Header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}>
          <Pressable onPress={onClose} hitSlop={12} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>

          <Text style={[typography.subtitle, { flex: 1, textAlign: 'center', color: colors.text }]} numberOfLines={1}>
            {mode === 'create' ? 'Nuovo album' : (album?.title ?? 'Album')}
          </Text>

          <LinearGradient
            colors={headerCtaEnabled ? ['#007fff', '#00a5f2'] : [colors.muted, colors.muted]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 14, opacity: headerCtaEnabled ? 1 : 0.6 }}
          >
            <Pressable
              onPress={headerCtaOnPress}
              disabled={!headerCtaEnabled}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 8 }}
            >
              <Ionicons name="checkmark" size={18} color={colors.white} />
              <Text style={{ color: colors.white, fontWeight: '700' }}>{headerCtaText}</Text>
            </Pressable>
          </LinearGradient>
        </View>

        <FlatList
          ListHeaderComponent={
            <>
              {/* Cover + titolo */}
              <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md, alignItems: 'center' }}>
                <Pressable
                  onPress={pickCover}
                  style={{
                    width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface,
                    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    borderWidth: 1, borderColor: colors.border
                  }}
                >
                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Ionicons name="images-outline" size={72} color={colors.primary} />
                  )}
                </Pressable>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Titolo album"
                  placeholderTextColor={colors.muted}
                  style={{
                    marginTop: spacing.md,
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border,
                    width: '100%',
                    color: colors.text,
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                />
              </View>

              {/* Gruppo */}
              <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Gruppo</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {groups.map(g => {
                    const selected = groupIdSel === g.id;
                    return (
                      <Pressable
                        key={g.id}
                        onPress={() => setGroupIdSel(g.id)}
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 999,
                          borderWidth: 1,
                          borderColor: selected ? colors.primary : colors.border,
                          backgroundColor: selected ? colors.primaryLight : colors.surface,
                        }}
                        hitSlop={6}
                      >
                        <Text style={{ color: colors.text, fontWeight: selected ? '700' as const : '600' }}>{g.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Contributori */}
              <View style={{ paddingHorizontal: spacing.lg, gap: 8 }}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>
                  Contributori ({contributorsSel.length})
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {contributorsSel.length === 0 ? (
                    <Text style={{ color: colors.muted }}>Nessun contributore</Text>
                  ) : (
                    contributorsSel.map(u => (
                      <View
                        key={u}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          paddingVertical: 6,
                          paddingHorizontal: 10,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: colors.surface,
                        }}
                      >
                        <Text style={{ color: colors.text }}>{u}</Text>
                        {u !== ownerUsername ? (
                          <Pressable onPress={() => removeContributorChip(u)} hitSlop={6}>
                            <Ionicons name="close" size={14} color={colors.muted} />
                          </Pressable>
                        ) : null}
                      </View>
                    ))
                  )}
                </View>

                <LinearGradient
                  colors={['#007fff', '#00a5f2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 14, marginTop: 6 }}
                >
                  <Pressable
                    onPress={() => setPickerOpen(true)}
                    style={{ alignItems: 'center', paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  >
                    <Ionicons name="person-add" size={18} color={colors.white} />
                    <Text style={{ color: colors.white, fontWeight: '700' }}>
                      {mode === 'create' ? 'Aggiungi contributori' : 'Gestisci contributori'}
                    </Text>
                  </Pressable>
                </LinearGradient>
              </View>

              {mode === 'edit' ? (
                <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
                  <Pressable
                    onPress={confirmDelete}
                    style={{
                      backgroundColor: colors.danger,
                      borderRadius: 14,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      gap: 8,
                      paddingVertical: spacing.md,
                    }}
                  >
                    <Ionicons name="trash" size={18} color={colors.white} />
                    <Text style={{ color: colors.white, fontWeight: '700' }}>Elimina album</Text>
                  </Pressable>
                </View>
              ) : null}
            </>
          }
          data={[]}
          renderItem={null as any}
        />

        <ContributorsPickerSheet
          visible={pickerOpen}
          friends={friends}
          initial={contributorsSel}
          ownerUsername={ownerUsername ?? ''}
          max={20}
          onClose={() => setPickerOpen(false)}
          onConfirm={(newList) => {
            setContributorsSel(newList);
            setPickerOpen(false);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}