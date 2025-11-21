import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface LettingGoOfValidationProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LettingGoOfValidation({ onComplete, onBack }: LettingGoOfValidationProps) {
    const introScreen = {
        title: "Letting Go of Validation",
        descriptions: [
            "As dancers, we're used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet? Let's practice rewriting validation so it comes from you.",
        ],
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "2",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Letting Go Of Validation",
            journalInstruction: "Before we begin, take a moment to reflect: Where do you currently seek validation in your life and career?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's Start",
    };

    const secondaryIntroScreen = {
        title: "Letting Go of Validation",
        descriptions: [
            "As dancers, we're used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet? Let's practice rewriting validation so it comes from you.",
        ],
        buttonText: "Start Rewriting",
    };

    const cards = [
        {
            id: 1,
            oldBelief: "I need applause to feel accomplished.",
            newBelief: "I celebrate myself when I show up, try, and grow.",
            buttonText: "That's better!"
        },
        {
            id: 2,
            oldBelief: "I only know I'm good enough when others say it.",
            newBelief: "I decide what's enough for me.",
            buttonText: "Ok strong inner monologue!"
        },
        {
            id: 3,
            oldBelief: "My resume proves my worth.",
            newBelief: "I'm worthy, no matter what I've booked.",
            buttonText: "Unshakable confidence!"
        },
        {
            id: 4,
            oldBelief: "Other people's approval keeps me going.",
            newBelief: "I'm giving myself permission to feel joy and fulfillment.",
            buttonText: "Yes, that's sustainable!"
        },
        {
            id: 5,
            oldBelief: "I'll never measure up to their expectations.",
            newBelief: "I set my own standards and only need to be better than yesterday.",
            buttonText: "Growth mindset unlocked!"
        }
    ];

    const reflectionScreen = {
        title: "Internal vs External Validation",
        description: "Validation feels different when it comes from within. Practice these reframes out loud, and notice how it shifts your energy. When you validate yourself, external praise becomes extra, not essential.",
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Now It's Your Turn",
        descriptions: [
            "It's not easy to let go of external validation, especially when it's been the primary measure of success throughout your dance career. But as challenging as it is, learning to validate yourself is the key to lasting confidence and fulfillment.",
        ],
        journalSectionProps: {
            pathTag: "mindset-shifts",
            day: "2",
            category: "Mindset and Wellness",
            pathTitle: "Mindset Shifts",
            dayTitle: "Letting Go Of Validation",
            journalInstruction: "Reflect on today's practice. Which validation reframe resonated most with you, and how can you apply it in your daily life?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you tomorrow for the next step.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="flip"
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
