import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface BeyondYourIdentityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function BeyondYourIdentity({ onComplete, onBack }: BeyondYourIdentityProps) {
    const pairs = [
        {
            id: 1,
            leftText: "My worth is tied to my achievements.",
            rightText: "My worth is inherent, not earned.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 2,
            leftText: "I am only [My old identity].",
            rightText: "I am constantly evolving and open to new identities.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 3,
            leftText: "Failure means I'm not good enough.",
            rightText: "Failure is a stepping stone to growth.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 4,
            leftText: "I need external validation to feel secure.",
            rightText: "My inner voice guides my self-worth.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
        {
            id: 5,
            leftText: "I have to be perfect to be loved.",
            rightText: "I am loved for who I am, imperfections and all.",
            leftType: "oldBelief",
            rightType: "reframe"
        },
    ];

    const welcomeScreen = {
        title: "Beyond Your Identity",
        descriptions: [
            "As dancers, our identity is often deeply intertwined with our art. But what happens when the stage goes dark, or our career path shifts?",
            "Today, we'll explore how to gracefully transition beyond an old identity, recognizing that you are more than any single role you play."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "How to identify limiting beliefs tied to past identities" },
                { id: 2, text: "Strategies for reframing self-worth beyond external roles" },
                { id: 3, text: "The power of embracing fluidity in self-perception" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you detach from old beliefs and embrace a more expansive view of yourself.",
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "3",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Beyond Your Identity",
            journalInstruction: "Before we begin, reflect: What identity has been most central to your life so far? How does the thought of moving beyond it make you feel?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Embrace a Broader Self",
        descriptions: [
            "It's time to challenge those ingrained beliefs about who you 'should' be. Match the old beliefs with new reframes to expand your sense of self."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Your Evolving Self",
        descriptions: [
            "You've begun the powerful work of reframing your identity. It's not about abandoning who you were, but integrating your past experiences into a richer, more expansive sense of who you are becoming."
        ],
        reflectionEmphasis: "Which reframe resonated most deeply with you? How does it feel to consider this new perspective?",
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "3",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Beyond Your Identity",
            journalInstruction: "Reflect on today's session. What new insight did you gain about your identity beyond your past roles? How can you carry this forward?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "You Are Limitless",
        descriptions: [
            "Your identity is not a fixed destination; it's a dynamic journey. Every experience, every challenge, every pivot adds a new layer to the magnificent person you are.",
            "Embrace the freedom of being more than any single role. Your true self is vast, resilient, and always evolving."
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID_HERE", // Replace with actual YouTube video ID
        alternativeClosing: "See you tomorrow for your next mindset shift.",
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "3",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Beyond Your Identity",
            journalInstruction: "As you move forward, how will you consciously nurture a broader, more expansive sense of your identity?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Beyond Your Identity"
            gameInstructions="Tap to match old beliefs with empowering reframes"
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
