import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';
import { TrendingUp } from 'lucide-react-native';

interface SideHustleChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface SideHustleScoreCardProps {
    onComplete: () => void;
    onBack?: () => void;
}

const sideHustleChoices: SideHustleChoice[] = [
    {
        id: 1,
        option1: 'Dog Walking',
        option2: 'Delivery Driving',
        storyKey: 'hustle1'
    },
    {
        id: 2,
        option1: 'Virtual Assistant',
        option2: 'Social Media Manager',
        storyKey: 'hustle2'
    },
    {
        id: 3,
        option1: 'Tutoring',
        option2: 'Video Editing',
        storyKey: 'hustle3'
    },
    {
        id: 4,
        option1: 'Graphic Design',
        option2: 'Web Design',
        storyKey: 'hustle4'
    },
    {
        id: 5,
        option1: 'Sell Crafts Online',
        option2: 'Start a Youtube channel',
        storyKey: 'hustle5'
    }
];

export default function SideHustleScoreCard({ onComplete, onBack }: SideHustleScoreCardProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        switch (screenNumber) {
            case 6:
                return "Your Hustle, Your Rules";
            case 7:
                return `You decided to bring in extra cash through ${gameChoices.hustle1?.toLowerCase()}. The flexible hours let you work around your dance schedule, and you love the variety.`;
            case 8:
                return `You decided to build your skills as a ${gameChoices.hustle2?.toLowerCase()}. You love the creative challenge and the ability to work from anywhere on your own schedule. But it isn't quite enough.`;
            case 9:
                return `You dabble in ${gameChoices.hustle3?.toLowerCase()} and start learning more about ${gameChoices.hustle4?.toLowerCase()}. You're not only making extra money that you put into savings but you're learning valuable skills for the future.`;
            case 10:
                const hustle5Text = gameChoices.hustle5 === 'Sell Crafts Online'
                    ? 'selling your crafts online'
                    : 'a YouTube channel';
                return `In the meantime, you take one of your other passions and start ${hustle5Text}. It feels amazing to finally have some agency in your life and build other income streams while you're still dancing.`;
            case 11:
                return "How does that feel? This isn't a far-off fantasy. This is what's possible when you direct your famous dancer discipline toward other goals.\n\nYour first step is simple: pick one side hustle from your choices and research how to get started this week. You don't have to commit forever, just try it.\n\nCome back tomorrow for more.";
            default:
                return "";
        }
    };

    const engineProps: ThisOrThatEngineProps = {
        onComplete,
        onBack,
        gameTitle: "Side Hustle Scorecard",
        gameDescription: "Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast. This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.",
        choices: sideHustleChoices,
        totalChoices: 5,
        pathTag: "financial-futureproofing",
        day: "2",
        category: "finance",
        pathTitle: "Money Mindsets",
        dayTitle: "Side Hustle Scorecard",
        morningJournalPrompt: "Before we begin, let's take a moment to check in with yourself. How are you feeling about exploring side hustle opportunities?",
        introButtonText: "Begin",
        introScreenDescription: "This is a game of instincts. Choose the side gigs that sound most appealing to you. We'll use your choices to show you the impact that extra income can have.\n\nDon't overthink it! There's no right or wrong.",
        morningIntroText: "Your financial goals need fuel. A side hustle is a powerful way to generate extra cash to build your future, fast.",
        reflectionTitle: "Your Hustle, Your Rules",
        reflectionDescription: "Explore how side hustles can transform your financial future and give you more control over your career path.",
        finalReflectionPrompt: [
            "How does that feel? This isn't a far-off fantasy. This is what's possible when you direct your famous dancer discipline toward other goals.",
            "Your first step is simple: pick one side hustle from your choices and research how to get started this week. You don't have to commit forever, just try it."
        ],
        finalJournalPrompt: "Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after exploring side hustle possibilities?",
        getStoryText,
        storyStartScreen: 6,
        storyEndScreen: 11,
        alternativeClosing: "Come back tomorrow for more.",
        customFinalHeader: {
            icon: TrendingUp,
            title: "How does that feel?"
        },
        skipStoryScreens: false,
        showEbookCallout: false
    };

    return <ThisOrThatEngine {...engineProps} />;
}