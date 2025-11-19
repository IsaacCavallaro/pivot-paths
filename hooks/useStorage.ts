import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

/**
 * A custom React hook for managing data in AsyncStorage.
 * It provides a stateful value that is synchronized with AsyncStorage.
 *
 * @param key The key from STORAGE_KEYS to use for AsyncStorage.
 * @param initialValue The initial value to use if no data is found in AsyncStorage.
 * @returns A tuple containing the current value and a function to update it.
 */
export function useStorage<T>(key: keyof typeof STORAGE_KEYS, initialValue: T): [T, (value: T | ((prev: T) => T)) => Promise<void>] {
    const storageKey = STORAGE_KEYS[key];
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from AsyncStorage on component mount
    useEffect(() => {
        const loadValue = async () => {
            try {
                const value = await storageService.load<T>(storageKey);
                if (value !== null) {
                    setStoredValue(value);
                }
            } catch (error) {
                console.error(`Failed to load value for key "${storageKey}" from storage:`, error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadValue();
    }, [storageKey]);

    // Update function that also saves to AsyncStorage
    const setValue = useCallback(async (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            await storageService.save(storageKey, valueToStore);
        } catch (error) {
            console.error(`Failed to save value for key "${storageKey}" to storage:`, error);
        }
    }, [storageKey, storedValue]);

    return [storedValue, setValue];
}
