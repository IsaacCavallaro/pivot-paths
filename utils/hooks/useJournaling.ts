import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/storageKeys';
import { JournalEntry } from '@/utils/interfaces';

export const useJournaling = (
    pathTag: string,
    day: string = '0',
    category: string = 'General',
    pathTitle: string = '',
    dayTitle: string = ''
) => {
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const addJournalEntry = useCallback(async (content: string, mood: string | null = null) => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Entry', 'Please write something before adding.');
            return false;
        }

        try {
            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                pathTag: pathTag,
                day: day,
                category: category, // Add category
                pathTitle: pathTitle, // Add path title
                dayTitle: dayTitle, // Add day title
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                timestamp: Date.now(), // Add timestamp for sorting
                content: trimmed,
                mood: mood ?? undefined,
            };

            const raw = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
            const existingEntries = raw ? JSON.parse(raw) : [];

            const updatedEntries = [newEntry, ...existingEntries];

            await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(updatedEntries));

            setJournalEntry('');
            setSelectedMood(null);
            return true;

        } catch (error) {
            console.error('Error saving journal entry:', error);
            Alert.alert('Error', 'Failed to save journal entry.');
            return false;
        }
    }, [pathTag, day, category, pathTitle, dayTitle]);

    return {
        journalEntry,
        setJournalEntry,
        selectedMood,
        setSelectedMood,
        addJournalEntry,
    };
};
