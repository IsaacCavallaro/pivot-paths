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
    cardType: "flip" | "swipe" | "choice" | "method" | "challenge" | "benefit" | "experiment";

    // General Props
    primaryButtonText: string;
    imageSource?: string;
    iconComponent?: ReactNode; // For custom icons like Calculator, PiggyBank, TrendingDown
    youtubeVideoId?: string; // NEW: Optional YouTube video ID for reflection screen

    // Intro Screen Props (Journal + Button)
    introScreen: {
        title: string;
        descriptions: string[];
        subtext?: string; // Optional additional text with different styling (used by TheTotalPackage)
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
        flipButtonText?: string; // ADD THIS LINE - for flip card type
        // Swipe card props
        prompt?: string;
        // Choice card props
        question?: string;
        option1?: string;
        option2?: string;
        resultKey?: string;
        // Method card props (shared structure)
        title?: string;
        description?: string;
        // Method card props (budgeting variant)
        breakdown?: string;
        // Method card props (debt variant)
        strategy?: string;
        why?: string;
        result?: string;
        // Challenge card props
        goal?: string;
        target?: string;
        // Benefit card props
        whatItIs?: string;
        whyValuable?: string;
        howToAsk?: string;
        // Shared method/challenge props
        bestFor?: string;
        steps?: string[];
        proTip?: string;
        // Common
        buttonText: string;
    }>;

    // Selection Screen Props (for choosing between options after cards)
    selectionScreen?: {
        title?: string; // Optional - TamingYourDebt doesn't use a title
        description: string;
        options: Array<{
            id: number;
            title: string;
            subtitle?: string; // For button-based selection (e.g., "Momentum Builder")
            icon?: ReactNode; // For card-based selection (e.g., PiggyBank icon)
        }>;
        footer?: string; // Optional footer text
        buttonText?: string; // Optional - only needed for card-based selection
        useButtons?: boolean; // If true, render as PrimaryButtons instead of selection cards
    };

    // Reflection Screen Props (Text + Button or Journal + Button)
    reflectionScreen?: {
        title: string;
        description?: string;
        customContent?: ReactNode | ((choices: { [key: string]: string }) => ReactNode); // UPDATED: Support function
        journalSectionProps?: JournalSectionProps;
        buttonText: string;
    };

    // Final Screen Props (Text + Journal + Button)
    finalScreen: {
        title: string;
        descriptions: string[];
        alternativeClosing?: string;
        customContent?: ReactNode;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };
}