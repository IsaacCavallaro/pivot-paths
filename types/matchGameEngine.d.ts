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

export interface MatchPair {
    id: number;
    leftText: string;
    rightText: string;
    leftType: string;
    rightType: string;
}

export interface LearningBoxItem {
    id: number;
    text: string;
}

export interface MatchGameEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    // General Props
    imageSource?: string;
    gameTitle: string;
    gameInstructions: string;
    leftColumnTitle: string;
    rightColumnTitle: string;

    // Game Content
    pairs: MatchPair[];

    // Welcome Screen
    welcomeScreen: {
        title: string;
        descriptions: string[];
        learningBox?: {
            title: string;
            items: LearningBoxItem[];
        };
        welcomeFooter?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Game Intro Screen (optional, if different from welcome)
    gameIntroScreen?: {
        title: string;
        descriptions: string[];
        buttonText: string;
    };

    // Reflection Screen
    reflectionScreen: {
        title: string;
        descriptions: string[]; // Can be multiple paragraphs
        reflectionEmphasis?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Final Screen
    finalScreen: {
        title: string;
        descriptions: string[]; // Can be multiple paragraphs
        videoLink?: string; // Optional YouTube link
        alternativeClosing?: string;
        journalSectionProps?: JournalSectionProps; // Optional for final screen
        buttonText: string;
    };
}
