import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ReportsScreen from '@/app/(tabs)/reports';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      return callback();
    }, [callback]);
  },
}));

jest.mock('react-native-svg-charts', () => ({
  PieChart: () => null,
}));

describe('reports screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the most advanced in-progress path instead of hard-coding dream life progress', async () => {
    jest.spyOn(storageService, 'load').mockImplementation(async (key: string) => {
      if (key === STORAGE_KEYS.PATH_PROGRESS) {
        return { 'career-transitions_prep-your-pivot': 3 };
      }

      if (key === STORAGE_KEYS.PATH_COMPLETION_DATES) {
        return {};
      }

      return null;
    });

    const { getByText } = render(<ReportsScreen />);

    await waitFor(() => {
      expect(getByText('Prep Your Pivot: 3/7 days complete')).toBeTruthy();
    });
  });

  it('renders stored completion dates for completed journeys', async () => {
    const completionDate = Date.UTC(2026, 0, 15);

    jest.spyOn(storageService, 'load').mockImplementation(async (key: string) => {
      if (key === STORAGE_KEYS.PATH_PROGRESS) {
        return { 'career-transitions_prep-your-pivot': 7 };
      }

      if (key === STORAGE_KEYS.PATH_COMPLETION_DATES) {
        return { 'career-transitions_prep-your-pivot': completionDate };
      }

      return null;
    });

    const { getByText } = render(<ReportsScreen />);

    await waitFor(() => {
      expect(getByText('Prep Your Pivot')).toBeTruthy();
      expect(
        getByText(`Completed ${new Date(completionDate).toLocaleDateString()}`)
      ).toBeTruthy();
    });
  });
});
