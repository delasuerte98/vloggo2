import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerTitle: { color: colors.text, margin: spacing.lg },
  empty: { color: colors.muted, marginHorizontal: spacing.lg },
  list: { padding: spacing.lg, gap: spacing.lg },
});
