import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  card: { width: '100%', backgroundColor: colors.white, borderRadius: 20, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: colors.text },
  avatarWrap: { alignItems: 'center', gap: spacing.xs },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  changePhoto: { color: colors.primary },
  input: { backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 16, alignItems: 'center', paddingVertical: spacing.md },
  saveBtnText: { color: colors.white, fontWeight: '700' },
});
