// src/components/VideoCard.styles.ts
import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export const styles = StyleSheet.create({
  /* Card principale */
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: spacing.sm,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  username: {
    color: colors.text,
    fontWeight: "600",
  },

  /* Testi */
  title: {
    color: colors.text,
    marginTop: spacing.xs,
    fontWeight: "700",
    fontSize: 16,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    marginTop: spacing.xs / 2,
  },

  /* Video */
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: spacing.sm,
  },
  video: {
    width: "100%",
    height: "100%",
  },

  /* Azioni */
  actions: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  likes: { color: colors.text, fontWeight: "500" },
  commentsToggle: { color: colors.text, fontWeight: "500" },

  /* Pannello commenti/risposte */
  panelBox: { marginTop: spacing.sm },

  /* Tabs */
  tabHeader: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  tabBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  tabBtnActive: {
    backgroundColor: colors.primary + "20", // colore brand soft
  },
  tabText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  tabTextActive: {
    fontWeight: "700",
    color: colors.primary,
  },

  /* Commenti */
  commentsBox: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted,
    overflow: "hidden",
    marginTop: 2,
  },
  commentAvatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  commentBubble: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  commentAuthor: {
    fontWeight: "600",
    marginBottom: 2,
    color: colors.text,
    fontSize: 13,
  },
  commentText: {
    color: colors.text,
    fontSize: 13,
  },

  /* Add comment */
  addCommentRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  /* Larghezza virtuale pager */
  pagerWidth: 320,

  /* Row miniature risposte */
  repliesRow: {
    gap: 10,
    alignItems: "center",
    paddingRight: spacing.sm,
  },
  replyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "transparent",
  },
  replyCircleSelected: { borderColor: colors.primary },
  replyCircleVideo: { width: "100%", height: "100%" },
  replyPlayOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    pointerEvents: "none",
  },

  /* Player risposta selezionata */
  replyPlayer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  replyPlayerTitle: {
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },
});