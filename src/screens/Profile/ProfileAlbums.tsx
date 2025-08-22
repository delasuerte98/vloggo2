// src/screens/Profile/ProfileAlbums.tsx
import React, { useContext, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  ScrollView,
  FlatList,
  Modal,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ProfileAlbums.styles";
import { typography } from "../../theme/typography";
import { colors } from "../../theme/colors";
import { DataContext, Album } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import ProfileEditModal from "../../components/ProfileEditModal";
import * as ImagePicker from "expo-image-picker";
import FriendsModal from "../../components/FriendsModal";
import AlbumManageModal from "../../components/AlbumManageModal";
import AlbumEditorSheet from "../../components/AlbumEditorSheet";
import * as Haptics from "expo-haptics"; // <— richiede: expo install expo-haptics

type Nav = NativeStackNavigationProp<any>;

export default function ProfileAlbums() {
  const {
    albums,
    profile,
    friends,
    groups,
    updateProfile,
    addFriend,
    updateAlbum,
    deleteAlbum, // opzionale: presente nel tuo DataContext
  } = useContext(DataContext);

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [editVisible, setEditVisible] = useState(false);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [albumManageVisible, setAlbumManageVisible] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Editor album
  const [albumEditorVisible, setAlbumEditorVisible] = useState(false);
  const [albumEditorMode, setAlbumEditorMode] = useState<"create" | "edit">("create");
  const [albumEditorId, setAlbumEditorId] = useState<string | null>(null);

  const totalVideos = useMemo(
    () => albums.reduce((sum, a) => sum + (a.count || a.videos?.length || 0), 0),
    [albums]
  );

  // Animazione mini header
  const scrollY = useRef(new Animated.Value(0)).current;
  const appear = scrollY.interpolate({
    inputRange: [40, 140],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const translateY = scrollY.interpolate({
    inputRange: [40, 140],
    outputRange: [-10, 0],
    extrapolate: "clamp",
  });

  const goAlbum = (a: Album) =>
    navigation.navigate("AlbumDetail", { albumId: a.id });

  const openCreateAlbum = () => {
    setAlbumEditorMode("create");
    setAlbumEditorId(null);
    setAlbumEditorVisible(true);
  };

  const openEditAlbum = (albumId: string) => {
    setAlbumEditorMode("edit");
    setAlbumEditorId(albumId);
    setAlbumEditorVisible(true);
  };

  const closeEditor = () => {
    setAlbumEditorVisible(false);
    setAlbumEditorId(null);
  };

  /* ========= Animazioni “shake + pop” sull’album ========= */
  const [activeAnimAlbumId, setActiveAnimAlbumId] = useState<string | null>(null);

  // Valori animati per l’album attivo
  const shakeX = useRef(new Animated.Value(0)).current;       // micro-traslazione orizzontale
  const popScale = useRef(new Animated.Value(1)).current;     // scala della cover
  const flashScale = useRef(new Animated.Value(0)).current;   // “onda” che si espande
  const flashOpacity = useRef(new Animated.Value(0)).current; // opacità dell’onda

  const resetAnimValues = useCallback(() => {
    shakeX.setValue(0);
    popScale.setValue(1);
    flashScale.setValue(0);
    flashOpacity.setValue(0);
  }, [shakeX, popScale, flashScale, flashOpacity]);

  /* ========= Menu bottom sheet ========= */
  const [menuAlbumId, setMenuAlbumId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const openMenuForAlbum = useCallback((albumId: string) => {
    setMenuAlbumId(albumId);
    setMenuVisible(true);
    menuAnim.setValue(0);
    Animated.spring(menuAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 220,
      mass: 0.9,
    }).start();
  }, [menuAnim]);

  const closeMenu = useCallback(() => {
    Animated.timing(menuAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
      setMenuVisible(false);
      setMenuAlbumId(null);
      // reset eventuale anim
      setActiveAnimAlbumId(null);
      resetAnimValues();
    });
  }, [menuAnim, resetAnimValues]);

  const closeMenuThen = useCallback((fn?: () => void) => {
    Animated.timing(menuAnim, { toValue: 0, duration: 160, useNativeDriver: true })
      .start(() => {
        setMenuVisible(false);
        setMenuAlbumId(null);
        setActiveAnimAlbumId(null);
        resetAnimValues();
        if (fn) fn();
      });
  }, [menuAnim, resetAnimValues]);

  // Effetto “shake + pop + flash” e poi apertura menu
  const handleLongPressAlbum = useCallback((albumId: string) => {
    // Haptic leggero subito (fire-and-forget, senza await)
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}

    setActiveAnimAlbumId(albumId);
    resetAnimValues();

    // Colpo “Rigid” sincronizzato al picco del POP (~120ms dall’inizio del pop)
    let popTick: ReturnType<typeof setTimeout> | null = null;

    Animated.sequence([
      // Shake orizzontale: sinistra → destra → centro
      Animated.sequence([
        Animated.timing(shakeX, { toValue: -4, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 4, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -3, duration: 70, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 3, duration: 70, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]),
      // POP + FLASH (con trigger haptic temporizzato)
      (() => {
        popTick = setTimeout(() => {
          try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid); } catch {}
        }, 120);

        return Animated.parallel([
          Animated.sequence([
            Animated.timing(popScale, { toValue: 1.12, duration: 120, useNativeDriver: true }),
            Animated.timing(popScale, { toValue: 0.98, duration: 90, useNativeDriver: true }),
            Animated.timing(popScale, { toValue: 1.0, duration: 80, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.parallel([
              Animated.timing(flashScale, { toValue: 1.8, duration: 260, useNativeDriver: true }),
              Animated.timing(flashOpacity, { toValue: 0.22, duration: 120, useNativeDriver: true }),
            ]),
            Animated.timing(flashOpacity, { toValue: 0, duration: 140, useNativeDriver: true }),
          ]),
        ]);
      })(),
    ]).start(() => {
      if (popTick) { clearTimeout(popTick); popTick = null; }
      // piccolo “tick” quando compare il menù
      try { Haptics.selectionAsync(); } catch {}
      openMenuForAlbum(albumId);
    });
  }, [shakeX, popScale, flashScale, flashOpacity, openMenuForAlbum, resetAnimValues]);

  // Album corrente del menu
  const currentMenuAlbum = useMemo(
    () => albums.find(a => a.id === menuAlbumId) || null,
    [albums, menuAlbumId]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Mini header */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.miniHeaderBox,
          { top: insets.top + 6, opacity: appear, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.miniHeaderText} numberOfLines={1}>
          {profile.fullName}
        </Text>
      </Animated.View>

      {/* ===== Scroll contenuto ===== */}
      <Animated.ScrollView
        as={ScrollView as any}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: 4,
            paddingBottom: 0,
          },
        ]}
        contentInsetAdjustmentBehavior="never"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ===== CARD PROFILO ===== */}
        <View style={styles.headerCard}>
          {/* Impostazioni */}
          <Pressable
            onPress={() => navigation.navigate("Settings" as never)}
            style={styles.profileGearBtn}
            hitSlop={10}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>

          {/* Pulsante Menu Rapido (in alto a sinistra) */}
          <Pressable
            onPress={() => setFabOpen((o) => !o)}
            style={{ position: 'absolute', top: 10, left: 10, padding: 6, borderRadius: 12, zIndex: 6 }}
            hitSlop={10}
          >
            <Ionicons name="people-outline" size={22} color={colors.text} />
          </Pressable>

          {/* Menu rapido posizionato sotto il pulsante (dentro la card) */}
          {fabOpen && (
            <View style={[styles.fabMenu, { position: 'absolute', top: 44, left: 10, zIndex: 35 }]}>
              <Pressable
                onPress={() => {
                  setFriendsVisible(true);
                  setFabOpen(false);
                }}
                style={styles.fabMenuItem}
              >
                <Ionicons name="person-add-outline" size={18} color={colors.text} />
                <Text style={styles.fabMenuText}>Aggiungi amico</Text>
              </Pressable>

              <View style={styles.fabMenuDivider} />

              <Pressable
                onPress={() => {
                  navigation.navigate("GroupManage" as never);
                  setFabOpen(false);
                }}
                style={styles.fabMenuItem}
              >
                <Ionicons name="people-outline" size={18} color={colors.text} />
                <Text style={styles.fabMenuText}>Gestisci gruppi</Text>
              </Pressable>
            </View>
          )}

          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color={colors.muted} />
            )}
          </View>

          {/* Nome */}
          <Text style={[typography.title, styles.fullName]} numberOfLines={1}>
            {profile.fullName}
          </Text>
          <Text style={[typography.caption, styles.username]}>
            {profile.username}
          </Text>

          {!!profile.bio && (
            <Text style={[typography.body, styles.bio]} numberOfLines={3}>
              {profile.bio}
            </Text>
          )}

          {!!profile.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.muted} />
              <Text style={[typography.caption, styles.locationText]} numberOfLines={1}>
                {profile.location}
              </Text>
            </View>
          )}

          {/* Modifica profilo */}
          <Pressable onPress={() => setEditVisible(true)} style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Modifica profilo</Text>
          </Pressable>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalVideos}</Text>
              <Text style={styles.statLabel}>Video</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{friends.length}</Text>
              <Text style={styles.statLabel}>Amici</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{groups.length}</Text>
              <Text style={styles.statLabel}>Gruppi</Text>
            </View>
          </View>
        </View>

        {/* ===== SEZIONE ALBUM ===== */}
        <View style={[styles.sectionHeaderRow, { marginTop: -2 }]}>
          <Text style={[typography.subtitle, styles.sectionTitle]}>Album</Text>
          <Pressable
            onPress={openCreateAlbum}
            style={{ padding: 4, marginRight: -4 }}
            hitSlop={10}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Grid album — 3 per riga */}
        <View style={[styles.gridContent, { paddingBottom: 8 }]}>
          <FlatList
            data={albums} // più recente in testa → alto a sinistra
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "flex-start" }}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isActive = activeAnimAlbumId === item.id;
              return (
                <Pressable
                  style={[styles.albumItem, { flexBasis: "33.333%", maxWidth: "33.333%" }]}
                  onPress={() => goAlbum(item)}
                  onLongPress={() => handleLongPressAlbum(item.id)}
                  delayLongPress={220}
                  android_ripple={{ color: "rgba(0,0,0,0.05)", borderless: false }}
                >
                  {/* wrapper animato della cover */}
                  <Animated.View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      transform: [
                        { translateX: isActive ? shakeX : new Animated.Value(0) },
                        { scale: isActive ? popScale : new Animated.Value(1) },
                      ],
                    }}
                  >
                    <View style={styles.coverCircle}>
                      {item.coverUri ? (
                        <Image source={{ uri: item.coverUri }} style={styles.coverImage} />
                      ) : (
                        <Ionicons name="videocam-outline" size={40} color={colors.primaryDark} />
                      )}

                      {/* Flash circolare che “esplode” */}
                      <Animated.View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: 999,
                          backgroundColor: "#fff",
                          opacity: isActive ? flashOpacity : 0,
                          transform: [{ scale: isActive ? flashScale : new Animated.Value(0) }],
                        }}
                      />
                      {!!item.contributors?.length && (
                        <LinearGradient
                          colors={colors.gradients.primary}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.sharedPill}
                        >
                          <Ionicons name="people-outline" size={14} color="#fff" />
                        </LinearGradient>
                      )}
                    </View>
                  </Animated.View>

                  <View style={{ width: "100%", marginTop: 6 }}>
                    <Text style={styles.albumTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.albumCount}>
                      {item.count ?? item.videos?.length ?? 0} video
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            contentContainerStyle={{ paddingBottom: 0 }}
          />
        </View>
      </Animated.ScrollView>

      {/* Backdrop per chiudere il menu rapido */}
      {fabOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setFabOpen(false)}
        />
      )}

      {/* ===== Modali ===== */}
      <ProfileEditModal
        visible={editVisible}
        initial={{
          fullName: profile.fullName,
          avatar: profile.avatar,
          bio: profile.bio,
          location: profile.location,
        }}
        onClose={() => setEditVisible(false)}
        onSave={(d) => {
          updateProfile(d);
          setEditVisible(false);
        }}
      />

      <FriendsModal
        visible={friendsVisible}
        onClose={() => setFriendsVisible(false)}
        onAdd={(f) => {
          addFriend(f);
          setFriendsVisible(false);
        }}
      />

      {/* Gestione album “classica” */}
      <AlbumManageModal
        visible={albumManageVisible}
        onClose={() => setAlbumManageVisible(false)}
        onCreateAlbum={() => {
          setAlbumManageVisible(false);
          openCreateAlbum();
        }}
        onEditAlbum={(id) => {
          setAlbumManageVisible(false);
          openEditAlbum(id);
        }}
      />

      {/* Editor vero e proprio */}
      <AlbumEditorSheet
        visible={albumEditorVisible}
        mode={albumEditorMode}
        albumId={albumEditorId}
        onClose={closeEditor}
        onCreated={closeEditor}
        onSaved={closeEditor}
      />

      {/* ===== Bottom Sheet Menù Modifica (animato) ===== */}
      <Modal visible={menuVisible} transparent animationType="none" onRequestClose={closeMenu}>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}
          onPress={closeMenu}
        />
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [
              {
                translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
            opacity: menuAnim,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, alignItems: "center" }}>
            <View
              style={{
                width: 42,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#E1E4EA",
                marginBottom: 8,
              }}
            />
            <Text style={{ fontWeight: "800", color: colors.text }}>Modifica album</Text>
            {!!currentMenuAlbum && (
              <Text style={{ color: colors.muted, marginTop: 2 }} numberOfLines={1}>
                {currentMenuAlbum.title}
              </Text>
            )}
          </View>

          {/* Azioni */}
          <View style={{ paddingHorizontal: 8 }}>
            <Pressable
              style={rowBtnStyle}
              onPress={() => {
                if (!menuAlbumId) return;
                const targetId = menuAlbumId; // capture before state resets in closeMenuThen
                closeMenuThen(() => openEditAlbum(targetId));
              }}
            >
              <Ionicons name="pencil" size={18} color={colors.text} />
              <Text style={rowBtnText}>Modifica titolo</Text>
            </Pressable>

            <Pressable
              style={rowBtnStyle}
              onPress={() => {
                if (!menuAlbumId) return;
                const targetId = menuAlbumId; // capture before it's cleared
                // Chiudi il menu, poi attendi un attimo e apri la galleria (evita conflitti con l'animazione della Modal)
                closeMenuThen(() => {
                  setTimeout(async () => {
                    try {
                      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (!perm.granted) {
                        // opzionale: Alert.alert('Permesso mancante', 'Concedi l\'accesso alle foto per cambiare la copertina.');
                        return;
                      }
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.9,
                        presentationStyle: 'fullScreen', // iOS: sicuro sopra altre modali
                      });
                      if (!result.canceled) {
                        const uri = result.assets?.[0]?.uri;
                        if (uri && updateAlbum) {
                          updateAlbum(targetId, { coverUri: uri });
                        }
                      }
                    } catch (e) {
                      // opzionale: console.log('ImagePicker error', e);
                    }
                  }, 80); // piccolo delay per lasciare smontare la Modal
                });
              }}
            >
              <Ionicons name="image-outline" size={18} color={colors.text} />
              <Text style={rowBtnText}>Cambia immagine di copertina</Text>
            </Pressable>

            <View style={{ height: 1, backgroundColor: "#E9ECF2", marginVertical: 6, marginLeft: 44 }} />

            <Pressable
              style={rowBtnStyle}
              onPress={() => {
                if (!menuAlbumId || !deleteAlbum) return;
                closeMenuThen(() => deleteAlbum(menuAlbumId));
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#D9534F" />
              <Text style={[rowBtnText, { color: "#D9534F" }]}>Elimina album</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

/* ====== Stili inline per le righe del menù (così non tocchiamo il tuo .styles.ts) ====== */
const rowBtnStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 10,
  paddingVertical: 12,
  paddingHorizontal: 8,
};
const rowBtnText = {
  fontWeight: "600" as const,
  color: colors.text,
};