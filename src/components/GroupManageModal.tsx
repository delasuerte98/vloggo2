import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DataContext } from "../../App";
import { styles } from "./GroupManageModal.styles";
import { colors } from "../theme/colors";

type Props = { visible: boolean; onClose: () => void };

export default function GroupManageModal({ visible, onClose }: Props) {
  const { groups, friends, updateGroup, deleteGroup } = useContext(DataContext);
  const insets = useSafeAreaInsets();

  const pickImage = async (groupId: string) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        updateGroup(groupId, { image: res.assets[0].uri });
      }
    } catch {
      Alert.alert("Errore", "Impossibile selezionare l'immagine.");
    }
  };

  const toggleMember = (groupId: string, friendId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const members = group.members.includes(friendId)
      ? group.members.filter((m) => m !== friendId)
      : [...group.members, friendId];
    updateGroup(groupId, { members });
  };

  const confirmDelete = (groupId: string) => {
    Alert.alert("Elimina gruppo", "Sei sicuro?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Elimina",
        style: "destructive",
        onPress: () => deleteGroup(groupId),
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose} // back Android
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={[styles.headerRow, { paddingTop: 0 }]}>
          <Text style={styles.title} accessibilityRole="header">
            Gestione gruppi
          </Text>
          <Pressable
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Chiudi gestione gruppi"
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Chiudi</Text>
          </Pressable>
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="always"
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          {groups.map((g) => (
            <View key={g.id} style={styles.groupCard}>
              <Pressable
                onPress={() => pickImage(g.id)}
                style={styles.imageWrap}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel={`Cambia immagine del gruppo ${g.name}`}
              >
                {g.image ? (
                  <Image source={{ uri: g.image }} style={styles.image} />
                ) : (
                  <Ionicons
                    name="people-circle"
                    size={50}
                    color={colors.primary}
                  />
                )}
              </Pressable>

              <Text style={styles.groupName} numberOfLines={1}>
                {g.name}
              </Text>

              <Text style={styles.subTitle}>Membri</Text>
              <View style={styles.membersWrap}>
                {friends.map((f) => {
                  const selected = g.members.includes(f.id);
                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => toggleMember(g.id, f.id)}
                      style={[styles.memberChip, selected && styles.memberChipSelected]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`${
                        selected ? "Rimuovi" : "Aggiungi"
                      } ${f.name} al gruppo ${g.name}`}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.memberText}>{f.name}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={() => confirmDelete(g.id)}
                style={styles.deleteBtn}
                accessibilityRole="button"
                accessibilityLabel={`Elimina gruppo ${g.name}`}
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
