import React, { useContext, useMemo } from 'react';
import { View, FlatList, Text } from 'react-native';
import { styles } from './FeedScreen.styles';
import { DataContext, FeedItem } from '../../../App';
import VideoCard from '../../components/VideoCard';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const { feed, currentUser } = useContext(DataContext);
  const feedFriends = useMemo<FeedItem[]>(
    () => feed.filter(f => f.user.username !== currentUser),
    [feed, currentUser]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[typography.title, { color: colors.text, margin: spacing.lg }]}>Feed</Text>
      <FlatList
        data={feedFriends}
        renderItem={({ item }) => <VideoCard item={item} />}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}
