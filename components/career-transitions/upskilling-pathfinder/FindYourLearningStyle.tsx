import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you learned choreography, what helped you most?",
        options: [
            {
                id: 'a',
                text: 'Watching someone else perform the steps',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Counting out loud or repeating the rhythm with others',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Jumping in and trying the steps myself',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "In school, which was the most helpful?",
        options: [
            {
                id: 'a',
                text: 'Slides, diagrams, or examples on the screen',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A lively Q&A or discussion with the instructor',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Doing a short exercise or practice activity',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "When you read instructions for something new, how do you usually respond?",
        options: [
            {
                id: 'a',
                text: 'I want a picture or diagram to make sense of it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I\'d rather someone explain it out loud',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I skim it quickly and just figure it out by doing',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "In rehearsal, if you forgot a step, how would you recall it fastest?",
        options: [
            {
                id: 'a',
                text: 'Watch the video or ask the choreographer to clarify with a demo',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Remember from the counts, music, or cues someone said',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Mark the routine until it comes back into my body',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "How do you usually learn a new app or tool?",
        options: [
            {
                id: 'a',
                text: 'By watching a video tutorial',
                type: 'A'
            },
            {
                id: 'b',
                text: 'By listening to someone explain the features',
                type: 'B'
            },
            {
                id: 'c',
                text: 'By clicking around and experimenting',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Which note-taking style works best for you?",
        options: [
            {
                id: 'a',
                text: 'Color-coded notes, sketches, or mind maps',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Recording voice memos or talking it through',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I always use pen to paper, no digital notes',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "When someone gives you directions to a new place…",
        options: [
            {
                id: 'a',
                text: 'I need to see a map',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I ask them to tell me step by step',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I prefer to go and get my bearings',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "If you had to explain a new idea to someone else, how would you do it?",
        options: [
            {
                id: 'a',
                text: 'Draw a sketch or show them with visuals',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talk it through using storytelling',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Get them to try it out with me',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "When you're inspired by something new, what's your instinct?",
        options: [
            {
                id: 'a',
                text: 'Watch video explainers on the topic',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talk to someone about it or listen to a podcast',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Experiment with it right away',
                type: 'C'
            }
        ]
    }
];

const learningStyleResults: { [key: string]: QuizResult } = {
    'A': {
        type: 'A',
        title: 'Visual Learner',
        description: 'You learn best when you can see it. Whether it\'s watching a demo, video, or using visuals to connect ideas, your brain thrives on imagery. For your career pivot, prioritize YouTube videos and mapping out your ideas.',
        subtitle: 'Your mind connects best with what your eyes can see.',
        color: '#928490',
        reflectionQuestions: [
            'How can I incorporate more visual elements into my learning?',
            'What types of visual resources work best for me?',
            'How can I create my own visual learning materials?'
        ],
        journalPlaceholder: 'I learn best visually by...'
    },
    'B': {
        type: 'B',
        title: 'Auditory Learner',
        description: 'You learn best by listening and speaking. Conversations and verbal repetition help things stick. For your pivot, find a mentor to talk things through with, listen to podcasts, or record your own voice notes to organize your thoughts.',
        subtitle: 'Your ears are the gateway to understanding.',
        color: '#928490',
        reflectionQuestions: [
            'How can I include more auditory elements in my learning process?',
            'What audio resources would be most helpful for me?',
            'How can I use discussion and conversation to enhance my learning?'
        ],
        journalPlaceholder: 'I learn best through listening and discussion by...'
    },
    'C': {
        type: 'C',
        title: 'Kinesthetic Learner',
        description: 'You learn best by doing. Trial, error, and action are your teachers. You need to put concepts into practice immediately. For your pivot, jump into small projects, internships, or hands-on workshops since you\'ll learn fastest through experience.',
        subtitle: 'Your hands and body are your learning tools.',
        color: '#928490',
        reflectionQuestions: [
            'How can I create more hands-on learning opportunities?',
            'What types of practical projects would help me learn best?',
            'How can I incorporate movement and action into my study routine?'
        ],
        journalPlaceholder: 'I learn best through hands-on experience by...'
    }
};

interface FindYourLearningStyleProps {
    onComplete: (result: QuizResult) => void;
    onBack?: () => void;
}

export default function FindYourLearningStyle({ onComplete, onBack }: FindYourLearningStyleProps) {
    const handleCompleteWithStorage = async (result: QuizResult) => {
        try {
            await AsyncStorage.setItem('day2LearningStyleResult', JSON.stringify(result));
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
        quizResults: learningStyleResults,
        baseCardStyle: styles.baseCardSkills,

        // Welcome Screen Configuration
        welcomeScreen: {
            title: 'Welcome back!',
            descriptions: [
                "Today, we're going to discover how you learn best. Understanding your learning style will help you choose the most effective upskilling path for your career transition."
            ],
            journalSectionProps: {
                pathTag: "upskilling-pathfinder",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Upskilling Pathfinder",
                dayTitle: "Find Your Learning Style",
                journalInstruction: "Before we begin, take a moment to reflect: What's your relationship with learning new things? Do you enjoy it, or does it feel challenging?",
                moodLabel: "",
                saveButtonText: "Add to Journal"
            },
            welcomeHighlightText: "Knowing how you learn best will save you time and frustration as you build new skills. Ready to discover your learning style?",
            buttonText: "I'm Ready to Begin"
        },

        // Quiz Intro Screen Configuration
        quizIntroScreen: {
            title: "What's your learning style?",
            descriptions: [
                "Let's face it. Starting your career change will likely require you to learn a thing or two (at least!). So it's useful to know how you learn best so that when it comes to upskilling, you can choose the most effective path."
            ],
            buttonText: "Let's do it"
        },

        // Main Result Screen Configuration
        mainResultScreen: {
            titleTemplate: (resultTitle: string) => resultTitle,
            descriptions: [],
            buttonText: 'Continue'
        },

        // Expansive Dreamer Screen Configuration (Used as Effective Learner Screen)
        expansiveDreamerScreen: {
            title: "Here's What You Could Be:",
            expansiveTitle: "The Effective Learner",
            descriptions: [
                "The Effective Learner understands their natural strengths and uses them to their advantage. They don't fight against their learning style—they embrace it.",
                "This learner knows that when you work with your natural tendencies, learning becomes faster, more enjoyable, and more sustainable. They choose learning methods that align with how their brain processes information best.",
                "The Effective Learner doesn't just acquire skills—they master them in a way that feels natural and empowering."
            ],
            buttonText: 'Continue'
        },

        // Take Action Screen Configuration
        takeActionScreen: {
            title: 'Take Action',
            descriptions: (resultTitle: string) => [
                `Now that you know you're a ${resultTitle.toLowerCase()}, how can you use this knowledge to become a more effective learner?`,
                "Let's explore some practical ways to apply your learning style to your career transition journey."
            ],
            videoLink: 'ZsvNvXLtcC4',
            journalSectionProps: {
                pathTag: "upskilling-pathfinder",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Upskilling Pathfinder",
                dayTitle: "Find Your Learning Style",
                journalInstruction: "Based on your learning style and the video, write your action plan below.",
                moodLabel: "How are you feeling about your learning journey?",
                saveButtonText: "Add to Journal"
            },
            buttonText: 'Continue Your Journey'
        },

        // Final Completion Screen Configuration
        finalCompletionScreen: {
            title: 'Congratulations!',
            descriptions: [
                "You've taken an important step toward becoming an Effective Learner. By understanding your learning style, you're setting yourself up for success in your career transition."
            ],
            closingText: 'Remember: There\'s no right or wrong learning style. Work with your nature, not against it!',
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