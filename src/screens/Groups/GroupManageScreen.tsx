import React, { useContext, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DataContext, Friend, Group } from '../../../App';
import { styles } from './GroupManageScreen.styles';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function GroupManageScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { groups, friends, updateGroup } = useContext(DataContext);

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [query, setQuery] = useState('');
  const [draftMembers, setDraftMembers] = useState<string[]>([]);

  const openEditor = (g: Group) => {
    setSelectedGroup(g);
    setDraftMembers(g.members.slice());
    setQuery('');
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setSelectedGroup(null);
    setDraftMembers([]);
    setQuery('');
  };

  const toggleMember = (username: string) => {
    setDraftMembers(prev => (prev.includes(username) ? prev.filter(u => u !== username) : [...prev, username]));
  };

  const selectAll = () => setDraftMembers(Array.from(new Set(friends.map(f => f.username))));
  const clearAll = () => setDraftMembers([]);

  const save = () => {
    if (!selectedGroup) return;
    updateGroup(selectedGroup.id, { members: draftMembers });
    closeEditor();
  };

  const filteredFriends: Friend[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(f => f.username.toLowerCase().includes(q) || f.fullName.toLowerCase().includes(q));
  }, [friends, query]);

  const headerPaddingTop = Math.max(insets.top, 12);

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: headerPaddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.title, styles.title]}>Gestione gruppi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista gruppi */}
      <FlatList
        contentContainerStyle={styles.listContent}
        data={groups}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => (
          <View style={styles.groupRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.subtitle, styles.groupName]}>{item.name}</Text>
              <Text style={[typography.body, styles.membersCount]}>{item.members.length} membri</Text>
            </View>
            <Pressable style={styles.editBtn} onPress={() => openEditor(item)}>
              <Ionicons name="people-outline" size={18} color={colors.white} />
              <Text style={styles.editBtnText}>Modifica</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-circle-outline" size={42} color={colors.muted} />
            <Text style={styles.emptyText}>Nessun gruppo. Creane uno dalla schermata Gruppi.</Text>
          </View>
        }
      />

      {/* Editor membri */}
      <Modal
        visible={editorOpen}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
        onRequestClose={closeEditor}
      >
        <SafeAreaView style={styles.modalSafe}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <Pressable onPress={closeEditor} hitSlop={12} style={styles.modalClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={[typography.subtitle, styles.modalTitle]}>{selectedGroup?.name ?? 'Gruppo'}</Text>
            <Pressable onPress={save} style={styles.saveBtn}>
              <Ionicons name="checkmark" size={18} color={colors.white} />
              <Text style={styles.saveBtnText}>Salva</Text>
            </Pressable>
          </View>

          {/* Azioni rapide */}
          <View style={styles.quickActions}>
            <Pressable onPress={selectAll} style={styles.chip}>
              <Ionicons name="checkbox" size={16} color={colors.text} />
              <Text style={styles.chipText}>Seleziona tutti</Text>
            </Pressable>
            <Pressable onPress={clearAll} style={styles.chip}>
              <Ionicons name="close-circle" size={16} color={colors.text} />
              <Text style={styles.chipText}>Rimuovi tutti</Text>
            </Pressable>
          </View>

          {/* Ricerca */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Cerca amici per nome o username"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Lista amici */}
          <FlatList
            data={filteredFriends}
            keyExtractor={(f) => f.id}
            contentContainerStyle={styles.friendsContent}
            renderItem={({ item }) => {
              const isMember = draftMembers.includes(item.username);
              return (
                <Pressable style={styles.friendRow} onPress={() => toggleMember(item.username)}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="person-circle-outline" size={32} color={colors.muted} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>{item.fullName}</Text>
                    <Text style={styles.friendUsername}>@{item.username}</Text>
                  </View>
                  <Ionicons
                    name={isMember ? 'checkmark-circle' : 'ellipse-outline'}
                    size={22}
                    color={isMember ? colors.primary : colors.muted}
                  />
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="search" size={36} color={colors.muted} />
                <Text style={styles.emptyText}>Nessun risultato</Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
