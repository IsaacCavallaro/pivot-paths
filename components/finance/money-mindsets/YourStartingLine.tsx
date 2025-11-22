import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you think about money, what's your first reaction?",
        options: [
            {
                id: 'a',
                text: 'Stress and avoidance',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Neutral, I don\'t think about it much',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Motivation and possibility',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "How often do you check your bank account?",
        options: [
            {
                id: 'a',
                text: 'Rarely, I\'d rather not look',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A few times a month',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Weekly or daily',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "Do you know how much you spend in an average week?",
        options: [
            {
                id: 'a',
                text: 'Not really, I just hope it balances',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Sort of, I have a ballpark idea',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I track it or budget regularly',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "Savings… where are you at?",
        options: [
            {
                id: 'a',
                text: '$0 or close to it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A little, but not consistent',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I save regularly and have a cushion',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When you get paid for gigs, what happens next?",
        options: [
            {
                id: 'a',
                text: 'Money disappears before I know it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I cover essentials first, then figure the rest out',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I intentionally allocate it (savings, bills, fun, etc.)',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Negotiating pay makes me feel…",
        options: [
            {
                id: 'a',
                text: 'Terrified, I\'d never ask',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Nervous, but I might try if I had a script',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Confident, I know my worth',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "If a $500 emergency bill came up, what would you do?",
        options: [
            {
                id: 'a',
                text: 'Panic, I\'d have no idea',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Put it on a credit card or ask for help',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Pay from savings or planned funds',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "How do you feel about dancers and money?",
        options: [
            {
                id: 'a',
                text: 'We\'re doomed to be underpaid',
                type: 'A'
            },
            {
                id: 'b',
                text: 'It\'s possible to earn more, but I don\'t see myself making a ton of money',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Dance skills are valuable and I can leverage them',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "Do you set financial goals?",
        options: [
            {
                id: 'a',
                text: 'Never, feels pointless',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Occasionally, but I don\'t stick with them',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I set and track them',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "When you picture your future, what role does money play?",
        options: [
            {
                id: 'a',
                text: 'I avoid thinking about it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I hope to have enough, but I\'m unsure how',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I see money as a tool for freedom and choices',
                type: 'C'
            }
        ]
    }
];

const financialResults: { [key: string]: QuizResult } = {
    'A': {
        type: 'A',
        title: 'The Avoider',
        description: 'You\'ve been avoiding money because it feels overwhelming which is totally normal in dance culture. But avoidance costs headroom. Your next step isn\'t a complicated budget… it\'s simply looking into it. Build awareness with tiny, shame-free check-ins. Once you face your numbers, you\'ll start to feel lighter.',
        subtitle: 'Awareness is your first step toward financial freedom.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be The Avoider?',
            'What would change if I faced my financial situation without shame?',
            'What small step can I take today to build financial awareness?'
        ],
        journalPlaceholder: 'I can start building financial awareness by...'
    },
    'B': {
        type: 'B',
        title: 'The Juggler',
        description: 'You\'ve got some systems, but they\'re patchy. You pay bills and try to save, but it\'s inconsistent, so money still feels stressful. The good news? You\'re already halfway there. With a bit more structure, you\'ll free up huge mental space.',
        subtitle: 'Consistency turns juggling into mastery.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be The Juggler?',
            'How can I create more consistency in my financial habits?',
            'What system would help me feel more in control?'
        ],
        journalPlaceholder: 'I can create more consistency by...'
    },
    'C': {
        type: 'C',
        title: 'The Builder',
        description: 'You\'ve already done some work with money. You track, plan, or save regularly — and now it\'s time to level up. For you, headroom comes from asking for more (negotiating, raising rates, growing income streams). You\'re ready to use money as a tool, not just survival fuel.',
        subtitle: 'Your foundation is set—now build your financial future.',
        color: '#928490',
        reflectionQuestions: [
            'Is it serving me to be The Builder?',
            'How can I leverage my current financial habits to create more opportunities?',
            'What financial goal would excite me to work towards?'
        ],
        journalPlaceholder: 'I can leverage my current habits to...'
    }
};

interface YourStartingLineProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function YourStartingLine({ onComplete, onBack }: YourStartingLineProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('day2MoneyMindsetsResult', JSON.stringify(result));
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
        quizResults: financialResults,
        baseCardStyle: styles.baseCardSkills,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Money Journey',
            descriptions: [
                "Taking this first step towards understanding your money mindset is something to be truly proud of. It takes courage to look at your financial habits and explore what might be holding you back from financial freedom."
            ],
            journalSectionProps: {
                pathTag: "money-mindsets",
                day: "2",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Know Your Value",
                journalInstruction: "Before we begin, let's take a moment to check in with yourself. How do you feel about money right now?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to how you're feeling a bit later. But now, are you ready to discover your financial starting line?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "What's your financial starting line?",
            descriptions: [
                "Before you can move forward with money, it helps to know where you're standing. Answer these 10 quick questions to uncover your money starting line. No shame, just awareness. Let's go."
            ],
            buttonText: "Start Quiz"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Expansive Dreamer Screen Configuration (Used as Financially Free Screen)
        expansiveDreamerScreen: {
            title: "Here's What You Could Be:",
            expansiveTitle: "The Financially Free",
            descriptions: [
                "The Financially Free dancer is someone who sees money as a tool for creating the life they want without stress or shame.",
                "This mindset understands that financial awareness brings freedom, not restriction. They use their dance discipline to create consistent financial habits that support their artistic journey and future goals.",
                "The Financially Free dancer doesn't avoid money conversations or opportunities. Instead, they see financial literacy as another skill to master, giving them more choices and reducing stress in their dance career."
            ],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Do you feel that ${resultTitle.toLowerCase()} describes you? Whatever's coming up for you, go with it. We got you!`,
                "Now, how can you unlock the financially free mindset within?!",
                "Let's explore how to transform your relationship with money starting today."
            ],
            videoLink: 'ZsvNvXLtcC4',
            journalSectionProps: {
                pathTag: "money-mindsets",
                day: "2",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Know Your Value",
                journalInstruction: "As you're reflecting, write your thoughts as a journal entry below.",
                moodLabel: "How are you feeling about money now?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken the first step toward becoming Financially Free. By understanding your current money mindset, you're already opening yourself up to new financial possibilities and reducing money-related stress."
            ],
            closingText: 'Your financially free future awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardSkills: {
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