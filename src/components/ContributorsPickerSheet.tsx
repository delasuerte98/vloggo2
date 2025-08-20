// src/components/ContributorsPickerSheet.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Friend = {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
};

type Props = {
  visible: boolean;
  friends: Friend[];
  initial: string[];        // usernames già contributor
  ownerUsername: string;    // non removibile
  max: number;              // es. 20
  onClose: () => void;
  onConfirm: (usernames: string[]) => void; // lista completa risultante
};

export default function ContributorsPickerSheet({
  visible,
  friends,
  initial,
  ownerUsername,
  max,
  onClose,
  onConfirm,
}: Props) {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState<string[]>(initial);

  // re-hydrate quando si riapre
  React.useEffect(() => setSel(initial), [visible, initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(f =>
      f.username.toLowerCase().includes(q) || f.fullName.toLowerCase().includes(q)
    );
  }, [friends, query]);

  const toggle = (username: string) => {
    // owner non selezionabile qui (è già contributor forzato)
    if (username === ownerUsername) return;

    setSel(prev => {
      const exists = prev.includes(username);
      if (!exists && prev.length >= max) return prev; // limite
      return exists ? prev.filter(u => u !== username) : [...prev, username];
    });
  };

  const selectedCount = sel.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        {/* Header */}
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

          <Text style={{ flex: 1, textAlign: 'center', color: colors.text, fontWeight: '700' }}>
            Scegli contributori
          </Text>

          <LinearGradient
            colors={['#007fff', '#00a5f2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 14 }}
          >
            <Pressable
              onPress={() => onConfirm(sel)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 8 }}
            >
              <Ionicons name="checkmark" size={18} color={colors.white} />
              <Text style={{ color: colors.white, fontWeight: '700' }}>
                Conferma ({selectedCount})
              </Text>
            </Pressable>
          </LinearGradient>
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
            placeholder="Cerca amici"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, color: colors.text }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Lista amici */}
        <FlatList
          data={filtered}
          keyExtractor={(f) => f.id}
          renderItem={({ item }) => {
            const isOwner = item.username === ownerUsername;
            const isSel = sel.includes(item.username);
            return (
              <Pressable onPress={() => toggle(item.username)} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                paddingVertical: 12,
                paddingHorizontal: spacing.lg,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor: isSel ? colors.surface : 'transparent'
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

                {isOwner ? (
                  <View style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}>
                    <Text style={{ color: colors.muted, fontWeight: '600', fontSize: 12 }}>owner</Text>
                  </View>
                ) : (
                  <Ionicons
                    name={isSel ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={isSel ? '#00a5f2' : colors.muted}
                  />
                )}
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