import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { themeColors } from '../config/themeColor';

interface MusicTrimmerProps {
    duration: number;
    startTime: number;
    endTime: number;
    onTimeChange: (start: number, end: number) => void;
    maxDuration?: number; // Maximum allowed duration (e.g., 15 seconds for story)
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicTrimmer = ({ 
    duration, 
    startTime, 
    endTime, 
    onTimeChange,
    maxDuration = 15 
}: MusicTrimmerProps) => {
    const [localStartTime, setLocalStartTime] = useState(startTime);
    const [localEndTime, setLocalEndTime] = useState(endTime);

    // Debug props
    useEffect(() => {
        console.log('MusicTrimmer props:', {
            duration,
            startTime,
            endTime,
            maxDuration
        });
    }, [duration, startTime, endTime, maxDuration]);

    const handleStartTimeChange = (value: number) => {
        console.log('Start time changed:', value);
        const newStartTime = Math.min(value, localEndTime - 1);
        setLocalStartTime(newStartTime);
        onTimeChange(newStartTime, localEndTime);
    };

    const handleEndTimeChange = (value: number) => {
        console.log('End time changed:', value);
        const newEndTime = Math.max(value, localStartTime + 1);
        setLocalEndTime(newEndTime);
        onTimeChange(localStartTime, newEndTime);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.timeText}>
                {formatTime(localStartTime)} - {formatTime(localEndTime)}
            </Text>
            <View style={styles.sliderContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={localStartTime}
                    onValueChange={handleStartTimeChange}
                    minimumTrackTintColor={themeColors.primary}
                    maximumTrackTintColor="#fff"
                />
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={localEndTime}
                    onValueChange={handleEndTimeChange}
                    minimumTrackTintColor={themeColors.primary}
                    maximumTrackTintColor="#fff"
                />
            </View>
            <Text style={styles.durationText}>
                Duration: {formatTime(localEndTime - localStartTime)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 12,
        marginTop: 10,
    },
    timeText: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    sliderContainer: {
        marginVertical: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    durationText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 5,
        fontSize: 12,
    },
});

export default MusicTrimmer; 