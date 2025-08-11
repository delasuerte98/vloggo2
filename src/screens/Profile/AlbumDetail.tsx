import React, { useContext, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { DataContext, FeedItem } from '../../../App';
import { styles } from './AlbumDetail.styles';
import VideoCard from '../../components/VideoCard';

export default function AlbumDetail() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { albums, groups, currentUser } = useContext(DataContext);

  const albumId = route.params?.albumId;
  const album = albums.find(a => a.id === albumId);

  useEffect(() => {
    navigation.setOptions({ title: album?.title ?? 'Album' });
  }, [album, navigation]);

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
      likes: [],        // evitiamo undefined
      comments: [],     // evitiamo undefined
    }));
  }, [album, groups, currentUser]);

  if (!album) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Album non trovato</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
