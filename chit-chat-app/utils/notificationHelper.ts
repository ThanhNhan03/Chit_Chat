import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});

export const requestNotificationPermissions = async () => {
    if (Platform.OS === 'android') {
        // Kiểm tra version Android
        const androidVersion = Device.platformApiLevel || 0;
        
        if (androidVersion >= 33) { // Android 13 trở lên
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync({
                    android: {
                        allowAlert: true,
                        allowBadge: true,
                        allowSound: true,
                    }
                });
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') {
                // console.log('Failed to get push token for push notification!');
                return false;
            }
            return true;
        }
    }
    
    return true; 
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

        // Thêm channel mới cho stories
        await Notifications.setNotificationChannelAsync('stories', {
            name: 'Stories',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'notification-sound.wav',
            enableVibrate: true,
            enableLights: true,
        });
    }
};

export const getExpoPushToken = async () => {
    try {
        const { status } = await Notifications.getPermissionsAsync();
        // console.log('Current permission status:', status);

        if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            // console.log('New permission status:', newStatus);
            if (newStatus !== 'granted') return null;
        }

        // console.log('Getting push token...');
        const token = await Notifications.getExpoPushTokenAsync({
            projectId: "0b168073-1ccb-4f36-aced-64caa2a241e7"
        });
        // console.log('Generated token:', token.data);
        return token.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
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

export const sendPushNotifications = async ({
    expoPushTokens,
    title,
    body,
    data = {}
}: {
    expoPushTokens: string[];
    title: string;
    body: string;
    data?: any;
}) => {
    try {
        const messages = expoPushTokens.map(pushToken => ({
            to: pushToken,
            sound: 'default',
            title,
            body,
            data: {
                ...data,
                channelId: 'stories' 
            },
            priority: 'high',
        }));

        const chunks = [];
        const chunkSize = 100;
        for (let i = 0; i < messages.length; i += chunkSize) {
            chunks.push(messages.slice(i, i + chunkSize));
        }


        const responses = await Promise.all(
            chunks.map(chunk =>
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(chunk),
                })
            )
        );

        const results = await Promise.all(responses.map(r => r.json()));
        return results;
    } catch (error) {
        console.error('Error sending push notifications:', error);
        throw error;
    }
};

export const sendNewStoryNotification = async ({
    expoPushTokens,
    userName,
    storyId,
    userId,
}: {
    expoPushTokens: string[];
    userName: string;
    storyId: string;
    userId: string;
}) => {
    if (!expoPushTokens || expoPushTokens.length === 0) {
        console.log('No friend tokens to send notifications to.');
        return;
    }

    return sendPushNotifications({
        expoPushTokens,
        title: 'New Story',
        body: `${userName} just shared a new story`,
        data: {
            type: 'new_story',
            storyId,
            userId,
            channelId: 'stories'
        }
    });
};

export const sendChatNotification = async ({
    expoPushToken,
    senderName,
    message,
    chatId,
    senderId,
}: {
    expoPushToken: string;
    senderName: string;
    message: string;
    chatId: string;
    senderId: string;
}) => {
    if (!expoPushToken) {
        console.log('No push token to send notification to.');
        return;
    }

    return sendPushNotifications({
        expoPushTokens: [expoPushToken],
        title: senderName,
        body: message.length > 50 ? message.substring(0, 47) + '...' : message,
        data: {
            type: 'new_message',
            chatId,
            senderId,
            channelId: 'messages'
        }
    });
};

export const sendGroupChatNotification = async ({
    expoPushTokens,
    senderName,
    message,
    chatId,
    senderId,
    groupName
}: {
    expoPushTokens: string[];
    senderName: string;
    message: string;
    chatId: string;
    senderId: string;
    groupName: string;
}) => {
    if (!expoPushTokens || expoPushTokens.length === 0) {
        console.log('No tokens to send notifications to.');
        return;
    }

    return sendPushNotifications({
        expoPushTokens,
        title: `${groupName} - ${senderName}`,
        body: message.length > 50 ? message.substring(0, 47) + '...' : message,
        data: {
            type: 'new_group_message',
            chatId,
            senderId,
            groupName,
            channelId: 'messages'
        }
    });
};
