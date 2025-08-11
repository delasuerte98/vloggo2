import React, { useMemo, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, Modal, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './DropdownMulti.styles';
import { Group } from '../../App';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

type Props = {
  groups: Group[];
  selected: string[];
  onChange: (ids: string[]) => void;
};

export default function DropdownMulti({ groups, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [showInfoFor, setShowInfoFor] = useState<Group | null>(null);

  const selectedLabels = useMemo(() => {
    const names = groups.filter(g => selected.includes(g.id)).map(g => g.name);
    return names.length ? names.join(', ') : 'Nessun gruppo selezionato';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, groups]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setOpen(o => !o)} style={styles.control}>
        <Text style={[typography.body, styles.value]} numberOfLines={1}>{selectedLabels}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 200 }} contentContainerStyle={{ paddingVertical: 4 }}>
            {groups.map((g) => {
              const selectedRow = selected.includes(g.id);
              return (
                <Pressable
                  key={g.id}
                  onPress={() => toggle(g.id)}
                  style={[styles.row, selectedRow && styles.rowSelected]}
                >
                  {g.image ? (
                    <Image source={{ uri: g.image }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="people-circle-outline" size={22} color={colors.muted} />
                  )}
                  <Text style={[typography.body, styles.rowText]}>{g.name}</Text>

                  <Pressable onPress={() => setShowInfoFor(g)} style={styles.infoBtn}>
                    <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} />
                  </Pressable>

                  <Ionicons
                    name={selectedRow ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={selectedRow ? colors.primary : colors.muted}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Info modal */}
      <Modal visible={!!showInfoFor} transparent animationType="fade" onRequestClose={() => setShowInfoFor(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={[typography.subtitle, styles.modalTitle]}>
                {showInfoFor?.name}
              </Text>
              <Pressable onPress={() => setShowInfoFor(null)}>
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: '80%' }}>
              {(showInfoFor?.members ?? []).map((m, i) => (
                <View key={i} style={styles.memberRow}>
                  <Ionicons name="person-outline" size={18} color={colors.muted} />
                  <Text style={[typography.body, styles.memberText]}>{m}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
