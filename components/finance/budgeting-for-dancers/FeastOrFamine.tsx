import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface FeastOrFamineProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function FeastOrFamine({ onComplete, onBack }: FeastOrFamineProps) {
    const pairs = [
        {
            id: 1,
            leftText: "My income is unpredictable, so I can't budget.",
            rightText: "A budget is your most powerful tool for managing unpredictability.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 2,
            leftText: "When I have a big paycheck, I deserve to splurge.",
            rightText: "A big paycheck is my chance to prepare for the lean months ahead.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 3,
            leftText: "I'll never get ahead because it's always feast or famine.",
            rightText: "The \"feast\" periods are what fund my stability during the \"famine.\"",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 4,
            leftText: "My bank account balance is what I can spend.",
            rightText: "My available money is my balance minus my upcoming bills.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 5,
            leftText: "I can't save money until I have a steady job.",
            rightText: "I can start building a savings buffer with any amount, right now.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 6,
            leftText: "It's pointless to plan because I don't know what I'll earn.",
            rightText: "Planning based on my average income creates stability.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 7,
            leftText: "All my financial problems would be solved with a higher income.",
            rightText: "Without a system, more money often just leads to more spending.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 8,
            leftText: "I'm just bad with money.",
            rightText: "I'm not bad with money. I just need a system that works for my unique income.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 9,
            leftText: "Freelancers can't get loans or mortgages.",
            rightText: "Lenders look for consistent average income and good credit, not just a salaried job.",
            leftType: "thought",
            rightType: "reality"
        },
        {
            id: 10,
            leftText: "I should just accept the stress as part of the gig.",
            rightText: "Financial stress is optional, not a mandatory part of being a dancer.",
            leftType: "thought",
            rightType: "reality"
        }
    ];

    const welcomeScreen = {
        title: "Welcome Back!",
        descriptions: [
            "Today we're exploring the financial mindsets that keep dancers stuck in the \"feast or famine\" cycle.",
            "Many dancers struggle with variable income and develop thought patterns that can actually increase financial stress."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "Common financial thoughts that increase stress" },
                { id: 2, text: "Practical realities to counter these thoughts" },
                { id: 3, text: "How to build financial stability with variable income" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you identify and challenge the financial thoughts that might be holding you back.",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "6",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Feast Or Famine",
            journalInstruction: "Before we begin, let's check in with your current financial mindset. How are you feeling about money today? What thoughts come up when you think about budgeting with variable income?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Feast or Famine",
        descriptions: [
            "Living with a variable income creates its own set of myths. Let's bust the ones that keep you stuck in a cycle of financial stress.",
            "Match the common thought to the practical reality to help you build your buffers and prepare for your pivot."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which financial thought feels most true to you right now?",
            "Take a moment to reflect on the thoughts and realities you encountered."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "6",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Feast Or Famine",
            journalInstruction: "Which financial thought are you still holding onto? What would it take for you to embrace the practical reality instead?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Great Work!",
        descriptions: [
            "The \"feast or famine\" cycle doesn't have to control you. By planning for the dips during the peaks, you take back control.",
            "Your financial stability isn't about how much you make in one month. It's about the system you build over time."
        ],
        alternativeClosing: "See you tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Feast or Famine"
            gameInstructions="Tap to match common thoughts with their practical realities"
            leftColumnTitle="Common Thought"
            rightColumnTitle="Practical Reality"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}