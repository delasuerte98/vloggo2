import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DataContext } from "../../App";
import { styles } from "./AlbumManageModal.styles";
import { colors } from "../theme/colors";

type Props = { visible: boolean; onClose: () => void };

export default function AlbumManageModal({ visible, onClose }: Props) {
  const { albums, groups, updateAlbum, deleteAlbum } = useContext(DataContext);
  const insets = useSafeAreaInsets();

  const pickImage = async (albumId: string) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        updateAlbum(albumId, { coverUri: res.assets[0].uri });
      }
    } catch (e) {
      Alert.alert("Errore", "Impossibile selezionare l'immagine.");
    }
  };

  const changeGroup = (albumId: string, groupId: string) => {
    updateAlbum(albumId, { groupId });
  };

  const confirmDelete = (albumId: string) => {
    Alert.alert("Elimina album", "Sei sicuro?", [
      { text: "Annulla", style: "cancel" },
      { text: "Elimina", style: "destructive", onPress: () => deleteAlbum(albumId) },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose} // tasto back su Android
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header con titolo + chiudi, sempre sotto allo status bar */}
        <View style={[styles.headerRow, { paddingTop: 0 }]}>
          <Text style={styles.title} accessibilityRole="header">
            Gestione album
          </Text>

          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Chiudi gestione album"
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Chiudi</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          contentInsetAdjustmentBehavior="always"
        >
          {albums.map((a) => (
            <View key={a.id} style={styles.albumCard}>
              <Pressable
                onPress={() => pickImage(a.id)}
                style={styles.imageWrap}
                accessibilityRole="button"
                accessibilityLabel={`Cambia copertina per l'album ${a.title}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {a.coverUri ? (
                  <Image source={{ uri: a.coverUri }} style={styles.image} />
                ) : (
                  <Ionicons name="images-outline" size={50} color={colors.primary} />
                )}
              </Pressable>

              <Text style={styles.albumTitle} numberOfLines={1}>
                {a.title}
              </Text>

              <Text style={styles.subTitle}>Gruppo</Text>
              <View style={styles.groupsWrap}>
                {groups.map((g) => (
                  <Pressable
                    key={g.id}
                    onPress={() => changeGroup(a.id, g.id)}
                    style={[
                      styles.groupChip,
                      a.groupId === g.id && styles.groupChipSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: a.groupId === g.id }}
                    accessibilityLabel={`Imposta gruppo ${g.name}`}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.groupText}>{g.name}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                onPress={() => confirmDelete(a.id)}
                style={styles.deleteBtn}
                accessibilityRole="button"
                accessibilityLabel={`Elimina album ${a.title}`}
              >
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteText}>Elimina</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
