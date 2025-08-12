// src/screens/Profile/AlbumDetail.tsx
// CHANGED: mostra "Aggiungi video" solo se owner/contributor

import React, { useContext, useEffect, useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DataContext, FeedItem } from '../../../App';
import { styles } from './AlbumDetail.styles';
import VideoCard from '../../components/VideoCard';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function AlbumDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { albums, groups, currentUser, canUserUploadToAlbum } = useContext(DataContext); // CHANGED

  const albumId = route.params?.albumId;
  const album = albums.find(a => a.id === albumId);

  useEffect(() => {
    navigation.setOptions({ title: album?.title ?? 'Album' });
  }, [album, navigation]);

  const canUpload = useMemo(
    () => (album ? canUserUploadToAlbum(currentUser, album) : false),
    [album, currentUser, canUserUploadToAlbum]
  );

  // Adatta i video dell’album alla shape che si aspetta VideoCard: { item: FeedItem }
  const items: FeedItem[] = useMemo(() => {
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
      user: { username: currentUser },
      likes: [],
      comments: [],
    }));
  }, [album, groups, currentUser]);

  const onAddVideo = () => {
    // Naviga alla schermata di upload; se gestisci parametri, puoi usare preselectedAlbumId
    navigation.navigate('Upload' as never, { preselectedAlbumId: album?.id } as never);
    // TODO(api): in futuro l’upload allegherà albumId al backend
  };

  if (!album) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Album non trovato</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {canUpload && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Pressable
            onPress={onAddVideo}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 8,
            }}
            accessibilityRole="button"
            accessibilityLabel="Aggiungi video a questo album"
          >
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700' }}>Aggiungi video</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <VideoCard item={item} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Nessun video in questo album</Text>}
        contentContainerStyle={items.length === 0 ? { flex: 1, justifyContent: 'center' } : undefined}
      />
    </View>
  );
}
