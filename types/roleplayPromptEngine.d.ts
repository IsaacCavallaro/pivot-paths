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

// Interface for the specific steps of a formula, used in FormulaScreenProps
export interface FormulaStep {
    number: number;
    title: string;
    text: string;
}

// New interface for a structured prompt-like scenario, combining elements from AskForMore and Generosity
export interface RoleplayScenarioContent {
    id: number; // Unique ID for the scenario
    scenarioTitle: string;
    scenarioText: string;
    scenarioQuestion?: string; // Optional, like in AskForMore

    // Choices for the user
    choices: {
        id: string; // Unique ID for the choice, e.g., 'choice1'
        text: string;
    }[];

    // Responses corresponding to user choices (index-based)
    responses: string[];

    // Optional follow-up text for the "Here's your situation" screen
    followUpTexts?: string[]; // Array of texts, matching responses length

    // Content for the alternative/conclusion screen
    alternativeTitle?: string;
    alternativeText: string; // Can be a single string or an array of paragraphs
    alternativeIcon?: LucideIcon; // For custom icons, like Gift or Users

    // Optional content for a formula screen (like in AskForMore)
    formula?: {
        title: string;
        text: string;
        steps: FormulaStep[];
        note?: string;
    };
    reflectionPrompt: string; // Prompt for the reflection section after the scenario
}

export interface LearningBoxItem {
    id: number;
    text: string;
}

export interface RoleplayPromptEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    // General Props
    imageSource?: string;
    engineTitle: string;
    engineInstructions: string;

    // Array of structured scenarios
    scenarios: RoleplayScenarioContent[];

    // Welcome Screen
    welcomeScreen: {
        title: string;
        descriptions: string[];
        learningBox?: { // Renamed from LearningBox to be more generic, but keeping original fields for now
            title: string;
            items: LearningBoxItem[];
        };
        welcomeFooter?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Engine Intro Screen (optional, if different from welcome, like in AskForMore)
    engineIntroScreen?: {
        title: string;
        descriptions: string[];
        buttonText: string;
    };

    // Reflection Screen (after all scenarios are complete, or per scenario if needed)
    reflectionScreen: {
        title: string;
        descriptions: string[]; // Can be multiple paragraphs
        reflectionEmphasis?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Final Screen (after reflection)
    finalScreen: {
        title: string;
        descriptions: string[]; // Can be multiple paragraphs
        videoLink?: string; // Optional YouTube link
        alternativeClosing?: string; // e.g., "See you tomorrow."
        journalSectionProps?: JournalSectionProps; // Optional for final screen
        buttonText: string;
    };
}
