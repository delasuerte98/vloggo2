import React, { useMemo, useState } from 'react';
import { View, Text, Modal, Pressable, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './FriendsModal.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';
import { Friend } from '../../App';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (f: Friend) => void;
};

const MOCK_DIRECTORY: Friend[] = [
  { id: 'u10', username: 'andre', fullName: 'Andrea Rossi' },
  { id: 'u11', username: 'vale', fullName: 'Valentina Gialli' },
  { id: 'u12', username: 'teo', fullName: 'Matteo Viola' },
];

export default function FriendsModal({ visible, onClose, onAdd }: Props) {
  const [q, setQ] = useState('');
  const results = useMemo(
    () => MOCK_DIRECTORY.filter(u => (u.username+u.fullName).toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={[typography.subtitle, styles.title]}>Aggiungi amici</Text>
            <Pressable onPress={onClose}><Ionicons name="close" size={22} color={colors.text} /></Pressable>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Cerca per nome o username"
            placeholderTextColor={colors.muted}
            value={q}
            onChangeText={setQ}
          />
          <FlatList
            data={results}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Ionicons name="person-circle-outline" size={26} color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.fullName}>{item.fullName}</Text>
                  <Text style={styles.username}>@{item.username}</Text>
                </View>
                <Pressable style={styles.addBtn} onPress={() => onAdd(item)}>
                  <Ionicons name="person-add-outline" size={18} color={colors.white} />
                  <Text style={styles.addBtnText}>Aggiungi</Text>
                </Pressable>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nessun risultato</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}
