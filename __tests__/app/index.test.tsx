import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import IndexScreen from '@/app/index';
import { storageService } from '@/utils/storageService';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/utils/storageService', () => ({
  storageService: {
    load: jest.fn(),
  },
}));

describe('app index route resolver', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('routes returning users to tabs', async () => {
    (storageService.load as jest.Mock).mockResolvedValueOnce(true);

    render(<IndexScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('routes first-time users to welcome', async () => {
    (storageService.load as jest.Mock).mockResolvedValueOnce(false);

    render(<IndexScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });
  });

  it('falls back to welcome when storage lookup fails', async () => {
    (storageService.load as jest.Mock).mockRejectedValueOnce(new Error('boom'));

    render(<IndexScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/welcome');
    });
  });
});
