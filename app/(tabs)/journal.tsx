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
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
    Notebook,
    PlusCircle,
    Trash2,
    Search,
    X,
    Smile,
    Frown,
    Meh,
    Laugh,
    Angry,
    Heart,
    ChevronDown,
    Filter,
    Calendar
} from 'lucide-react-native';

interface JournalEntry {
    id: string;
    pathTag: string;
    day: number;
    content: string;
    mood?: string;
    timestamp: number;
}

const MOOD_OPTIONS = [
    { id: 'angry', label: 'Angry', icon: Angry, color: '#DC2626' },
    { id: 'sad', label: 'Sad', icon: Frown, color: '#2563EB' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: '#CA8A04' },
    { id: 'happy', label: 'Happy', icon: Smile, color: '#16A34A' },
    { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
    { id: 'loved', label: 'Loved', icon: Heart, color: '#DB2777' },
];

const GUIDED_PROMPTS = {
    'personal': [
        "What are you grateful for today?",
        "What challenged you today and how did you overcome it?",
        "What did you learn about yourself today?",
        "What would make tomorrow even better?",
    ],
    'career': [
        "What professional accomplishment are you proud of today?",
        "What skill did you develop or practice today?",
        "How did you contribute to your team or goals today?",
        "What career insight did you gain today?",
    ],
    'wellness': [
        "How did you nurture your physical health today?",
        "What did you do for your mental wellbeing today?",
        "How did you practice self-care today?",
        "What healthy habit did you reinforce today?",
    ],
    'relationships': [
        "How did you connect with someone important today?",
        "What act of kindness did you give or receive today?",
        "How did you strengthen a relationship today?",
        "What communication skill did you practice today?",
    ]
};

export default function EnhancedJournalScreen() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [newEntryContent, setNewEntryContent] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
    const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
    const [selectedPath, setSelectedPath] = useState('personal');
    const [showWriteMode, setShowWriteMode] = useState(false);
    const [showPrompts, setShowPrompts] = useState(false);
    const [filterMood, setFilterMood] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

    // Load entries from AsyncStorage
    useFocusEffect(
        useCallback(() => {
            loadEntries();
        }, [])
    );

    const loadEntries = async () => {
        try {
            const raw = await AsyncStorage.getItem('journalEntries');
            if (raw) {
                const parsedEntries = JSON.parse(raw);
                // Ensure all entries have the correct structure
                const validatedEntries = parsedEntries.map((entry: any) => ({
                    ...entry,
                    // Handle old entries that might have 'date' instead of 'pathTag'
                    pathTag: entry.pathTag || 'general',
                    // Ensure day is a number
                    day: typeof entry.day === 'number' ? entry.day : 0,
                    // Add timestamp if missing
                    timestamp: entry.timestamp || Date.now()
                }));
                setEntries(validatedEntries);
            }
        } catch (e) {
            console.error('loadEntries error', e);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchQuery, entries, filterMood]);

    useEffect(() => {
        updatePrompts(selectedPath);
    }, [selectedPath]);

    const applyFilters = () => {
        let filtered = [...entries];

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.content.toLowerCase().includes(query) ||
                entry.pathTag.toLowerCase().includes(query) ||
                (entry.mood && entry.mood.toLowerCase().includes(query))
            );
        }

        if (filterMood) {
            filtered = filtered.filter(entry => entry.mood === filterMood);
        }

        setFilteredEntries(filtered);
    };

    const updatePrompts = (path: string) => {
        const prompts = GUIDED_PROMPTS[path as keyof typeof GUIDED_PROMPTS] || GUIDED_PROMPTS.personal;
        setCurrentPrompts(prompts);
    };

    const addEntry = async () => {
        const trimmed = newEntryContent.trim();
        if (!trimmed) {
            Alert.alert('Empty Entry', 'Please write something before adding.');
            return;
        }

        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            pathTag: selectedPath,
            day: 0, // For manual entries, day is 0
            content: trimmed,
            mood: selectedMood,
            timestamp: Date.now(),
        };

        try {
            // Update local state
            const updatedEntries = [newEntry, ...entries];
            setEntries(updatedEntries);

            // Save to AsyncStorage
            await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

            // Reset form
            setNewEntryContent('');
            setSelectedMood(null);
            setShowWriteMode(false);
            setShowPrompts(false);

            Alert.alert('Success', 'Journal entry added!');
        } catch (error) {
            console.error('Error saving journal entry:', error);
            Alert.alert('Error', 'Failed to save journal entry.');
        }
    };

    const usePrompt = (prompt: string) => {
        setNewEntryContent(prev => prev ? `${prev}\n\n${prompt}` : prompt);
    };

    const deleteEntry = (id: string) => {
        setEntryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;

        try {
            const filtered = entries.filter((e) => e.id !== entryToDelete);
            setEntries(filtered);

            // Update AsyncStorage
            await AsyncStorage.setItem('journalEntries', JSON.stringify(filtered));

            setShowDeleteModal(false);
            setEntryToDelete(null);
        } catch (error) {
            console.error('Error deleting entry:', error);
            Alert.alert('Error', 'Failed to delete journal entry.');
            setShowDeleteModal(false);
            setEntryToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setEntryToDelete(null);
    };

    // New function to handle delete all
    const deleteAllEntries = () => {
        if (entries.length === 0) {
            Alert.alert('No Entries', 'There are no entries to delete.');
            return;
        }
        setShowDeleteAllModal(true);
    };

    const confirmDeleteAll = async () => {
        try {
            setEntries([]);
            await AsyncStorage.removeItem('journalEntries');
            setShowDeleteAllModal(false);
            Alert.alert('Success', 'All journal entries have been deleted.');
        } catch (error) {
            console.error('Error deleting all entries:', error);
            Alert.alert('Error', 'Failed to delete all journal entries.');
            setShowDeleteAllModal(false);
        }
    };

    const cancelDeleteAll = () => {
        setShowDeleteAllModal(false);
    };

    const getMoodIcon = (moodId: string) => {
        const mood = MOOD_OPTIONS.find(m => m.id === moodId);
        return mood ? mood.icon : Meh;
    };

    const getMoodColor = (moodId: string) => {
        const mood = MOOD_OPTIONS.find(m => m.id === moodId);
        return mood ? mood.color : '#928490';
    };

    const formatPathTag = (pathTag: string): string => {
        if (!pathTag) return 'General';

        return pathTag
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const renderEntryTag = (entry: JournalEntry) => {
        const formattedPath = formatPathTag(entry.pathTag);

        if (entry.day > 0) {
            return `${formattedPath} • Day ${entry.day}`;
        } else {
            return formattedPath;
        }
    };

    if (showWriteMode) {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Write Mode Header */}
                <View style={[styles.header, { backgroundColor: '#647C90' }]}>
                    <TouchableOpacity onPress={() => setShowWriteMode(false)}>
                        <X size={24} color="#E2DED0" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Entry</Text>
                    <TouchableOpacity onPress={addEntry}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.writeContent} showsVerticalScrollIndicator={false}>
                    {/* Path Selection */}
                    <View style={styles.writeSection}>
                        <Text style={styles.writeSectionLabel}>Path</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {Object.keys(GUIDED_PROMPTS).map((path) => (
                                <TouchableOpacity
                                    key={path}
                                    style={[
                                        styles.writePathButton,
                                        selectedPath === path && styles.writePathButtonActive
                                    ]}
                                    onPress={() => {
                                        setSelectedPath(path);
                                        updatePrompts(path);
                                    }}
                                >
                                    <Text style={[
                                        styles.writePathText,
                                        selectedPath === path && styles.writePathTextActive
                                    ]}>
                                        {formatPathTag(path)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Mood Selection */}
                    <View style={styles.writeSection}>
                        <Text style={styles.writeSectionLabel}>How are you feeling?</Text>
                        <View style={styles.writeMoodContainer}>
                            {MOOD_OPTIONS.map((mood) => {
                                const IconComponent = mood.icon;
                                return (
                                    <TouchableOpacity
                                        key={mood.id}
                                        style={[
                                            styles.writeMoodButton,
                                            selectedMood === mood.id && {
                                                backgroundColor: mood.color,
                                            }
                                        ]}
                                        onPress={() => setSelectedMood(
                                            selectedMood === mood.id ? null : mood.id
                                        )}
                                    >
                                        <IconComponent
                                            size={24}
                                            color={selectedMood === mood.id ? '#E2DED0' : mood.color}
                                        />
                                        <Text style={[
                                            styles.writeMoodLabel,
                                            selectedMood === mood.id && { color: '#E2DED0' }
                                        ]}>
                                            {mood.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Prompts Toggle */}
                    <TouchableOpacity
                        style={styles.promptsToggle}
                        onPress={() => setShowPrompts(!showPrompts)}
                    >
                        <Text style={styles.promptsToggleText}>
                            {showPrompts ? 'Hide' : 'Show'} Writing Prompts
                        </Text>
                        <ChevronDown
                            size={20}
                            color="#647C90"
                            style={{ transform: [{ rotate: showPrompts ? '180deg' : '0deg' }] }}
                        />
                    </TouchableOpacity>

                    {/* Prompts List */}
                    {showPrompts && (
                        <View style={styles.promptsList}>
                            {currentPrompts.map((prompt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.writePromptButton}
                                    onPress={() => usePrompt(prompt)}
                                >
                                    <Text style={styles.writePromptText}>{prompt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Text Input */}
                    <View style={styles.writeInputContainer}>
                        <TextInput
                            style={styles.writeTextInput}
                            placeholder="Start writing your thoughts..."
                            placeholderTextColor="#928490"
                            multiline
                            value={newEntryContent}
                            onChangeText={setNewEntryContent}
                            autoFocus
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: '#647C90' }]}>
                <Text style={styles.headerTitle}>Journal</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setShowSearch(!showSearch)}
                    >
                        <Search size={22} color="#E2DED0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={22} color="#E2DED0" />
                    </TouchableOpacity>
                    {entries.length > 0 && (
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={deleteAllEntries}
                        >
                            <Trash2 size={22} color="#E2DED0" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Search Bar */}
            {showSearch && (
                <View style={styles.searchContainer}>
                    <Search size={20} color="#928490" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search entries..."
                        placeholderTextColor="#928490"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={20} color="#928490" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Filters */}
            {showFilters && (
                <View style={styles.filtersContainer}>
                    <Text style={styles.filterLabel}>Filter by mood:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                !filterMood && styles.filterChipActive
                            ]}
                            onPress={() => setFilterMood(null)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                !filterMood && styles.filterChipTextActive
                            ]}>All</Text>
                        </TouchableOpacity>
                        {MOOD_OPTIONS.map((mood) => {
                            const IconComponent = mood.icon;
                            return (
                                <TouchableOpacity
                                    key={mood.id}
                                    style={[
                                        styles.filterChip,
                                        filterMood === mood.id && { backgroundColor: mood.color }
                                    ]}
                                    onPress={() => setFilterMood(filterMood === mood.id ? null : mood.id)}
                                >
                                    <IconComponent
                                        size={16}
                                        color={filterMood === mood.id ? '#E2DED0' : mood.color}
                                    />
                                    <Text style={[
                                        styles.filterChipText,
                                        filterMood === mood.id && { color: '#E2DED0' }
                                    ]}>{mood.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* Entries List */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredEntries.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Notebook size={64} color="#928490" />
                        <Text style={styles.emptyStateTitle}>
                            {searchQuery || filterMood ? 'No matches found' : 'Start Your Journey'}
                        </Text>
                        <Text style={styles.emptyStateText}>
                            {searchQuery || filterMood
                                ? 'Try adjusting your filters'
                                : 'Tap the + button to create your first entry'}
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.entriesCount}>
                            {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
                        </Text>
                        {filteredEntries.map((item) => {
                            const MoodIcon = item.mood ? getMoodIcon(item.mood) : null;
                            const moodColor = item.mood ? getMoodColor(item.mood) : '#928490';

                            return (
                                <View key={item.id} style={styles.entryCard}>
                                    <View style={styles.entryHeader}>
                                        <View style={styles.entryMeta}>
                                            <Text style={styles.entryPath}>{renderEntryTag(item)}</Text>
                                        </View>
                                        <TouchableOpacity
                                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                                            onPress={() => deleteEntry(item.id)}
                                        >
                                            <Trash2 size={18} color="#928490" />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.entryContent} numberOfLines={3}>
                                        {item.content}
                                    </Text>

                                    {MoodIcon && (
                                        <View style={styles.entryFooter}>
                                            <View style={[styles.entryMoodBadge, { backgroundColor: moodColor }]}>
                                                <MoodIcon size={12} color="#E2DED0" />
                                                <Text style={styles.entryMoodText}>
                                                    {MOOD_OPTIONS.find(m => m.id === item.mood)?.label}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowWriteMode(true)}
            >
                <PlusCircle size={28} color="#E2DED0" />
            </TouchableOpacity>

            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Delete Entry?</Text>
                        <Text style={styles.modalMessage}>
                            This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={cancelDelete}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalDeleteButton}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.modalDeleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete All Confirmation Modal */}
            <Modal
                visible={showDeleteAllModal}
                transparent={true}
                animationType="fade"
                onRequestClose={cancelDeleteAll}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Delete All Entries?</Text>
                        <Text style={styles.modalMessage}>
                            This will permanently delete all {entries.length} journal entries. This action cannot be undone.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={cancelDeleteAll}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalDeleteButton, { backgroundColor: '#647C90' }]}
                                onPress={confirmDeleteAll}
                            >
                                <Text style={styles.modalDeleteText}>Delete All</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0'
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 28,
        color: '#E2DED0',
        fontWeight: '700',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    headerButton: {
        padding: 4,
    },
    saveText: {
        fontSize: 16,
        color: '#E2DED0',
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#4E4F50',
        marginLeft: 12,
        marginRight: 8,
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginTop: 12,
        borderRadius: 12,
    },
    filterLabel: {
        fontSize: 14,
        color: '#647C90',
        fontWeight: '600',
        marginBottom: 12,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E2DED0',
        marginRight: 8,
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#647C90',
    },
    filterChipText: {
        fontSize: 14,
        color: '#647C90',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#E2DED0',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    entriesCount: {
        fontSize: 16,
        color: '#647C90',
        fontWeight: '600',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    entryCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    entryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    entryPath: {
        fontSize: 13,
        color: '#647C90',
        fontWeight: '600',
    },
    entryContent: {
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 22,
        marginBottom: 12,
    },
    entryFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    entryMoodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    entryMoodText: {
        fontSize: 12,
        color: '#E2DED0',
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 20,
        color: '#647C90',
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 22,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#647C90',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    // Write Mode Styles
    writeContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    writeSection: {
        marginBottom: 24,
    },
    writeSectionLabel: {
        fontSize: 16,
        color: '#647C90',
        fontWeight: '600',
        marginBottom: 12,
    },
    writePathButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    writePathButtonActive: {
        backgroundColor: '#647C90',
    },
    writePathText: {
        fontSize: 14,
        color: '#647C90',
        fontWeight: '600',
    },
    writePathTextActive: {
        color: '#E2DED0',
    },
    writeMoodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    writeMoodButton: {
        flex: 1,
        minWidth: '30%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    writeMoodLabel: {
        fontSize: 12,
        color: '#4E4F50',
        fontWeight: '500',
    },
    promptsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    promptsToggleText: {
        fontSize: 15,
        color: '#647C90',
        fontWeight: '600',
    },
    promptsList: {
        gap: 12,
        marginBottom: 24,
    },
    writePromptButton: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#647C90',
    },
    writePromptText: {
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
    },
    writeInputContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 16,
        minHeight: 200,
        marginBottom: 30,
    },
    writeTextInput: {
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        minHeight: 150,
        textAlignVertical: 'top',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        color: '#647C90',
        fontWeight: '700',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 15,
        color: '#928490',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#E2DED0',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: 16,
        color: '#647C90',
        fontWeight: '600',
    },
    modalDeleteButton: {
        flex: 1,
        backgroundColor: '#647C90',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    modalDeleteText: {
        fontSize: 16,
        color: '#E2DED0',
        fontWeight: '600',
    },
});