// src/screens/Profile/ProfileAlbums.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Contenuto scroll
  scrollContent: { paddingBottom: 0 },

  // Mini header centrato (nome flottante)
  miniHeaderBox: {
    position: 'absolute',
    left: 0,
    right: 0,
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
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // ===== CARD PROFILO =====
  headerCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginTop: 0,
    marginBottom: spacing.md,
    borderRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    overflow: 'hidden',
    alignItems: 'center',
  },

  // Ingranaggio interno alla card (alto-destro)
  profileGearBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 12,
    zIndex: 5,
  },

  // Profilo centrato
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  fullName: { color: colors.text, marginTop: spacing.sm, fontWeight: '800', letterSpacing: 0.2 },
  username: { color: colors.muted, marginTop: 2, letterSpacing: 0.2 },
  bio: { color: colors.text, marginTop: spacing.xs, textAlign: 'center' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  locationText: { color: colors.muted },

  // Pulsante "Modifica profilo"
  editProfileBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 9,
    backgroundColor: '#EEF0F4',
    alignSelf: 'center',
  },
  editProfileText: {
    fontWeight: '700',
    color: colors.text,
  },

  // Stats
  statsRow: {
    marginTop: spacing.lg,
    minHeight: 64,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: colors.text, fontWeight: '800', fontSize: 18 },
  statLabel: { color: colors.muted, marginTop: 2, fontSize: 12 },
  statDivider: { width: 1, height: 24, backgroundColor: colors.border },

  // ===== SEZIONE ALBUM =====
  sectionHeaderRow: {
    marginTop: spacing.sm, // ridotto per avvicinarlo alla card
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  sectionTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },

  // Grid Album
  gridContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 1,
  },

  // Importante: wrap + allineamento a sinistra
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  // 3 per riga fissi: 33.333% a cella
  // Usare sia flexBasis che maxWidth evita comportamenti strani con padding/misure
  albumItem: {
    flexBasis: '33.333%',
    maxWidth: '33.333%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  // Cerchio responsivo: sta dentro la colonna
  coverCircle: {
    width: '86%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: { width: '100%', height: '100%' },

  albumTitle: { color: colors.text, textAlign: 'center', marginTop: spacing.md },
  albumCount: { color: colors.muted, textAlign: 'center', marginTop: spacing.xs },

  // Indicatore "condiviso" come pill attaccato al bordo destro della cover
  sharedPill: {
    position: 'absolute',
    top: 40,
    right: 0,
    height: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  // ===== Backdrop =====
  backdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 25,
  },

  // Menu del FAB (riutilizzato come menu rapido header)
  fabMenu: {
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 170,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fabMenuText: {
    marginLeft: 8,
    fontWeight: '600',
    color: colors.text,
  },
  fabMenuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});