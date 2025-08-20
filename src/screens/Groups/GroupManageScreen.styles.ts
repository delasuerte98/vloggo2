// src/screens/Groups/GroupManageScreen.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /** HEADER */
  header: {
    position: 'relative',
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: colors.text,
  },

  /** Pulsante “Nuovo” (gradient gestito via JSX) */
  newBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 14,
  },
  newBtnText: { color: colors.white, fontWeight: '700' },

  /** LIST */
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  /** CARD COVER STYLE */
  card: {
    height: 140,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cover: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  coverImg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  groupName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    maxWidth: '70%',
  },

  /** Badge membri (gradient gestito via JSX) */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },

  /** Menu overlay */
  menu: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00000055',
    borderRadius: 16,
    padding: 6,
  },

  /** Empty */
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: { color: colors.muted },

  /** Bottom sheet */
  sheetBackdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    textAlign: 'center',
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
  },
  sheetRowText: {
    color: colors.text,
    fontWeight: '600',
  },
  sheetRowDanger: {},
  sheetRowDangerText: { color: '#ef4444', fontWeight: '700' },
  sheetCancel: { alignItems: 'center', paddingVertical: 10, marginTop: spacing.sm },
  sheetCancelText: { color: colors.muted, fontWeight: '600' },
});