import { Smile, Frown, Meh, Laugh, Angry, Heart, Annoyed } from 'lucide-react-native';

export const MOOD_OPTIONS = [
    { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
    { id: 'nervous', label: 'Nervous', icon: Frown, color: '#2563EB' },
    { id: 'supported', label: 'Supported', icon: Heart, color: '#DB2777' },
    { id: 'defensive', label: 'Defensive', icon: Angry, color: '#DC2626' },
    { id: 'Reflective', label: 'Happy', icon: Smile, color: '#16A34A' },
    { id: 'unsure', label: 'Unsure', icon: Meh, color: '#CA8A04' },
];