import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "You get $50 extra this week. Do you:",
        options: [
            {
                id: 'a',
                text: 'Add it straight to savings',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy dance gear you\'ve been eyeing',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Treat yourself to dinner',
                type: 'Warm'
            }
        ]
    },
    {
        id: 2,
        question: "A friend invites you to brunch, but money's tight. Do you:",
        options: [
            {
                id: 'a',
                text: 'Suggest a lower-cost hang like a coffee walk',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Say yes and put it on your credit card',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Go but order the cheapest thing',
                type: 'Warm'
            }
        ]
    },
    {
        id: 3,
        question: "You're offered a gig that pays less than you hoped. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline (it undervalues your time)',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Accept because it\'s still money',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Negotiate (but feel a little unsure)',
                type: 'Warm'
            }
        ]
    },
    {
        id: 4,
        question: "Your shoes are worn but not destroyed. Do you:",
        options: [
            {
                id: 'a',
                text: 'Keep wearing them until they really need replacing',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Upgrade to a nicer brand',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Ask friends if anyone\'s selling theirs secondhand',
                type: 'Warm'
            }
        ]
    },
    {
        id: 5,
        question: "You want a new outfit for a night out. Do you:",
        options: [
            {
                id: 'a',
                text: 'Borrow or restyle what you own',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy it full price (you deserve it)',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Hit the sales rack',
                type: 'Warm'
            }
        ]
    },
    {
        id: 6,
        question: "You get a big paycheck. Do you:",
        options: [
            {
                id: 'a',
                text: 'Put some toward savings right away',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Celebrate with a splurge',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save half and use the other half on something fun',
                type: 'Warm'
            }
        ]
    },
    {
        id: 7,
        question: "Rehearsal runs late. Do you:",
        options: [
            {
                id: 'a',
                text: 'Eat leftovers at home',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Treat yourself to delivery',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Grab cheap takeout',
                type: 'Warm'
            }
        ]
    },
    {
        id: 8,
        question: "You dream of a trip abroad. Do you:",
        options: [
            {
                id: 'a',
                text: 'Plan a backpacking trip that\'s super economical',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Put it on credit so you can go sooner',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save up and plan ahead',
                type: 'Warm'
            }
        ]
    },
    {
        id: 9,
        question: "You're invited to a wedding out of town. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline, you can\'t swing it right now',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Go but stress about the cost',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Use the sinking fund you prepared for travel',
                type: 'Warm'
            }
        ]
    }
];

const spendingTemperatureResults: { [key: string]: QuizResult } = {
    'Cool': {
        type: 'Cool',
        title: 'Cool Spender',
        description: 'You\'re cautious and thoughtful with money, sometimes holding back too much. Remember: spending on things that bring joy or growth is part of a healthy budget.',
        subtitle: 'You prioritize saving but might benefit from some mindful spending.',
        color: '#6B9BD1',
        reflectionQuestions: [
            'Is it serving me to be the Cool Spender?',
            'How can I allow myself to enjoy money more while still being responsible?',
            'What would mindful spending look like for me?'
        ],
        journalPlaceholder: 'I can become more mindful by allowing myself to...'
    },
    'Warm': {
        type: 'Warm',
        title: 'Warm Spender',
        description: 'You make intentional choices... sometimes saving, sometimes spending. With a little structure, you\'ll feel even more confident.',
        subtitle: 'You balance saving and spending with thoughtful choices.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be the Warm Spender?',
            'How can I bring more intention to my spending decisions?',
            'What systems would help me feel more confident with money?'
        ],
        journalPlaceholder: 'I can enhance my mindful spending by...'
    },
    'Hot': {
        type: 'Hot',
        title: 'Hot Spender',
        description: 'You lean toward spending in the moment. That passion is great, but with more planning you can enjoy the fun *and* still hit your goals.',
        subtitle: 'You enjoy spending but could benefit from more planning.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be the Hot Spender?',
            'How can I create more balance between enjoying money and planning for the future?',
            'What small changes could help me feel more in control?'
        ],
        journalPlaceholder: 'I can create better balance by...'
    }
};

interface SpendingTemperatureCheckProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function SpendingTemperatureCheck({ onComplete, onBack }: SpendingTemperatureCheckProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('day2SpendingTemperatureResult', JSON.stringify(result));
            onComplete(result);
        } catch (error) {
            console.error('Error saving quiz result to AsyncStorage:', error);
            onComplete(result);
        }
    };

    const quizConfig: MiniQuizEngineProps & { expansiveDreamerScreen?: any } = {
        onComplete: handleCompleteWithStorage,
        onBack,
        imageSource: 'https://pivotfordancers.com/assets/logo.png',
        totalQuestions: quizQuestions.length,
        quizQuestions,
        quizResults: spendingTemperatureResults,
        baseCardStyle: styles.baseCardSpending,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Money Mindset Journey',
            descriptions: [
                "Understanding your relationship with money is the first step toward financial confidence. Let's explore your spending habits in a judgment-free way."
            ],
            journalSectionProps: {
                pathTag: "budgeting-for-dancers",
                day: "2",
                category: "finance",
                pathTitle: "Budgeting For Dancers",
                dayTitle: "Know Your Value",
                journalInstruction: "Before we begin, take a moment to reflect: What's your current relationship with money like?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to your reflections later. Ready to discover your spending temperature?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "What's Your Spending Temperature?",
            descriptions: [
                "How do you feel about spending money? Let's check your spending temperature and see if you tend to run hot (spend easily), cold (hold back), or warm (somewhere in between). Understanding your natural tendencies helps you make more intentional financial choices."
            ],
            buttonText: "Let's do it"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Expansive Dreamer Screen Configuration (Used as Mindful Spender Screen)
        expansiveDreamerScreen: {
            title: "Here's What You Could Be:",
            expansiveTitle: "The Mindful Spender",
            descriptions: [
                "The Mindful Spender is someone who makes financial decisions with both intention and awareness. They understand that money is a tool for creating the life they want, not something to fear or worship.",
                "This spender balances present enjoyment with future security, making conscious choices that align with their values and goals. They give themselves permission to spend on what truly matters while staying grounded in their financial reality.",
                "The Mindful Spender doesn't let emotions drive financial decisions. Instead, they use awareness to create healthy spending habits that support both their current needs and future aspirations."
            ],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Do you feel that ${resultTitle.toLowerCase()} describes you? Whatever thoughts come up, acknowledge them without judgment.`,
                "Now, how can you cultivate the mindful spender within?",
                "Let's explore how to create a healthier relationship with money through mindful awareness."
            ],
            journalSectionProps: {
                pathTag: "budgeting-for-dancers",
                day: "2",
                category: "finance",
                pathTitle: "Budgeting For Dancers",
                dayTitle: "Know Your Value",
                journalInstruction: "Write your reflections as a journal entry below.",
                moodLabel: "How are you feeling about money?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken an important step toward understanding your money mindset. By recognizing your spending temperature, you're building awareness that will help you make more intentional financial choices."
            ],
            closingText: 'Your mindful financial future awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardSpending: {
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