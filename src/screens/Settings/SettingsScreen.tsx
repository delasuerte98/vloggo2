// src/screens/Settings/SettingsScreen.tsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import ProfileEditModal from "../../components/ProfileEditModal";
import AlbumManageModal from "../../components/AlbumManageModal";
import AlbumEditorSheet from "../../components/AlbumEditorSheet";
import { DataContext } from "../../../App";

type Nav = NativeStackNavigationProp<any>;

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useContext(DataContext);

  // Modali locali
  const [editVisible, setEditVisible] = useState(false);
  const [albumManageVisible, setAlbumManageVisible] = useState(false);

  // Editor album (stesso componente usato in UploadScreen)
  const [albumEditorVisible, setAlbumEditorVisible] = useState(false);
  const [albumEditorMode, setAlbumEditorMode] = useState<"create" | "edit">(
    "create"
  );
  const [albumEditorId, setAlbumEditorId] = useState<string | null>(null);

  // Tema scuro (placeholder)
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Conferma logout", "Vuoi davvero uscire?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // Nel tuo StackNavigator la route è "Login"
          navigation.replace("Login" as never);
        },
      },
    ]);
  };

  // Callbacks passati alla modale di gestione album
  const onCreateAlbum = () => {
    // chiudo gestione -> apro editor "create"
    setAlbumManageVisible(false);
    setTimeout(() => {
      setAlbumEditorMode("create");
      setAlbumEditorId(null);
      setAlbumEditorVisible(true);
    }, 150);
  };

  const onEditAlbum = (id: string) => {
    setAlbumManageVisible(false);
    setTimeout(() => {
      setAlbumEditorMode("edit");
      setAlbumEditorId(id);
      setAlbumEditorVisible(true);
    }, 150);
  };

  return (
    <View style={styles.container}>
      {/* Header semplice */}
      <Text style={styles.header}>Impostazioni</Text>

      <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 16 }}>
        {/* --- SEZIONE ACCOUNT --- */}
        <Text style={styles.sectionTitle}>Account</Text>

        <Pressable style={styles.item} onPress={() => setEditVisible(true)}>
          <Ionicons name="person-outline" size={20} color={colors.text} />
          <Text style={styles.itemText}>Modifica profilo</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => setAlbumManageVisible(true)}
        >
          <Ionicons name="albums-outline" size={20} color={colors.text} />
          <Text style={styles.itemText}>Gestisci album</Text>
        </Pressable>

        <Pressable
          style={styles.item}
          onPress={() => navigation.navigate("GroupManage" as never)}
        >
          <Ionicons name="people-outline" size={20} color={colors.text} />
          <Text style={styles.itemText}>Gestisci gruppi</Text>
        </Pressable>

        {/* --- SEZIONE ASPETTO --- */}
        <Text style={styles.sectionTitle}>Aspetto</Text>
        <View style={styles.item}>
          <Ionicons name="moon-outline" size={20} color={colors.text} />
          <Text style={[styles.itemText, { flex: 1 }]}>Tema scuro</Text>
          <Switch
            value={darkMode}
            onValueChange={(v) => {
              setDarkMode(v);
              Alert.alert(
                "Tema",
                v ? "Tema scuro (placeholder)" : "Tema chiaro (placeholder)"
              );
              // Qui in futuro potrai agganciare un ThemeContext / persistenza
            }}
          />
        </View>

        {/* --- SEZIONE ALTRO --- */}
        <Text style={styles.sectionTitle}>Altro</Text>
        <Pressable style={styles.item} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={[styles.itemText, { color: colors.danger }]}>Logout</Text>
        </Pressable>
      </ScrollView>

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
        onSave={() => setEditVisible(false)}
      />

      <AlbumManageModal
        visible={albumManageVisible}
        onClose={() => setAlbumManageVisible(false)}
        onCreateAlbum={onCreateAlbum}
        onEditAlbum={onEditAlbum}
      />

      <AlbumEditorSheet
        visible={albumEditorVisible}
        mode={albumEditorMode}
        albumId={albumEditorId}
        onClose={() => setAlbumEditorVisible(false)}
        onCreated={() => setAlbumEditorVisible(false)}
        onSaved={() => setAlbumEditorVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: colors.muted,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  itemText: {
    fontSize: 16,
    color: colors.text,
  },
});