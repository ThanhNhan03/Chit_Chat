import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_EXPIRY_TIME = 1000 * 60 * 60; // 1 giờ

export const getChatCacheKey = (chatId: string, userId: string) => `private_chat_messages_${chatId}_${userId}`;
export const getGroupChatCacheKey = (chatId: string, userId: string) => `group_chat_messages_${chatId}_${userId}`;
export const getMessageReactionsCacheKey = (messageId: string) => 
    `message_reactions_${messageId}`;

export const clearUserChatCache = async (userId: string) => {
    try {
        // Lấy tất cả keys trong AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        
        // Lọc ra các keys liên quan đến chat của user hiện tại
        const chatKeys = keys.filter(key => 
            key.includes(`private_chat_messages_${userId}`) || 
            key.includes(`group_chat_messages_${userId}`)
        );
        
        // Xóa tất cả cache của user
        if (chatKeys.length > 0) {
            await AsyncStorage.multiRemove(chatKeys);
        }
    } catch (error) {
        console.error('Error clearing user chat cache:', error);
    }
}; 

export const cacheMessageReactions = async (messageId: string, reactions: any[]) => {
    try {
        const key = getMessageReactionsCacheKey(messageId);
        await AsyncStorage.setItem(key, JSON.stringify({
            reactions,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error caching message reactions:', error);
    }
};

export const getCachedMessageReactions = async (messageId: string) => {
    try {
        const key = getMessageReactionsCacheKey(messageId);
        const data = await AsyncStorage.getItem(key);
        if (!data) return null;

        const cached = JSON.parse(data);
        if (Date.now() - cached.timestamp > CACHE_EXPIRY_TIME) {
            await AsyncStorage.removeItem(key);
            return null;
        }
        return cached.reactions;
    } catch (error) {
        console.error('Error getting cached reactions:', error);
        return null;
    }
};