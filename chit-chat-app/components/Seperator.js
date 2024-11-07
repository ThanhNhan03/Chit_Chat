import React from 'react';
import { View, StyleSheet } from 'react-native';

const Seperator = ({ style = {} }) => {
    return <View style={[styles.separator, style]} />;
};

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0', 
        marginHorizontal: 16,
    },
});

export default Seperator;