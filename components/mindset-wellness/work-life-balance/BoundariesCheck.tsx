import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface BoundariesCheckProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function BoundariesCheck({ onComplete, onBack }: BoundariesCheckProps) {
    const pairs = [
        {
            id: 1,
            leftText: "Boss asks you to take on extra tasks late at night",
            rightText: "Politely decline and schedule for next day",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 2,
            leftText: "Friend invites you to a social event after a long workday",
            rightText: "Suggest another time or shorter visit",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 3,
            leftText: "Feeling overwhelmed with email",
            rightText: "Schedule focused email blocks, turn off notifications",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 4,
            leftText: "Colleague interrupts your focus",
            rightText: "Use headphones or set 'do not disturb'",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 5,
            leftText: "Saying yes to every social invite",
            rightText: "Choosing one or two social events you *really* want to attend",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 6,
            leftText: "Checking emails late at night",
            rightText: "Clocking off at 5pm and not checking until the next day",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 7,
            leftText: "Skipping meals to \"get it all done\"",
            rightText: "Scheduling breaks to be as important as your other \"to-dos\"",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 8,
            leftText: "Taking on tasks to avoid disappointing others",
            rightText: "Saying \"I'd love to, but I can't right now.\"",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 9,
            leftText: "Overcommitting to multiple hobbies at once",
            rightText: "Starting with just *one* new interest at a time",
            leftType: "scenario",
            rightType: "response"
        },
        {
            id: 10,
            leftText: "Feeling guilty for resting",
            rightText: "Recognizing rest as part of productivity",
            leftType: "scenario",
            rightType: "response"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Boundaries Check!",
        descriptions: [
            "As dancers, we're used to saying \"yes\" to everything: extra rehearsals, extra shifts, extra favors. But outside of dance, that same habit can drain your energy.",
            "Today, we're practicing how to spot and establish healthy boundaries to protect your time, energy, and well-being."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "How to recognize boundary-crossing scenarios" },
                { id: 2, text: "Healthy responses to protect your energy" },
                { id: 3, text: "Practical strategies for work-life balance" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you practice identifying and responding to common boundary challenges.",
        journalSectionProps: {
            pathTag: "work-life-balance",
            day: "4",
            category: "Mindset and Wellness",
            pathTitle: "Work Life Balance",
            dayTitle: "Boundaries Check",
            journalInstruction: "Before we begin, let's take a moment to check in with your current boundary habits. What areas of your life feel most challenging when it comes to setting boundaries? What would you like to improve?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Boundaries Check",
        descriptions: [
            "Let's match common boundary scenarios with healthy responses to build your boundary-setting skills."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which boundary scenario felt most familiar or challenging to you?",
            "Take a moment to reflect on what you've learned about setting healthy boundaries."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "work-life-balance",
            day: "4",
            category: "Mindset and Wellness",
            pathTitle: "Work Life Balance",
            dayTitle: "Boundaries Check",
            journalInstruction: "Which boundary response are you most interested in practicing in your own life? What makes it challenging for you?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "You're Building Better Boundaries!",
        descriptions: [
            "Boundaries aren't walls. They're guardrails that protect your energy. Notice one area where you might need stronger boundaries right now.",
            "Check out this additional resource to learn more about setting healthy boundaries:",
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID", // Replace with actual video ID if available
        alternativeClosing: "See you tomorrow for more.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Boundaries Check"
            gameInstructions="Tap to match scenarios with healthy boundary responses"
            leftColumnTitle="Scenario"
            rightColumnTitle="Response"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}
