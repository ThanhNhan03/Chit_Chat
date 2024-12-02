import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

const { height } = Dimensions.get('window');

interface ViewsCounterProps {
    count: number;
    onPress: () => void;
}

const ViewsCounter: React.FC<ViewsCounterProps> = ({ count, onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={onPress}
        >
            <Icon name="eye-outline" size={20} color="#fff" />
            <Text style={styles.text}>{count}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 150,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 20,
        zIndex: 1,
    },
    text: {
        color: '#fff',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ViewsCounter; 