import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AlbumPill.styles';
import { typography } from '../theme/typography';
import { colors } from '../theme/colors';

type Props = { title: string; coverUri?: string; compact?: boolean };

export default function AlbumPill({ title, coverUri, compact }: Props) {
  return (
    <View style={[styles.pill, compact && styles.compact]}>
      {coverUri ? (
        <Image source={{ uri: coverUri }} style={styles.img} />
      ) : (
        <Ionicons name="albums-outline" size={compact ? 14 : 16} color={colors.muted} />
      )}
      <Text style={[typography.caption, styles.text]} numberOfLines={1}>{title}</Text>
    </View>
  );
}
