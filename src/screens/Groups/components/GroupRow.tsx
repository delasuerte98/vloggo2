// src/screens/Groups/components/GroupRow.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { Group } from '../../../../App';

type Props = {
  group: Group;
  onPress: () => void;
  onRename: () => void;
  onChangePhoto: () => void;
  onDelete: () => void;
};

export default function GroupRow({
  group,
  onPress,
  onRename,
  onChangePhoto,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    }}>
      {/* Avatar */}
      <Pressable onPress={onPress} style={{
        width: 44, height: 44, borderRadius: 22, overflow: 'hidden',
        alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border
      }}>
        {group.image ? (
          <Image source={{ uri: group.image }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Ionicons name="people-circle-outline" size={36} color={colors.primary} />
        )}
      </Pressable>

      {/* Name + count */}
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        <Text style={[{ color: colors.text, fontWeight: '700' }, typography.subtitle]} numberOfLines={1}>
          {group.name}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 2 }}>
          {group.members?.length ?? 0} membri
        </Text>
      </Pressable>

      {/* Menu */}
      <Pressable onPress={() => setMenuOpen(true)} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }} hitSlop={10}>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
      </Pressable>

      {/* Bottom Sheet (moderno cross-platform) */}
      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable onPress={() => setMenuOpen(false)} style={{ flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: colors.white,
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
            paddingHorizontal: spacing.lg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            gap: spacing.sm,
          }}>
            <View style={{ width: 44, height: 4, backgroundColor: colors.border, alignSelf: 'center', borderRadius: 2, marginBottom: spacing.sm }} />
            <Pressable onPress={() => { setMenuOpen(false); onRename(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10 }}>
              <Ionicons name="pencil" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: '600' }}>Rinomina</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuOpen(false); onChangePhoto(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10 }}>
              <Ionicons name="image" size={18} color={colors.text} />
              <Text style={{ color: colors.text, fontWeight: '600' }}>Cambia foto</Text>
            </Pressable>
            <Pressable onPress={() => { setMenuOpen(false); onDelete(); }} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10 }}>
              <Ionicons name="trash" size={18} color="#ef4444" />
              <Text style={{ color: '#ef4444', fontWeight: '700' }}>Elimina</Text>
            </Pressable>
            <Pressable onPress={() => setMenuOpen(false)} style={{ alignItems: 'center', paddingVertical: 10, marginTop: spacing.sm }}>
              <Text style={{ color: colors.muted, fontWeight: '600' }}>Chiudi</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}