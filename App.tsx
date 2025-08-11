import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import StackNavigator from './src/navigation/StackNavigator';
import { colors } from './src/theme/colors';

/* ===========================
 * Tipi
 * =========================== */
export type Profile = {
  fullName: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followers: number;
  following: number;
};

export type Friend = { id: string; username: string; fullName: string; avatar?: string };

export type Group = { id: string; name: string; image?: string; members: string[] };

export type AlbumVideo = { id: string; uri: string; title: string; description: string };

export type Album = {
  id: string;
  title: string;
  coverUri?: string;
  count: number;
  videos: AlbumVideo[];
  groupId: string;
};

export type FeedComment = { user: string; text: string };
export type FeedUser = { username: string; avatar?: string };

export type FeedItem = {
  id: string;
  uri: string;
  title: string;
  description: string;
  group: Group;
  albumId?: string;
  albumTitle?: string;
  user: FeedUser;
  likes: string[];
  comments: FeedComment[];
};

/* ===========================
 * Context
 * =========================== */
export type DataContextType = {
  currentUser: string;
  profile: Profile;
  friends: Friend[];
  groups: Group[];
  albums: Album[];
  feed: FeedItem[];

  // Profilo
  updateProfile: (p: Partial<Profile>) => void;

  // Gruppi
  createGroup: (args: { name: string; image?: string; memberUsernames: string[] }) => Group;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  // Album
  createAlbum: (args: { title: string; coverUri?: string; groupId: string }) => Album;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  addVideoToAlbum: (args: { albumId: string; video: AlbumVideo }) => void;

  // Feed
  addFeedItem: (args: {
    uri: string;
    title: string;
    description?: string;
    groupId: string;
    albumId?: string;
  }) => void;
};

export const DataContext = createContext<DataContextType>({} as DataContextType);

