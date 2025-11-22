import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "Did you schedule time for hobbies this week?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'Not yet',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 2,
        question: "Did you notice energy dips or times you felt drained?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'low'
            },
            {
                id: 'b',
                text: 'Sometimes',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'high'
            }
        ]
    },
    {
        id: 3,
        question: "Did you practice at least one boundary (with work, people, or yourself)?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'I thought about it',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 4,
        question: "Did you try a movement or workout you actually enjoyed?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: "It's on the schedule",
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 5,
        question: "Did you make time for social connection (friends, family, or community)?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'I have plans to',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 6,
        question: "Did you set aside quiet time for yourself (journaling, rest, reading, or just doing nothing)?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'Not yet',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 7,
        question: "Did you feel like \"yourself\" outside of work this week?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'Somewhat',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 8,
        question: "When work got busy, were you able to keep balance in at least one area (movement, hobbies, or rest)?",
        options: [
            {
                id: 'a',
                text: 'Yes',
                type: 'high'
            },
            {
                id: 'b',
                text: 'I tried to',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'No',
                type: 'low'
            }
        ]
    },
    {
        id: 9,
        question: "How balanced do you feel overall, on a scale of 1–5?",
        options: [
            {
                id: 'a',
                text: '5 (Very balanced)',
                type: 'high'
            },
            {
                id: 'b',
                text: '3 (Somewhat balanced)',
                type: 'medium'
            },
            {
                id: 'c',
                text: '1 (Not balanced at all)',
                type: 'low'
            }
        ]
    },
    {
        id: 10,
        question: "Looking back, how proud are you of the effort you put in?",
        options: [
            {
                id: 'a',
                text: 'Incredibly proud',
                type: 'high'
            },
            {
                id: 'b',
                text: 'I know I did well',
                type: 'medium'
            },
            {
                id: 'c',
                text: 'I can do better',
                type: 'low'
            }
        ]
    }
];

const reflectionResults: { [key: string]: QuizResult } = {
    'high': {
        type: 'high',
        title: "You're Finding Your Flow",
        description: "You're creating real space for balance in your life. It's working and the best part is, you're proving it's possible. Keep nurturing what energizes you and protecting what matters.",
        subtitle: 'Your balance journey is paying off—keep trusting the process.',
        color: '#928490',
        reflectionQuestions: [
            "What's one area where I feel I made real progress this week?",
            "What's one small adjustment I can make for next week?"
        ],
        journalPlaceholder: "Reflect on your progress and adjustments..."
    },
    'medium': {
        type: 'medium',
        title: "You're Making Progress",
        description: "Balance is a process, and you're building it piece by piece. You're noticing shifts, but there's still room to experiment. Keep testing small changes until you find your sweet spot.",
        subtitle: 'Every small step counts—you\'re moving in the right direction.',
        color: '#928490',
        reflectionQuestions: [
            "What's one area where I feel I made real progress this week?",
            "What's one small adjustment I can make for next week?"
        ],
        journalPlaceholder: "Reflect on your progress and adjustments..."
    },
    'low': {
        type: 'low',
        title: "You're Ready to Reset",
        description: "This week showed you what isn't working… which is just as valuable as knowing what *is*. But you didn't fail, you're just not used to it. Try one new boundary, one hobby, or one rest ritual next week to reset your balance.",
        subtitle: 'Awareness is the first step toward meaningful change.',
        color: '#647C90',
        reflectionQuestions: [
            "What's one area where I feel I made real progress this week?",
            "What's one small adjustment I can make for next week?"
        ],
        journalPlaceholder: "Reflect on your progress and adjustments..."
    }
};

interface ReflectAndAdjustProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function ReflectAndAdjust({ onComplete, onBack }: ReflectAndAdjustProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('day7ReflectAndAdjustResult', JSON.stringify(result));
            onComplete(result);
        } catch (error) {
            console.error('Error saving reflection result to AsyncStorage:', error);
            onComplete(result);
        }
    };

    const quizConfig: MiniQuizEngineProps = {
        onComplete: handleCompleteWithStorage,
        onBack,
        imageSource: 'https://pivotfordancers.com/assets/logo.png',
        totalQuestions: quizQuestions.length,
        quizQuestions,
        quizResults: reflectionResults,
        baseCardStyle: styles.baseCardReflect,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Reflection',
            descriptions: [
                "You've tried new things this week to bring more balance into your life. Taking time to reflect on your progress is a powerful way to understand what's working and what you might want to adjust moving forward."
            ],
            journalSectionProps: {
                pathTag: "work-life-balance",
                day: "7",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "Reflect And Adjust",
                journalInstruction: "Before we begin, take a moment to check in with yourself. How are you feeling about your work-life balance journey so far?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to how you're feeling later. Ready to reflect on your week and see what's working?",
            buttonText: "I'm Ready to Reflect"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "Reflect & Adjust",
            descriptions: [
                "You've tried new things this week to bring more balance into your life. Let's reflect on how it felt. Your answers will help you see what's working and what to adjust."
            ],
            buttonText: "Start Reflection"
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
                `Your reflection shows that ${resultTitle.toLowerCase()}. This insight is valuable for understanding your current balance and making intentional adjustments.`,
                "Now let's capture your thoughts and plan for the week ahead."
            ],
            journalSectionProps: {
                pathTag: "work-life-balance",
                day: "7",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "Reflect And Adjust",
                journalInstruction: "Reflect on these questions based on your results:",
                moodLabel: "How are you feeling about your results?",
                saveButtonText: "Add Entry"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Keep Going!',
            descriptions: [
                "Finding balance isn't something you do once. It's something you constantly have to rediscover. And for us dancers, putting our own wants and needs at the forefront can feel particularly unfamiliar.",
                "But keep going, you're on the right track."
            ],
            closingText: 'Your balanced future awaits!',
            buttonText: 'Mark As Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardReflect: {
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