import React, { useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DataContext, Friend, Group } from '../../../App';
import { styles } from './GroupManageScreen.styles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

import GroupEditorSheet from './components/GroupEditorSheet';
import GroupCreateSheet from './components/GroupCreateSheet';
import ScreenContainer from '../../components/layout/ScreenContainer';

const MAX_GROUP_MEMBERS = 50;

export default function GroupManageScreen() {
  const navigation = useNavigation();
  const { groups, friends, updateGroup, deleteGroup, createGroup } = useContext(DataContext);

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  // Bottom sheet azioni
  const [actionGroup, setActionGroup] = useState<Group | null>(null);
  const [actionOpen, setActionOpen] = useState(false);

  const openEditor = useCallback((g: Group) => { setSelectedGroup(g); setEditorOpen(true); }, []);
  const closeEditor = useCallback(() => { setEditorOpen(false); setSelectedGroup(null); }, []);

  const openActions = useCallback((g: Group) => { setActionGroup(g); setActionOpen(true); }, []);
  const closeActions = useCallback(() => { setActionOpen(false); setActionGroup(null); }, []);

  const changePhoto = useCallback(async (g: Group) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        updateGroup(g.id, { image: res.assets[0].uri });
      }
    } catch {
      Alert.alert('Errore', "Impossibile selezionare l'immagine.");
    }
  }, [updateGroup]);

  const removeGroup = useCallback((g: Group) => {
    Alert.alert('Elimina gruppo', `Vuoi eliminare “${g.name}”?`, [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Elimina', style: 'destructive', onPress: () => deleteGroup(g.id) },
    ]);
  }, [deleteGroup]);

  const onCreateGroup = useCallback(() => setCreateOpen(true), []);

  const renderGroupCard = ({ item }: { item: Group }) => {
    const scale = new Animated.Value(1);
    const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Cover */}
        <Pressable
          style={styles.cover}
          onPress={() => openEditor(item)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.coverImg} />
          ) : (
            <LinearGradient
              colors={['#4DA9E9', '#007AFF']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.coverImg}
            />
          )}
          {/* overlay per leggere bene i testi */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={styles.overlay}
          />

          {/* Titolo + badge */}
          <View style={styles.bottomRow}>
            <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>
            <LinearGradient
              colors={['#007fff', '#00a5f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Ionicons name="person" size={12} color={colors.white} />
              <Text style={styles.badgeText}>{item.members?.length ?? 0}</Text>
            </LinearGradient>
          </View>
        </Pressable>

        {/* Menu overlay */}
        <Pressable style={styles.menu} hitSlop={8} onPress={() => openActions(item)}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.white} />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    // ✅ Usa ScreenContainer: safe area + gestione inset. withScroll={false} perché usiamo FlatList.
    <ScreenContainer withScroll={false} headerHeight={56}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Pressable onPress={() => (navigation as any).goBack()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
        </View>

        <Text style={styles.headerTitle}>Gruppi</Text>

        <Pressable onPress={onCreateGroup} hitSlop={12}>
          <LinearGradient
            colors={['#007fff', '#00a5f2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.newBtn}
          >
            <Ionicons name="add" size={18} color={colors.white} />
            <Text style={styles.newBtnText}>Nuovo</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Lista */}
      <FlatList
        contentContainerStyle={styles.list}
        data={groups}
        keyExtractor={(g) => g.id}
        renderItem={renderGroupCard}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-circle-outline" size={42} color={colors.muted} />
            <Text style={styles.emptyText}>Nessun gruppo. Crea il primo dal pulsante “Nuovo”.</Text>
          </View>
        }
      />

      {/* Editor */}
      <GroupEditorSheet
        visible={editorOpen}
        group={selectedGroup}
        maxMembers={MAX_GROUP_MEMBERS}
        friends={friends as Friend[]}
        onClose={closeEditor}
        onSave={(id, payload) => updateGroup(id, payload)}
      />

      {/* Creazione */}
      <GroupCreateSheet
        visible={createOpen}
        friends={friends as Friend[]}
        maxMembers={MAX_GROUP_MEMBERS}
        onClose={() => setCreateOpen(false)}
        onCreate={(data) => { (createGroup as any)?.(data); setCreateOpen(false); }}
      />

      {/* Bottom sheet azioni */}
      <Modal visible={actionOpen} transparent animationType="fade" onRequestClose={closeActions}>
        <Pressable style={styles.sheetBackdrop} onPress={closeActions}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{actionGroup?.name ?? 'Gruppo'}</Text>

            <Pressable style={styles.sheetRow} onPress={() => { closeActions(); openEditor(actionGroup!); }}>
              <Ionicons name="create-outline" size={18} color={colors.text} />
              <Text style={styles.sheetRowText}>Modifica</Text>
            </Pressable>

            <Pressable style={styles.sheetRow} onPress={() => { if (!actionGroup) return; closeActions(); changePhoto(actionGroup); }}>
              <Ionicons name="image-outline" size={18} color={colors.text} />
              <Text style={styles.sheetRowText}>Cambia foto</Text>
            </Pressable>

            <Pressable style={[styles.sheetRow, styles.sheetRowDanger]} onPress={() => { if (!actionGroup) return; closeActions(); removeGroup(actionGroup); }}>
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
              <Text style={[styles.sheetRowText, styles.sheetRowDangerText]}>Elimina</Text>
            </Pressable>

            <Pressable style={styles.sheetCancel} onPress={closeActions}>
              <Text style={styles.sheetCancelText}>Chiudi</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}