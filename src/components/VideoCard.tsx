import React, { useContext, useMemo, useRef, useState } from "react";
import { View, Text, Image, Pressable, TextInput } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./VideoCard.styles";
import { FeedItem, DataContext } from "../../App";
import { typography } from "../theme/typography";
import { colors } from "../theme/colors";
import GroupPill from "./GroupPill";
import AlbumPill from "./AlbumPill";

type Props = { item: FeedItem };

// Modello locale del commento (compatibile con i vecchi)
type CommentNew = { authorId: string; authorName: string; text: string };

export default function VideoCard({ item }: Props) {
  const videoRef = useRef<Video>(null);
  const { profile, friends } = useContext(DataContext);

  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(item?.likes?.length ?? 0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>("");

  // Normalizza eventuali commenti "vecchi" { user, text } in { authorId, authorName, text }
  const initialComments: CommentNew[] = useMemo(() => {
    const list: any[] = item?.comments ?? [];
    return list.map((c) => {
      if (c && typeof c === "object" && "authorId" in c) {
        // già nel formato nuovo
        return {
          authorId: c.authorId,
          authorName: c.authorName ?? "Utente",
          text: c.text ?? "",
        } as CommentNew;
      }
      // vecchio formato: { user, text }
      const name: string = c?.user ?? c?.authorName ?? "Utente";
      let inferredId: string | undefined;

      if (
        profile &&
        (name === profile.fullName ||
          name === profile.username ||
          name.toLowerCase() === "tu")
      ) {
        inferredId = profile.id ?? "local-user";
      } else {
        const f = friends.find((x) => x.name === name || x.username === name);
        inferredId = f?.id;
      }

      return {
        authorId: inferredId ?? "unknown",
        authorName: name,
        text: c?.text ?? "",
      } as CommentNew;
    });
  }, [item?.comments, profile, friends]);

  const [comments, setComments] = useState<CommentNew[]>(initialComments);

  const toggleLike = () => {
    setLiked((p) => !p);
    setLikeCount((c) => (liked ? Math.max(0, c - 1) : c + 1));
  };

  const addComment = () => {
    const txt = commentText.trim();
    if (!txt) return;

    const authorId = profile?.id ?? "local-user"; // fallback se non hai un id persistito
    const authorName = profile?.fullName || profile?.username || "Tu";

    setComments((prev) => [
      ...prev,
      { authorId, authorName, text: txt },
    ]);
    setCommentText("");
    setShowComments(true);
  };

  const openFullScreen = async () => {
    try {
      await videoRef.current?.presentFullscreenPlayer();
    } catch {}
  };

  // Risolve l’avatar: prima con l'id (incluso "local-user"), poi in fallback col nome
  const resolveAvatarUri = (authorId?: string, authorName?: string) => {
    if (authorId && authorId !== "unknown") {
      if (profile) {
        // match su id reale o fallback "local-user"
        if (profile.id === authorId || authorId === "local-user") {
          return profile.avatar;
        }
      }
      const fById = friends.find((x) => x.id === authorId);
      if (fById) return fById.avatar;
    }
    if (authorName) {
      if (
        profile &&
        (authorName === profile.fullName ||
          authorName === profile.username ||
          authorName.toLowerCase() === "tu")
      ) {
        return profile.avatar;
      }
      const fByName = friends.find(
        (x) => x.name === authorName || x.username === authorName
      );
      return fByName?.avatar;
    }
    return undefined;
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        {item.user?.avatar ? (
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={36}
            color={colors.muted}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={[typography.subtitle, styles.username]}>
            {item.user.username}
          </Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <GroupPill group={item.group} compact />
            {!!item.albumTitle && <AlbumPill title={item.albumTitle} compact />}
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
      </View>

      <Text style={[typography.title, styles.title]}>{item.title}</Text>
      {!!item.description && (
        <Text style={[typography.body, styles.description]}>
          {item.description}
        </Text>
      )}

      {/* Video */}
      <Pressable onPress={openFullScreen} style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={{ uri: item.uri }}
          style={styles.video}
          isMuted={false}
          volume={1.0}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
          onError={() => {
            // opzionale: log/alert
          }}
        />
      </Pressable>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable onPress={toggleLike} style={styles.actionLeft}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? colors.danger : colors.text}
          />
          <Text style={[typography.body, styles.likes]}>{likeCount}</Text>
        </Pressable>
        <Pressable
          onPress={() => setShowComments((s) => !s)}
          style={styles.actionRight}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={colors.text}
          />
          <Text style={[typography.body, styles.commentsToggle]}>
            {showComments ? "Nascondi" : "Commenti"}
          </Text>
        </Pressable>
      </View>

      {/* Commenti (avatar + bubble) */}
      {showComments && (
        <View style={styles.commentsBox}>
          {comments.slice(-3).map((c, idx) => {
            const avatarUri = resolveAvatarUri(c.authorId, c.authorName);
            return (
              <View key={`${c.authorId}-${idx}`} style={styles.commentRow}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.commentAvatar} />
                ) : (
                  <View style={[styles.commentAvatar, styles.commentAvatarFallback]}>
                    <Ionicons name="person" size={14} color={colors.white} />
                  </View>
                )}

                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor} numberOfLines={1}>
                    {c.authorName}
                  </Text>
                  <Text style={styles.commentText}>{c.text}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.addCommentRow}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Aggiungi commento"
              placeholderTextColor={colors.muted}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={addComment}
            />
            <Pressable onPress={addComment} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color={colors.white} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
