import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 1,
    paddingBottom: 1,
  },

  /** Top logo */
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 190,
    resizeMode: 'contain',
  },

  /** Titolo hero (CTA) */
  titleWrapper: {
    marginTop: -80, // sposta il titolo leggermente sotto il logo
  },
  heroTitle: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 22,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  heroEmph: {
    color: '#007AFF', // coerente con brand/CTA
    fontWeight: '800',
  },

  /** Avatar */
  avatarRow: {
    alignItems: 'center',
    marginBottom: 22,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarHint: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 12,
  },

  /** Form */
  form: {
    gap: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  col: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  inputPwdWrap: {
    position: 'relative',
  },
  inputPwd: {
    paddingRight: 40,
  },
  eye: {
    position: 'absolute',
    right: 12,
    top: 14, // centrata per input ~48 di altezza
  },
  passwordHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 6,
  },

  /** CTA */
  button: {
    paddingVertical: spacing.md,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },

  /** Footer */
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
