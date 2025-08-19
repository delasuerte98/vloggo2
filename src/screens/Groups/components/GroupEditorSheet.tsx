// src/screens/Groups/components/GroupEditorSheet.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  FlatList,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { Friend, Group } from '../../../../App';

type Props = {
  visible: boolean;
  group: Group | null;
  friends: Friend[];
  maxMembers: number;
  onClose: () => void;
  onSave: (groupId: string, payload: Partial<Group>) => void;
};

export default function GroupEditorSheet({
  visible,
  group,
  friends,
  maxMembers,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');
  const [draftMembers, setDraftMembers] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [limitMsg, setLimitMsg] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      setName(group.name ?? '');
      setDraftMembers(group.members ? [...group.members] : []);
      setImageUri(group.image);
      setQuery('');
      setLimitMsg(null);
    }
  }, [group, visible]);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(f =>
      f.username.toLowerCase().includes(q) || f.fullName.toLowerCase().includes(q)
    );
  }, [friends, query]);

  const isDirty =
    group &&
    (name.trim() !== (group.name ?? '') ||
      imageUri !== group.image ||
      JSON.stringify([...draftMembers].sort()) !== JSON.stringify([...(group.members ?? [])].sort()));

  const toggleMember = (username: string) => {
    setLimitMsg(null);
    setDraftMembers(prev => {
      const exists = prev.includes(username);
      if (!exists && prev.length >= maxMembers) {
        setLimitMsg(`Limite massimo di ${maxMembers} membri raggiunto`);
        return prev;
      }
      return exists ? prev.filter(u => u !== username) : [...prev, username];
    });
  };

  const selectAll = () => {
    const allUsernames = Array.from(new Set(friends.map(f => f.username)));
    if (allUsernames.length > maxMembers) {
      setDraftMembers(allUsernames.slice(0, maxMembers));
      setLimitMsg(`Selezionati i primi ${maxMembers} di ${allUsernames.length} amici (limite raggiunto)`);
    } else {
      setDraftMembers(allUsernames);
      setLimitMsg(null);
    }
  };
  const clearAll = () => { setDraftMembers([]); setLimitMsg(null); };

  const save = () => {
    if (!group) return;
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Nome richiesto', 'Inserisci un nome per il gruppo.');
      return;
    }
    const payload: Partial<Group> = {
      name: trimmed,
      members: draftMembers,
      image: imageUri,
    };
    // TODO(api): validare uniqueness nome se richiesto dal backend
    onSave(group.id, payload);
    onClose();
  };

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.9,
      });
      if (!res.canceled && res.assets?.length) {
        // TODO(api): upload immagine su backend e salva URL definitivo
        setImageUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Errore', "Impossibile selezionare l'immagine.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        {/* Header compatto */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}>
          <Pressable onPress={onClose} hitSlop={12} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>

          <Text style={[typography.subtitle, { flex: 1, textAlign: 'center', color: colors.text }]} numberOfLines={1}>
            {group?.name ?? 'Gruppo'}
          </Text>

          <Pressable onPress={save} hitSlop={12} style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: isDirty && name.trim() ? colors.primary : colors.muted,
            paddingHorizontal: spacing.md,
            paddingVertical: 8,
            borderRadius: 14,
          }}>
            <Ionicons name="checkmark" size={18} color={colors.white} />
            <Text style={{ color: colors.white, fontWeight: '700' }}>Salva</Text>
          </Pressable>
        </View>

        {/* Contenuto */}
        <FlatList
          ListHeaderComponent={
            <>
              {/* Avatar grande + Nome */}
              <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md, alignItems: 'center' }}>
                <Pressable onPress={pickImage} style={{
                  width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surface,
                  alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  borderWidth: 1, borderColor: colors.border
                }}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <Ionicons name="people-circle" size={72} color={colors.primary} />
                  )}
                </Pressable>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Nome del gruppo"
                  placeholderTextColor={colors.muted}
                  style={{
                    marginTop: spacing.md,
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderWidth: 1,
                    borderColor: colors.border,
                    width: '100%',
                    color: colors.text,
                    textAlign: 'center',
                    fontWeight: '700',
                  }}
                />
              </View>

              {/* Azioni rapide */}
              <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}>
                <Pressable onPress={selectAll} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: colors.surface, borderRadius: 999,
                  paddingHorizontal: spacing.md, paddingVertical: 8, borderWidth: 1, borderColor: colors.border,
                }}>
                  <Ionicons name="checkbox" size={16} color={colors.text} />
                  <Text style={{ color: colors.text }}>Seleziona tutti</Text>
                </Pressable>
                <Pressable onPress={clearAll} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  backgroundColor: colors.surface, borderRadius: 999,
                  paddingHorizontal: spacing.md, paddingVertical: 8, borderWidth: 1, borderColor: colors.border,
                }}>
                  <Ionicons name="close-circle" size={16} color={colors.text} />
                  <Text style={{ color: colors.text }}>Rimuovi tutti</Text>
                </Pressable>
              </View>

              {/* Ricerca */}
              <View style={{
                marginHorizontal: spacing.lg, marginBottom: spacing.sm,
                flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
                backgroundColor: colors.surface, borderRadius: 12,
                paddingHorizontal: spacing.md, paddingVertical: 10,
                borderWidth: 1, borderColor: colors.border,
              }}>
                <Ionicons name="search" size={18} color={colors.muted} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Cerca amici per nome o username"
                  placeholderTextColor={colors.muted}
                  style={{ flex: 1, color: colors.text }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Info limite */}
              <View style={{
                marginHorizontal: spacing.lg,
                marginBottom: spacing.xs,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <Text style={{ color: colors.muted }}>
                  Membri ({draftMembers.length}/{maxMembers})
                </Text>
                {limitMsg ? <Text style={{ color: colors.primary, fontWeight: '600' }}>{limitMsg}</Text> : null}
              </View>
            </>
          }
          data={filteredFriends}
          keyExtractor={(f) => f.id}
          renderItem={({ item }) => {
            const isMember = draftMembers.includes(item.username);
            return (
              <Pressable onPress={() => toggleMember(item.username)} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: 12,
                paddingHorizontal: spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: isMember ? colors.surface : 'transparent'
              }}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                ) : (
                  <Ionicons name="person-circle-outline" size={36} color={colors.muted} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{item.fullName}</Text>
                  <Text style={{ color: colors.muted, marginTop: 2 }}>@{item.username}</Text>
                </View>
                <Ionicons
                  name={isMember ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={isMember ? colors.primary : colors.muted}
                />
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, gap: spacing.sm }}>
              <Ionicons name="search" size={36} color={colors.muted} />
              <Text style={{ color: colors.muted }}>Nessun risultato</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}