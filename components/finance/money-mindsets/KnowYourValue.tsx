import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface KnowYourValueProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function KnowYourValue({ onComplete, onBack }: KnowYourValueProps) {
    const introScreen = {
        title: "Know Your Value",
        descriptions: [
            "You're doing incredible work digging into your money mindset. This isn't easy, but you're showing up and doing the work. Let's continue building that foundation of self-worth.",
        ],
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "2",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Know Your Value",
            journalInstruction: "Before we begin, take a moment to reflect on your current relationship with money and self-worth. What comes up for you?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's go",
    };

    const secondaryIntroScreen = {
        title: "Know Your Value",
        descriptions: [
            "In dance, it's common to be underpaid or told you should \"do it for exposure\". That conditioning sticks. But your skills are worth real money and you deserve to ask for it.",
        ],
        buttonText: "Rewrite the story",
    };

    const cards = [
        {
            id: 1,
            oldBelief: "I don't want to seem greedy if I ask for more.",
            newBelief: "Asking for fair pay is respecting myself, not being greedy.",
            buttonText: "Exactly!"
        },
        {
            id: 2,
            oldBelief: "I should be grateful for any opportunity.",
            newBelief: "Gratitude doesn't mean undercutting myself. I can be thankful and well-compensated.",
            buttonText: "So true!"
        },
        {
            id: 3,
            oldBelief: "I can't negotiate. I might lose the job.",
            newBelief: "Negotiation shows confidence. The right opportunity won't disappear just because I ask.",
            buttonText: "Totally!"
        },
        {
            id: 4,
            oldBelief: "Money doesn't matter if I love what I do.",
            newBelief: "Loving what I do and earning well is possible. Passion and pay can co-exist.",
            buttonText: "Amen!"
        },
        {
            id: 5,
            oldBelief: "I should just take what's offered.",
            newBelief: "Taking what's offered keeps me stuck. Asking for more raises the bar, for me and for others.",
            buttonText: "So good!"
        },
        {
            id: 6,
            oldBelief: "I'm not experienced enough to charge more.",
            newBelief: "Experience isn't just years on paper. My unique background already adds value.",
            buttonText: "Yes ma'am!"
        },
        {
            id: 7,
            oldBelief: "I don't see myself in a high-paying role.",
            newBelief: "Undervaluing myself was part of the dance world's culture. That doesn't have to be my future.",
            buttonText: "Onwards and upwards!"
        }
    ];

    const reflectionScreen = {
        title: "You Deserve It",
        description: "You've spent years (and maybe decades) delivering excellence for less than you're worth. That doesn't mean you're 'worthless', it means the system was broken.\n\nFrom here on, you get to set new standards for yourself. Advocate, negotiate, and expect more. You deserve it.",
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Own Your Worth",
        descriptions: [
            "You've taken powerful steps today to rewrite your money story and recognize your true value. This foundation will serve you in every negotiation and career decision moving forward.",
        ],
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "2",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Know Your Value",
            journalInstruction: "Reflect on today's exercise. What new insights do you have about your worth? How will you carry this forward?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you tomorrow for more money mindset work!",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="flip"
            primaryButtonText="Let's go"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}