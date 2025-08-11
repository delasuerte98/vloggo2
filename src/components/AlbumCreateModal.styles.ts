import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { width: '100%', backgroundColor: colors.white, borderRadius: 20, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text },
  coverPicker: { alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  cover: { width: 100, height: 100, borderRadius: 50 },
  coverHint: { color: colors.muted },
  input: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  createBtn: { backgroundColor: colors.primary, borderRadius: 16, alignItems: 'center', paddingVertical: spacing.md },
  createBtnText: { color: colors.white, fontWeight: '700' },
});
