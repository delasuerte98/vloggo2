// src/screens/Profile/AlbumDetail.tsx
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
  const { albums, groups, currentUser, canUserUploadToAlbum } = useContext(DataContext);

  const albumId = route.params?.albumId;
  const album = albums.find(a => a.id === albumId);

  useEffect(() => {
    navigation.setOptions({ title: album?.title ?? 'Album' });
  }, [album, navigation]);

  const canUpload = useMemo(
    () => (album ? canUserUploadToAlbum(currentUser, album) : false),
    [album, currentUser, canUserUploadToAlbum]
  );

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
    navigation.navigate('Upload' as never, { preselectedAlbumId: album?.id } as never);
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
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{album.title}</Text>
        {canUpload && (
          <Pressable
            onPress={onAddVideo}
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel="Aggiungi video a questo album"
          >
            <Ionicons name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Video</Text>
          </Pressable>
        )}
      </View>

      {/* Lista video */}
      <FlatList
  data={items}
  keyExtractor={(it) => it.id}
  renderItem={({ item }) => <VideoCard item={item} />}
  ListEmptyComponent={<Text style={styles.emptyText}>Nessun video in questo album</Text>}
  contentContainerStyle={{
    padding: 16,
    paddingBottom: 24,
    ...(items.length === 0 ? { flex: 1, justifyContent: 'center' } : null),
  }}
  ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // ← SPAZIO TRA LE CARD
  showsVerticalScrollIndicator={false}
/>

    </View>
  );
}