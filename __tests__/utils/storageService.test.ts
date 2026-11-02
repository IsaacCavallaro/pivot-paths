import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '@/utils/storageService';

describe('storageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves JSON serializable data', async () => {
    await storageService.save('example', { ok: true });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'example',
      JSON.stringify({ ok: true })
    );
  });

  it('loads and parses stored JSON', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify({ ok: true })
    );

    await expect(storageService.load('example')).resolves.toEqual({ ok: true });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('example');
  });

  it('removes stored keys', async () => {
    await storageService.remove('example');

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('example');
  });

  it('removes multiple stored keys', async () => {
    await storageService.multiRemove(['one', 'two']);

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['one', 'two']);
  });

  it('returns all stored keys', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce(['one', 'two']);

    await expect(storageService.getAllKeys()).resolves.toEqual(['one', 'two']);
  });
});
