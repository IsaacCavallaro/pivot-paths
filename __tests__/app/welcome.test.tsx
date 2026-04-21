import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import WelcomeScreen from '@/app/welcome';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/utils/storageService', () => ({
  storageService: {
    save: jest.fn(),
  },
}));

describe('welcome screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storageService.save as jest.Mock).mockResolvedValue(undefined);
  });

  it('saves onboarding and opens the selected focus area', async () => {
    const { getByPlaceholderText, getByText } = render(<WelcomeScreen />);

    fireEvent.changeText(getByPlaceholderText('First name'), 'John');
    expect(getByText('We’ll greet you as John.')).toBeTruthy();
    fireEvent.press(getByText('Confirm'));
    fireEvent.press(getByText('Financial Wellness'));
    fireEvent.press(getByText('Start With This Focus'));

    await waitFor(() => {
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
        true
      );
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.PREFERRED_CATEGORY_ID,
        'finance'
      );
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.FIRST_NAME,
        'John'
      );
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(tabs)/categories/[id]',
        params: { id: 'finance' },
      });
    });
  });

  it('stores preference and returns to the app when browsing first', async () => {
    const { getByPlaceholderText, getByText } = render(<WelcomeScreen />);

    fireEvent.changeText(getByPlaceholderText('First name'), 'John');
    expect(getByText('We’ll greet you as John.')).toBeTruthy();
    fireEvent.press(getByText('Confirm'));
    fireEvent.press(getByText('Browse The App First'));

    await waitFor(() => {
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
        true
      );
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.PREFERRED_CATEGORY_ID,
        'mindset'
      );
      expect(storageService.save).toHaveBeenCalledWith(
        STORAGE_KEYS.FIRST_NAME,
        'John'
      );
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });
});
