import { useCallback, useRef } from 'react';
import { ScrollView } from 'react-native';

export const useScrollToTop = () => {
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToTop = useCallback(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
    }, []);

    return { scrollViewRef, scrollToTop };
};
