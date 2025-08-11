import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './GroupPill.styles';
import { Group } from '../../App';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

type Props = {
  group: Group;
  compact?: boolean;
};

export default function GroupPill({ group, compact = false }: Props) {
  return (
    <View style={[styles.pill, compact && styles.compact]}>
      {group.image ? (
        <Image source={{ uri: group.image }} style={styles.img} />
      ) : (
        <Ionicons name="people-circle-outline" size={compact ? 16 : 18} color={colors.muted} />
      )}
      <Text style={[typography.caption, styles.text]} numberOfLines={1}>
        {group.name}
      </Text>
    </View>
  );
}
