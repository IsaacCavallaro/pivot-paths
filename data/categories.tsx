import { Brain, Rocket, DollarSign } from 'lucide-react-native';

export interface PathDay {
  day: number;
  title: string;
  content: string;
  prompt: string;
  callout?: string;
  hasQuiz?: boolean;
  hasLeadershipExperience?: boolean;
  hasMythBuster?: boolean;
  hasRoleplay?: boolean;
  hasDreamBigger?: boolean;
  hasValuesDiscovery?: boolean;
  hasFlipScript?: boolean;
  hasVoiceMessage?: boolean;
  hasExpandYourHorizons?: boolean;
  hasWhatEnergizesYou?: boolean;
  hasSparkCuriosity?: boolean;
  hasTryItOn?: boolean;
  hasBreakOutOfYourBubble?: boolean;
  hasDealBreakerGame?: boolean;
  hasYourFirstExperiment?: boolean;
}

export interface Path {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  totalDays: number;
  days: PathDay[];
  callout?: {
    text: string;
    url: string;
  };
}

export interface Category {
  id: string;
  title: string;
  description: string;
  color: string;
  paths: Path[];
}

export const categories: Category[] = [
  {
    id: 'mindset',
    title: 'Mindset & Wellness',
    description: 'Develop the mental resilience and wellness practices for successful transition',
    color: '#647C90',
    icon: <Brain size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'discover-dream-life',
        title: 'Discover Your Dream Life',
        subtitle: '', // We only use subheadings for "Coming Soon"
        description: 'It\'s time to dream big. Each step in this path offers mindset shifts and thought-provoking exercises to help you discover what you want beyond dance and explore what it means to let go of your dream job to build your dream life.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'What kind of dreamer are you?',
            content: 'It\'s a skill to dream big. Sure, we had dance dreams and achieved them, but when we start dreaming on our own terms, it can start to fall apart. To help you dream bigger, let\'s start by figuring out your "Dreamer Type" to unlock what could be holding you back.',
            hasQuiz: true,
          },
          {
            day: 2,
            title: 'Permission to Want More',
            content: 'Today we explore what it means to give yourself full permission to want more than what feels "realistic" or "safe."',
            hasMythBuster: true,
          },
          {
            day: 3,
            title: 'Beyond the Practical',
            content: 'Let\'s walk through a common scenario you may find yourself in if you continue down the path of professional dance. Choose what you\'d be most likely to do in this scenario and we\'ll shed light on an alternative.',
            hasRoleplay: true,
          },
          {
            day: 4,
            title: 'Dream Bigger',
            content: 'This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don\'t think too much! There\'s no right or wrong. Let\'s see what you can dream up.',
            hasDreamBigger: true,
          },
          {
            day: 5,
            title: 'What do you actually value?',
            content: 'We might all be dancers, but we all connected with dance for different reasons. Why we love something comes down to what we value and understanding our values helps us to build a dream life. Let\'s explore our hidden values to discover all the exciting ways we can build our dream life based on our values, not the other way around.',
            hasValuesDiscovery: true,
          },
          {
            day: 6,
            title: 'Flip the Script',
            content: 'One of the scariest parts of leaving your dance career is answering the dreaded small-talk question, "So, what have you been up to?". When you\'re in the middle of a huge shift, it\'s easy to make a joke or shirk the question entirely. But what if we flip the script and talked about our pivot with confidence?',
            hasFlipScript: true,
          },
          {
            day: 7,
            title: 'Your Expansive Vision',
            content: 'You\'re ready to dream bigger and step into a full and rich life beyond dance. Take it one step further with actionable next steps.',
            hasVoiceMessage: true,
          },
        ]
      },
      {
        id: 'identity-shift',
        title: 'Identity Beyond Dance',
        subtitle: 'Coming Soon',
        description: 'Explore who you are beyond your dancer identity - comprehensive path coming soon',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Coming Soon',
            content: 'This comprehensive path on identity exploration is being developed and will be available soon. Check back for updates on discovering who you are beyond your dancer identity.',
            prompt: 'What aspects of identity exploration would be most helpful for your transition? Consider values, interests, and personal strengths.',
          },
          // Additional days will be added when path is developed
        ],
      },
      {
        id: 'resilience-building',
        title: 'Building Resilience',
        subtitle: 'Coming Soon',
        description: 'Develop mental toughness and resilience for life\'s challenges - comprehensive path coming soon',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Coming Soon',
            content: 'This comprehensive path on building resilience is being developed and will be available soon. Check back for updates on developing mental toughness and resilience strategies.',
            prompt: 'What resilience topics would be most helpful for your transition? Consider stress management, adaptability, and mental toughness.',
          },
          // Additional days will be added when path is developed
        ],
      },
    ],
  },
  {
    id: 'career-transitions',
    title: 'Career Transitions',
    description: 'Navigate your path from dance to your next fulfilling career',
    color: '#647C90',
    icon: <Rocket size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'skills-assessment',
        title: 'Discover Your Direction',
        subtitle: '',
        description: 'Not sure what career is right for you? Curious to know if you’re on the right path? Each step in the path helps you explore career options you may have never considered and start taking action towards landing a job in the industry that’s works for you.',
        duration: '7 days',
        totalDays: 7,
        days: [
          {
            day: 1,
            title: 'Expand Your Horizons',
            content: 'This comprehensive path on transferable skills discovery is being developed and will be available soon. Check back for updates on identifying and articulating your valuable dance skills.',
            hasExpandYourHorizons: true,
          },
          {
            day: 2,
            title: 'What Energizes You?',
            content: 'Some work drains you. Other work fuels you. This quiz helps you spot the tasks, environments, and wins that give you real energy, so you can steer your career in that direction.',
            hasWhatEnergizesYou: true,
          },
          {
            day: 3,
            title: 'Spark Curiosity',
            content: 'Curiosity is the engine of your pivot. Today we’re here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.',
            hasSparkCuriosity: true,
          },
          {
            day: 4,
            title: 'Try it on',
            content: 'Let’s try on some new careers to see how they might feel in the real world. We’ll show you a few scenarios and you’ll choose what you’d do in each situation.',
            hasTryItOn: true,
          },
          {
            day: 5,
            title: 'Break Out of Your Bubble',
            content: '',
            hasBreakOutOfYourBubble: true,
          },
          {
            day: 6,
            title: 'Deal Breakers',
            content: 'Match each deal breaker with the type of work environment or situation it aligns with. These will be the circumstance to avoid.',
            hasDealBreakerGame: true,
          },
          {
            day: 7,
            title: 'Your First Experiment',
            content: 'It’s time to put ideas into action.Today, you’re going to try one small experiment to explore a career you’re curious about.The goal isn’t perfection… it’s discovery.',
            hasYourFirstExperiment: true,
          },
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'Financial Wellness',
    description: 'Master your money mindset and build financial security during your transition',
    color: '#647C90',
    icon: <DollarSign size={24} color='rgba(226, 222, 208, 0.9)' />,
    paths: [
      {
        id: 'coming-soon',
        title: 'Financial Planning Paths',
        subtitle: 'Coming Soon',
        description: 'Comprehensive financial wellness paths are being developed and will be available soon',
        duration: 'Coming Soon',
        totalDays: 1,
        days: [
          {
            day: 1,
            title: 'Coming Soon',
            content: 'We\'re developing comprehensive financial wellness paths specifically for dancers in transition. These will include budgeting, emergency funds, transition planning, and investment strategies tailored to irregular dance income. Check back soon or visit pivotfordancers.com for updates!',
            prompt: 'What financial topics would be most helpful for your transition? Consider budgeting, emergency planning, or investment strategies.',
            callout: 'Get notified when financial paths launch at pivotfordancers.com',
          },
        ],
      },
    ],
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getPathById = (categoryId: string, pathId: string): Path | undefined => {
  const category = getCategoryById(categoryId);
  return category?.paths.find(path => path.id === pathId);
};