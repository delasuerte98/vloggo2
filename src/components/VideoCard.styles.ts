import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20, // rounded-2xl vibe
    padding: spacing.lg,
    // soft shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: spacing.sm,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  username: { color: colors.text },

  // Testi
  title: { color: colors.text, marginTop: spacing.xs },
  description: { color: colors.muted },

  // Video
  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  // Actions
  actions: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  likes: { color: colors.text },
  commentsToggle: { color: colors.text },

  // Commenti container
  commentsBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.sm,
  },

  // Riga commento (avatar + bubble)
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },

  // Avatar commento
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.muted, // fallback
    overflow: "hidden",
    marginTop: 2, // allinea meglio con la bubble
  },
  commentAvatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Bubble commento
  commentBubble: {
    flex: 1,
    backgroundColor: "#F4F5F7", // se hai colors.surfaceAlt, usa quello
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  commentAuthor: {
    fontWeight: "600",
    marginBottom: 2,
    color: colors.text,
  },
  commentText: { color: colors.text },

  // Add comment
  addCommentRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
