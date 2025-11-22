import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface DealBreakerGameProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function DealBreakerGame({ onComplete, onBack }: DealBreakerGameProps) {
    const pairs = [
        {
            id: 1,
            leftText: "No creative freedom",
            rightText: "Rigid, highly structured corporate roles",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 2,
            leftText: "Low flexibility",
            rightText: "Jobs with strict 9–5 schedules and no hybrid options",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 3,
            leftText: "Constant public scrutiny",
            rightText: "Front-facing client roles or media positions",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 4,
            leftText: "Minimal social interaction",
            rightText: "Remote or solitary work without collaboration",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 5,
            leftText: "Unclear expectations",
            rightText: "Roles with no defined processes or guidance",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 6,
            leftText: "Repetitive tasks",
            rightText: "Roles with limited variety or creativity like data entry or admin",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 7,
            leftText: "Lack of growth opportunities",
            rightText: "Positions with little training or promotion potential",
            leftType: "dealBreaker",
            rightType: "environment"
        },
        {
            id: 8,
            leftText: "Low autonomy",
            rightText: "Jobs requiring constant supervision",
            leftType: "dealBreaker",
            rightType: "environment"
        }
    ];

    const welcomeScreen = {
        title: "Welcome Back!",
        descriptions: [
            "Today, we're exploring deal breakers - those non-negotiable factors that can make or break your satisfaction in a career.",
            "Understanding what you won't accept is just as important as knowing what you do want. This clarity will help you evaluate opportunities with confidence."
        ],
        learningBox: {
            title: "What You'll Discover:",
            items: [
                { id: 1, text: "Your personal deal breakers in work environments" },
                { id: 2, text: "Types of situations to avoid in your career search" },
                { id: 3, text: "How to protect your wellbeing and values" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help identify deal breakers and the environments they align with.",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Deal Breakers",
            journalInstruction: "Before we begin, reflect on your past experiences. What work situations have made you feel drained or unhappy? What environments have felt energizing?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Deal Breakers",
        descriptions: [
            "Match each deal breaker with the type of work environment or situation it aligns with. These will be the circumstances to avoid."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Take a moment to reflect",
        descriptions: [
            "Which deal breakers stood out to you the most?",
            "How might these influence your career choices?",
            "Did you notice that a lot of what you might consider deal breakers in other industries actually already exist in your dance career?"
        ],
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Deal Breakers",
            journalInstruction: "Reflect on your deal breakers. Which ones feel most important to you? Are there any that surprised you?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Great Work!",
        descriptions: [
            "Knowing what you won't accept is just as important as knowing what you do want. Use these insights to guide your next steps and evaluate new opportunities with clarity and confidence."
        ],
        alternativeClosing: "See you tomorrow for the final step!",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Deal Breakers"
            gameInstructions="Tap to match deal breakers with their environments"
            leftColumnTitle="Deal Breaker"
            rightColumnTitle="Environment"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}