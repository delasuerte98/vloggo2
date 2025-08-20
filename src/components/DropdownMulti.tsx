// src/components/DropdownMulti.tsx
import React, { useMemo, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, Image,
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
  onInfo?: (id: string) => void;   // ✅ nuova prop
};

export default function DropdownMulti({ groups, selected, onChange, onInfo }: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabels = useMemo(() => {
    const names = groups.filter(g => selected.includes(g.id)).map(g => g.name);
    return names.length ? names.join(', ') : 'Nessun gruppo selezionato';
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
      {/* Controllo dropdown */}
      <Pressable onPress={() => setOpen(o => !o)} style={styles.control}>
        <Text style={[typography.body, styles.value]} numberOfLines={1}>
          {selectedLabels}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>

      {/* Lista gruppi */}
      {open && (
        <View style={styles.dropdown}>
          <ScrollView style={{ maxHeight: 200 }} contentContainerStyle={{ paddingVertical: 4 }}>
            {groups.map((g) => {
              const selectedRow = selected.includes(g.id);
              return (
                <View
                  key={g.id}
                  style={[styles.row, selectedRow && styles.rowSelected]}
                >
                  {g.image ? (
                    <Image source={{ uri: g.image }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="people-circle-outline" size={22} color={colors.muted} />
                  )}

                  <Text style={[typography.body, styles.rowText]}>{g.name}</Text>

                  {/* Pulsante info → delega al padre */}
                  <Pressable
                    onPress={() => onInfo?.(g.id)}
                    style={styles.infoBtn}
                    hitSlop={8}
                  >
                    <Ionicons name="information-circle-outline" size={20} color={colors.primaryDark} />
                  </Pressable>

                  {/* Checkbox */}
                  <Pressable onPress={() => toggle(g.id)} hitSlop={8}>
                    <Ionicons
                      name={selectedRow ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={selectedRow ? colors.primary : colors.muted}
                    />
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}