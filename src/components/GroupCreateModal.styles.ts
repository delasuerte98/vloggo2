import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,        // <-- sfondo scuro semitrasparente
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.subtitle, color: colors.text },

  coverPicker: {
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cover: { width: 84, height: 84, borderRadius: 42 },
  coverHint: { color: colors.muted },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subLabel: { color: colors.muted },

  list: { maxHeight: 220 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fullName: { color: colors.text, fontWeight: '700' },
  username: { color: colors.muted, marginTop: 2 },

  createBtn: { backgroundColor: colors.primary, borderRadius: 16, alignItems: 'center', paddingVertical: spacing.md },
  createBtnText: { color: colors.white, fontWeight: '700' },
});
