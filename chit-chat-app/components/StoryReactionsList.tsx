import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { StoryReaction } from '../src/API';

interface StoryReactionsListProps {
  reactions: StoryReaction[];
}

const StoryReactionsList = ({ reactions }: StoryReactionsListProps) => {
  const renderItem = ({ item }: { item: StoryReaction }) => (
    <View style={styles.reactionItem}>
      <Image 
        source={{ uri: item.user?.profile_picture || undefined }} 
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user?.name}</Text>
        <View style={styles.reactionInfo}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.created_at || '').toLocaleTimeString()}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reactions}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reactionItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  reactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default StoryReactionsList;