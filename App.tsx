// App.tsx
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
import { Alert } from 'react-native'; // NEW

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

// CHANGED: Album esteso con permessi (ownerId, contributors, viewers?)
export type Album = {
  id: string;
  title: string;
  coverUri?: string;
  count: number;
  videos: AlbumVideo[];
  groupId: string;

  // --- Permessi (condivisione) ---
  ownerId: string;         // NEW: usa lo username senza '@'
  contributors: string[];  // NEW: array di username che possono caricare
  viewers?: string[];      // NEW: predisposizione sola lettura (non usato ora)
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
 * Helper permessi
 * =========================== */
// NEW: helper richiesto (puoi importarlo dove serve oppure usare dal Context)
export const canUserUploadToAlbum = (userId: string, album: Album): boolean =>
  album.ownerId === userId || album.contributors.includes(userId);

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
  createAlbum: (args: {
    title: string;
    coverUri?: string;
    groupId: string;
    contributors?: string[]; // NEW
    // viewers?: string[];   // NEW (predisposizione, non usato ora)
  }) => Album;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  addVideoToAlbum: (args: { albumId: string; video: AlbumVideo }) => void;

  // NEW: helper gestione permessi/contributori
  canUserUploadToAlbum: (userId: string, album: Album) => boolean;
  addAlbumContributors: (albumId: string, friendIds: string[]) => void;
  removeAlbumContributor: (albumId: string, friendId: string) => void;

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

  const currentUser = profile.username.replace('@', ''); // CHANGED: comodo per ownerId/permessi

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
  // CHANGED: aggiunti ownerId/contributors coerenti con gli username del mock
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: 'a1',
      title: 'Vacanza a Riccione',
      coverUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      count: 5,
      groupId: 'g1',
      ownerId: 'luca',                 // NEW
      contributors: ['marta', 'sara'], // NEW
      // viewers: [],                   // NEW (opzionale)
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
      ownerId: 'luca',        // NEW
      contributors: [],       // NEW (privato)
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
  const createAlbum: DataContextType['createAlbum'] = ({ title, coverUri, groupId, contributors }) => { // CHANGED
    const gid = groupId || groups[0]?.id || 'g1';
    const newAlbum: Album = {
      id: `a_${Date.now()}`,
      title,
      coverUri,
      count: 0,
      videos: [],
      groupId: gid,
      ownerId: currentUser,                 // NEW
      contributors: contributors ?? [],     // NEW
      // viewers: [],                        // NEW (predisposizione)
    };
    setAlbums(prev => [newAlbum, ...prev]);
    // TODO(api): POST /albums { title, coverUri?, groupId, ownerId, contributors[] }
    if (newAlbum.contributors.length) {
      Alert.alert('Album condiviso creato', 'I contributori selezionati possono caricare video.');
    }
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
    // TODO(api): PATCH /albums/:id (campi generici)
  };

  const deleteAlbum: DataContextType['deleteAlbum'] = (id) => {
    setAlbums(prev => prev.filter(a => a.id !== id));
    setFeed(prev => prev.map(f => (f.albumId === id ? { ...f, albumId: undefined, albumTitle: undefined } : f)));
    // TODO(api): DELETE /albums/:id
  };

  const addVideoToAlbum: DataContextType['addVideoToAlbum'] = ({ albumId, video }) => {
    setAlbums(prev =>
      prev.map(a => {
        if (a.id !== albumId) return a;
        const videos = [video, ...a.videos];
        return { ...a, videos, count: videos.length, coverUri: a.coverUri ?? video.uri };
      }),
    );
    // TODO(api): POST /albums/:id/uploads { file... }
  };

  // NEW: gestione contributors (multi-add e single-remove)
  const addAlbumContributors: DataContextType['addAlbumContributors'] = (albumId, friendIds) => {
    setAlbums(prev =>
      prev.map(a =>
        a.id === albumId
          ? { ...a, contributors: Array.from(new Set([...a.contributors, ...friendIds])) }
          : a,
      ),
    );
    // TODO(api): PATCH /albums/:id/contributors { add: string[] }
    Alert.alert('Contributori aggiunti', 'Gli utenti selezionati ora possono caricare in questo album.');
  };

  const removeAlbumContributor: DataContextType['removeAlbumContributor'] = (albumId, friendId) => {
    setAlbums(prev =>
      prev.map(a =>
        a.id === albumId ? { ...a, contributors: a.contributors.filter(u => u !== friendId) } : a,
      ),
    );
    // TODO(api): PATCH /albums/:id/contributors { remove: [friendId] }
    Alert.alert('Contributore rimosso', 'L’utente non può più caricare in questo album.');
  };

  // NEW: wrapper per esporre il check permessi via Context
  const canUserUploadToAlbumCtx: DataContextType['canUserUploadToAlbum'] = (userId, album) =>
    canUserUploadToAlbum(userId, album);

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
      user: { username: currentUser },
      likes: [],
      comments: [],
    };
    setFeed(prev => [item, ...prev]);
    // TODO(api): POST /feed
  };

  const ctxValue = useMemo<DataContextType>(
    () => ({
      currentUser,
      profile,
      friends,
      groups,
      albums,
      feed,
      updateProfile,
      createGroup,
      updateGroup,
      deleteGroup,
      createAlbum,         // CHANGED
      updateAlbum,
      deleteAlbum,
      addVideoToAlbum,
      canUserUploadToAlbum: canUserUploadToAlbumCtx, // NEW
      addAlbumContributors,                           // NEW
      removeAlbumContributor,                         // NEW
      addFeedItem,
    }),
    [currentUser, profile, friends, groups, albums, feed],
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
