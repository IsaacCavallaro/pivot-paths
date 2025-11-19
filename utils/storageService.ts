import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
    /**
     * Saves data to AsyncStorage.
     * @param key The key under which to store the data.
     * @param value The data to store. Can be any JSON-serializable value.
     */
    save: async <T>(key: string, value: T): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (e) {
            console.error(`Error saving data for key ${key}:`, e);
            throw e;
        }
    },

    /**
     * Loads data from AsyncStorage.
     * @param key The key from which to load the data.
     * @returns The loaded data, or null if not found.
     */
    load: async <T>(key: string): Promise<T | null> => {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(`Error loading data for key ${key}:`, e);
            throw e;
        }
    },

    /**
     * Removes data from AsyncStorage.
     * @param key The key of the data to remove.
     */
    remove: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`Error removing data for key ${key}:`, e);
            throw e;
        }
    },
};
