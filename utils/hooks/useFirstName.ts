import { useEffect, useState } from 'react';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

export function personalizeGreeting(baseGreeting: string, firstName: string | null) {
  const trimmedName = firstName?.trim();
  return trimmedName ? `${baseGreeting} ${trimmedName}` : baseGreeting;
}

export function useFirstName() {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFirstName = async () => {
      try {
        const savedFirstName = await storageService.load<string>(STORAGE_KEYS.FIRST_NAME);
        if (isMounted) {
          setFirstName(savedFirstName?.trim() || null);
        }
      } catch (error) {
        console.error('Failed to load first name:', error);
      }
    };

    loadFirstName();

    return () => {
      isMounted = false;
    };
  }, []);

  return firstName;
}
