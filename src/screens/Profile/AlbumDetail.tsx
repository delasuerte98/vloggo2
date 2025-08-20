// src/screens/Profile/AlbumDetail.tsx
import React, { useContext, useMemo, useRef } from 'react';
import { View, Text, FlatList, Pressable, Platform } from 'react-native';
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

  const { albums, groups, currentUser, canUserUploadToAlbum } = useContext(DataContext);

  const albumId = route.params?.albumId;
  const album = albums.find(a => a.id === albumId);

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
    navigation.navigate('UploadScreen' as never, { preselectedAlbumId: album?.id } as never);
  };

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

  return (
    // ⚠️ Nel navigator: options={{ headerShown: false }} per questa screen
    <ScreenContainer withScroll={false} headerHeight={0}>
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <VideoCard item={item} />}

        // Header custom (titolo + bottone). Niente spazio “strano” in alto.
        ListHeaderComponent={
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>{album.title}</Text>
            {canUpload && (
              <Pressable onPress={onAddVideo} hitSlop={8}>
                <LinearGradient
                  colors={['#007fff', '#00a5f2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    gap: 6,
                  }}
                >
                  <Ionicons name="add" size={16} color={colors.white} />
                  <Text style={{ color: colors.white, fontWeight: '700' }}>Video</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        }
        // (facoltativo) blocca l’header in alto mentre scrolli
        stickyHeaderIndices={[0]}
        ListHeaderComponentStyle={{
          backgroundColor: colors.background,
          paddingTop: 0, // niente extra spazio
        }}

        ListEmptyComponent={<Text style={styles.emptyText}>Nessun video in questo album</Text>}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8, // piccolissimo respiro sotto la top-bar
          paddingBottom: 24 + insets.bottom,
          ...(items.length === 0 ? { flex: 1, justifyContent: 'center' } : null),
        }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}

        // Tastiera/commenti: non copre e resta fluido
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets
        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      />
    </ScreenContainer>
  );
}