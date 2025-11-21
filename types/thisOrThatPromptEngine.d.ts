import { LucideIcon } from 'lucide-react-native';

export interface ChoiceOption {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

export interface ThisOrThatEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    // Game Configuration
    gameTitle: string;
    gameDescription: string;
    choices: ChoiceOption[];
    totalChoices: number;

    // Journaling Configuration
    pathTag: string;
    day: string;
    category: string;
    pathTitle: string;
    dayTitle: string;

    // Content Configuration
    morningJournalPrompt: string;
    introButtonText?: string; // Optional: defaults to "Start dreaming"
    introScreenDescription?: string; // Optional: defaults to generic description
    morningIntroText?: string; // Optional: defaults to "Expansive Dreamer" text
    reflectionTitle: string;
    reflectionDescription: string | string[]; // Can be single string or array of paragraphs
    finalReflectionPrompt: string | string[]; // Can be single string or array of paragraphs
    finalJournalPrompt?: string; // Optional: defaults to generic prompt

    // Story Configuration
    getStoryText: (screenNumber: number, choices: { [key: string]: string }) => string;
    storyStartScreen: number;
    storyEndScreen: number;

    // Ebook Configuration
    ebookTitle: string;
    ebookDescription: string;
    ebookLink: string;
    alternativeClosing: string;
}