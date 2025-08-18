import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    canUserUploadToAlbum,
    currentUser,
  } = useContext(DataContext);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | 'none' | 'create'>('none');
  const [albumModal, setAlbumModal] = useState(false);
  const [groupModal, setGroupModal] = useState(false);

  const videoRef = useRef<Video>(null);
  const [posterUri, setPosterUri] = useState<string | undefined>(undefined);
  const [showPoster, setShowPoster] = useState<boolean>(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  const canUpload = !!videoUri && title.trim().length > 0;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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

    Alert.alert('Caricato', 'Video aggiunto (album e feed).');
  };

  const onCreateAlbum = (data: { title: string; coverUri?: string; contributors?: string[] }) => {
    const newAlbum = createAlbum(data);
    setAlbumModal(false);
    setSelectedAlbumId(newAlbum.id);
  };

  const onCreateGroup = (data: { name: string; image?: string; memberUsernames: string[] }) => {
    const g = createGroup(data);
    setGroupModal(false);
    setSelectedGroups(prev => [...prev, g.id]);
  };

  const handlePlay = async () => {
    try {
      setShowPoster(false);
      await videoRef.current?.playAsync();
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.title, styles.headerTitle]}>Carica un video</Text>
          <Text style={styles.headerSub}>Condividi momenti con i tuoi amici</Text>
        </View>
        <View style={styles.headerActions} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
              <Text style={styles.sectionTitle}>Gruppi</Text>
            </View>
            <Pressable onPress={() => setGroupModal(true)} style={styles.circleAddBtn} hitSlop={8}>
              <Ionicons name="add" size={18} color={colors.primaryDark} />
            </Pressable>
          </View>

          <DropdownMulti groups={groups} selected={selectedGroups} onChange={setSelectedGroups} />
        </View>

        {/* ALBUM */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name="images-outline" size={16} color={colors.primaryDark} />
              </View>
              <Text style={styles.sectionTitle}>Album</Text>
            </View>
            <Text style={styles.sectionHint}>Organizza al meglio i tuoi video</Text>
          </View>

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

        <View style={{ height: 100 }} />
      </ScrollView>

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

      <AlbumCreateModal visible={albumModal} onClose={() => setAlbumModal(false)} onCreate={onCreateAlbum} />
      <GroupCreateModal visible={groupModal} friends={friends} onClose={() => setGroupModal(false)} onCreate={onCreateGroup} />
    </SafeAreaView>
  );
}