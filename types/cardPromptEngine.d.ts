import { LucideIcon } from 'lucide-react-native';

export interface JournalSectionProps {
    pathTag: string;
    day: string;
    category: string;
    pathTitle: string;
    dayTitle: string;
    journalInstruction: string;
    moodLabel: string;
    saveButtonText: string;
}

export interface CardPromptEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    // Config for card type
    cardType: "flip" | "swipe"; // "flip" for LettingGoOfValidation, "swipe" for others

    // General Props
    primaryButtonText: string;
    imageSource?: string;

    // Intro Screen Props (Journal + Button)
    introScreen: {
        title: string;
        descriptions: string[];
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Secondary Intro Screen Props (No Journal, just button to start cards)
    secondaryIntroScreen?: {
        title: string;
        descriptions: string[];
        buttonText: string;
    };

    // Card Content Props
    cards: Array<{
        id: number;
        oldBelief?: string; // For 'flip' type
        newBelief?: string; // For 'flip' type
        prompt?: string; // For 'swipe' type
        buttonText: string;
    }>;

    // Reflection Screen Props (Text + Button or Journal + Button)
    reflectionScreen: {
        title: string;
        description: string;
        journalSectionProps?: JournalSectionProps; // Optional for reflection
        buttonText: string;
    };

    // Final Screen Props (Text + Journal + Button)
    finalScreen: {
        title: string;
        descriptions: string[];
        alternativeClosing?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };
}
