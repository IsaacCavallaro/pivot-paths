// roleplayPromptEngine.d.ts
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

export interface FormulaStep {
    number: number;
    title: string;
    text: string;
}

// Extended interface to support TryItOn's two-question structure
export interface RoleplayScenarioContent {
    id: number;
    scenarioTitle: string;
    scenarioText: string;
    scenarioQuestion?: string;

    // For backward compatibility - single question structure
    choices?: {
        id: string;
        text: string;
    }[];
    responses?: string[];
    followUpTexts?: string[];

    // For TryItOn's two-question structure
    question1?: {
        text: string;
        choice1: string;
        choice2: string;
        response1: string;
        response2: string;
    };
    question2?: {
        text: string;
        choice1: string;
        choice2: string;
        response1: string;
        response2: string;
    };
    reflection?: string;

    alternativeTitle?: string;
    alternativeText: string;
    alternativeIcon?: LucideIcon;

    formula?: {
        title: string;
        text: string;
        steps: FormulaStep[];
        note?: string;
    };
    reflectionPrompt: string;
}

export interface LearningBoxItem {
    id: number;
    text: string;
}

export interface RoleplayPromptEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    imageSource?: string;
    engineTitle: string;
    engineInstructions: string;

    scenarios: RoleplayScenarioContent[];

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

    engineIntroScreen?: {
        title: string;
        descriptions: string[];
        buttonText: string;
    };

    reflectionScreen: {
        title: string;
        descriptions: string[];
        reflectionEmphasis?: string;
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    finalScreen: {
        title: string;
        descriptions: string[];
        videoLink?: string;
        alternativeClosing?: string;
        journalSectionProps?: JournalSectionProps;
        buttonText: string;
    };

    // New prop to handle TryItOn specific flow
    flowType?: 'standard' | 'tryItOn';
}