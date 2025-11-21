import React from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MiniQuizEngine from '@/components/shared/mini-quiz-engine/MiniQuizEngine';
import { MiniQuizEngineProps, QuizQuestion, QuizResult } from '@/types/miniQuizEngine';

const valuesQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "When you imagine your ideal day in the life, what's happening?",
    options: [
      {
        id: 'a',
        text: "I'm doing something expressive or artistic",
        type: 'creativity'
      },
      {
        id: 'b',
        text: "I'm setting my own schedule",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "I have a worthy goal to work towards",
        type: 'growth'
      }
    ]
  },
  {
    id: 2,
    question: "What part of dancing do you miss most when you're away from it?",
    options: [
      {
        id: 'a',
        text: "The ability to express my inner world and create something",
        type: 'creativity'
      },
      {
        id: 'b',
        text: "The structure and discipline of knowing what's expected",
        type: 'stability'
      },
      {
        id: 'c',
        text: "The connection to a group or shared goal",
        type: 'connection'
      }
    ]
  },
  {
    id: 3,
    question: "When dance feels unfulfilling, what's usually missing?",
    options: [
      {
        id: 'a',
        text: "A sense of personal growth or evolution",
        type: 'growth'
      },
      {
        id: 'b',
        text: "Flexibility in how I engage with it",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "Feeling disconnected in the ultra-competitive environment",
        type: 'connection'
      }
    ]
  },
  {
    id: 4,
    question: "If you designed your ideal lifestyle, it would include...",
    options: [
      {
        id: 'a',
        text: "Time for learning new skills and evolving personally",
        type: 'growth'
      },
      {
        id: 'b',
        text: "A flexible daily schedule with no rigid structure",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "A calm, consistent rhythm that brings peace of mind",
        type: 'stability'
      }
    ]
  },
  {
    id: 5,
    question: "When you think about leaving or shifting away from dance, you most want to...",
    options: [
      {
        id: 'a',
        text: "Keep using your creativity in a new way",
        type: 'creativity'
      },
      {
        id: 'b',
        text: "Feel free to explore your other interests without pressure or judgment",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "Find a way of life that's less overwhelming",
        type: 'stability'
      }
    ]
  },
  {
    id: 6,
    question: "Which sentence feels most true right now?",
    options: [
      {
        id: 'a',
        text: "I want to be challenged and find that spark again",
        type: 'growth'
      },
      {
        id: 'b',
        text: "I want to finally live on my own terms",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "I want to feel like I belong, even without dance",
        type: 'connection'
      }
    ]
  },
  {
    id: 7,
    question: "You feel most grounded when...",
    options: [
      {
        id: 'a',
        text: "You're tapping in to your most creative self",
        type: 'creativity'
      },
      {
        id: 'b',
        text: "You're in a community that understands your dancer experience",
        type: 'connection'
      },
      {
        id: 'c',
        text: "You know what's expected and what comes next",
        type: 'stability'
      }
    ]
  },
  {
    id: 8,
    question: "When you're overwhelmed, it's often because...",
    options: [
      {
        id: 'a',
        text: "You feel cut off from your identity",
        type: 'connection'
      },
      {
        id: 'b',
        text: "You don't have an outlet for self-expression",
        type: 'creativity'
      },
      {
        id: 'c',
        text: "You don't know what your next step should be",
        type: 'stability'
      }
    ]
  },
  {
    id: 9,
    question: "In this season of life, you most want...",
    options: [
      {
        id: 'a',
        text: "Space to discover the new version of yourself",
        type: 'growth'
      },
      {
        id: 'b',
        text: "Confidence to go after what you really want",
        type: 'freedom'
      },
      {
        id: 'c',
        text: "Encouragement to step into something meaningful",
        type: 'stability'
      }
    ]
  },
  {
    id: 10,
    question: "When you think back to your favorite performance, what made it unforgettable?",
    options: [
      {
        id: 'a',
        text: "The unique choreography and artistic choices",
        type: 'creativity'
      },
      {
        id: 'b',
        text: "The bond and energy shared with the cast and audience",
        type: 'connection'
      },
      {
        id: 'c',
        text: "How much I grew and challenged myself during the process",
        type: 'growth'
      }
    ]
  }
];

