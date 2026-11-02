import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';
import { storageService } from '@/utils/storageService';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      return callback();
    }, [callback]);
  },
  useScrollToTop: jest.fn(),
}));

describe('profile screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears all local app storage on reset and returns to welcome', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ 'mindset_discover-dream-life': 2 })
    );

    jest.spyOn(storageService, 'getAllKeys').mockResolvedValueOnce([
      'pathProgress',
      'currentDay_mindset_discover-dream-life',
      'journalEntries',
      'firstName',
    ]);
    const multiRemoveSpy = jest.spyOn(storageService, 'multiRemove').mockResolvedValueOnce(undefined);

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(getByText('Reset Progress')).toBeTruthy();
    });

    fireEvent.press(getByText('Reset Progress'));
    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(multiRemoveSpy).toHaveBeenCalledWith([
        'pathProgress',
        'currentDay_mindset_discover-dream-life',
        'journalEntries',
        'firstName',
      ]);
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });
  });
});
