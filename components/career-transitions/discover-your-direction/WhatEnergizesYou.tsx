import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "At the end of a day, you feel most satisfied if you've…",
        options: [
            {
                id: 'a',
                text: 'Helped people directly',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Solved a tough problem',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Created something new',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Practiced and improved a skill',
                type: 'D'
            }
        ]
    },
    {
        id: 2,
        question: "Which type of environment excites you most?",
        options: [
            {
                id: 'a',
                text: 'A buzzing, people-filled space',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A quiet zone where you can focus',
                type: 'B'
            },
            {
                id: 'c',
                text: 'A flexible setting with freedom',
                type: 'C'
            },
            {
                id: 'd',
                text: 'A structured space with clear rules',
                type: 'D'
            }
        ]
    },
    {
        id: 3,
        question: "When you lose track of time, what are you usually doing?",
        options: [
            {
                id: 'a',
                text: 'Talking and connecting',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Analyzing or organizing',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Designing or brainstorming',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Training or mastering a technique',
                type: 'D'
            }
        ]
    },
    {
        id: 4,
        question: "Which kind of project feels fun, not draining?",
        options: [
            {
                id: 'a',
                text: 'Organizing a group event',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Researching or troubleshooting',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Making art, writing, or content',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Practicing until you nail it',
                type: 'D'
            }
        ]
    },
    {
        id: 5,
        question: "When you face a challenge, your first instinct is to…",
        options: [
            {
                id: 'a',
                text: 'Ask for input or advice',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Break it into smaller parts',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Get creative with a new approach',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Keep at it until you master it',
                type: 'D'
            }
        ]
    },
    {
        id: 6,
        question: "What type of feedback energizes you?",
        options: [
            {
                id: 'a',
                text: '"You really made me feel supported."',
                type: 'A'
            },
            {
                id: 'b',
                text: '"You solved that perfectly."',
                type: 'B'
            },
            {
                id: 'c',
                text: '"That was so creative!"',
                type: 'C'
            },
            {
                id: 'd',
                text: '"Your progress is amazing."',
                type: 'D'
            }
        ]
    },
    {
        id: 7,
        question: "Which role in a group excites you most?",
        options: [
            {
                id: 'a',
                text: 'The one connecting people',
                type: 'A'
            },
            {
                id: 'b',
                text: 'The one organizing details',
                type: 'B'
            },
            {
                id: 'c',
                text: 'The one brainstorming ideas',
                type: 'C'
            },
            {
                id: 'd',
                text: 'The one practicing skills until solid',
                type: 'D'
            }
        ]
    },
    {
        id: 8,
        question: "What excites you most about starting something new?",
        options: [
            {
                id: 'a',
                text: 'Meeting new people',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Learning how it all works',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Trying new creative ideas',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Building up skills over time',
                type: 'D'
            }
        ]
    },
    {
        id: 9,
        question: "Which \"win\" would leave you buzzing?",
        options: [
            {
                id: 'a',
                text: 'Seeing someone light up from your help',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Cracking a code or fixing something broken',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Bringing a vision to life',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Reaching a new level of mastery',
                type: 'D'
            }
        ]
    },
    {
        id: 10,
        question: "Imagine you land your dream role. The part that keeps you motivated is…",
        options: [
            {
                id: 'a',
                text: 'Connecting and uplifting others',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Solving problems and improving systems',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Innovating and creating',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Growing stronger and more skilled every day',
                type: 'D'
            }
        ]
    }
];

