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

// Question structure for TryItOn flow
export interface TryItOnQuestion {
    text: string;
    choice1: string;
    choice2: string;
    response1: string;
    response2: string;
}

// Extended interface to support both standard and TryItOn flows
export interface RoleplayScenarioContent {
    id: number;
    scenarioTitle: string;
    scenarioText: string;
    scenarioQuestion?: string;

    // For standard flow - single question structure
    choices?: {
        id: string;
        text: string;
    }[];
    responses?: string[];
    followUpTexts?: string[];

    // For TryItOn flow - two-question structure
    question1?: TryItOnQuestion;
    question2?: TryItOnQuestion;
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

export interface WelcomeScreenProps {
    title: string;
    descriptions: string[];
    learningBox?: {
        title: string;
        items: LearningBoxItem[];
    };
    welcomeFooter?: string;
    journalSectionProps: JournalSectionProps;
    buttonText: string;
}

export interface EngineIntroScreenProps {
    title: string;
    descriptions: string[];
    buttonText: string;
}

export interface ReflectionScreenProps {
    title: string;
    descriptions: string[];
    reflectionEmphasis?: string;
    journalSectionProps: JournalSectionProps;
    buttonText: string;
}

export interface FinalScreenProps {
    title: string;
    descriptions: string[];
    videoLink?: string;
    alternativeClosing?: string;
    journalSectionProps?: JournalSectionProps;
    buttonText: string;
}

export interface ReflectionScreenProps {
    title: string;
    descriptions: string[];
    reflectionEmphasis?: string;
    videoLink?: string;
    journalSectionProps: JournalSectionProps;
    buttonText: string;
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
    welcomeScreen: WelcomeScreenProps;

    // Engine Intro Screen (optional, if different from welcome)
    engineIntroScreen?: EngineIntroScreenProps;

    // Reflection Screen (after all scenarios are complete, or per scenario if needed)
    reflectionScreen: ReflectionScreenProps;

    // Final Screen (after reflection)
    finalScreen: FinalScreenProps;

    // New prop to handle different flow types
    flowType?: 'standard' | 'tryItOn' | 'mustHaves' | 'simpleChoice';
}