import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When someone asks what you want to do after dance, you usually…",
    options: [
      {
        id: 'a',
        text: 'Say, "I don\'t know yet," but worry about it later.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Say something you think is realistic and achievable.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Give a vague answer or make a joke to avoid it.',
        type: 'C'
      }
    ]
  },
  {
    id: 2,
    question: "Which statement feels most true right now?",
    options: [
      {
        id: 'a',
        text: 'I need help quieting the self-doubt.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I want more clarity about what\'s possible.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I\'ve already limited myself before I begin.',
        type: 'C'
      }
    ]
  },
  {
    id: 3,
    question: "Your vision for the future is…",
    options: [
      {
        id: 'a',
        text: 'Blurry, chaotic, or overwhelming.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Structured with clear, safe steps.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Boring. It doesn\'t feel exciting.',
        type: 'C'
      }
    ]
  },
  {
    id: 4,
    question: "You're scrolling Instagram and see a former dancer thriving in a new career. Your first thought is...",
    options: [
      {
        id: 'a',
        text: 'I could never pull that off.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'How do I get there?',
        type: 'B'
      },
      {
        id: 'c',
        text: 'That\'s cool but not for me.',
        type: 'C'
      }
    ]
  },
  {
    id: 5,
    question: "What's your relationship to risk?",
    options: [
      {
        id: 'a',
        text: 'It stresses me out, so I avoid it.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I calculate every detail before deciding.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I like the idea of risk, but rarely go for it.',
        type: 'C'
      }
    ]
  },
  {
    id: 6,
    question: "When you imagine your \"dream life\", what do you see?",
    options: [
      {
        id: 'a',
        text: 'A quiet life that doesn\'t overwhelm me.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'A solid plan with job security and peace.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I can barely picture anything specific.',
        type: 'C'
      }
    ]
  },
  {
    id: 7,
    question: "Which of these feels most frustrating right now?",
    options: [
      {
        id: 'a',
        text: 'I don\'t know what I really want.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I know what I want, but I don\'t believe I can have it.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I\'ve stopped letting myself want big things.',
        type: 'C'
      }
    ]
  },
  {
    id: 8,
    question: "When you talk about your goals out loud, you…",
    options: [
      {
        id: 'a',
        text: 'Get nervous and downplay them.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'Say only what sounds "reasonable".',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Don\'t talk about them at all.',
        type: 'C'
      }
    ]
  },
  {
    id: 9,
    question: "What do you need most right now?",
    options: [
      {
        id: 'a',
        text: 'Confidence and permission to want more.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'A starting point and actionable steps.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'Help dreaming bigger or differently.',
        type: 'C'
      }
    ]
  },
  {
    id: 10,
    question: "Which phrase resonates with you most?",
    options: [
      {
        id: 'a',
        text: 'I\'m afraid of failing.',
        type: 'A'
      },
      {
        id: 'b',
        text: 'I don\'t want to be unrealistic.',
        type: 'B'
      },
      {
        id: 'c',
        text: 'I don\'t know what\'s next.',
        type: 'C'
      }
    ]
  }
];

const dreamerResults: { [key: string]: QuizResult } = {
  'A': {
    type: 'A',
    title: 'The Anxious Dreamer',
    description: 'You\'re full of potential, but fear or uncertainty has been holding you back. Whether it\'s perfectionism, imposter syndrome, or fear of judgment, it\'s hard to dream clearly when anxiety gets loud. This path will help you replace "what ifs" with grounded confidence.',
    subtitle: 'Your dream life doesn\'t need to be perfect. It just needs to be yours.',
    color: '#928490',
    reflectionQuestions: [
      'Is it serving me to be the Anxious Dreamer?',
      'How did Monica turn her anxiety about the future into real change?',
      'What did I learn from Monica\'s story?'
    ],
    journalPlaceholder: 'Monica channelled anxious feelings into change by...'
  },
  'B': {
    type: 'B',
    title: 'The Practical Dreamer',
    description: "You're thoughtful, grounded, and great at making realistic decisions. But sometimes you forget how expansive your future could be. You might downplay your dreams to protect yourself from disappointment. This path will help you reconnect with possibility while still honoring your practical nature.",
    subtitle: 'You don\'t need to let go of logic to follow your dreams. You just need a little more permission to dream bigger.',
    color: '#928490',
    reflectionQuestions: [
      'Is it serving me to be the Practical Dreamer?',
      'How did Monica take practical steps on her journey that helped her dream bigger?',
      'What did I learn from Monica\'s story?'
    ],
    journalPlaceholder: 'Monica took practical steps by...'
  },
  'C': {
    type: 'C',
    title: 'The Limited Dreamer',
    description: 'You\'ve been dreaming small, maybe without even realizing it. Whether due to burnout, self-protection, or past letdowns, your imagination needs a little spark. This path is your invitation to let yourself want more.',
    subtitle: 'Playing small won\'t keep you safe, it just keeps you stuck. Let\'s expand your vision together.',
    color: '#928490',
    reflectionQuestions: [
      'Is it serving me to be the Limited Dreamer?',
      'How did Monica challenge her limiting beliefs?',
      'What did I learn from Monica\'s story?'
    ],
    journalPlaceholder: 'Monica challenged her limiting beliefs by...'
  }
};

