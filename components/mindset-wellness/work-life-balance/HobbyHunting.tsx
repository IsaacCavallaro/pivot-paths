import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';

interface HobbyChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface HobbyHuntingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const hobbyChoices: HobbyChoice[] = [
    {
        id: 1,
        option1: 'Painting',
        option2: 'Pottery',
        storyKey: 'creative'
    },
    {
        id: 2,
        option1: 'Cooking',
        option2: 'Knitting',
        storyKey: 'winddown'
    },
    {
        id: 3,
        option1: 'Yoga',
        option2: 'Martial arts',
        storyKey: 'balance'
    },
    {
        id: 4,
        option1: 'Gardening',
        option2: 'Photography',
        storyKey: 'weekend'
    },
    {
        id: 5,
        option1: 'Learning a language',
        option2: 'Learning an instrument',
        storyKey: 'challenge'
    },
    {
        id: 6,
        option1: 'Volunteering',
        option2: 'Blogging',
        storyKey: 'connection'
    },
    {
        id: 7,
        option1: 'Hiking',
        option2: 'Rock climbing',
        storyKey: 'movement'
    },
    {
        id: 8,
        option1: 'Board games',
        option2: 'Book clubs',
        storyKey: 'social'
    },
    {
        id: 9,
        option1: 'Pickleball',
        option2: 'Paddleboarding',
        storyKey: 'saturday'
    }
];

export default function HobbyHunting({ onComplete, onBack }: HobbyHuntingProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        switch (screenNumber) {
            case 11:
                return "Explore Your New Hobby Life";
            case 12:
                return `After work, you dive into ${gameChoices.creative?.toLowerCase()}, feeling curious and excited by this new form of expression or challenge. And as you wind down for the day, your new ${gameChoices.winddown === 'Cooking' ? 'cookbook' : 'knitting project'} keeps you engaged.`;
            case 13:
                return `A few times a week, you find balance and focus through ${gameChoices.balance?.toLowerCase()}, letting your body and mind reconnect in new ways.`;
            case 14:
                return `Your weekends are filled with ${gameChoices.weekend?.toLowerCase()} to help you slow down and notice the details, giving you a sense of accomplishment and calm.\n\nAnd when you're itching for a challenge, you decide to stretch your mind ${gameChoices.challenge?.toLowerCase()}.`;
            case 15:
                return `As a summer project, you explore connection and purpose through ${gameChoices.connection?.toLowerCase()}, sharing your time, skills, or thoughts with others.\n\nAnd your daily movement off the stage finally becomes playtime again as you enjoy ${gameChoices.movement?.toLowerCase()} with friends.`;
            case 16:
                return `${gameChoices.social === 'Board games' ? 'Board games with family' : 'A book club with friends'} and ${gameChoices.saturday === 'Pickleball' ? 'pickleball tournaments' : 'solo paddleboarding excursions'} fill those Saturdays that used to be spent auditioning (or scrolling).`;
            case 17:
                return "You actually have hobbies now and letting go of dance doesn't seem so hard. You have other things to enjoy and new ways to recharge and play.\n\nTry adding at least one of these hobbies to your routine this week.";
            default:
                return "";
        }
    };

    const engineProps: Omit<ThisOrThatEngineProps, 'choices'> & { choices: HobbyChoice[] } = {
        onComplete,
        onBack,
        gameTitle: "Hobby Hunting",
        gameDescription: "You've already started exploring what life after dance could look like. Now, let's discover hobbies that can bring you joy and fulfillment.",
        choices: hobbyChoices,
        totalChoices: 9,
        pathTag: "work-life-balance",
        day: "2",
        category: "Mindset and Wellness",
        pathTitle: "Work Life Balance",
        dayTitle: "Hobby Hunting",
        morningJournalPrompt: "Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring new hobbies outside of dance?",
        introButtonText: "Start exploring",
        introScreenDescription: "This is a game of instincts. Choose the answer that you resonate with the most to help you discover new hobbies that bring you joy outside of dance. Don't think too much! There's no right or wrong. Let's see what hobbies you're drawn to.",
        morningIntroText: "This is where we're diving deeper into building a balanced life beyond dance.",
        reflectionTitle: "Building Your Hobby Muscle",
        reflectionDescription: [
            "Perhaps this doesn't sound possible with your busy schedule? But the goal is to give yourself permission to explore interests outside of dance.",
            "This is just an exercise of building the muscle to imagine a life filled with diverse interests and activities.",
            "Every time you allow yourself to explore a new hobby, you're strengthening that part of you that exists beyond the dance studio."
        ],
        finalReflectionPrompt: [
            "Take a moment to notice how you're feeling right now. Are you excited about trying new hobbies? Skeptical? Overwhelmed?",
            "If any part of you thought \"I don't have time for hobbies\" - that sounds like a story that keeps you from having a balanced life.",
            "These mindset shifts around time and identity are exactly what we explore in our dancer-specific resources, helping you create space for life beyond dance."
        ],
        getStoryText,
        storyStartScreen: 11,
        storyEndScreen: 17,
        ebookTitle: "Explore Balance Tools",
        ebookDescription: "If you'd like to dive deeper into creating work-life balance, our book \"How to Pivot\" offers practical strategies that might help.",
        ebookLink: "https://pivotfordancers.com/products/how-to-pivot/",
        alternativeClosing: "See you tomorrow for more",
        finalJournalPrompt: "Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring potential hobbies?"
    };

    return <ThisOrThatEngine {...engineProps} />;
}