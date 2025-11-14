import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    FlatList,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Notebook, PlusCircle, Trash2 } from 'lucide-react-native';

interface JournalEntry {
    id: string;
    date: string;
    content: string;
}

export default function JournalScreen() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntryContent, setNewEntryContent] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [])
    );

    useEffect(() => {
        saveEntries(entries);
    }, [entries]);

    const loadEntries = async () => {
        try {
            const raw = await AsyncStorage.getItem('journalEntries');
            if (raw) setEntries(JSON.parse(raw));
        } catch (e) {
            console.error('loadEntries error', e);
        }
    };

    const saveEntries = async (list: JournalEntry[]) => {
        try {
            await AsyncStorage.setItem('journalEntries', JSON.stringify(list));
        } catch (e) {
            console.error('saveEntries error', e);
        }
    };

    const addEntry = () => {
        const trimmed = newEntryContent.trim();
        if (!trimmed) {
            Alert.alert('Empty Entry', 'Please write something before adding.');
            return;
        }

        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            content: trimmed,
        };

        setEntries((prev) => [newEntry, ...prev]);
        setNewEntryContent('');
    };

    const deleteEntry = (id: string) => {
        setEntryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;

        try {
            // Filter out the entry to delete
            const filtered = entries.filter((e) => e.id !== entryToDelete);

            // Update state
            setEntries(filtered);

            // Save to AsyncStorage
            await AsyncStorage.setItem('journalEntries', JSON.stringify(filtered));

            // Close modal and reset
            setShowDeleteModal(false);
            setEntryToDelete(null);
        } catch (error) {
            console.error('Error deleting entry:', error);
            setShowDeleteModal(false);
            setEntryToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setEntryToDelete(null);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: '#647C90' }]}>
                <Text style={styles.headerTitle}>Journal</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your journal entry here..."
                        placeholderTextColor="#928490"
                        multiline
                        value={newEntryContent}
                        onChangeText={setNewEntryContent}
                    />
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: '#647C90' }]}
                        onPress={addEntry}
                    >
                        <PlusCircle size={24} color="#E2DED0" />
                        <Text style={styles.addButtonText}>Add Entry</Text>
                    </TouchableOpacity>
                </View>

                {/* List or Empty State */}
                {entries.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Notebook size={60} color="#928490" />
                        <Text style={styles.emptyStateText}>
                            No journal entries yet. Start writing!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={entries}
                        keyExtractor={(item) => item.id}
                        extraData={entries}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        renderItem={({ item }) => (
                            <View style={[styles.entryCard, { backgroundColor: '#F5F5F5' }]}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryDate}>{item.date}</Text>

                                    {/* ---- DELETE BUTTON ---- */}
                                    <TouchableOpacity
                                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                        onPress={() => deleteEntry(item.id)}
                                    >
                                        <Trash2 size={20} color="#928490" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.entryContent}>{item.content}</Text>
                            </View>
                        )}
                    />
                )}
            </View>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: '#F5F5F5' }]}>
                        <Text style={styles.modalTitle}>Delete Entry</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete this journal entry? This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: 'rgba(146, 132, 144, 0.2)' }]}
                                onPress={cancelDelete}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmButton, { backgroundColor: '#647C90' }]}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.confirmButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ============================================================= */
/* Styles                                                        */
/* ============================================================= */
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E2DED0' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    headerTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 25,
        color: '#E2DED0',
        fontWeight: '700',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 30,
    },
    inputContainer: {
        marginBottom: 30,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    textInput: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 15,
        padding: 10,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    addButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginLeft: 8,
        fontWeight: '600',
    },
    entryCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    entryDate: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#647C90',
        fontWeight: '600',
    },
    entryContent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    emptyStateText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        marginTop: 15,
        textAlign: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContainer: {
        borderRadius: 24,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },
    modalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '700',
    },
    modalMessage: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '600',
    },
    confirmButton: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        textAlign: 'center',
        fontWeight: '600',
    },
});