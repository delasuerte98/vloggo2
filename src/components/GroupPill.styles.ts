import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    maxWidth: 140,
  },
  compact: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  img: { width: 16, height: 16, borderRadius: 8 },
  text: { color: colors.muted },
});
