import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Contenuto scroll
  scrollContent: { paddingBottom: spacing.xxxl },

  // Mini header centrato
  miniHeaderBox: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  miniHeaderText: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    fontWeight: '800',
    fontSize: 16,
    color: colors.text,
    // soft shadow
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Header card
  headerCard: {
    backgroundColor: colors.white,
    margin: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
  },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  screenTitle: { color: colors.text },

  profileRow: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  avatarWrap: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: colors.surface },
  avatar: { width: '100%', height: '100%' },
  fullName: { color: colors.text },
  username: { color: colors.muted, marginTop: 2 },
  bio: { color: colors.text, marginTop: spacing.xs },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  locationText: { color: colors.muted },

  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  shareBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, borderRadius: 999, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  // Stats
  statsRow: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: colors.text, fontWeight: '800', fontSize: 18 },
  statLabel: { color: colors.muted, marginTop: 2, fontSize: 12 },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border },

  sectionHeaderRow: { marginTop: spacing.sm, marginHorizontal: spacing.lg, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text },

  // Grid
  gridContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap' },
  albumItem: { width: '48%', alignItems: 'center', marginBottom: spacing.xl },
  coverCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverImage: { width: '100%', height: '100%' },
  albumTitle: { color: colors.text, textAlign: 'center', marginTop: spacing.md },
  albumCount: { color: colors.muted, textAlign: 'center', marginTop: spacing.xs },
});
