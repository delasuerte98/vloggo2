// src/components/AlbumManageModal.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  /** Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  closeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  closeText: { color: colors.white, fontWeight: '700' },

  /** Card */
  albumCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  image: { width: '100%', height: '100%' },
  albumTitle: {
    color: colors.text,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryText: { color: colors.text },

  /** CTA Gestisci (gradient in JSX) */
  manageBtn: {
    marginTop: spacing.md,
    borderRadius: 14,
  },
  manageBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
  },
  manageBtnText: { color: colors.white, fontWeight: '700' },
});