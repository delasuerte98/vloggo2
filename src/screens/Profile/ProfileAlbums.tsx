import React, { useContext, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ProfileAlbums.styles";
import { typography } from "../../theme/typography";
import { colors } from "../../theme/colors";
import { DataContext, Album } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AlbumCreateModal from "../../components/AlbumCreateModal";
import ProfileEditModal from "../../components/ProfileEditModal";
import FriendsModal from "../../components/FriendsModal";
import GroupManageModal from "../../components/GroupManageModal";
import AlbumManageModal from "../../components/AlbumManageModal";

type Nav = NativeStackNavigationProp<any>;

export default function ProfileAlbums() {
  const { albums, profile, friends, groups, updateProfile, addFriend } =
    useContext(DataContext);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [editVisible, setEditVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [groupManageVisible, setGroupManageVisible] = useState(false);
  const [albumManageVisible, setAlbumManageVisible] = useState(false);

  const totalVideos = useMemo(
    () => albums.reduce((sum, a) => sum + (a.count || 0), 0),
    [albums]
  );

  // Animazione: mini header centrato
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

  return (
    <SafeAreaView
      style={styles.container}
      // Garantiamo padding per top/bottom notch/home indicator
      edges={["top", "bottom"]}
    >
      {/* Mini header box centrato - ora sempre sotto lo status bar */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.miniHeaderBox,
          {
            top: insets.top + 6,
            opacity: appear,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.miniHeaderText} numberOfLines={1}>
          {profile.fullName}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        as={ScrollView as any}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: (styles?.scrollContent?.paddingBottom || 0) + // se definito nello style
              Math.max(insets.bottom, 12),
            // un minimo di spazio sopra perché la card non “tocchi” lo status bar
            paddingTop: Math.max(insets.top, 8),
          },
        ]}
        contentInsetAdjustmentBehavior="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTopRow}>
            <Text style={[typography.title, styles.screenTitle]}>Profilo</Text>

            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => setFriendsVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel="Aggiungi amico"
              >
                <Ionicons
                  name="person-add-outline"
                  size={24}
                  color={colors.text}
                />
              </Pressable>

              {/* Gestione gruppi */}
              <Pressable
                onPress={() => setGroupManageVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Gestisci gruppi"
              >
                <Ionicons name="people-outline" size={24} color={colors.text} />
              </Pressable>

              {/* Modifica profilo */}
              <Pressable
                onPress={() => setEditVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Modifica profilo"
              >
                <Ionicons
                  name="create-outline"
                  size={24}
                  color={colors.text}
                />
              </Pressable>

              {/* Gestione album (ingranaggio) */}
              <Pressable
                onPress={() => setAlbumManageVisible(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ marginLeft: 12 }}
                accessibilityRole="button"
                accessibilityLabel="Gestisci album"
              >
                <Ionicons
                  name="settings-outline"
                  size={24}
                  color={colors.text}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {profile.avatar ? (
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={72}
                  color={colors.muted}
                />
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[typography.title, styles.fullName]}
                numberOfLines={1}
              >
                {profile.fullName}
              </Text>
              <Text style={[typography.caption, styles.username]}>
                {profile.username}
              </Text>

              {!!profile.bio && (
                <Text
                  style={[typography.body, styles.bio]}
                  numberOfLines={2}
                >
                  {profile.bio}
                </Text>
              )}

              {!!profile.location && (
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={colors.muted}
                  />
                  <Text
                    style={[typography.caption, styles.locationText]}
                    numberOfLines={1}
                  >
                    {profile.location}
                  </Text>
                </View>
              )}

              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.shareBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Condividi profilo"
                >
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>

                {/* (Opzionale) Crea album rapido */}
                <Pressable
                  onPress={() => setCreateVisible(true)}
                  style={[styles.shareBtn, { marginLeft: 8 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Crea nuovo album"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color={colors.primary}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Stats: Video / Amici / Gruppi */}
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

          {/* Titolo sezione */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[typography.subtitle, styles.sectionTitle]}>
              Album
            </Text>
          </View>
        </View>

        {/* Grid album */}
        <View style={styles.gridContent}>
          <View style={styles.gridRow}>
            {albums.map((item, idx) => (
              <Pressable
                key={item.id}
                style={[
                  styles.albumItem,
                  idx % 2 === 0 ? { marginRight: "4%" } : null,
                ]}
                onPress={() => goAlbum(item)}
                accessibilityRole="button"
                accessibilityLabel={`Apri album ${item.title}`}
              >
                <View style={styles.coverCircle}>
                  {item.coverUri ? (
                    <Image
                      source={{ uri: item.coverUri }}
                      style={styles.coverImage}
                    />
                  ) : (
                    <Ionicons
                      name="videocam-outline"
                      size={40}
                      color={colors.primaryDark}
                    />
                  )}
                </View>
                <Text style={styles.albumTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.albumCount}>
                  {item.count ?? 0} video
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Modali */}
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

      <AlbumCreateModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreate={() => {
          // Implementa la logica reale di creazione album dove preferisci
          setCreateVisible(false);
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

      <GroupManageModal
        visible={groupManageVisible}
        onClose={() => setGroupManageVisible(false)}
      />

      <AlbumManageModal
        visible={albumManageVisible}
        onClose={() => setAlbumManageVisible(false)}
      />
    </SafeAreaView>
  );
}