interface DreamerTypeQuizProps {
  onComplete: (result: QuizResult) => void;
  onBack?: () => void;
}

export default function DreamerTypeQuiz({ onComplete, onBack }: DreamerTypeQuizProps) {
  const handleCompleteWithStorage = async (result: QuizResult) => {
    try {
      await AsyncStorage.setItem('day1SkillsQuizResult', JSON.stringify(result));
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
    quizResults: dreamerResults,
    baseCardStyle: styles.baseCardSkills,

    // Welcome Screen Configuration
    welcomeScreen: {
      title: 'Welcome to Your Path',
      descriptions: [
        "Taking this first step is something to be truly proud of. It takes courage to look inward and explore what might be holding you back from the future you deserve post-dance."
      ],
      journalSectionProps: {
        pathTag: "discover-dream-life",
        day: "1",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Dream Bigger Game",
        journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling as you begin this journey?",
        moodLabel: "",
        saveButtonText: "Add to Journal"
      },
      welcomeHighlightText: "We'll come back to how you're feeling a bit later. But now, are you ready to find out what kind of dreamer you are?",
      buttonText: "I'm Ready to Begin"
    },

    // Quiz Intro Screen Configuration
    quizIntroScreen: {
      title: "What kind of dreamer are you?",
      descriptions: [
        "It's a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let's start by figuring out your \"Dreamer Type\" to unlock what could be holding you back."
      ],
      buttonText: "Let's do it"
    },

    // Main Result Screen Configuration
    mainResultScreen: {
      titleTemplate: (resultTitle: string) => resultTitle,
      descriptions: [],
      buttonText: 'Continue'
    },

    // Expansive Dreamer Screen Configuration
    expansiveDreamerScreen: {
      title: "Here's What You Could Be:",
      expansiveTitle: "The Expansive Dreamer",
      descriptions: [
        "The Expansive Dreamer is someone who allows their imagination to be bold without apology.",
        "This dreamer understands that their past experiences in dance have given them unique strengths: discipline, creativity, resilience, and the ability to envision something before it exists. They use these strengths to build a future that excites them on their own terms.",
        "The Expansive Dreamer doesn't let fear of the unknown stop them. Instead, they see possibility where others see obstacles, and they trust that each step forward reveals the next."
      ],
      buttonText: 'Continue'
    },

    // Take Action Screen Configuration
    takeActionScreen: {
      title: 'Take Action',
      descriptions: (resultTitle: string) => [
        `Do you feel that ${resultTitle.toLowerCase()} describes you? Or are you bothered by the results? Whatever's coming up for you, go with it. We got you!`,
        'Now, how can you unlock the expansive dreamer within?!',
        "Let's hear from a dancer who gave herself permission to be the expansive dreamer and learn from her."
      ],
      videoLink: 'ZsvNvXLtcC4',
      journalSectionProps: {
        pathTag: "discover-dream-life",
        day: "day-1",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Dream Bigger Game",
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
        "You've taken the first step toward becoming an Expansive Dreamer. By understanding your current dreaming style, you're already opening yourself up to new possibilities beyond your dance dreams."
      ],
      closingText: 'Your expansive future awaits!',
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