export default function App() {
  // ===========================
  // AUDIO: abilita suonare anche in modalità silenziosa (iOS)
  // ===========================
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        // evita crash se il device non supporta qualche flag
        // console.warn("Audio mode error", e);
      }
    })();
  }, []);

  /* ===========================
   * Stato mock iniziale
   * =========================== */
  // ---- Profile ----
  const [profile, setProfile] = useState<Profile>({
    fullName: 'Luca Bianchi',
    username: '@luca',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80',
    bio: 'Amante di viaggi, vlog e montagna.',
    location: 'Milano, IT',
    followers: 248,
    following: 183,
  });

  // ---- Friends ----
  const [friends] = useState<Friend[]>([
    { id: 'u1', username: 'marta', fullName: 'Marta Verdi' },
    { id: 'u2', username: 'sara', fullName: 'Sara Neri' },
    { id: 'u3', username: 'gio', fullName: 'Giorgio Blu' },
  ]);

  // ---- Groups ----
  const [groups, setGroups] = useState<Group[]>([
    { id: 'g1', name: 'Amici', members: ['luca', 'marta', 'sara'] },
    { id: 'g2', name: 'Palestra', members: ['luca', 'andre', 'marta'] },
    { id: 'g3', name: 'Colleghi', members: ['gio', 'sara', 'marta', 'teo'] },
    { id: 'g4', name: 'Famiglia', members: ['mamma', 'papa', 'io'] },
  ]);

  // ---- Albums ----
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: 'a1',
      title: 'Vacanza a Riccione',
      coverUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      count: 5,
      groupId: 'g1',
      videos: [
        { id: 'v1', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Spiaggia', description: 'Giornata al mare' },
        { id: 'v2', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Passeggiata', description: 'Tramonto' },
        { id: 'v3', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Cena', description: 'Grigliata' },
        { id: 'v6', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Gita', description: 'Centro storico' },
        { id: 'v7', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Beach', description: 'Onde' },
      ],
    },
    {
      id: 'a2',
      title: 'Natale 2023',
      coverUri: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80',
      count: 3,
      groupId: 'g4',
      videos: [
        { id: 'v4', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Albero', description: 'Decorazioni' },
        { id: 'v5', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Cena', description: 'Panettone' },
        { id: 'v8', uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', title: 'Regali', description: 'Scambi' },
      ],
    },
  ]);

  // ---- Feed ----
  const [feed, setFeed] = useState<FeedItem[]>([
    {
      id: 'f1',
      uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
      title: 'Vlog al parco',
      description: 'Skate e risate',
      group: { ...groups[0] },
      albumId: 'a1',
      albumTitle: 'Vacanza a Riccione',
      user: { username: 'marta' },
      likes: ['sara'],
      comments: [{ user: 'sara', text: 'Che stile!' }],
    },
  ]);

  /* ===========================
   * ACTIONS
   * =========================== */
  // Profilo
  const updateProfile: DataContextType['updateProfile'] = (p) =>
    setProfile(prev => ({ ...prev, ...p }));

  // Gruppi
  const createGroup: DataContextType['createGroup'] = ({ name, image, memberUsernames }) => {
    const g: Group = { id: `g_${Date.now()}`, name, image, members: memberUsernames };
    setGroups(prev => [g, ...prev]);
    return g;
  };
  const updateGroup: DataContextType['updateGroup'] = (id, updates) => {
    setGroups(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };
  const deleteGroup: DataContextType['deleteGroup'] = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    setAlbums(prev => prev.filter(a => a.groupId !== id));
    setFeed(prev => prev.filter(f => f.group.id !== id));
  };

  // Album
  const createAlbum: DataContextType['createAlbum'] = ({ title, coverUri, groupId }) => {
    const gid = groupId || groups[0]?.id || 'g1';
    const newAlbum: Album = { id: `a_${Date.now()}`, title, coverUri, count: 0, videos: [], groupId: gid };
    setAlbums(prev => [newAlbum, ...prev]);
    return newAlbum;
  };
  const updateAlbum: DataContextType['updateAlbum'] = (id, updates) => {
    setAlbums(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              ...updates,
              count: updates.videos ? updates.videos.length : a.count,
            }
          : a,
      ),
    );
  };
  const deleteAlbum: DataContextType['deleteAlbum'] = (id) => {
    setAlbums(prev => prev.filter(a => a.id !== id));
    setFeed(prev => prev.map(f => (f.albumId === id ? { ...f, albumId: undefined, albumTitle: undefined } : f)));
  };
  const addVideoToAlbum: DataContextType['addVideoToAlbum'] = ({ albumId, video }) => {
    setAlbums(prev =>
      prev.map(a => {
        if (a.id !== albumId) return a;
        const videos = [video, ...a.videos];
        return { ...a, videos, count: videos.length, coverUri: a.coverUri ?? video.uri };
      }),
    );
  };

  // Feed
  const addFeedItem: DataContextType['addFeedItem'] = ({ uri, title, description, groupId, albumId }) => {
    const group = groups.find(g => g.id === groupId) ?? groups[0];
    const album = albums.find(a => a.id === albumId);
    const item: FeedItem = {
      id: `f_${Date.now()}`,
      uri,
      title,
      description: description ?? '',
      group,
      albumId: album?.id,
      albumTitle: album?.title,
      user: { username: profile.username.replace('@', '') },
      likes: [],
      comments: [],
    };
    setFeed(prev => [item, ...prev]);
  };

  const ctxValue = useMemo<DataContextType>(
    () => ({
      currentUser: profile.username.replace('@', ''),
      profile,
      friends,
      groups,
      albums,
      feed,
      updateProfile,
      createGroup,
      updateGroup,
      deleteGroup,
      createAlbum,
      updateAlbum,
      deleteAlbum,
      addVideoToAlbum,
      addFeedItem,
    }),
    [profile, friends, groups, albums, feed],
  );

  /* ===========================
   * Tema Navigazione
   * =========================== */
  const navTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      text: colors.text,
      primary: colors.primary,
      card: colors.background,
      border: colors.border,
      notification: colors.primary,
    },
  };

  /* ===========================
   * App Root
   * =========================== */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataContext.Provider value={ctxValue}>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="dark" />
            <StackNavigator />
          </NavigationContainer>
        </DataContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
