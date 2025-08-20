import React, { useContext, useMemo } from 'react';
import { View, FlatList, Text } from 'react-native';
import { styles } from './FeedScreen.styles';
import { DataContext, FeedItem } from '../../../App';
import VideoCard from '../../components/VideoCard';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';
import ScreenContainer from '../../components/layout/ScreenContainer';

export default function FeedScreen() {
  const { feed, currentUser } = useContext(DataContext);

  // Solo post degli amici (come prima)
  const feedFriends = useMemo<FeedItem[]>(
    () => feed.filter(f => f.user.username !== currentUser),
    [feed, currentUser]
  );

  return (
    // ⬇️ Wrapper che gestisce safe-area e tastiera (anche se qui non serve la tastiera)
    <ScreenContainer withScroll={false} headerHeight={10}>
      {/* Header coerente con le altre schermate */}
      <View style={styles.header}>
        <Text style={[typography.title, styles.headerTitle]}>Feed</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista: lasciamo scorrere la FlatList (no ScrollView) */}
      <FlatList
        data={feedFriends}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <VideoCard item={item} />}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        // migliora comportamento con notch/statusbar
        contentInsetAdjustmentBehavior="automatic"
        // spazio per eventuale bottom bar (se presente in altre viste)
        scrollIndicatorInsets={{ bottom: 16 }}
      />
    </ScreenContainer>
  );
}