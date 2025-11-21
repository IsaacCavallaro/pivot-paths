import React from 'react';
import { StyleSheet } from 'react-native';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When someone asks about your career plans, how do you usually respond?",
        options: [
            {
                id: 'a',
                text: 'I feel tongue-tied and struggle to explain',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'I can talk about it, but I doubt my skills',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'I explain clearly and feel motivated',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 2,
        question: "When you see a job description that excites you, what's your first thought?",
        options: [
            {
                id: 'a',
                text: '"I\'m not qualified enough."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I need more training before I could apply."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"I\'m applying now!"',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 3,
        question: "If a recruiter asked why you'd be a good fit, how would you feel?",
        options: [
            {
                id: 'a',
                text: 'Unsure what to say about myself',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'A little prepared, but I\'d want more practice',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Confident—I know how to frame my story',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 4,
        question: "When you think about leaving dance, what feels hardest?",
        options: [
            {
                id: 'a',
                text: 'Believing I can succeed in a different world',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'Learning the practical skills for a new career',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Taking the leap and actually applying',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 5,
        question: "If you failed at something in your new path, what's your reaction?",
        options: [
            {
                id: 'a',
                text: '"I knew I wasn\'t cut out for this."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I need to study or train more."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"Failure is just part of the process."',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 6,
        question: "How do you talk about your dance career to non-dancers?",
        options: [
            {
                id: 'a',
                text: 'I freeze and worry they won\'t understand',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'I try, but I\'m not sure I explain it well',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'I confidently connect my dance skills to their world',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 7,
        question: "When you think about networking, what's your gut reaction?",
        options: [
            {
                id: 'a',
                text: '"I\'m too nervous to reach out."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I\'d do better if I had scripts or practice."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"I\'m excited to meet people and share my story."',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 8,
        question: "Imagine walking into your first interview outside of dance. How do you picture yourself?",
        options: [
            {
                id: 'a',
                text: 'Anxious and doubtful',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'A bit shaky but somewhat prepared',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Confident, prepared, and ready to connect',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 9,
        question: "What would make you feel most prepared for your career change?",
        options: [
            {
                id: 'a',
                text: 'Learning to trust myself more',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'Gaining new skills and practice',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Just getting out there and taking action',
                type: 'Action-Ready'
            }
        ]
    }
];

const confidenceGapResults: { [key: string]: QuizResult } = {
    'Mindset': {
        type: 'Mindset',
        title: 'Your Confidence Gap is Mindset',
        description: 'Your biggest hurdle isn\'t your skills—it\'s believing you belong in a new space. Build your confidence by reframing your dance background as an asset and practicing self-trust. You\'re more capable than you think.',
        subtitle: 'Focus on believing in your inherent worth and capabilities.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to have a mindset confidence gap?',
            'How can I reframe my dance experience as an asset?',
            'What evidence do I have that I can succeed in new areas?'
        ],
        journalPlaceholder: 'I can build my confidence mindset by...'
    },
    'Skills': {
        type: 'Skills',
        title: 'Your Confidence Gap is Skills',
        description: 'You believe in yourself, but you want more tools in your belt. Upskilling, training, and practicing interviews will boost your confidence. Focus on building what you need so you can walk into opportunities prepared.',
        subtitle: 'Your confidence grows through preparation and practice.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to focus only on skill gaps?',
            'What skills do I already have that I\'m underestimating?',
            'How can I build confidence through small skill wins?'
        ],
        journalPlaceholder: 'I can build confidence in my skills by...'
    },
    'Action-Ready': {
        type: 'Action-Ready',
        title: 'Your Confidence Gap is Action',
        description: 'You\'ve got the right mindset and enough skills, but hesitation can hold you back. Confidence comes from doing. Start applying, networking, and saying "yes"—you\'ll build proof of your capability as you go.',
        subtitle: 'Your path forward is through taking the first step.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to hesitate before taking action?',
            'What small action can I take today to build momentum?',
            'How have past actions proven my capability?'
        ],
        journalPlaceholder: 'I can build confidence through action by...'
    }
};

interface ConfidenceGapProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function ConfidenceGap({ onComplete, onBack }: ConfidenceGapProps) {
    const quizConfig: MiniQuizEngineProps = {
        onComplete,
        onBack,
        imageSource: 'https://pivotfordancers.com/assets/logo.png',
        totalQuestions: quizQuestions.length,
        quizQuestions,
        quizResults: confidenceGapResults,
        baseCardStyle: styles.baseCardConfidence,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Confidence Journey',
            descriptions: [
                "Making a big career change is as much about mindset as it is about skills. Taking this first step to understand your confidence patterns shows incredible self-awareness and courage."
            ],
            journalSectionProps: {
                pathTag: "prep-your-pivot",
                day: "1",
                category: "Career Transitions",
                pathTitle: "Prep Your Pivot",
                dayTitle: "Confidence Gap",
                journalInstruction: "Before we begin, let's check in with how you're feeling about your career transition journey right now.",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "Understanding where your confidence dips will help you build it back up, stronger than ever. Ready to discover your confidence gap?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "Where's your confidence gap?",
            descriptions: [
                "This quick check will help you see where your confidence tends to dip—whether it's in your mindset, your skills, or taking action—so you know exactly what to focus on as you prep your pivot."
            ],
            buttonText: "Let's find out"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Build Your Confidence',
            descriptions: (resultTitle: string) => [
                `Recognizing your ${resultTitle.toLowerCase()} is the first step toward building unshakeable confidence in your career transition.`,
                'Now, let\'s explore how you can develop into the confident self and close that gap for good.'
            ],
            journalSectionProps: {
                pathTag: "prep-your-pivot",
                day: "1",
                category: "Career Transitions",
                pathTitle: "Prep Your Pivot",
                dayTitle: "Confidence Gap",
                journalInstruction: "Write your reflections as a journal entry below to solidify your confidence-building plan.",
                moodLabel: "How are you feeling about your confidence now?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken a powerful first step toward becoming your most confident self. By understanding where your confidence dips, you're already building the self-awareness needed to close that gap."
            ],
            closingText: 'Your confident future awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardConfidence: {
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 50,
    },
});
