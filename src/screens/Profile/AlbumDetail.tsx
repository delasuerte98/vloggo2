// src/screens/Profile/AlbumDetail.tsx
import React, { useContext, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { DataContext, FeedItem } from '../../../App';
import VideoCard from '../../components/VideoCard';
import ScreenContainer from '../../components/layout/ScreenContainer';
import { styles } from './AlbumDetail.styles';
import { colors } from '../../theme/colors';

export default function AlbumDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Presupposti in DataContext:
  // - albums: stato globale con { id, videos: [...] }
  // - deleteVideo?(albumId: string, videoId: string): Promise<void> | void (opzionale)
  const { albums, groups, currentUser, canUserUploadToAlbum, deleteVideo } = useContext(DataContext);

  const albumId = route.params?.albumId;
  const album = albums.find(a => a.id === albumId);

  const canUpload = useMemo(
    () => (album ? canUserUploadToAlbum(currentUser, album) : false),
    [album, currentUser, canUserUploadToAlbum]
  );

  // Costruisco i FeedItem dalla sorgente album
  const computedItems: FeedItem[] = useMemo(() => {
    if (!album) return [];
    const group = groups.find(g => g.id === album.groupId);
    return album.videos.map(v => ({
      id: v.id,
      uri: v.uri,
      title: v.title ?? '',
      description: v.description ?? '',
      group: group!,
      albumId: album.id,
      albumTitle: album.title,
      user: { username: currentUser, avatar: (album as any)?.ownerAvatar },
      likes: v.likes ?? [],
      comments: v.comments ?? [],
    }));
  }, [album, groups, currentUser]);

  // Stato locale visualizzato dalla FlatList (per rimuovere subito il video)
  const [items, setItems] = useState<FeedItem[]>(computedItems);
  useEffect(() => {
    setItems(computedItems);
  }, [computedItems]);

  const onAddVideo = () => {
    navigation.navigate('Main' as never, { screen: 'Upload', params: { preselectedAlbumId: album?.id } } as never);
  };

  // 3 puntini: solo ELIMINA VIDEO (con conferma) + rimozione ottimistica
  const onRequestDelete = useCallback((item: FeedItem) => {
    if (!album) return;
    Alert.alert(
      'Eliminare questo video?',
      `Il video "${item.title || 'senza titolo'}" verrà rimosso dall’album.`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            // Rimozione ottimistica
            setItems(prev => prev.filter(x => x.id !== item.id));

            try {
              if (typeof deleteVideo === 'function') {
                await Promise.resolve(deleteVideo(album.id, item.id));
              } else {
                // Se manca deleteVideo nel DataContext, almeno avvisa
                console.warn('deleteVideo non definita nel DataContext');
              }
            } catch (e) {
              console.warn(e);
              // Ripristina in caso di errore
              setItems(prev => {
                const alreadyHas = prev.some(x => x.id === item.id);
                return alreadyHas ? prev : [item, ...prev];
              });
              Alert.alert('Errore', 'Non è stato possibile eliminare il video.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [album, deleteVideo]);

  if (!album) {
    return (
      <ScreenContainer withScroll={false} headerHeight={0}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
          <Text style={styles.emptyText}>Album non trovato</Text>
        </View>
      </ScreenContainer>
    );
  }

  const listRef = useRef<FlatList<FeedItem>>(null);
  const HEADER_HEIGHT = 36;

  return (
    // ⚠️ Nel navigator: options={{ headerShown: false }} per questa screen
    <ScreenContainer withScroll={false} headerHeight={0}>
      {/* Header sovrapposto */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 6,
          backgroundColor: colors.background,
          zIndex: 10,
          elevation: 2,
        }}
      >
        <View style={{ height: HEADER_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.topBarTitle} numberOfLines={1}>{album.title}</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <VideoCard item={item} onRequestDelete={onRequestDelete} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Nessun video in questo album</Text>}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: HEADER_HEIGHT + 6,
          paddingBottom: 24 + insets.bottom,
          ...(items.length === 0 ? { flex: 1, justifyContent: 'center' } : null),
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      />

      {canUpload && (
        <View style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom }}>
          <Pressable onPress={onAddVideo} accessibilityRole="button" accessibilityLabel="Aggiungi video" style={{ borderRadius: 28, overflow: 'hidden' }}>
            <LinearGradient
              colors={['#007fff', '#00a5f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 8 }}
            >
              <Ionicons name="add" size={26} color={colors.white} />
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}