import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import { STORAGE_KEYS } from '@/utils/storageKeys';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
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

describe('home screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows continue state when progress exists and deep-links back into the path', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === STORAGE_KEYS.PREFERRED_CATEGORY_ID) {
        return 'career-transitions';
      }

      if (key === STORAGE_KEYS.PATH_PROGRESS) {
        return JSON.stringify({ 'mindset_discover-dream-life': 2 });
      }

      if (key === 'currentDay_mindset_discover-dream-life') {
        return '3';
      }

      return null;
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Continue where you left off')).toBeTruthy();
      expect(getByText('Your Dream Life')).toBeTruthy();
      expect(getByText('Continue Path')).toBeTruthy();
    });

    fireEvent.press(getByText('Continue Path'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/(tabs)/paths/[categoryId]/[pathId]',
      params: {
        categoryId: 'mindset',
        pathId: 'discover-dream-life',
      },
    });
  });

  it('does not show the recommendation card when no progress exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === STORAGE_KEYS.PREFERRED_CATEGORY_ID) {
        return 'finance';
      }

      return null;
    });

    const { queryByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(queryByText('Start with a recommendation')).toBeNull();
      expect(queryByText('Open Recommended Focus')).toBeNull();
      expect(queryByText('Financial Wellness')).toBeNull();
    });
  });
});
