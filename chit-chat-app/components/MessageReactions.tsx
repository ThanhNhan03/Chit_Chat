import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, Animated } from 'react-native';

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
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const closeTooltip = () => {
    fadeOut();
    setTimeout(() => setHoveredIcon(null), 150);
  };

  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.icon]) {
      acc[reaction.icon] = [];
    }
    acc[reaction.icon].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  return (
    <>
      {hoveredIcon && (
        <Pressable 
          style={styles.overlay} 
          onPress={closeTooltip}
        />
      )}
      
      <View style={styles.reactionsContainer}>
        {Object.entries(groupedReactions).map(([icon, reactionGroup]) => (
          <View key={icon} style={styles.reactionGroupWrapper}>
            <TouchableOpacity
              onPress={() => {
                if (hoveredIcon === icon) {
                  closeTooltip();
                } else {
                  setHoveredIcon(icon);
                  fadeIn();
                }
              }}
              style={styles.reactionGroup}
            >
              <Text style={styles.reaction}>
                {icon} {reactionGroup.length}
              </Text>
            </TouchableOpacity>
            
            {hoveredIcon === icon && (
              <Animated.View 
                style={[
                  styles.hoverCard,
                  { opacity: fadeAnim }
                ]}
              >
                <View style={styles.tooltipArrow} />
                <View style={styles.userListContainer}>
                  {reactionGroup.map(reaction => (
                    <Text key={reaction.id} style={styles.tooltipUserName}>
                      {reaction.userName || 'Unknown user'}
                    </Text>
                  ))}
                </View>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
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
  reactionGroupWrapper: {
    position: 'relative',
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
  hoverCard: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: 150,
    zIndex: 1000,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.8)',
  },
  userListContainer: {
    padding: 4,
  },
  tooltipUserName: {
    fontSize: 14,
    color: 'white',
    paddingVertical: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

export default MessageReactions;