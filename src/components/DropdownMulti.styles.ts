import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  control: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // soft shadow
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  value: { color: colors.text, flex: 1, marginRight: spacing.md },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowSelected: { backgroundColor: colors.primaryLight },
  rowText: { color: colors.text, flex: 1 },
  avatar: { width: 22, height: 22, borderRadius: 11 },
  infoBtn: { marginRight: spacing.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { color: colors.text },
  memberRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', paddingVertical: spacing.xs },
  memberText: { color: colors.text },
});
