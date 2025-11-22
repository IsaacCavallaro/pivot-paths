import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface SunkCostFallacyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SunkCostFallacy({ onComplete, onBack }: SunkCostFallacyProps) {
    const pairs = [
        {
            id: 1,
            leftText: "I trained too long to start over.",
            rightText: "My training gave me discipline that transfers anywhere.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 2,
            leftText: "Leaving dance means I wasted 20 years.",
            rightText: "Experience is never wasted. Dance shaped how I think and learn.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 3,
            leftText: "If I quit, it means I failed.",
            rightText: "Pivoting means I'm choosing growth, not giving up.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 4,
            leftText: "All those sacrifices were for nothing.",
            rightText: "Those sacrifices gave me the resilience I'll always carry.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 5,
            leftText: "I should stick it out because I've already invested so much.",
            rightText: "If I'm feeling stuck, I should cut my losses.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 6,
            leftText: "If I stop now, I'll disappoint everyone who believed in me.",
            rightText: "The people who matter want me to be fulfilled.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 7,
            leftText: "I'm too old to start something new.",
            rightText: "My maturity and experience give me an edge in any new path.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 8,
            leftText: "I've only ever been a dancer.",
            rightText: "Dance shaped my identity but it's not the whole of who I am.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 9,
            leftText: "Switching careers means starting from zero.",
            rightText: "I'll need to be a beginner again but the challenge will be worth it.",
            leftType: "sunkCost",
            rightType: "reframe"
        },
        {
            id: 10,
            leftText: "Walking away means giving up my dream.",
            rightText: "Dreams evolve. I can honor what was and still create new ones.",
            leftType: "sunkCost",
            rightType: "reframe"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Sunk Cost Fallacy!",
        descriptions: [
            "The sunk cost fallacy keeps us stuck in situations because we've already invested time, money, or energy - even when moving on would be better for us.",
            "Today, we'll explore how to recognize this cognitive bias and reframe your thinking to make decisions based on your future, not your past investments."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "How to identify sunk cost thinking patterns" },
                { id: 2, text: "Powerful reframes to break free from past investments" },
                { id: 3, text: "How to make decisions based on future potential" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you recognize and reframe sunk cost thinking in your own life.",
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "5",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Sunk Cost Fallacy",
            journalInstruction: "Before we begin, reflect on areas in your life where you might be holding on because of past investments rather than future potential. What feels hardest to let go of?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "The Sunk Cost Fallacy",
        descriptions: [
            "You haven't wasted your years in dance. Match each sunk-cost thought with a reframe that opens new doors."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which sunk cost reframe resonated most with you?",
            "Take a moment to reflect on how these reframes might apply to your own life and decisions."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "5",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Sunk Cost Fallacy",
            journalInstruction: "Where in your life are you holding on because of past investments rather than future potential? How can you apply the reframes from today's exercise?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Cutting Your Losses",
        descriptions: [
            "If you're ready for a shift, there's no point staying where you are. The sunk cost fallacy keeps dancers stuck in a cycle, only making it harder and harder to step away.",
            "Nothing has been wasted. It was an incredible chapter that doesn't just evaporate. You might be surprised how much of your experiences you can bring with you on the other side.",
            "Check out this additional resource to learn more about overcoming sunk cost thinking:"
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID",
        alternativeClosing: "We'll see you again tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="The Sunk Cost Fallacy"
            gameInstructions="Tap to match sunk-cost thoughts with their reframes"
            leftColumnTitle="Sunk-Cost"
            rightColumnTitle="Reframe"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}