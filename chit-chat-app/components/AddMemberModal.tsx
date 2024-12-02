import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface Member {
    id: string;
    name: string;
    profile_picture?: string;
}

interface AddMemberModalProps {
    visible: boolean;
    contacts: Member[];
    onClose: () => void;
    onAddMember: (userId: string) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
    visible,
    contacts,
    onClose,
    onAddMember
}) => {
    const { theme } = useTheme();

    const renderContactItem = ({ item }: { item: Member }) => (
        <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => onAddMember(item.id)}
        >
            {item.profile_picture ? (
                <Image 
                    source={{ uri: item.profile_picture }} 
                    style={styles.contactAvatar} 
                />
            ) : (
                <View style={styles.contactAvatarPlaceholder}>
                    <Text style={styles.avatarText}>
                        {item.name[0].toUpperCase()}
                    </Text>
                </View>
            )}
            <Text style={[styles.contactName, { color: theme.textColor }]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                            Add Members
                        </Text>
                        <TouchableOpacity 
                            style={styles.closeIcon}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color={theme.textColor} />
                        </TouchableOpacity>
                    </View>

                    {contacts.length > 0 ? (
                        <FlatList
                            data={contacts}
                            renderItem={renderContactItem}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.contactsList}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.textColor }]}>
                                No contacts available to add
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingTop: 32,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeIcon: {
        padding: 4,
    },
    contactsList: {
        paddingBottom: 20,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
    },
    contactAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    contactAvatarPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(162, 155, 254, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#a29bfe',
    },
    contactName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
});

export default AddMemberModal; 