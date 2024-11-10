// src/screens/HelpScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const HelpScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.optionContainer}>
        <View style={styles.iconContainer}>
          {<Ionicons name="people" size={24} color="#1386d8" />}
        </View>
        <View style={styles.iconContainer}>
        <Text style={styles.optionText}>Contact us</Text>
        <Text style={styles.optionSubText}>Questions? Need help?</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionContainer}>
        <View style={styles.iconContainer}>
          {<Ionicons name="information-circle" size={24} color="#b01f63" />}
        </View>
        <Text style={styles.optionText}>App info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    marginRight: 16,
    // Add styles for the icon container
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionSubText: {
    fontSize: 14,
    color: '#666',
  },
});

export default HelpScreen;
