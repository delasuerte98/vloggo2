import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontWeight: '800', fontSize: 18 },
  groupCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  imageWrap: {
    alignSelf: 'center',
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm, overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  groupName: { color: colors.text, textAlign: 'center', fontWeight: '700', marginBottom: spacing.sm },
  subTitle: { color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.xs },
  membersWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  memberChip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberChipSelected: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  memberText: { color: colors.text },
  deleteBtn: {
    marginTop: spacing.md,
    backgroundColor: '#ef4444',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  deleteText: { color: '#fff', fontWeight: '700' },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '700' },
});
