import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MessageItemProps {
    message: {
        id: string;
        text?: string;
        image?: string;
        timestamp: string;
        type: 'text' | 'image';
        isMe: boolean;
        senderName?: string;
        isUploading?: boolean;
    };
    onImagePress: (uri: string) => void;
    showSender?: boolean;
    isFirstInGroup?: boolean;
    isLastInGroup?: boolean;
}

const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    return '';
};

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    onImagePress,
    showSender,
    isFirstInGroup,
    isLastInGroup
}) => {
    return (
        <View>
            {showSender && !message.isMe && message.senderName && (
                <Text style={styles.senderName}>{message.senderName}</Text>
            )}

            <View style={[
                styles.messageContainer,
                message.isMe ? styles.myMessage : styles.theirMessage,
                isFirstInGroup && (message.isMe ? styles.firstMyMessage : styles.firstTheirMessage),
                isLastInGroup && (message.isMe ? styles.lastMyMessage : styles.lastTheirMessage),
                !isFirstInGroup && { marginTop: 2 },
                !isLastInGroup && { marginBottom: 2 }
            ]}>
                {message.type === 'text' ? (
                    <Text style={[
                        styles.messageText,
                        message.isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>
                        {message.text}
                    </Text>
                ) : (
                    <View style={styles.imageWrapper}>
                        <TouchableOpacity 
                            onPress={() => !message.isUploading && onImagePress(message.image!)}
                            disabled={message.isUploading}
                        >
                            <Image
                                source={{ uri: message.image }}
                                style={[
                                    styles.messageImage,
                                    message.isUploading && styles.uploadingImage
                                ]}
                                resizeMode="cover"
                            />
                            {message.isUploading && (
                                <View style={styles.uploadingOverlay}>
                                   <ActivityIndicator size="small" color="#4CAF50" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
                <Text style={[
                    styles.timestamp,
                    message.isMe ? styles.myTimestamp : styles.otherTimestamp
                ]}>
                    {formatMessageTime(message.timestamp)}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        marginLeft: 12,
        fontWeight: '500'
    },
    messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 15,
        elevation: 2,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        marginLeft: '20%',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        marginRight: '20%',
        borderColor: '#e0e0e0',
        borderWidth: 1,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#000000',
    },
    theirMessageText: {
        color: '#000000',
    },
    // messageImage: {
    //     width: 200,
    //     height: 200,
    //     borderRadius: 8,
    // },
    timestamp: {
        fontSize: 12,
        color: '#666666',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    myTimestamp: {
        color: '#666666',
    },
    otherTimestamp: {
        color: '#666666',
    },
    firstMyMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 15,
    },
    lastMyMessage: {
        borderTopRightRadius: 5,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    firstTheirMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 5,
    },
    lastTheirMessage: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    
    imageWrapper: {
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
    },
    messageImage: {
        width: screenWidth * 0.6,
        height: screenWidth * 0.6,
        borderRadius: 8,
    },
    uploadingImage: {
        opacity: 0.7,
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-end',
    },
    loadingBar: {
        height: 3,
        backgroundColor: '#4CAF50', // hoặc màu bạn muốn
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});

export default MessageItem;
