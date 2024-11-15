import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal } from 'react-native';

interface Reaction {
  id: string;
  user_id: string;
  icon: string;
  userName?: string;
  message_id: string;
}

interface MessageReactionsProps {
  reactions: Reaction[];
  onPressReaction: (reaction: Reaction) => void;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions, onPressReaction }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Nhóm reactions theo icon
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.icon]) {
      acc[reaction.icon] = [];
    }
    acc[reaction.icon].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  // Lấy icon đầu tiên để hiển thị
  const firstIcon = Object.keys(groupedReactions)[0];

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.reactionSummary}
      >
        <Text>{firstIcon} {reactions.length}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {Object.entries(groupedReactions).map(([icon, reactionGroup]) => (
              <View key={icon} style={styles.reactionGroup}>
                <Text style={styles.reactionIcon}>{icon}</Text>
                <Text style={styles.reactionCount}>{reactionGroup.length}</Text>
                <View style={styles.userList}>
                  {reactionGroup.map(reaction => (
                    <Text key={reaction.id} style={styles.userName}>
                      {reaction.userName || 'Unknown user'}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    position: 'absolute',
    bottom: -20,
    left: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  reaction: {
    fontSize: 14,
  },
  count: {
    fontSize: 12,
    marginLeft: 2,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxWidth: '80%',
  },
  reactionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  userList: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    color: '#333',
  },
  reactionSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
});

export default MessageReactions;