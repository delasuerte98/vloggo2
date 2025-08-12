import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  /* Layout base */
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl },

  /* Header */
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { color: colors.text },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerIconBtn: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconText: { color: colors.primaryDark, fontWeight: '700' },

  /* Sezioni a card */
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIconWrap: {
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sectionTitle: { color: colors.text, fontWeight: '800' },
  sectionHint: { color: colors.muted, fontSize: 12 },

  /* Picker vuoto elegante */
  emptyPicker: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyPickerIcon: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    padding: 12,
  },
  emptyPickerTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  emptyPickerSub: { color: colors.muted, fontSize: 12 },

  /* Preview video card */
  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 16 / 9,
    position: 'relative',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  previewVideo: { width: '100%', height: '100%' },

  /* Overlay play e durata (solo su poster) */
  previewOverlay: {
    position: 'absolute',
    inset: 0 as any, // RN non supporta 'inset' nativamente, viene interpretato come shorthand
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: { color: colors.white, fontSize: 12, fontWeight: '600' },

  /* Form */
  label: { color: colors.muted, marginTop: spacing.xs },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },

  /* Gruppi */
  circleAddBtn: { padding: 6, borderRadius: 999, backgroundColor: colors.primaryLight },

  /* Album chips */
  albumControl: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  albumChip: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  albumChipSelected: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLight },
  albumChipInner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  albumChipText: { color: colors.text, maxWidth: 180 },
  albumChipTextSel: { color: colors.primaryDark, fontWeight: '700' },
  sharedBadge: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#eef2ff',
    color: colors.primaryDark,
    overflow: 'hidden',
  },

  /* CTA fissa */
  bottomBar: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: colors.white, fontWeight: '800' },
});
