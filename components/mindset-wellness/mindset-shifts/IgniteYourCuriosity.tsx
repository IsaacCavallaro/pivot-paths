import React from 'react';
import { StyleSheet } from 'react-native';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "If you had a free hour today, what could you do (instead of scrolling)?",
        options: [
            {
                id: 'a',
                text: 'Wander a nearby neighborhood you\'ve never been to',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Watch a documentary on a random topic',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Strike up a conversation with the barista',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "Pick a way to add novelty to your week:",
        options: [
            {
                id: 'a',
                text: 'Take a different route home',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Try a new recipe',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Go to a class for something you\'ve never done',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "You overhear someone talking about a field you know nothing about. You could…",
        options: [
            {
                id: 'a',
                text: 'Ask them a question',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Look it up later',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Let it inspire a new idea of your own',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "If you could shadow someone for a day, you'd choose:",
        options: [
            {
                id: 'a',
                text: 'An artist in a medium you\'ve never tried',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A scientist or researcher',
                type: 'B'
            },
            {
                id: 'c',
                text: 'A business owner or entrepreneur',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When faced with something unfamiliar, you could try to:",
        options: [
            {
                id: 'a',
                text: 'Dive in and try it hands-on',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Observe first, then engage',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Learn by asking lots of questions',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Pick an experiment to try this week:",
        options: [
            {
                id: 'a',
                text: 'Journal one "curiosity question" a day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Say yes to the next unusual opportunity that comes your way',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Visit a place you\'d never normally go',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "Imagine going back to being a kid for a day. You'd spend it…",
        options: [
            {
                id: 'a',
                text: 'Exploring outside',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Building or making something',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking endless "why" questions',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "You get an invitation to something out of your comfort zone. You could…",
        options: [
            {
                id: 'a',
                text: 'Jump in without overthinking',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Hesitate but eventually say yes',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Bring a friend along for support',
                type: 'C'
            }
        ]
    }
];

const curiosityResults: { [key: string]: QuizResult } = {
    'A': {
        type: 'A',
        title: 'The Explorer',
        description: 'You\'re curious through *experience*. You learn by stepping into new spaces and saying yes to adventures.',
        challenge: 'Keep adding little twists to your daily routine (new routes, new foods, new people).',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be the Explorer?',
            'How can I incorporate more exploration into my daily routine?',
            'What did I learn about my curiosity style?'
        ],
        journalPlaceholder: 'I can embrace exploration by...'
    },
    'B': {
        type: 'B',
        title: 'The Learner',
        description: 'Your curiosity thrives on *knowledge*. You want to understand the "why" behind things.',
        challenge: 'Follow one random question down the rabbit hole each week and let learning be playful, not just practical.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be the Learner?',
            'How can I make learning more playful in my life?',
            'What did I learn about my curiosity style?'
        ],
        journalPlaceholder: 'I can make learning playful by...'
    },
    'C': {
        type: 'C',
        title: 'The Creator',
        description: 'You turn curiosity into *expression*. What you discover becomes fuel for making, shaping, and sharing.',
        challenge: 'Channel your curiosity into a small project. Even if it\'s messy, let it be fun.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be the Creator?',
            'How can I channel my curiosity into creative expression?',
            'What did I learn about my curiosity style?'
        ],
        journalPlaceholder: 'I can channel curiosity creatively by...'
    }
};

interface IgniteYourCuriosityProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function IgniteYourCuriosity({ onComplete, onBack }: IgniteYourCuriosityProps) {
    const quizConfig: MiniQuizEngineProps = {
        onComplete,
        onBack,
        imageSource: 'https://pivotfordancers.com/assets/logo.png',
        totalQuestions: quizQuestions.length,
        quizQuestions,
        quizResults: curiosityResults,
        baseCardStyle: styles.baseCardCuriosity,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Curiosity Journey',
            descriptions: [
                "Taking this first step to explore your curiosity is something to be truly proud of. It takes courage to look inward and discover new ways of seeing the world around you."
            ],
            journalSectionProps: {
                pathTag: "mindset-shifts",
                day: "7",
                category: "Mindset and Wellness",
                pathTitle: "Mindset Shifts",
                dayTitle: "Ignite Your Curiosity",
                journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling as you begin this journey of exploration?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to how you're feeling a bit later. But now, are you ready to discover your curiosity style?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "What's Your Curiosity Style?",
            descriptions: [
                "Curiosity isn't something you either have or don't... it's like a muscle. This quiz will stretch your curiosity and help you practice seeing the world with fresh eyes."
            ],
            buttonText: "Let's Play"
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
                `Do you feel that ${resultTitle.toLowerCase()} describes you? Or are you surprised by the results? Whatever's coming up for you, go with it. We got you!`,
                'Now, how can you unlock the curious explorer within?!',
                'Let\'s explore how curiosity can transform your perspective and open up new possibilities.'
            ],
            videoLink: 'ZsvNvXLtcC4', // YouTube video ID directly
            journalSectionProps: {
                pathTag: "mindset-shifts",
                day: "7",
                category: "Mindset and Wellness",
                pathTitle: "Mindset Shifts",
                dayTitle: "Ignite Your Curiosity",
                journalInstruction: "As you're reflecting, write your thoughts as a journal entry below.",
                moodLabel: "How are you feeling?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken an important step toward becoming more curious and open to the world around you. By understanding your curiosity style, you're already opening yourself up to new experiences and perspectives."
            ],
            closingText: 'Your curious journey awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardCuriosity: {
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
