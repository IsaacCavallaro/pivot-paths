import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface JustStartProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function JustStart({ onComplete, onBack }: JustStartProps) {
    const introScreen = {
        title: "You're Almost There!",
        descriptions: [
            "You've made it to the final day of this path! Today is all about taking action - no matter how small. Each step forward builds momentum and brings you closer to your goals.",
        ],
        journalSectionProps: {
            pathTag: "upskilling-pathfindner",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Just Start",
            journalInstruction: "Before we begin, what's one thing you're excited to explore or learn more about?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's begin",
    };

    const secondaryIntroScreen = {
        title: "Just Start",
        descriptions: [
            "Swipe through each card and commit to doing it today. Even small actions count. The goal isn't perfection - it's momentum. Pick what feels achievable and take that first step.",
        ],
        buttonText: "Get started",
    };

    const cards = [
        {
            id: 1,
            prompt: "Send one LinkedIn connection request to someone you admire",
            buttonText: "Sent!"
        },
        {
            id: 2,
            prompt: "Research one course, workshop, or webinar in a field that interests you",
            buttonText: "Done!"
        },
        {
            id: 3,
            prompt: "Write a 3-line elevator pitch about your skills and experience",
            buttonText: "Nailed it!"
        },
        {
            id: 4,
            prompt: "Reach out to a friend or former colleague to ask about their career path",
            buttonText: "Sent!"
        },
        {
            id: 5,
            prompt: "Ask someone for a small feedback or advice session",
            buttonText: "Asked!"
        },
        {
            id: 6,
            prompt: "Volunteer for a project in your community",
            buttonText: "Done!"
        },
        {
            id: 7,
            prompt: "Make a list of 3 potential roles or industries you'd like to explore",
            buttonText: "Got it!"
        },
        {
            id: 8,
            prompt: "Comment on a LinkedIn post or join a discussion in an online community",
            buttonText: "Posted!"
        },
        {
            id: 9,
            prompt: "Spend 15 minutes practicing or trying a new skill",
            buttonText: "Yes!"
        },
        {
            id: 10,
            prompt: "Reflect for 5 minutes: what's one small step you can take right now?",
            buttonText: "Start now"
        }
    ];

    const reflectionScreen = {
        title: "Building Momentum",
        description: "Taking consistent action, no matter how small, creates momentum that carries you forward. Remember that every expert was once a beginner, and every successful career transition started with a single step.",
        journalSectionProps: {
            pathTag: "upskilling-pathfindner",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Just Start",
            journalInstruction: "Reflect on your progress this week. What's one insight you've gained about yourself and your career goals?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "The Time Is Now",
        descriptions: [
            "Stop waiting for tomorrow to make a change. Each small action builds momentum toward your pivot. Keep taking steps, even tiny ones, because progress compounds over time. It won't be perfect, it won't be linear, but it can be done.",
        ],
        journalSectionProps: {
            pathTag: "upskilling-pathfindner",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Just Start",
            journalInstruction: "What's one action you'll commit to taking in the next 24 hours to continue your momentum?",
            moodLabel: "",
            saveButtonText: "Save Commitment",
        },
        alternativeClosing: "This is your life. Start now.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="swipe"
            primaryButtonText="Let's begin"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}