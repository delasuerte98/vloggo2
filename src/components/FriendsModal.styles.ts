import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { width: '100%', maxHeight: '80%', backgroundColor: colors.white, borderRadius: 20, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text },
  input: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  fullName: { color: colors.text, fontWeight: '700' },
  username: { color: colors.muted, marginTop: 2 },
  addBtn: { backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  addBtnText: { color: colors.white, fontWeight: '700' },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: spacing.lg },
});
