import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you get a raise, what's the first thing you think of?",
        options: [
            {
                id: 'a',
                text: "Finally, I can save more.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I'll treat myself just this once.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "Time to upgrade my wardrobe/apartment/phone.",
                type: 'high'
            }
        ]
    },
    {
        id: 2,
        question: "You've been eyeing a new piece of furniture or tech. What's your process?",
        options: [
            {
                id: 'a',
                text: "Wait, research, and only buy if it fits my budget.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I'll buy it soon, but only if there's a sale.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "I usually just go for it. I deserve it.",
                type: 'high'
            }
        ]
    },
    {
        id: 3,
        question: "Do you know how much your monthly expenses actually cost?",
        options: [
            {
                id: 'a',
                text: "Yes, down to the dollar.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I have a ballpark idea.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "Not really. I just hope my card doesn't decline.",
                type: 'high'
            }
        ]
    },
    {
        id: 4,
        question: "If your side gigs suddenly stopped, could you cover your living expenses with your current income?",
        options: [
            {
                id: 'a',
                text: "Yes, easily.",
                type: 'low'
            },
            {
                id: 'b',
                text: "Probably, but it would be tight.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "No, I rely on multiple streams to get by.",
                type: 'high'
            }
        ]
    },
    {
        id: 5,
        question: "When your friends suggest an overseas trip, what do you do?",
        options: [
            {
                id: 'a',
                text: "I check my budget first.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I say yes most of the time, but I try to cut back elsewhere.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "I usually say yes without thinking.",
                type: 'high'
            }
        ]
    },
    {
        id: 6,
        question: "What happens to your savings rate when your income goes up?",
        options: [
            {
                id: 'a',
                text: "I increase it.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I keep it the same.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "Honestly… it usually goes down.",
                type: 'high'
            }
        ]
    },
    {
        id: 7,
        question: "What's your relationship with credit card balances?",
        options: [
            {
                id: 'a',
                text: "I pay them off in full every month.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I carry a small balance sometimes.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "I carry balances often, but I plan to pay them off later.",
                type: 'high'
            }
        ]
    },
    {
        id: 8,
        question: "When you compare yourself to friends or colleagues, how do you feel?",
        options: [
            {
                id: 'a',
                text: "I'm focused on my own goals.",
                type: 'low'
            },
            {
                id: 'b',
                text: "I sometimes feel the pressure to keep up.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "I often upgrade my lifestyle to match theirs.",
                type: 'high'
            }
        ]
    },
    {
        id: 9,
        question: "If you doubled your income tomorrow, what would you do?",
        options: [
            {
                id: 'a',
                text: "Automate savings and stick to my current lifestyle.",
                type: 'low'
            },
            {
                id: 'b',
                text: "Save some, but definitely spend some too.",
                type: 'moderate'
            },
            {
                id: 'c',
                text: "Upgrade nearly everything — I've been waiting for this moment!",
                type: 'high'
            }
        ]
    }
];

const lifestyleResults: { [key: string]: QuizResult } = {
    'low': {
        type: 'low',
        title: 'Low Risk of Lifestyle Creep',
        description: "You're mindful of your expenses and stay grounded, even when your income grows. In fact, you're probably more at risk of underspending and holding too tightly to the purse strings. Spending is a skill too and it might help to give yourself some guilt-free options.",
        subtitle: 'Your financial awareness is your greatest strength.',
        color: '#5A7D7B',
        reflectionQuestions: [
            'How can I maintain my financial awareness while allowing for some guilt-free spending?',
            'What areas of my life could benefit from more intentional investment?',
            'How can I balance saving with enjoying the present moment?'
        ],
        journalPlaceholder: 'I can maintain financial awareness while enjoying life by...'
    },
    'moderate': {
        type: 'moderate',
        title: 'Moderate Risk of Lifestyle Creep',
        description: "You're doing okay, but there are a few 'treat yourself' habits that can creep up on you. Focus on setting rules for when you'll increase expenses and when you'll bank the difference instead.",
        subtitle: 'A little structure can turn good habits into great ones.',
        color: '#928490',
        reflectionQuestions: [
            'What spending habits tend to creep up on me the most?',
            'How can I create better boundaries around discretionary spending?',
            'What systems would help me stay consistent with my financial goals?'
        ],
        journalPlaceholder: 'I can create better financial structure by...'
    },
    'high': {
        type: 'high',
        title: 'High Risk of Lifestyle Creep',
        description: "Your lifestyle is rising right alongside (or faster than) your income. That can feel fun in the moment, but it leaves you vulnerable long-term. Try setting a 'cap' on upgrades and funneling extra money toward savings or investments first. You can still spend, but make sure your bases are covered.",
        subtitle: 'Awareness is the first step toward meaningful change.',
        color: '#C76B6B',
        reflectionQuestions: [
            'What triggers my impulse to upgrade my lifestyle?',
            'How can I create a "spending cap" for different categories?',
            'What small changes would help me feel more in control of my finances?'
        ],
        journalPlaceholder: 'I can start building better financial habits by...'
    }
};

interface LifestyleCreepRiskMeterProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function LifestyleCreepRiskMeter({ onComplete, onBack }: LifestyleCreepRiskMeterProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('day6LifestyleCreepResult', JSON.stringify(result));
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
        quizResults: lifestyleResults,
        baseCardStyle: styles.baseCard,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Financial Assessment',
            descriptions: [
                "Taking this honest look at your spending habits is a powerful step toward financial freedom. Understanding your relationship with money helps you build a future that supports your dreams, not just your lifestyle."
            ],
            journalSectionProps: {
                pathTag: "financial-futureproofing",
                day: "6",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Lifestyle Creep Risk Meter",
                journalInstruction: "Before we begin, let's check in with your current feelings about money and spending. How are you feeling about your financial habits right now?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to these reflections later. Ready to discover your lifestyle creep risk level?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "Lifestyle Creep Risk Meter",
            descriptions: [
                "Lifestyle creep happens when your income rises, but your spending rises right alongside it (or faster). This quiz will help you see how at risk you are, and what you can do to keep more of your hard-earned money.",
                "Answer honestly! This is just for your awareness!"
            ],
            buttonText: "Start Assessment"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Expansive Dreamer Screen Configuration (Used as Financial Freedom Screen)
        expansiveDreamerScreen: {
            title: "Here's What You're Working Toward:",
            expansiveTitle: "Financial Freedom",
            descriptions: [
                "Financial freedom isn't about having unlimited money—it's about having control over your money so it supports the life you want to live.",
                "It means your spending aligns with your values, you have security for the future, and you can make choices based on what matters to you, not just what you can afford.",
                "By understanding your lifestyle creep risk, you're already taking the first step toward building this kind of freedom."
            ],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Your assessment shows you have a ${resultTitle.toLowerCase()} of lifestyle creep. This awareness is valuable for building healthier financial habits.`,
                "Let's explore how you can use this insight to move toward greater financial freedom."
            ],
            journalSectionProps: {
                pathTag: "financial-futureproofing",
                day: "6",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Lifestyle Creep Risk Meter",
                journalInstruction: "Based on your results and what you've learned, what's one small change you can make to improve your financial habits?",
                moodLabel: "How are you feeling about your financial future?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken an important step toward understanding your financial habits and building awareness around lifestyle creep.",
                "Remember: Financial freedom is a journey, not a destination. Each small, intentional choice brings you closer to the financial security and peace of mind you deserve."
            ],
            closingText: 'Your financially aware future awaits!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCard: {
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