const energizerResults: { [key: string]: QuizResult } = {
    'A': {
        type: 'A',
        title: 'The Connector',
        description: 'You thrive on people, support, and collaboration. Careers in teaching, coaching, communication, or leadership could light you up.',
        subtitle: 'Your superpower is bringing people together and lifting them up.',
        color: '#928490',
        reflectionQuestions: [
            'How can I incorporate more connection into my daily work?',
            'What environments help me feel most energized around people?',
            'How can my natural ability to connect serve me in new careers?'
        ],
        journalPlaceholder: 'I feel most energized when connecting with others by...'
    },
    'B': {
        type: 'B',
        title: 'The Problem-Solver',
        description: 'You\'re fueled by analysis and clarity. Data, strategy, and troubleshooting roles could feel natural and satisfying.',
        subtitle: 'You see puzzles where others see problems, and that\'s your strength.',
        color: '#928490',
        reflectionQuestions: [
            'What types of problems do I enjoy solving most?',
            'How can I create more focused, analytical work in my life?',
            'What systems or processes could benefit from my problem-solving skills?'
        ],
        journalPlaceholder: 'Solving problems energizes me because...'
    },
    'C': {
        type: 'C',
        title: 'The Creator',
        description: 'You\'re energized by imagination and making new things. Creative industries, design, content, and innovation are strong paths for you.',
        subtitle: 'Your ideas and vision have the power to change the world.',
        color: '#928490',
        reflectionQuestions: [
            'What creative outlets bring me the most joy?',
            'How can I make space for innovation in my daily routine?',
            'What ideas have I been wanting to bring to life?'
        ],
        journalPlaceholder: 'My creative energy comes alive when...'
    },
    'D': {
        type: 'D',
        title: 'The Builder',
        description: 'You thrive on growth and steady mastery. Roles with training opportunities, unique challenges, or long-term development will keep you motivated.',
        subtitle: 'Every day is a chance to get stronger, and that drives you forward.',
        color: '#928490',
        reflectionQuestions: [
            'What skills am I most excited to develop further?',
            'How can I create a structured path for my growth?',
            'What mastery would feel most fulfilling to achieve?'
        ],
        journalPlaceholder: 'Building mastery energizes me through...'
    }
};

interface WhatEnergizesYouProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function WhatEnergizesYou({ onComplete, onBack }: WhatEnergizesYouProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('whatEnergizesYouResult', JSON.stringify(result));
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
        quizResults: energizerResults,
        baseCardStyle: styles.baseCardEnergizes,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome to Your Energy Discovery',
            descriptions: [
                "Understanding what truly energizes you is key to building a career that feels fulfilling and sustainable. Let's explore the activities and environments that light you up."
            ],
            journalSectionProps: {
                pathTag: "map-your-direction",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Map Your Direction",
                dayTitle: "What Energizes You?",
                journalInstruction: "Before we begin, let's take a moment to check in with yourself. What activities have felt most energizing to you recently?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "We'll come back to how you're feeling a bit later. But now, are you ready to discover what truly energizes you?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "What Energizes You?",
            descriptions: [
                "Some work drains you. Other work fuels you. This quiz helps you spot the tasks, environments, and wins that give you real energy, so you can steer your career in that direction."
            ],
            buttonText: "Let's find out"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Expansive Dreamer Screen Configuration (Used as Energy Guide Screen)
        expansiveDreamerScreen: {
            title: "Here's How You Can Use Your Energy:",
            expansiveTitle: "Your Personal Energy Guide",
            descriptions: [
                "Understanding your energy type is the first step toward building a career that doesn't just work for you, but works with you.",
                "Your dance background has given you incredible discipline and awareness of your body and mind. Now you can use that same awareness to notice what energizes you in your career.",
                "When you align your work with your natural energy sources, you'll find yourself more engaged, motivated, and fulfilled in your daily life."
            ],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Now that you know you're ${resultTitle.toLowerCase()}, how can you use this knowledge to shape your career path?`,
                "Let's hear from someone who learned to follow their energy and built a career that truly lights them up."
            ],
            videoLink: 'ZsvNvXLtcC4',
            journalSectionProps: {
                pathTag: "map-your-direction",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Map Your Direction",
                dayTitle: "What Energizes You?",
                journalInstruction: "As you're watching, write your reflections as a journal entry below.",
                moodLabel: "How are you feeling?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken an important step toward understanding what truly energizes you. By recognizing your natural energy sources, you're better equipped to build a career that feels fulfilling and sustainable."
            ],
            closingText: 'Your energy is your compass - follow it to work that lights you up!',
            buttonText: 'Mark as Complete'
        }
    };

    return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
    baseCardEnergizes: {
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