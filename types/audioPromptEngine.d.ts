import { LucideIcon } from 'lucide-react-native';

export interface AudioPromptEngineProps {
    onComplete: () => void;
    onBack?: () => void;

    // Intro Screen Props
    introTitle: string;
    introDescriptions: string[];
    journalIntroSectionProps: {
        pathTag: string;
        day: string;
        category: string;
        pathTitle: string;
        dayTitle: string;
        journalInstruction: string;
        moodLabel: string;
        saveButtonText: string;
    };
    preparationSection: string[];

    // Voice Message Screen Props
    voiceMessageTitle: string;
    voiceMessageDescription: string;

    // Journal Prompt Screen Props
    journalReflectionTitle: string;
    journalReflectionDescription: string;
    journalReflectionSectionProps: {
        pathTag: string;
        day: string;
        category: string;
        pathTitle: string;
        dayTitle: string;
        journalInstruction: string;
        moodLabel: string;
        saveButtonText: string;
    };

    // Ebook Promotion Screen Props
    ebookProps: {
        title: string;
        descriptions: string[];
        callout: string;
        link: string;
        cardTitle: string;
        cardIcon: LucideIcon;
        cardFeatures: { icon: LucideIcon; text: string }[];
        cardButtonText: string;
    };
}
