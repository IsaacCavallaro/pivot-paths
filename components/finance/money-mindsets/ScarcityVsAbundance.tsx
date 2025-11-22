import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface ScarcityVsAbundanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function ScarcityVsAbundance({ onComplete, onBack }: ScarcityVsAbundanceProps) {
    const pairs = [
        {
            id: 1,
            leftText: "I should be grateful for what I have.",
            rightText: "I can be grateful and still build wealth for myself and my family.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 2,
            leftText: "Money will always be tight.",
            rightText: "Money can be plentiful if I just learn how to manage it.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 3,
            leftText: "Negotiating makes me look greedy.",
            rightText: "Negotiating shows I value my time and talent.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 4,
            leftText: "There's only so much work to go around.",
            rightText: "There are endless ways to earn and create.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 5,
            leftText: "I can't afford to invest in myself.",
            rightText: "Investing in myself multiplies my opportunities.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 6,
            leftText: "If I earn more, others will have less.",
            rightText: "The more I earn, the more I can give and share.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 7,
            leftText: "Debt is a normal part of life.",
            rightText: "I deserve to live within my means and without the stress of debt.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 8,
            leftText: "I'll never catch up after past mistakes.",
            rightText: "I can learn, grow, and make better choices now.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 9,
            leftText: "Money stresses me out.",
            rightText: "Money gives me breathing room and clarity.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        },
        {
            id: 10,
            leftText: "Being underpaid is normal and I'm used to it.",
            rightText: "It feels uncomfortable but I'm ready to earn more.",
            leftType: "scarcityThought",
            rightType: "abundanceReframe"
        }
    ];

    const welcomeScreen = {
        title: "Welcome Back!",
        descriptions: [
            "Today, we're exploring how our mindset about scarcity and abundance shapes our relationship with money.",
            "Many of us carry scarcity thinking that limits our earning potential and financial freedom."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "How to identify scarcity thinking patterns" },
                { id: 2, text: "Powerful abundance reframes for common money beliefs" },
                { id: 3, text: "How to shift from limitation to possibility thinking" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you transform scarcity thoughts into abundance mindsets.",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Scarcity Vs Abundance",
            journalInstruction: "Before we begin, let's take a moment to check in with yourself. What are your current thoughts about scarcity and abundance? Do you notice any patterns in how you think about money?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Scarcity vs Abundance Match Game",
        descriptions: [
            "As dancers, we've been taught to accept less… low pay, \"exposure gigs,\" and the starving artist life. But what if you flipped the script? Let's explore scarcity vs. abundance thinking by matching the scarcity thought with the abundance reframe."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which scarcity thought feels most familiar to you?",
            "Take a moment to reflect on the scarcity and abundance mindsets you encountered."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Scarcity Vs Abundance",
            journalInstruction: "Which scarcity thought are you still holding onto? Why does it feel true to you?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Aim for Abundance",
        descriptions: [
            "Money isn't the enemy… it's the fuel that allows you to take risks, rest, and grow.",
            "You're allowed to want more. You're allowed to earn more. And you're allowed to create a life where your worth isn't tied to how much you sacrifice.",
            "Watch this 5 min clip for more ideas about shifting from scarcity to abundance thinking!"
        ],
        videoLink: "https://www.youtube.com/watch?v=1J26CRRwr-k",
        alternativeClosing: "Get ready for tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Scarcity vs Abundance"
            gameInstructions="Tap to match scarcity thoughts with their abundance reframes"
            leftColumnTitle="Scarcity Thought"
            rightColumnTitle="Abundance Reframe"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}