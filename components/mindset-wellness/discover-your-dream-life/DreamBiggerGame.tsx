import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';

interface DreamChoice {
  id: number;
  option1: string;
  option2: string;
  storyKey: string;
}

interface DreamBiggerGameProps {
  onComplete: () => void;
  onBack?: () => void;
}

const dreamChoices: DreamChoice[] = [
  {
    id: 1,
    option1: 'Beach house',
    option2: 'Mountain cabin',
    storyKey: 'home'
  },
  {
    id: 2,
    option1: 'Travel the world',
    option2: 'Buy your forever home',
    storyKey: 'lifestyle'
  },
  {
    id: 3,
    option1: 'Learn to surf',
    option2: 'Learn to build pottery',
    storyKey: 'hobby'
  },
  {
    id: 4,
    option1: 'Start a family',
    option2: 'Start a business',
    storyKey: 'purpose'
  },
  {
    id: 5,
    option1: '6-figure income',
    option2: 'Unlimited time off',
    storyKey: 'work'
  },
  {
    id: 6,
    option1: 'Personal chef',
    option2: 'High-quality wardrobe',
    storyKey: 'luxury'
  },
  {
    id: 7,
    option1: 'Work part time',
    option2: 'Retire early',
    storyKey: 'schedule'
  },
  {
    id: 8,
    option1: 'Season tickets to the theatre',
    option2: 'Create your own show',
    storyKey: 'entertainment'
  },
  {
    id: 9,
    option1: 'Run a marathon',
    option2: 'Annual yoga retreats',
    storyKey: 'wellness'
  },
  {
    id: 10,
    option1: 'Donate to charity',
    option2: 'Help your parents retire',
    storyKey: 'giving'
  }
];

// Mapping function to convert specific choices to their story representations
const getStoryMapping = (choice: string): string => {
  const mappings: { [key: string]: string } = {
    'Learn to surf': 'surfing lessons',
    'Learn to build pottery': 'pottery classes',
    'Run a marathon': 'marathon',
    'Annual yoga retreats': 'yoga retreat'
  };

  return mappings[choice] || choice;
};

export default function DreamBiggerGame({ onComplete, onBack }: DreamBiggerGameProps) {
  const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
    switch (screenNumber) {
      case 12:
        return "Explore Your Dream Life";
      case 13:
        return `You wake up in your ${gameChoices.home?.toLowerCase()} to the ${gameChoices.purpose === 'Start a family' ? 'sound of happy kids running around' : 'notification that more sales from your business came through overnight'}.`;
      case 14:
        return `${gameChoices.schedule === 'Work part time' ? 'You work part-time' : 'You\'re on track to retire early'} and you relax at the thought of your ${gameChoices.work?.toLowerCase()} knowing that your ${getStoryMapping(gameChoices.hobby || '').toLowerCase()} are going to be the most challenging part of your day.`;
      case 15:
        return `You head ${gameChoices.luxury === 'Personal chef' ? 'downstairs to eat your chef-prepared breakfast' : 'to your closet and pick out another custom piece from your wardrobe'} and start the day on your terms.`;
      case 16:
        return `Your to-do list involves organizing ${gameChoices.lifestyle === 'Travel the world' ? 'next week\'s travel plans' : 'renovations for your forever home'}, training for that upcoming ${getStoryMapping(gameChoices.wellness || '').toLowerCase()}, and deciding ${gameChoices.giving === 'Donate to charity' ? 'which charity to donate to this month' : 'when you\'re meeting up with your parents now that you helped them retire too'}.`;
      case 17:
        return `And tonight, you're off ${gameChoices.entertainment === 'Season tickets to the theatre' ? 'to the theater with season tickets' : 'to workshop a new show you\'re creating which opens next month'}. Life's good.`;
      default:
        return "";
    }
  };

  const engineProps: Omit<ThisOrThatEngineProps, 'choices'> & { choices: DreamChoice[] } = {
    onComplete,
    onBack,
    gameTitle: "Dream Bigger",
    gameDescription: "You've already identified your dreamer type, challenged industry myths, and explored alternatives. Now, let's stretch your imagination even further.",
    choices: dreamChoices,
    totalChoices: 10,
    pathTag: "discover-dream-life",
    day: "4",
    category: "Mindset and Wellness",
    pathTitle: "Discover Your Dream Life",
    dayTitle: "Dream Bigger",
    morningJournalPrompt: "Before we begin, let's take a moment to check in with yourself. How are you feeling as you continue this journey?",
    reflectionTitle: "Building Your Dreamer Muscle",
    reflectionDescription: [
      "Perhaps this doesn't sound possible? But the goal is to give yourself permission to turn up as the expansive dreamer.",
      "This is just an exercise of building the muscle to dream about something other than booking your dream job.",
      "Every time you allow yourself to imagine a different future, you're strengthening that expansive dreamer within you."
    ],
    finalReflectionPrompt: [
      "Take a moment to notice how you're feeling right now. Are you excited? Skeptical? Overwhelmed?",
      "If any part of you thought \"this could never be me\" - that sounds like an unhelpful story that keeps you stuck.",
      "These mindset shifts are exactly what we explore in our dancer-specific career change resources, helping you rewrite those limiting stories."
    ],
    getStoryText,
    storyStartScreen: 12,
    storyEndScreen: 17,
    ebookTitle: "Explore Mindset Tools",
    ebookDescription: "If you'd like to dive deeper into shifting those limiting beliefs, our book \"How to Pivot\" offers practical strategies that might help.",
    ebookLink: "https://pivotfordancers.com/products/how-to-pivot/",
    alternativeClosing: "See you for more tomorrow"
  };

  return <ThisOrThatEngine {...engineProps} />;
}