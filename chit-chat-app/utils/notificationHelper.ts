import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    
    return finalStatus === 'granted';
};

export const initializeNotifications = async () => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('messages', {
            name: 'Messages',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'notification-sound.wav', 
            enableVibrate: true,
            enableLights: true,
        });

        // Channel cho friend requests
        await Notifications.setNotificationChannelAsync('friend-requests', {
            name: 'Friend Requests',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'notification-sound.wav',
            enableVibrate: true,
            enableLights: true,
        });
    }
};

export const sendNotification = async ({
    title,
    body,
    data = {},
    channelId = 'messages'
}) => {
    try {
        if (Platform.OS === 'ios') {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    // sound: 'notification-sound.wav', 
                    badge: 1,
                },
                trigger: null,
            });
        } else {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data,
                    // sound: 'notification-sound.wav', 
                    badge: 1,
                    priority: 'high',
                    vibrate: [0, 250, 250, 250],
                },
                trigger: null,
                identifier: channelId,
            });
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
