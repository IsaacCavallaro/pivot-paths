import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { PlusCircle } from 'lucide-react-native';
import { MOOD_OPTIONS } from '../constants';
import { useJournaling } from '../hooks/useJournaling';

interface JournalEntrySectionProps {
    pathTag?: string;
    day?: string;
    journalInstruction?: string;
    moodLabel?: string;
    saveButtonText?: string;
    category?: string;
    pathTitle?: string;
    dayTitle?: string;
    placeholder?: string;
}

export const JournalEntrySection: React.FC<JournalEntrySectionProps> = ({
    pathTag,
    day,
    journalInstruction,
    moodLabel,
    saveButtonText,
    category = 'General', // Default value
    pathTitle = '', // Default empty
    dayTitle = '', // Default empty
    placeholder = "Add your entry here", // Default placeholder
}) => {
    const {
        journalEntry,
        setJournalEntry,
        selectedMood,
        setSelectedMood,
        addJournalEntry,
    } = useJournaling(pathTag || 'default-path',
        day || 'default-day', category, pathTitle, dayTitle); // Pass new props

    const handleSave = () => {
        addJournalEntry(journalEntry, selectedMood);
    };

    // Calculate button width based on screen size and number of buttons
    const screenWidth = Dimensions.get('window').width;
    const buttonSize = (screenWidth - 80) / 4; // 80 = total horizontal padding (40*2) + gaps

    return (
        <View style={styles.journalSection}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionDivider} />
            </View>

            <Text style={styles.journalInstruction}>
                {journalInstruction}
            </Text>

            {/* Mood Selection */}
            <View style={styles.moodSection}>
                <Text style={styles.moodLabel}>{moodLabel}</Text>
                <View style={styles.moodContainer}>
                    {MOOD_OPTIONS.map((mood) => {
                        const IconComponent = mood.icon;
                        return (
                            <TouchableOpacity
                                key={mood.id}
                                style={[
                                    styles.moodButton,
                                    { width: buttonSize, height: buttonSize },
                                    selectedMood === mood.id && {
                                        backgroundColor: mood.color,
                                    }
                                ]}
                                onPress={() => setSelectedMood(
                                    selectedMood === mood.id ? null : mood.id
                                )}
                            >
                                <IconComponent
                                    size={20}
                                    color={selectedMood === mood.id ? '#E2DED0' : mood.color}
                                />
                                <Text style={[
                                    styles.moodLabelText,
                                    selectedMood === mood.id && { color: '#E2DED0' }
                                ]}>
                                    {mood.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Journal Input */}
            <View style={styles.journalInputContainer}>
                <TextInput
                    style={styles.journalTextInput}
                    placeholder={placeholder}
                    placeholderTextColor="#928490"
                    multiline
                    value={journalEntry}
                    onChangeText={setJournalEntry}
                />
                <TouchableOpacity
                    style={[styles.journalAddButton, { backgroundColor: '#647C90' }]}
                    onPress={handleSave}
                >
                    <PlusCircle size={20} color="#E2DED0" />
                    <Text style={styles.journalAddButtonText}>{saveButtonText}</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.journalNote}>
                We'll keep these entries safe in your personal journal for you.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    journalSection: {
        width: '100%',
        marginBottom: 32,
        padding: 20,
        backgroundColor: 'rgba(146, 132, 144, 0.08)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    journalInstruction: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
        fontWeight: '500',
    },
    moodSection: {
        marginBottom: 16,
    },
    moodLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 16,
    },
    moodButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        // Fixed dimensions will be applied via inline style
        minWidth: 0, // Override previous minWidth
    },
    moodLabelText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 12,
        color: '#4E4F50',
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'center',
    },
    journalInputContainer: {
        marginBottom: 12,
    },
    journalTextInput: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 12,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.3)',
    },
    journalAddButton: {
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
    journalAddButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#E2DED0',
        marginLeft: 8,
        fontWeight: '600',
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionDivider: {
        width: 60,
        height: 3,
        backgroundColor: '#928490',
        borderRadius: 2,
    },
    journalNote: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 18,
        fontStyle: 'italic',
    },
});
