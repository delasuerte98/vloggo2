// src/components/VideoCard.tsx
import React, { useContext, useMemo, useRef, useState } from "react";
import { View, Text, Image, Pressable, TextInput, Alert, ScrollView } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./VideoCard.styles";
import { FeedItem, DataContext } from "../../App";
import { typography } from "../theme/typography";
import { colors } from "../theme/colors";
import GroupPill from "./GroupPill";
import AlbumPill from "./AlbumPill";

type Props = { item: FeedItem };
type CommentNew = { authorId: string; authorName: string; text: string };

export default function VideoCard({ item }: Props) {
  const mainVideoRef = useRef<Video>(null);
  const replyPlayerRef = useRef<Video>(null);
  const pagerRef = useRef<ScrollView>(null);

  const {
    profile,
    friends,
    albums,
    currentUser,
    canUserUploadToAlbum,
    addVideoReply,
  } = useContext(DataContext);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.likes?.length ?? 0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<0 | 1>(0); // 0=Commenti, 1=Risposte
  const [commentText, setCommentText] = useState("");
  const [mediaPerm, setMediaPerm] = useState<boolean | null>(null);
  const [cameraPerm, setCameraPerm] = useState<boolean | null>(null);

  const initialComments: CommentNew[] = useMemo(() => {
    const list: any[] = item?.comments ?? [];
    return list.map((c) => {
      if (c && typeof c === "object" && "authorId" in c) {
        return {
          authorId: (c as any).authorId,
          authorName: (c as any).authorName ?? "Utente",
          text: (c as any).text ?? "",
        };
      }
      const name: string = (c as any)?.user ?? (c as any)?.authorName ?? "Utente";
      let inferredId: string | undefined;
      if (profile && (name === profile.fullName || name === profile.username || name.toLowerCase() === "tu")) {
        inferredId = (profile as any).id ?? "local-user";
      } else {
        const f = friends.find((x: any) => x.name === name || x.username === name);
        inferredId = f?.id;
      }
      return { authorId: inferredId ?? "unknown", authorName: name, text: (c as any)?.text ?? "" };
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
    const authorId = (profile as any)?.id ?? "local-user";
    const authorName = profile?.fullName || profile?.username || "Tu";
    setComments((prev) => [...prev, { authorId, authorName, text: txt }]);
    setCommentText("");
    setPanelOpen(true);
    setActiveTab(0);
  };

  const openFullScreen = async () => {
    try {
      await mainVideoRef.current?.presentFullscreenPlayer();
    } catch {}
  };

  const resolveAvatarUri = (authorId?: string, authorName?: string) => {
    if (authorId && authorId !== "unknown") {
      if (profile && ((profile as any).id === authorId || authorId === "local-user")) return profile.avatar;
      const fById = friends.find((x: any) => x.id === authorId);
      if (fById) return (fById as any).avatar;
    }
    if (authorName) {
      if (profile && (authorName === profile.fullName || authorName === profile.username || authorName.toLowerCase() === "tu")) {
        return profile.avatar;
      }
      const fByName = friends.find((x: any) => x.name === authorName || x.username === authorName);
      return (fByName as any)?.avatar;
    }
    return undefined;
  };

  const canReply = useMemo(() => {
    if (!item.albumId) return false;
    const album = albums.find((a) => a.id === item.albumId);
    return !!album && canUserUploadToAlbum(currentUser, album);
  }, [albums, item.albumId, currentUser, canUserUploadToAlbum]);

  const videoReplies = useMemo(() => {
    if (!item.albumId) return [];
    const album = albums.find((a) => a.id === item.albumId);
    const v = album?.videos.find((vv) => vv.id === item.id);
    return v?.replies ?? [];
  }, [albums, item.albumId, item.id]);

  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const selectedReply = useMemo(
    () => videoReplies.find((r) => r.id === selectedReplyId) || null,
    [videoReplies, selectedReplyId]
  );

  const replyWithVideo = async () => {
    if (!item.albumId) return;
    const album = albums.find((a) => a.id === item.albumId);
    if (!album) return;
    if (!canUserUploadToAlbum(currentUser, album)) {
      Alert.alert("Accesso negato", "Non puoi rispondere con un video in questo album.");
      return;
    }
    if (cameraPerm === null) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPerm(status === "granted");
      if (status !== "granted") {
        Alert.alert("Permesso fotocamera", "Concedi l’accesso per registrare una risposta.");
        return;
      }
    } else if (cameraPerm === false) {
      Alert.alert("Permesso fotocamera", "Concedi l’accesso per registrare una risposta.");
      return;
    }
    if (mediaPerm === null) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaPerm(status === "granted");
    }

    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      videoMaxDuration: 60,
    });
    if (res.canceled || !res.assets?.length) return;

    const uri = res.assets[0].uri;
    const reply = { id: `vr_${Date.now()}`, uri, title: `Risposta a ${item.title || "video"}`, description: "" };

    addVideoReply({ albumId: item.albumId, parentVideoId: item.id, reply });
    Alert.alert("Risposta aggiunta", "La tua risposta video è stata registrata.");
    setPanelOpen(true);
    setActiveTab(1);
    setSelectedReplyId(reply.id);
  };

  const onTabPress = (index: 0 | 1) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index === 0 ? 0 : styles.pagerWidth, y: 0, animated: true });
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        {item.user?.avatar ? (
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={36} color={colors.muted} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={[typography.subtitle, styles.username]}>{item.user.username}</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <GroupPill group={item.group} compact />
            {!!item.albumTitle && <AlbumPill title={item.albumTitle} compact />}
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.muted} />
      </View>

      {/* TITLE + DESC */}
      <Text style={[typography.title, styles.title]}>{item.title}</Text>
      {!!item.description && (
        <Text style={[typography.body, styles.description]}>{item.description}</Text>
      )}

      {/* VIDEO */}
      <Pressable onPress={openFullScreen} style={styles.videoWrapper}>
        <Video
          ref={mainVideoRef}
          source={{ uri: item.uri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          isLooping
        />
      </Pressable>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <Pressable onPress={toggleLike} style={styles.actionLeft}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={22}
            color={liked ? colors.danger : colors.text}
          />
          <Text style={styles.likes}>{likeCount}</Text>
        </Pressable>

        {canReply && (
          <Pressable onPress={replyWithVideo} style={styles.actionRight}>
            <Ionicons name="videocam-outline" size={22} color={colors.text} />
            <Text style={styles.commentsToggle}>Rispondi</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setPanelOpen((s) => !s)} style={styles.actionRight}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.text} />
          <Text style={styles.commentsToggle}>
            {panelOpen ? "Nascondi" : "Commenti"}
          </Text>
        </Pressable>
      </View>

      {/* PANEL */}
      {panelOpen && (
        <View style={styles.panelBox}>
          {/* TABS */}
          <View style={styles.tabHeader}>
            <Pressable
              onPress={() => onTabPress(0)}
              style={[styles.tabBtn, activeTab === 0 && styles.tabBtnActive]}
            >
              <Text
                style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}
              >
                Commenti
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onTabPress(1)}
              style={[styles.tabBtn, activeTab === 1 && styles.tabBtnActive]}
            >
              <Text
                style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}
              >
                Risposte video{" "}
                {videoReplies.length ? `(${videoReplies.length})` : ""}
              </Text>
            </Pressable>
          </View>

          {/* COMMENTS */}
          {activeTab === 0 ? (
            <View style={styles.commentsBox}>
              {comments.slice(-3).map((c, idx) => {
                const avatarUri = resolveAvatarUri(c.authorId, c.authorName);
                return (
                  <View key={`${c.authorId}-${idx}`} style={styles.commentRow}>
                    {avatarUri ? (
                      <Image
                        source={{ uri: avatarUri }}
                        style={styles.commentAvatar}
                      />
                    ) : (
                      <View
                        style={[
                          styles.commentAvatar,
                          styles.commentAvatarFallback,
                        ]}
                      >
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
              {/* ADD COMMENT */}
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
          ) : (
            <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
              {/* REPLIES PREVIEW */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.repliesRow}
              >
                {videoReplies.length === 0 ? (
                  <Text style={{ opacity: 0.6 }}>
                    Ancora nessuna risposta video
                  </Text>
                ) : (
                  videoReplies.map((r) => {
                    const selected = selectedReplyId === r.id;
                    return (
                      <Pressable
                        key={r.id}
                        onPress={() => setSelectedReplyId(r.id)}
                        style={[
                          styles.replyCircle,
                          selected && styles.replyCircleSelected,
                        ]}
                      >
                        <Video
                          source={{ uri: r.uri }}
                          style={styles.replyCircleVideo}
                          resizeMode={ResizeMode.COVER}
                          isMuted
                          shouldPlay={false}
                        />
                        <View style={styles.replyPlayOverlay}>
                          <Ionicons name="play" size={16} color="#fff" />
                        </View>
                      </Pressable>
                    );
                  })
                )}
              </ScrollView>

              {/* SELECTED REPLY PLAYER */}
              {selectedReply && (
                <View style={{ marginTop: 12 }}>
                  <Video
                    ref={replyPlayerRef}
                    key={selectedReply.id}
                    source={{ uri: selectedReply.uri }}
                    style={styles.replyPlayer}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay
                  />
                  {!!selectedReply.title && (
                    <Text
                      style={styles.replyPlayerTitle}
                      numberOfLines={2}
                    >
                      {selectedReply.title}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