const valuesResults: { [key: string]: QuizResult } = {
  'freedom': {
    type: 'freedom',
    title: 'Freedom & Flexibility',
    description: 'You thrive when life feels open-ended and adaptable. The stage may have taught you discipline, but now your soul is craving space to explore, create, and choose your own rhythm.',
    subtitle: 'Your dream life leaves room for spontaneous opportunities and days that are uniquely your own. In your next chapter, prioritizing flexibility will allow you to stay creative, energized, and fully in charge of your path.',
    color: '#647C90',
    reflectionQuestions: [
      'How does Demi\'s story show the power of following your curiosity?',
      'What small step could you take today to honor your need for freedom?',
      'How can you bring more flexibility into your daily routine?'
    ],
    journalPlaceholder: 'Demi found freedom by following her curiosity when...'
  },
  'connection': {
    type: 'connection',
    title: 'Connection & Community',
    description: 'You draw energy from people who understand you and lift you higher. In the dance world, your community was your second family and that closeness still matters.',
    subtitle: 'Your dream life is built around shared experiences, meaningful relationships, and being part of something bigger than yourself. Whether it\'s mentoring, collaborating, or simply being part of a family unit, connection will be the heartbeat of your future.',
    color: '#928490',
    reflectionQuestions: [
      'How did Demi build community through roller skating?',
      'What connections could you nurture that align with your values?',
      'How can you create meaningful interactions in your daily life?'
    ],
    journalPlaceholder: 'Demi built community through roller skating by...'
  },
  'growth': {
    type: 'growth',
    title: 'Growth & Mastery',
    description: 'You feel most alive when you\'re learning, improving, and chasing new levels of excellence. Your years in the studio have hardwired you to work toward mastery and that drive won\'t disappear after dance.',
    subtitle: 'Your dream life includes challenges that excite you, skills to refine, and the thrill of knowing you\'re becoming your best self in new arenas.',
    color: '#5A7D7B',
    reflectionQuestions: [
      'What does Demi\'s journey teach us about continuous learning?',
      'How can you challenge yourself to grow in a new area?',
      'What skill would you love to master outside of dance?'
    ],
    journalPlaceholder: 'Demi showed continuous growth when she...'
  },
  'stability': {
    type: 'stability',
    title: 'Stability & Security',
    description: 'You value feeling grounded, supported, and confident about what\'s next. The unpredictability of a dance career may have been exciting at times, but now you want a strong foundation.',
    subtitle: 'Your dream life allows you to relax, breathe, and plan ahead without constant worry. That sense of security will free you to explore new passions with confidence and clarity.',
    color: '#746C70',
    reflectionQuestions: [
      'How did Demi create stability through her passion project?',
      'What foundations can you build to feel more secure?',
      'How can you create a sense of predictability while still exploring?'
    ],
    journalPlaceholder: 'Demi created stability through her passion by...'
  },
  'creativity': {
    type: 'creativity',
    title: 'Creativity & Expression',
    description: 'At your core, you are an artist and no career shift will ever take that away. Your dream life must allow for self-expression, whether through movement, art, design, storytelling, or innovation.',
    subtitle: 'You feel most fulfilled when you can share a piece of your inner world with others. Honoring this value will make your next chapter just as soulful and vibrant as your time on stage.',
    color: '#4E4F50',
    reflectionQuestions: [
      'How did Demi express her creativity through roller skating?',
      'What new creative outlet could you explore?',
      'How can you bring more self-expression into your daily life?'
    ],
    journalPlaceholder: 'Demi expressed her creativity through...'
  }
};

interface ValuesDiscoveryProps {
  onComplete: (result: QuizResult) => void;
  onBack?: () => void;
}

export default function ValuesDiscovery({ onComplete, onBack }: ValuesDiscoveryProps) {
  const handleCompleteWithStorage = async (result: QuizResult) => {
    try {
      await AsyncStorage.setItem('VALUES_DISCOVERY_RESULT', JSON.stringify(result));
      onComplete(result);
    } catch (error) {
      console.error('Error saving values discovery result to AsyncStorage:', error);
      onComplete(result);
    }
  };

  const quizConfig: MiniQuizEngineProps = {
    onComplete: handleCompleteWithStorage,
    onBack,
    imageSource: 'https://pivotfordancers.com/assets/logo.png',
    totalQuestions: valuesQuestions.length,
    quizQuestions: valuesQuestions,
    quizResults: valuesResults,
    baseCardStyle: styles.baseCardValues,

    // Welcome Screen Configuration
    welcomeScreen: {
      title: 'Welcome back!',
      descriptions: [
        "When we considered the alternative to living a life in dance on Day 3, we did it so that we can start to actively choose options that more closely align with who we are now. But do you really know what you actually align with? That's what we're doing today… getting in touch with what you actually value."
      ],
      journalSectionProps: {
        pathTag: "discover-dream-life",
        day: "5",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Values Discovery",
        journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?",
        moodLabel: "",
        saveButtonText: "Save Entry"
      },
      welcomeHighlightText: "We'll come back to how you're feeling a bit later. But now, are you ready to discover your core values?",
      buttonText: "I'm Ready to Begin"
    },

    // Quiz Intro Screen Configuration
    quizIntroScreen: {
      title: "What do you actually value?",
      descriptions: [
        "We might all be dancers, but we all connected with dance for different reasons. Why we love something comes down to what we value and understanding our values helps us to build a dream life. Let's explore our hidden values to discover all the exciting ways we can build our dream life based on our values, not the other way around."
      ],
      buttonText: "Let's Explore"
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
        `Now that you know your core value is ${resultTitle}, let's see how others have turned their values into incredible opportunities.`,
        "Watch how Demi followed her values and turned a new roller skating hobby into over 500K followers on Instagram. Reflect on how you can apply similar principles to your own journey."
      ],
      videoLink: '7EUfZS8mQtk',
      journalSectionProps: {
        pathTag: "discover-dream-life",
        day: "5",
        category: "Mindset and Wellness",
        pathTitle: "Discover Your Dream Life",
        dayTitle: "Values Discovery",
        journalInstruction: "As you're watching, write your reflections as a journal entry below.",
        moodLabel: "",
        saveButtonText: "Add to Journal"
      },
      buttonText: 'Continue'
    },

    // Final Completion Screen Configuration
    finalCompletionScreen: {
      title: 'What a Journey!',
      descriptions: [
        "There are so many ways to build a dream life beyond dance. When you start with your values and open your mind to unique ways to bring those values together, you'll realize that dance was just one piece of the puzzle."
      ],
      closingText: 'See you again tomorrow.',
      buttonText: 'Mark As Complete'
    }
  };

  return <MiniQuizEngine {...quizConfig} />;
}

const styles = StyleSheet.create({
  baseCardValues: {
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