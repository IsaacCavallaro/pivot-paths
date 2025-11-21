import React from 'react';

export interface JournalSectionProps {
    pathTag: string;
    day: string;
    category: string;
    pathTitle: string;
    dayTitle: string;
    journalInstruction: string;
    moodLabel: string;
    saveButtonText: string;
    placeholder?: string;
}

export interface QuizOption {
    id: string;
    text: string | React.ReactElement;
    type: string; // 'A', 'B', 'C' etc.
}

export interface QuizQuestion {
    id: number;
    question: string;
    options: QuizOption[];
}

export interface QuizResult {
    type: string;
    title: string;
    description: string;
    subtitle?: string; // For EnergyAudit
    challenge?: string; // For IgniteYourCuriosity
    color: string;
    reflectionQuestions?: string[]; // For Take Action screen
    journalPlaceholder?: string; // For Take Action screen
}

export interface MiniQuizEngineProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;

    // General Props
    imageSource?: string;
    totalQuestions: number;
    quizQuestions: QuizQuestion[];
    quizResults: { [key: string]: QuizResult };
    baseCardStyle?: any; // To allow custom card styles for each quiz

    // Welcome Screen Props
    welcomeScreen: {
        title: string;
        descriptions: string[];
        journalSectionProps: JournalSectionProps;
        welcomeHighlightText: string;
        buttonText: string;
    };

    // Quiz Intro Screen Props
    quizIntroScreen: {
        title: string;
        descriptions: string[];
        buttonText: string;
    };

    // Main Result Screen Props (after quiz completion)
    mainResultScreen: {
        titleTemplate: (resultTitle: string) => string; // e.g., "Here's What You Could Be: {resultTitle}"
        descriptions: string[]; // Can be multiple paragraphs, will dynamically insert result title
        buttonText: string;
    };

    // Take Action Screen Props
    takeActionScreen: {
        title: string;
        descriptions: (resultTitle: string) => string[]; // Descriptions that use the result title
        videoLink?: string; // Optional YouTube video ID
        journalSectionProps: JournalSectionProps;
        buttonText: string;
    };

    // Final Completion Screen Props
    finalCompletionScreen: {
        title: string;
        descriptions: string[];
        closingText: string;
        buttonText: string;
    };
}
