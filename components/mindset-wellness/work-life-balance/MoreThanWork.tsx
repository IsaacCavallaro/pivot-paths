import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface MoreThanWorkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MoreThanWork({ onComplete, onBack }: MoreThanWorkProps) {
    const introScreen = {
        title: "More Than Your Work",
        descriptions: [
            "As a dancer, you lived and breathed it. We all did! But now, we're going to do things differently. Of course, we hope you find meaningful work off the stage. But we also want to make sure you're still *you,* in ways that have nothing to do with your job. Here are some action ideas to remind you that you're more than work.",
        ],
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "3",
            category: "Mindset and Wellness",
            pathTitle: "Work Life Balance",
            dayTitle: "More Than Work",
            journalInstruction: "Before we begin, take a moment to reflect: How do you currently define yourself outside of your work identity?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's Start",
    };

    const secondaryIntroScreen = {
        title: "Discover Your Whole Self",
        descriptions: [
            "Let's explore the many facets that make you who you are beyond your professional identity. These activities will help you reconnect with the parts of yourself that exist outside of work.",
        ],
        buttonText: "Begin Activities",
    };

    const cards = [
        {
            id: 1,
            prompt: "Who's someone you've shown up for recently, or who's shown up for you?",
            buttonText: "Send them a 'thinking of you' message"
        },
        {
            id: 2,
            prompt: "Where do you feel a sense of belonging outside of work?",
            buttonText: "Show up in that space this week"
        },
        {
            id: 3,
            prompt: "How do you move your body now that feels good… not to perform, but for just you?",
            buttonText: "Schedule it in"
        },
        {
            id: 4,
            prompt: "Dance let you tell stories. How else can you share your perspective?",
            buttonText: "Write down 5 ideas"
        },
        {
            id: 5,
            prompt: "What's the last thing you made that wasn't work-related?",
            buttonText: "Block out 30 minutes to create something"
        },
        {
            id: 6,
            prompt: "What topic or skill excites your curiosity right now?",
            buttonText: "Find a podcast to explore it today"
        },
        {
            id: 7,
            prompt: "What vision or idea has been floating around in your mind lately?",
            buttonText: "Map it out"
        },
        {
            id: 8,
            prompt: "When was the last time you tried something brand new?",
            buttonText: "Pick a new hobby to try this week"
        }
    ];

    const reflectionScreen = {
        title: "You're So Much More",
        description: "You're more than a dancer and you're more than the work you do next. You're a friend, a learner, a dreamer, an explorer, and so much more. Let these roles remind you that balance is about honoring *all parts of you*.",
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Honor All Parts of You",
        descriptions: [
            "Remember that your worth isn't tied to your productivity or job title. The activities you explored today are reminders that you contain multitudes - each one a valuable part of your complete identity.",
        ],
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "3",
            category: "Mindset and Wellness",
            pathTitle: "Work Life Balance",
            dayTitle: "More Than Work",
            journalInstruction: "Reflect on today's activities. Which parts of yourself felt most alive? How can you continue to nurture these aspects of your identity?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="swipe"
            primaryButtonText="Let's Start"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}
