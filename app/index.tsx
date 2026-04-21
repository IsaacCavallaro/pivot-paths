import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { storageService } from '@/utils/storageService';
import { STORAGE_KEYS } from '@/utils/storageKeys';

export default function IndexScreen() {
  const router = useRouter();
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveEntryRoute = async () => {
      try {
        const hasCompletedOnboarding = await storageService.load<boolean>(
          STORAGE_KEYS.HAS_COMPLETED_ONBOARDING
        );

        if (!isMounted) {
          return;
        }

        router.replace(hasCompletedOnboarding ? '/(tabs)' : '/welcome');
      } catch (error) {
        console.error('Failed to resolve launch route:', error);

        if (isMounted) {
          router.replace('/welcome');
        }
      } finally {
        if (isMounted) {
          setIsResolving(false);
        }
      }
    };

    resolveEntryRoute();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!isResolving) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#647C90" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2DED0',
  },
});
