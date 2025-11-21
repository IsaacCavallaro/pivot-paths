import { LucideIcon } from 'lucide-react-native';
import { ReactNode } from 'react';

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
    cardType: "flip" | "swipe" | "choice" | "method";

    // General Props
    primaryButtonText: string;
    imageSource?: string;
    iconComponent?: ReactNode; // For custom icons like Calculator

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
        // Flip card props
        oldBelief?: string;
        newBelief?: string;
        // Swipe card props
        prompt?: string;
        // Choice card props
        question?: string;
        option1?: string;
        option2?: string;
        resultKey?: string;
        // Method card props
        title?: string;
        description?: string;
        breakdown?: string;
        bestFor?: string;
        steps?: string[];
        proTip?: string;
        // Common
        buttonText: string;
    }>;

    // Reflection Screen Props (Text + Button or Journal + Button)
    reflectionScreen: {
        title: string;
        description: string;
        journalSectionProps?: JournalSectionProps; // Optional for reflection
        customContent?: ReactNode; // For custom content like assignment sections
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