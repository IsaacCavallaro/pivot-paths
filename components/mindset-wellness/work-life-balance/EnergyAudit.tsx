import React from 'react';
import { StyleSheet } from 'react-native';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When do you feel most motivated?",
        options: [
            {
                id: 'a',
                text: 'First thing in the morning',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Midday after lunch',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Late afternoon/evening',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "When tackling a new task, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Diving in immediately',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Planning first',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking for guidance',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "After a long day of dance, I usually feel…",
        options: [
            {
                id: 'a',
                text: 'Energized and ready to do more',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Tired but okay',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Completely drained',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "I focus best when…",
        options: [
            {
                id: 'a',
                text: 'Listening and observing',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking and collaborating',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Moving and doing',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When learning something new, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Reading instructions or watching examples',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking it through with someone',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Jumping in and figuring it out as I go',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "I feel recharged after…",
        options: [
            {
                id: 'a',
                text: 'A quiet solo activity like journaling or a walk',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Socializing or connecting with friends',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Physical movement or dancing',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "During a busy week, I notice my energy dips…",
        options: [
            {
                id: 'a',
                text: 'Early in the day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Mid-afternoon',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Later in the evening',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "I handle stress best when…",
        options: [
            {
                id: 'a',
                text: 'I have a clear routine and plan',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I talk it through with someone I trust',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I move my body or do something physical',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "If I have free time, I naturally gravitate toward…",
        options: [
            {
                id: 'a',
                text: 'Calm, reflective activities',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Social or collaborative activities',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Active, hands-on activities',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "I feel most productive when…",
        options: [
            {
                id: 'a',
                text: 'Everything is quiet and planned (Early Bird)',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I can mix social, solo, and active tasks (Balanced)',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I can tackle tasks later in the day or evening (Night Owl)',
                type: 'C'
            }
        ]
    }
];

const energyResults: { [key: string]: QuizResult } = {
    'A': {
        type: 'A',
        title: 'The Reflector',
        description: 'You thrive when you have quiet, focused time. You gain energy from planning, observing, and processing internally. To make the most of your energy, schedule tasks that allow deep focus, reflection, or learning independently.',
        subtitle: 'Your energy flows when you honor your need for space and reflection.',
        color: '#928490',
        reflectionQuestions: [
            'How can I structure my day to honor my reflective nature?',
            'What activities drain my energy the most?',
            'When do I feel most focused and clear-headed?'
        ],
        journalPlaceholder: 'I can honor my reflective energy by...'
    },
    'B': {
        type: 'B',
        title: 'The Connector',
        description: "You thrive when you're interacting with others. Energy comes from collaboration, conversation, and shared experiences. To maximize your productivity, plan tasks that involve teamwork, brainstorming, or mentoring — and balance with some solo downtime.",
        subtitle: 'Your energy amplifies through connection and shared experiences.',
        color: '#928490',
        reflectionQuestions: [
            'How can I build more connection into my routine?',
            'What social interactions energize me vs. drain me?',
            'How can I balance social time with necessary solo work?'
        ],
        journalPlaceholder: 'I can optimize my social energy by...'
    },
    'C': {
        type: 'C',
        title: 'The Doer',
        description: "You thrive when you're active and hands-on. You get your energy from movement and taking immediate action. To make the most of your week, focus on tasks where you can dive in and learn by doing, and build in short breaks to recharge.",
        subtitle: 'Your energy ignites through action and physical engagement.',
        color: '#647C90',
        reflectionQuestions: [
            'How can I incorporate more movement into my day?',
            'What physical activities help me recharge?',
            'When do I feel most energized and active?'
        ],
        journalPlaceholder: 'I can channel my active energy by...'
    }
};

interface EnergyAuditProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function EnergyAudit({ onComplete, onBack }: EnergyAuditProps) {
    const quizConfig: MiniQuizEngineProps = {
        onComplete,
        onBack,
        imageSource: 'https://pivotfordancers.com/assets/logo.png',
        totalQuestions: quizQuestions.length,
        quizQuestions,
        quizResults: energyResults,
        baseCardStyle: styles.baseCardEnergy,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Energy Audit',
            descriptions: [
                "Understanding your energy patterns is the first step toward creating sustainable balance in your life. Let's discover when you're at your best and how to work with your natural rhythms."
            ],
            journalSectionProps: {
                pathTag: "work-life-balance",
                day: "1",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "Energy Audit",
                journalInstruction: "Before we begin, take a moment to reflect: How has your energy been flowing lately?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to your energy reflections later. Ready to uncover your unique energy pattern?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: 'Discover Your Energy Pattern',
            descriptions: [
                'Your energy isn\'t constant throughout the day. By understanding your unique rhythm, you can schedule demanding tasks when you\'re at your peak and restorative activities when you need them most.'
            ],
            buttonText: 'Start Energy Audit'
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Now that you understand your energy pattern as ${resultTitle.toLowerCase()}, let's create a plan to work with your natural rhythm.`,
                'The goal isn\'t to change who you are, but to become an energy master who knows how to flow with their natural energy cycles.'
            ],
            journalSectionProps: {
                pathTag: "work-life-balance",
                day: "1",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "Energy Audit",
                journalInstruction: "Based on your energy type and reflection questions, create your personalized energy plan below.",
                moodLabel: "How energized are you feeling?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken a powerful step toward understanding your energy patterns and creating sustainable balance. By working with your natural rhythm instead of against it, you're setting yourself up for long-term success and well-being."
            ],
            closingText: 'Your balanced energy awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardEnergy: {
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
