import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface InvestmentInvestigationProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function InvestmentInvestigation({ onComplete, onBack }: InvestmentInvestigationProps) {
    const pairs = [
        {
            id: 1,
            leftText: "401(k)/403(b)",
            rightText: "An employer-sponsored retirement account. The biggest perk is often the company match.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 2,
            leftText: "Roth IRA",
            rightText: "A retirement account you fund with after-tax money. Your investments grow completely tax-free.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 3,
            leftText: "ETF / Index Fund",
            rightText: "A single investment that automatically holds hundreds of companies. It's built for diversification.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 4,
            leftText: "Stocks (Shares)",
            rightText: "A piece of ownership in a single company. High potential growth, but higher risk.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 5,
            leftText: "Health Savings Account (HSA)",
            rightText: "An account for medical expenses. It's the only account that is triple-tax-advantaged.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 6,
            leftText: "Cryptocurrency",
            rightText: "A highly volatile, decentralized digital asset. It's considered a speculative investment.",
            leftType: "term",
            rightType: "definition"
        },
        {
            id: 7,
            leftText: "High-Yield Savings Account",
            rightText: "A safe place for your cash that earns a much higher interest rate than a standard bank account.",
            leftType: "term",
            rightType: "definition"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Investment Investigation!",
        descriptions: [
            "Building wealth means knowing both where to put your money (your accounts) and what to put in it (your investments).",
            "Today, we're exploring the fundamental building blocks of investing to help you become a more confident investor."
        ],
        learningBox: {
            title: "What You'll Learn:",
            items: [
                { id: 1, text: "Key investment accounts and their benefits" },
                { id: 2, text: "Different types of investment vehicles" },
                { id: 3, text: "How to match the right investments to your goals" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you understand and remember these important financial concepts.",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Investment Investigations",
            journalInstruction: "Before we begin, let's take a moment to check in with your current knowledge. What investment terms are you already familiar with? What would you like to learn more about?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Investment Investigation",
        descriptions: [
            "Let's match investment terms with their definitions to build your financial knowledge foundation."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which investment concept was most surprising or new to you?",
            "Take a moment to reflect on what you've learned about different investment options."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Investment Investigations",
            journalInstruction: "Which investment account or concept are you most interested in exploring further? Why does it appeal to you?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "You're Thinking Like an Investor!",
        descriptions: [
            "This is not financial or investment advice. This game is simply an educational guide to basic definitions.",
            "The right choices for you depend on your personal financial situation, goals, and risk tolerance. We strongly encourage you to use these definitions as a starting point for your own research or to consult with a qualified financial advisor before making any investment decisions.",
            "Check out this additional resource to learn more about investment basics:"
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID",
        alternativeClosing: "See you tomorrow for more.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Investment Investigation"
            gameInstructions="Tap to match investment terms with their definitions"
            leftColumnTitle="Term"
            rightColumnTitle="Meaning"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}