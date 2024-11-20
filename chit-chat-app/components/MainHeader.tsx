import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { themeColors } from '../config/themeColor';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width, height } = Dimensions.get('window');


type RootStackParamList = {
    Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface MainHeaderProps {
    title: string;
}

const MainHeader: React.FC<MainHeaderProps> = ({ title }) => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <TouchableOpacity 
                onPress={() => navigation.navigate('Settings')}
                style={styles.settingsButton}
            >
                <Ionicons 
                    name="person-circle-outline" 
                    size={24} 
                    color={themeColors.text} 
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: themeColors.surface,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.02,
        marginTop: height * 0.02,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: width * 0.06,
        fontWeight: '600',
        color: themeColors.text,
    },
    settingsButton: {
        padding: 8,
    }
});

export default MainHeader;
