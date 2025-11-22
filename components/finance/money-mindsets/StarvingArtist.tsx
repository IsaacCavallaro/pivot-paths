import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface StarvingArtistProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function StarvingArtist({ onComplete, onBack }: StarvingArtistProps) {
    const pairs = [
        {
            id: 1,
            leftText: "If I make money, I'm selling out.",
            rightText: "Earning money gives me freedom to create on my own terms.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 2,
            leftText: "Artists should suffer for their art.",
            rightText: "My art is stronger when I'm supported and cared for.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 3,
            leftText: "Money and creativity don't mix.",
            rightText: "Financial stability fuels creativity and risk-taking.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 4,
            leftText: "I don't deserve more than survival.",
            rightText: "I deserve to thrive, not just survive.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 5,
            leftText: "It's selfish to want more.",
            rightText: "Earning more allows me to give more.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 6,
            leftText: "I'm not qualified for a high-paying job.",
            rightText: "I might be surprised how many high-paying jobs fit my skills.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 7,
            leftText: "Wanting to make more money means I've failed as an artist.",
            rightText: "Increasing my income makes me resilient and resourceful.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 8,
            leftText: "Real art doesn't pay well.",
            rightText: "Art and abundance can absolutely go hand in hand.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 9,
            leftText: "I'm not good with money, so why bother?",
            rightText: "I can learn money skills the same way I learned dance skills.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 10,
            leftText: "I'll never be financially stable because I chose to pursue dance.",
            rightText: "My dance background taught me so many skills I can use in other fields.",
            leftType: "oldBelief",
            rightType: "reframe"
        }
    ];

    const welcomeScreen = {
        title: "Welcome!",
        descriptions: [
            "Today, we're diving into the money mindsets that shape our thinking as artists and dancers.",
            "Many of us carry beliefs about money that may actually be holding us back from building sustainable, fulfilling careers."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "Common money beliefs that artists carry" },
                { id: 2, text: "How to reframe these limiting beliefs" },
                { id: 3, text: "Whether you still hold onto any starving artist stereotypes" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you identify and challenge the money mindsets you might be holding onto.",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "1",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Starving Artist No More",
            journalInstruction: "Before we begin, let's take a moment to check in with yourself. What are your current thoughts about money and being an artist? Is there anything you're hoping to gain today?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Starving Artist No More",
        descriptions: [
            "You don't have to buy into the starving artist stereotype anymore. In this game, you'll match the old belief with a reframe that frees you."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which money belief are you not convinced is actually limiting?",
            "Take a moment to reflect on the money mindsets you encountered."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "1",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Starving Artist No More",
            journalInstruction: "Which money belief are you still holding onto? Why does it feel true to you?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Great Work!",
        descriptions: [
            "You've spent years in an industry that romanticizes struggle, where working for little or nothing is framed as paying your dues. But you don't have to keep carrying that story.",
            "The truth is, being a dancer has already made you resourceful, disciplined, and creative. Those are the exact qualities that can help you build stability and freedom in this next chapter.",
            "Take a detour and check out the money mindsets our founder had to unlearn. But don't forget to come back and mark this day as complete!"
        ],
        videoLink: "https://www.youtube.com/shorts/8DwWYZHsUHw",
        alternativeClosing: "See you tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Starving Artist No More"
            gameInstructions="Tap to match old beliefs with their reframes"
            leftColumnTitle="Old Belief"
            rightColumnTitle="Reframe"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}
