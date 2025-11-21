import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';

interface CareerChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface ExpandYourHorizonsProps {
    onComplete: () => void;
    onBack?: () => void;
}

const careerChoices: CareerChoice[] = [
    {
        id: 1,
        option1: 'Working with people',
        option2: 'Working with numbers',
        storyKey: 'workStyle'
    },
    {
        id: 2,
        option1: 'A job with creativity at its core',
        option2: 'A job that solves problems',
        storyKey: 'approach'
    },
    {
        id: 3,
        option1: 'Helping individuals one-on-one',
        option2: 'Designing systems that help many people at once',
        storyKey: 'impact'
    },
    {
        id: 4,
        option1: 'A structured office role',
        option2: 'A flexible, self-directed role',
        storyKey: 'structure'
    },
    {
        id: 5,
        option1: 'A job where you\'re constantly learning',
        option2: 'A job where you\'re the expert, teaching others',
        storyKey: 'learning'
    },
    {
        id: 6,
        option1: 'Stability and long-term security',
        option2: 'Adventure and variety',
        storyKey: 'lifestyle'
    },
    {
        id: 7,
        option1: 'A role tied closely to the arts',
        option2: 'A role that stretches you into a brand-new industry',
        storyKey: 'industry'
    },
    {
        id: 8,
        option1: 'A behind-the-scenes role',
        option2: 'A front-facing role with lots of interaction',
        storyKey: 'visibility'
    },
    {
        id: 9,
        option1: 'Building something new',
        option2: 'Joining something established',
        storyKey: 'environment'
    }
];

export default function ExpandYourHorizons({ onComplete, onBack }: ExpandYourHorizonsProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        switch (screenNumber) {
            case 11:
                return "Explore Your Horizons";
            case 12:
                return `You're excited (and to be honest, a bit nervous) about starting your new job ${gameChoices.workStyle?.toLowerCase()} after performing full-time for so long. But instantly, you realize that this is a place where your skills could shine.`;
            case 13:
                return `You're thrilled by the idea of ${gameChoices.approach?.toLowerCase()} and realize that life off the stage isn't so bad after all.`;
            case 14:
                return `You're making an impact and ${gameChoices.impact?.toLowerCase()}. The way you create value might look different than before, but isn't any less meaningful.`;
            case 15:
                return `You're in ${gameChoices.structure?.toLowerCase()} and your day-to-day life is no longer dictated by scarcity and chaos like it was when you were a dancer.`;
            case 16:
                return `In this new role, you're ${gameChoices.learning?.toLowerCase()} and you feel prepared because your dance background taught you discipline and resourcefulness.`;
            case 17:
                return `You've been craving ${gameChoices.lifestyle?.toLowerCase()} and you've finally found it by stepping into this new chapter.`;
            case 18:
                return `You're in ${gameChoices.industry?.toLowerCase()} as you continue to rediscover who you actually are in the workplace.`;
            case 19:
                return `You're thriving in ${gameChoices.visibility?.toLowerCase()} and giving your best in a role that fits exactly who you are.`;
            case 20:
                return `You're excited to be ${gameChoices.environment?.toLowerCase()} and ready to take on the amazing opportunities available to you.`;
            case 21:
                return "You've started mapping out the landscape of possibilities off the stage without pressure, just curiosity. Every small choice you've made is a clue about what excites you most. Remember: career pivots don't have to look one way. The more you explore, the more options you'll uncover.";
            default:
                return "";
        }
    };

    const engineProps: Omit<ThisOrThatEngineProps, 'choices'> & { choices: CareerChoice[] } = {
        onComplete,
        onBack,
        gameTitle: "Expand Your Horizons",
        gameDescription: "This is a game of instincts to help you open your mind to careers you may have never considered. Pick the answer that sparks your curiosity most. There are no wrong choices!",
        choices: careerChoices,
        totalChoices: 9,
        pathTag: "map-your-direction",
        day: "1",
        category: "Career Transitions",
        pathTitle: "Map Your Direction",
        dayTitle: "Expand Your Horizons",
        morningJournalPrompt: "Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring new career possibilities?",
        introButtonText: "Start exploring",
        introScreenDescription: "This is a game of instincts to help you open your mind to careers you may have never considered. Pick the answer that sparks your curiosity most. There are no wrong choices!",
        morningIntroText: "This is where we're diving deeper into building a balanced life beyond dance.",
        reflectionTitle: "Expanding Your Career Possibilities",
        reflectionDescription: [
            "Perhaps some of these career paths feel unfamiliar or even intimidating? But the goal is to give yourself permission to explore beyond what you already know.",
            "This is just an exercise in opening your mind to the vast landscape of opportunities available to someone with your unique skills and background.",
            "Every time you allow yourself to consider a different path, you're expanding your horizons and creating more possibilities for your future."
        ],
        finalReflectionPrompt: [
            "Take a moment to notice how you're feeling right now. Are you curious? Overwhelmed? Excited about new possibilities?",
            "If any part of you thought \"I could never do that\" - that's exactly the kind of limiting belief we're working to overcome.",
            "Remember that your dance background has given you unique strengths that are valuable in many different fields."
        ],
        getStoryText,
        storyStartScreen: 11,
        storyEndScreen: 21,
        ebookTitle: "Explore Career Tools",
        ebookDescription: "If you'd like to dive deeper into career transition strategies, our book \"How to Pivot\" offers practical guidance that might help.",
        ebookLink: "https://pivotfordancers.com/products/how-to-pivot/",
        alternativeClosing: "See you tomorrow!",
        finalJournalPrompt: "Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring these new career possibilities?",
        // youtubeVideoId: "H9DMFyi8voM"s
    };

    return <ThisOrThatEngine {...engineProps} />;
}