import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react-native';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { useStorage } from '@/hooks/useStorage';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { storageService } from '@/utils/storageService';

describe('journaling cluster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('persists a journal entry with metadata and clears local state', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() =>
      useJournaling(
        'discover-dream-life',
        '1',
        'Mindset',
        'Your Dream Life',
        'What kind of dreamer are you?'
      )
    );

    await act(async () => {
      await result.current.addJournalEntry('My reflection', 'excited');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    const [, payload] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    const savedEntries = JSON.parse(payload);

    expect(savedEntries[0]).toMatchObject({
      pathTag: 'discover-dream-life',
      day: '1',
      category: 'Mindset',
      pathTitle: 'Your Dream Life',
      dayTitle: 'What kind of dreamer are you?',
      content: 'My reflection',
      mood: 'excited',
    });
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(result.current.journalEntry).toBe('');
    expect(result.current.selectedMood).toBeNull();
  });

  it('blocks empty journal entries', async () => {
    const { result } = renderHook(() => useJournaling('discover-dream-life', '1'));

    await act(async () => {
      await result.current.addJournalEntry('   ');
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Empty Entry',
      'Please write something before adding.'
    );
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('loads and updates stored values through useStorage', async () => {
    jest.spyOn(storageService, 'load').mockResolvedValueOnce(['existing']);
    const saveSpy = jest.spyOn(storageService, 'save').mockResolvedValueOnce(undefined);

    const { result } = renderHook(() =>
      useStorage('MYTH_BUSTER_MATCHED_PAIRS', [] as string[])
    );

    await waitFor(() => {
      expect(result.current[0]).toEqual(['existing']);
    });

    await act(async () => {
      await result.current[1]((prev) => [...prev, 'next']);
    });

    expect(saveSpy).toHaveBeenCalledWith('mythBusterMatchedPairs', ['existing', 'next']);
    expect(result.current[0]).toEqual(['existing', 'next']);
  });

  it('lets the journal entry section collect mood, save text, and show feedback', async () => {
    const addJournalEntry = jest.fn();
    const setJournalEntry = jest.fn();
    const setSelectedMood = jest.fn();

    jest.spyOn(require('@/utils/hooks/useJournaling'), 'useJournaling').mockReturnValue({
      journalEntry: '',
      setJournalEntry,
      selectedMood: null,
      setSelectedMood,
      addJournalEntry,
    });

    addJournalEntry.mockResolvedValue(true);

    const { getByPlaceholderText, getByText, findByText } = render(
      <JournalEntrySection
        pathTag="discover-dream-life"
        day="2"
        journalInstruction="Reflect on the myth that still feels true."
        moodLabel="Mood"
        saveButtonText="Save Reflection"
      />
    );

    fireEvent.changeText(getByPlaceholderText('Add your entry here'), 'Test entry');
    fireEvent.press(getByText('Excited'));
    await act(async () => {
      fireEvent.press(getByText('Save Reflection'));
    });

    expect(setJournalEntry).toHaveBeenCalledWith('Test entry');
    expect(setSelectedMood).toHaveBeenCalledWith('excited');
    expect(addJournalEntry).toHaveBeenCalledWith('', null);
    expect(await findByText('Journal entry saved to your personal journal.')).toBeTruthy();
  });
});
