import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl },
  screenTitle: { color: colors.text, marginBottom: spacing.md },
  selectBtn: {
    backgroundColor: colors.primary, borderRadius: 16, paddingVertical: spacing.md, paddingHorizontal: spacing.lg,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  selectBtnText: { color: colors.white, fontWeight: '700' },
  preview: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', aspectRatio: 16/9 },
  previewVideo: { width: '100%', height: '100%' },
  label: { color: colors.muted, marginTop: spacing.sm },
  input: { backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  albumControl: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: spacing.sm },
  albumChip: { backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  albumChipSelected: { backgroundColor: colors.primaryLight },
  albumChipText: { color: colors.text, maxWidth: 180 },
  albumChipTextSel: { color: colors.primaryDark, fontWeight: '700' },
  uploadBtn: { marginTop: spacing.lg, backgroundColor: colors.primaryDark, borderRadius: 16, paddingVertical: spacing.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  uploadBtnText: { color: colors.white, fontWeight: '700' },
});
