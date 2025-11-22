import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface OvercomeAnalysisParalysisProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function OvercomeAnalysisParalysis({ onComplete, onBack }: OvercomeAnalysisParalysisProps) {
    const pairs = [
        {
            id: 1,
            leftText: "I don't know enough yet",
            rightText: "Start learning for free on YouTube",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 2,
            leftText: "What if I fail?",
            rightText: "Start towards your goal today and aim to fail faster",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 3,
            leftText: "I need more research first",
            rightText: "Take action into the unknown",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 4,
            leftText: "I'll never be ready",
            rightText: "Take the first step before you feel ready",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 5,
            leftText: "I don't have the right connections",
            rightText: "Reach out to one person in your network",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 6,
            leftText: "I don't have time",
            rightText: "Set a 15-minute time block to start",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 7,
            leftText: "I need perfect clarity first",
            rightText: "Draft a rough plan and aim for completion, not perfection",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 8,
            leftText: "I can't do it alone",
            rightText: "Ask one person for feedback or help",
            leftType: "thought",
            rightType: "action"
        },
        {
            id: 9,
            leftText: "I should wait until inspiration hits",
            rightText: "Take action through discipline, not motivation",
            leftType: "thought",
            rightType: "action"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Overcome Analysis Paralysis!",
        descriptions: [
            "Analysis paralysis happens when overthinking prevents you from taking action. The key is to break the cycle with small, deliberate steps.",
            "Today, we'll help you recognize common overthinking patterns and pair them with actionable solutions."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "How to identify overthinking thoughts" },
                { id: 2, text: "Actionable strategies to break through paralysis" },
                { id: 3, text: "Building momentum through small, consistent actions" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you recognize and overcome analysis paralysis in real-time.",
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "5",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Overcome Analysis Paralysis",
            journalInstruction: "Before we begin, let's take a moment to reflect. What decisions or actions have you been putting off due to overthinking? What thoughts typically hold you back?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Overcome Analysis Paralysis",
        descriptions: [
            "Match the thought that keeps you stuck with the action that breaks the pattern."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which thought-action pair resonated most with your current situation?",
            "Take a moment to reflect on how you can apply these action strategies to your own goals."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "5",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Overcome Analysis Paralysis",
            journalInstruction: "Which action strategy feels most helpful for overcoming your current analysis paralysis? How can you implement it starting today?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Action > Analysis",
        descriptions: [
            "Great job! Notice how each overthinking thought can be paired with a small action.",
            "When you take one step, momentum grows, and the next step becomes easier.",
            "It's always good to have a plan, but the hard part isn't talking the talk, it's walking the walk.",
            "Check out this additional resource to learn more about overcoming analysis paralysis:"
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID",
        alternativeClosing: "Take action today and we'll see you again tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Overcome Analysis Paralysis"
            gameInstructions="Tap to match overthinking thoughts with breakthrough actions"
            leftColumnTitle="Thought"
            rightColumnTitle="Action"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}