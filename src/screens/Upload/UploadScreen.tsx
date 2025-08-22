// src/screens/Upload/UploadScreen.tsx
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Alert, TextInput, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './UploadScreen.styles';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { DataContext, Group } from '../../../App';
import DropdownMulti from '../../components/DropdownMulti';
import GroupCreateSheet from '../Groups/components/GroupCreateSheet';
import AlbumEditorSheet from '../../components/AlbumEditorSheet';
import { useRoute } from '@react-navigation/native';
import GroupEditorSheet from '../Groups/components/GroupEditorSheet';
import ScreenContainer from '../../components/layout/ScreenContainer';

type UploadRouteParams = { preselectedAlbumId?: string };
type AlbumOption = { id: string; title: string; isShared?: boolean };

export default function UploadScreen() {
  const {
    groups,
    albums,
    friends,
    addFeedItem,
    addVideoToAlbum,
    createGroup,
    canUserUploadToAlbum,
    currentUser,
    updateGroup,
  } = useContext(DataContext); // ❌ rimosso createAlbum: non lo usiamo qui (lo fa AlbumEditorSheet)

  const route = useRoute<any>();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | 'none' | 'create'>('none');

  // Editor album (crea/edit)
  const [albumEditorVisible, setAlbumEditorVisible] = useState(false);
  const [albumEditorMode, setAlbumEditorMode] = useState<'create' | 'edit'>('create');
  const [albumEditorId, setAlbumEditorId] = useState<string | null>(null);

  // Sheet gruppi (crea)
  const [groupSheet, setGroupSheet] = useState(false);

  // Editor gruppo (info → modifica)
  const [groupEditorOpen, setGroupEditorOpen] = useState(false);
  const [groupEditorSelected, setGroupEditorSelected] = useState<Group | null>(null);

  const videoRef = useRef<Video>(null);
  const [posterUri, setPosterUri] = useState<string | undefined>(undefined);
  const [showPoster, setShowPoster] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  // Toast/snackbar
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const canUpload = !!videoUri && title.trim().length > 0;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const pre = (route.params as UploadRouteParams | undefined)?.preselectedAlbumId;
    if (pre && albums.some(a => a.id === pre)) {
      setSelectedAlbumId(pre);
    }
  }, [route.params, albums]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    Animated.timing(toastAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToastMsg(null));
      }, 1800);
    });
  };

  const formatDuration = (millis: number) => {
    const totalSec = Math.floor(millis / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const generatePoster = async (uri: string) => {
    try {
      const { uri: thumb } = await VideoThumbnails.getThumbnailAsync(uri, { time: 800 });
      setPosterUri(thumb);
      setShowPoster(true);
    } catch {
      setPosterUri(undefined);
      setShowPoster(false);
    }
  };

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
    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);
      await generatePoster(uri);
    }
  };

  const allowedAlbums = useMemo(
    () => albums.filter(a => canUserUploadToAlbum(currentUser, a)),
    [albums, currentUser, canUserUploadToAlbum]
  );

  const albumOptions: AlbumOption[] = useMemo(
    () => [
      { id: 'none', title: 'Nessun album' },
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
    setPosterUri(undefined);
    setShowPoster(false);
    setVideoDuration(null);

    showToast('Video caricato ✅');
  };

  // CREA ALBUM (EditorSheet mode='create')
  const openCreateAlbum = () => {
    setAlbumEditorMode('create');
    setAlbumEditorId(null);
    setAlbumEditorVisible(true);
  };

  // EDIT ALBUM SELEZIONATO
  const openEditSelectedAlbum = () => {
    const aid = typeof selectedAlbumId === 'string' ? selectedAlbumId : null;
    if (!aid || aid === 'none' || aid === 'create') return;
    setAlbumEditorMode('edit');
    setAlbumEditorId(aid);
    setAlbumEditorVisible(true);
  };

  // Crea gruppo (da Upload)
  const onCreateGroup = (data: { name: string; image?: string; memberUsernames: string[] }) => {
    const g = createGroup(data);
    setGroupSheet(false);
    setSelectedGroups(prev => [...prev, g.id]);
    showToast('Gruppo creato ✅');
  };

  // Apri editor gruppo dalla “i”
  const openGroupEditor = (groupId: string) => {
    const g = groups.find(gr => gr.id === groupId) || null;
    setGroupEditorSelected(g);
    setGroupEditorOpen(true);
  };
  const closeGroupEditor = () => {
    setGroupEditorOpen(false);
    setGroupEditorSelected(null);
  };

  const handlePlay = async () => {
    try {
      setShowPoster(false);
      await videoRef.current?.playAsync();
    } catch {}
  };

  return (
    // ✅ Wrapper unico scrollabile + gestione tastiera
    <ScreenContainer withScroll headerHeight={1} keyboardOffset={8}  contentPaddingHorizontal={0}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.title, styles.headerTitle]}>Carica un video</Text>
          <Text style={styles.headerSub}>Condividi i tuoi momenti preferiti con i tuoi amici</Text>
        </View>
        <View style={styles.headerActions} />
      </View>

      {/* ✅ NIENTE ScrollView qui: lasciamo scorrere il wrapper */}
      <View style={styles.content}>
        {/* CARD UNIFICATA: Video + Dettagli */}
        <View style={styles.unifiedCard}>
          {/* Blocco media */}
          {videoUri ? (
            <View style={styles.previewCard}>
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.previewVideo}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping={false}
                posterSource={posterUri ? { uri: posterUri } : undefined}
                usePoster={!!posterUri && showPoster}
                onPlaybackStatusUpdate={(status) => {
                  if ('durationMillis' in status && status.durationMillis && !videoDuration) {
                    setVideoDuration(formatDuration(status.durationMillis));
                  }
                  if ('didJustFinish' in status && status.didJustFinish) {
                    setShowPoster(true);
                    videoRef.current?.stopAsync();
                  }
                  if ('isPlaying' in status && status.isPlaying && showPoster) {
                    setShowPoster(false);
                  }
                }}
              />
              {/* Overlay & durata */}
              {showPoster ? (
                <Pressable style={styles.previewOverlay} onPress={handlePlay} hitSlop={8}>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={28} color={colors.white} />
                  </View>
                </Pressable>
              ) : null}
              {videoDuration ? (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{videoDuration}</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <Pressable style={styles.emptyPickerV2} onPress={pickVideo} hitSlop={8}>
              <LinearGradient
                colors={['#4DA9E9', '#007AFF']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.emptyPickerIconV2}
              >
                <Ionicons name="cloud-upload-outline" size={22} color={colors.white} />
              </LinearGradient>
              <Text style={styles.emptyPickerTitle}>Aggiungi un video</Text>
              <Text style={styles.emptyPickerSub}>Seleziona dalla tua galleria</Text>
            </Pressable>
          )}

          {/* Blocco dettagli */}
          <View style={{ gap: 8 }}>
            <Text style={styles.labelStrong}>Titolo</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Titolo del video"
              placeholderTextColor={colors.muted}
              style={styles.input}
              autoCapitalize="sentences"
              returnKeyType="next"
            />

            <Text style={styles.labelStrong}>Descrizione</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descrizione (facoltativa)"
              placeholderTextColor={colors.muted}
              style={[styles.input, styles.textarea]}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* GRUPPI */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="people-outline" size={16} color={colors.primaryDark} />
              </View>
              <Text style={styles.sectionTitle}>Gruppi </Text>
            </View>
            <Pressable onPress={() => setGroupSheet(true)} style={styles.circleAddBtn} hitSlop={8}>
              <Ionicons name="add" size={18} color={colors.primaryDark} />
            </Pressable>
          </View>

          <DropdownMulti
            groups={groups}
            selected={selectedGroups}
            onChange={setSelectedGroups}
            onInfo={openGroupEditor} // ← clic sulla “i” apre l’editor gruppo
          />
        </View>

        {/* ALBUM */}
        <View style={[styles.sectionCard, { marginBottom: -16 }]}> 
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="images-outline" size={16} color={colors.primaryDark} />
              </View>
              <Text style={styles.sectionTitle}>Album</Text>
            </View>

            {/* Azioni: modifica album selezionato + crea */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {typeof selectedAlbumId === 'string' && selectedAlbumId !== 'none' && selectedAlbumId !== 'create' ? (
                <Pressable onPress={openEditSelectedAlbum} hitSlop={6} style={styles.circleAddBtn}>
                  <Ionicons name="settings-outline" size={16} color={colors.primaryDark} />
                </Pressable>
              ) : null}
              <Pressable onPress={openCreateAlbum} hitSlop={8} style={styles.circleAddBtn}>
                <Ionicons name="add" size={18} color={colors.primaryDark} />
              </Pressable>
            </View>
          </View>

          <View style={styles.albumControl}>
            {/* ✅ questa ScrollView resta: è orizzontale per i chip */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {albumOptions.map(opt => {
                const sel = selectedAlbumId === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => {
                      if (opt.id !== 'none') {
                        const album = albums.find(a => a.id === opt.id);
                        if (album && !canUserUploadToAlbum(currentUser, album)) {
                          Alert.alert('Accesso negato', 'Non puoi caricare video in questo album.');
                          return;
                        }
                      }
                      setSelectedAlbumId(opt.id as any);
                    }}
                    style={[styles.albumChipV2, sel && styles.albumChipV2Sel]}
                    hitSlop={6}
                  >
                    <Text style={[styles.albumChipText, sel && styles.albumChipTextSel]} numberOfLines={1}>
                      {opt.title}
                    </Text>
                    {sel ? <Ionicons name="checkmark-circle" size={14} color={colors.primaryDark} /> : null}
                    {opt.isShared ? <Text style={styles.sharedBadge}>Condiviso</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

      </View>

      {/* Bottom CTA bar (gradient) */}
      <View style={styles.bottomBar}>
        <Pressable onPress={onUpload} disabled={!canUpload} style={{ borderRadius: 16 }} hitSlop={6}>
          <LinearGradient
            colors={['#4DA9E9', '#007AFF']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.primaryBtn, !canUpload && styles.primaryBtnDisabled]}
          >
            <Ionicons name="cloud-upload" size={18} color={colors.white} />
            <Text style={styles.primaryBtnText}>Carica video</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Editor album riusabile */}
      <AlbumEditorSheet
        visible={albumEditorVisible}
        mode={albumEditorMode}
        albumId={albumEditorId}
        onClose={() => setAlbumEditorVisible(false)}
        onCreated={(newAlbum) => {
          setSelectedAlbumId(newAlbum.id);
          setAlbumEditorVisible(false);
          showToast('Album creato ✅');
        }}
        onSaved={() => {
          setAlbumEditorVisible(false);
          showToast('Album aggiornato ✅');
        }}
      />

      {/* Crea gruppo da Upload */}
      <GroupCreateSheet
        visible={groupSheet}
        friends={friends}
        maxMembers={50}
        onClose={() => setGroupSheet(false)}
        onCreate={onCreateGroup}
      />

      {/* Editor gruppo da “i” info */}
      <GroupEditorSheet
        visible={groupEditorOpen}
        group={groupEditorSelected}
        maxMembers={50}
        friends={friends}
        onClose={closeGroupEditor}
        onSave={(id, payload) => updateGroup(id, payload)}
      />

      {/* Toast/snackbar */}
      {toastMsg ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
            backgroundColor: '#111827',
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
          <Text style={{ color: '#fff', fontWeight: '600' }}>{toastMsg}</Text>
        </Animated.View>
      ) : null}
    </ScreenContainer>
  );
}