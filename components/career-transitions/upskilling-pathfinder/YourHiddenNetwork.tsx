import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';
import { Users } from 'lucide-react-native';

interface NetworkQuestion {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface YourHiddenNetworkProps {
    onComplete: () => void;
    onBack?: () => void;
}

const networkQuestions: NetworkQuestion[] = [
    {
        id: 1,
        option1: "Friend in a corporate job",
        option2: "Friend who freelances",
        storyKey: 'choice1'
    },
    {
        id: 2,
        option1: "Former school teacher",
        option2: "Dance friend who already pivoted",
        storyKey: 'choice2'
    },
    {
        id: 3,
        option1: "Family member who owns a business",
        option2: "Online community forums",
        storyKey: 'choice3'
    },
    {
        id: 4,
        option1: "LinkedIn networking",
        option2: "Informal coffee chats",
        storyKey: 'choice4'
    },
    {
        id: 5,
        option1: "Colleague from your survival job",
        option2: "Artist running their own business",
        storyKey: 'choice5'
    },
    {
        id: 6,
        option1: "Former mentor",
        option2: "Friend of a friend with experience",
        storyKey: 'choice6'
    },
    {
        id: 7,
        option1: "Asking for a skills swap",
        option2: "Asking to volunteer on a project",
        storyKey: 'choice7'
    },
    {
        id: 8,
        option1: "Dance friend who's also changing careers",
        option2: "Career coach",
        storyKey: 'choice8'
    },
    {
        id: 9,
        option1: "Professional networking groups",
        option2: "University alumni network",
        storyKey: 'choice9'
    }
];

const storyScreens = [
    {
        id: 1,
        text: "You start your pivot by reaching out to someone in your network. They share stories that open your eyes to paths you hadn't considered before."
    },
    {
        id: 2,
        text: "When you hit a wall, you look back to your connections. Their guidance reminds you that you're not starting from scratch — you're building on everything you already know."
    },
    {
        id: 3,
        text: "Support also shows up in surprising places: Advice from unexpected sources gives you confidence to test new ideas and trust your instincts."
    },
    {
        id: 4,
        text: "You practice reaching out by inviting others to connect. Each conversation feels like a classroom and you're feeling more and more excited about the future."
    },
    {
        id: 5,
        text: "Even in everyday life, learning happens. People around you show how transferable skills can open surprising doors."
    },
    {
        id: 6,
        text: "Mentorship comes in many forms when helpful people appear out of nowhere and give you honest advice that shapes your next steps."
    },
    {
        id: 7,
        text: "You put yourself out there by exploring new opportunities. These moments become your most practical learning experiences."
    },
    {
        id: 8,
        text: "You lean on your support system to help you stay accountable and reminds you that growth is easier when shared."
    },
    {
        id: 9,
        text: "And when you zoom out, your network expands through various channels, giving you a bigger picture of what's possible."
    }
];

export default function YourHiddenNetwork({ onComplete, onBack }: YourHiddenNetworkProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        const storyIndex = screenNumber - 11;
        const story = storyScreens[storyIndex];
        if (!story) return "";
        return story.text;
    };

    const engineProps: ThisOrThatEngineProps = {
        onComplete,
        onBack,
        gameTitle: "Your Hidden Network",
        gameDescription: "Today we're exploring the incredible network that's already around you, waiting to be discovered and activated for your career transition. You'll be surprised at how many connections and resources you already have access to when you know where to look.",
        choices: networkQuestions,
        totalChoices: 9,
        pathTag: "upskilling-pathfinder",
        day: "4",
        category: "Career Transitions",
        pathTitle: "Upskilling Pathfinder",
        dayTitle: "Your Hidden Network",
        morningJournalPrompt: "Before we begin exploring your network, let's check in. How are you feeling about your current support system and connections?",
        introButtonText: "Start the Game",
        introScreenDescription: "This is a game of instincts to uncover your hidden network. Choose the answer that makes the most sense for you. There's no right or wrong!",
        morningIntroText: "Today we're exploring the incredible network that's already around you, waiting to be discovered and activated for your career transition.",
        reflectionTitle: "Explore Your Hidden Network",
        reflectionDescription: "Discover the connections and resources that are already available to you as you build your network.",
        finalReflectionPrompt: [
            "Your network is everywhere. Each conversation, connection, and small act of courage adds another stepping stone on your path forward.",
            "You don't have to do this alone! Your support system is already forming around you if you're willing to look."
        ],
        finalJournalPrompt: "Before we complete today's session, let's reflect on your network discoveries. How has your perspective on your support system changed?",
        getStoryText,
        storyStartScreen: 11,
        storyEndScreen: 19,
        ebookTitle: "Expand Your Network Further",
        ebookDescription: "If you'd like to learn more about building meaningful professional connections, our book \"How to Pivot\" offers networking strategies tailored for dancers.",
        ebookLink: "https://pivotfordancers.com/products/how-to-pivot/",
        alternativeClosing: "See you tomorrow!",
        customFinalHeader: {
            icon: Users,
            title: "Your Hidden Network"
        },
        customFinalContent: [
            "Your network is everywhere. Each conversation, connection, and small act of courage adds another stepping stone on your path forward.",
            "You don't have to do this alone! Your support system is already forming around you if you're willing to look."
        ],
        skipStoryScreens: false,
        showEbookCallout: true
    };

    return <ThisOrThatEngine {...engineProps} />;
}