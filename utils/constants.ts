import { Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';

export const MOOD_OPTIONS = [
    { id: 'angry', label: 'Angry', icon: Angry, color: '#DC2626' },
    { id: 'sad', label: 'Sad', icon: Frown, color: '#2563EB' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: '#CA8A04' },
    { id: 'happy', label: 'Happy', icon: Smile, color: '#16A34A' },
    { id: 'excited', label: 'Excited', icon: Laugh, color: '#7C3AED' },
    { id: 'loved', label: 'Loved', icon: Heart, color: '#DB2777' },
];
