import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry } from '../interfaces';

export const useJournaling = (pathTag: string, day: string) => {
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const addJournalEntry = useCallback(async (content: string, mood: string | null = null) => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Entry', 'Please write something before adding.');
            return;
        }

        try {
            const newEntry: JournalEntry = {
                id: Date.now().toString(),
                pathTag: pathTag,
                day: day,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
                content: trimmed,
                mood: mood,
            };

            const raw = await AsyncStorage.getItem('journalEntries');
            const existingEntries = raw ? JSON.parse(raw) : [];

            const updatedEntries = [newEntry, ...existingEntries];

            await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

            setJournalEntry('');
            setSelectedMood(null);
            Alert.alert('Success', 'Journal entry added!');

        } catch (error) {
            console.error('Error saving journal entry:', error);
            Alert.alert('Error', 'Failed to save journal entry.');
        }
    }, [pathTag]);

    return {
        journalEntry,
        setJournalEntry,
        selectedMood,
        setSelectedMood,
        addJournalEntry,
    };
};
