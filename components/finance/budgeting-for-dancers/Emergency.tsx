import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Plane, Briefcase, Heart } from 'lucide-react-native';

interface EmergencyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Emergency({ onComplete, onBack }: EmergencyProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Scenario 1: The Unexpected Audition",
            scenarioText: "It's a Tuesday afternoon. Your agent calls: there's a last-minute audition for a dream job tomorrow in Los Angeles. Flights and a hotel will cost at least $800.",
            scenarioQuestion: "What do you do?",
            choices: [
                {
                    id: 'choice1',
                    text: "Put it all on a credit card. This opportunity is worth the debt!"
                },
                {
                    id: 'choice2',
                    text: "Politely decline. You feel a pit in your stomach, but your bank account is already too tight."
                },
                {
                    id: 'choice3',
                    text: "You check your dedicated \"Opportunity Fund\", book the trip, and go to bed stress-free."
                }
            ],
            responses: [
                "The hustle is real! You're willing to bet on yourself, which is powerful. But starting a potential new job already in debt adds a layer of financial pressure that can dim the excitement.",
                "This is the reality for so many artists. The feeling of having to say 'no' to a big break because of money is one of the most frustrating parts of the industry. It can lead to burnout and resentment.",
                "Yes! Having a fund specifically for career opportunities allows you to say 'YES' without a second thought. You can focus 100% on nailing the audition, not on the receipt total."
            ],
            followUpTexts: [
                "The hustle is real, but starting a new opportunity already in debt can add pressure that dims the excitement.",
                "This is a tough reality for many artists—having to decline opportunities due to finances can lead to burnout and resentment.",
                "Having an opportunity fund means you can say YES without hesitation and focus entirely on succeeding."
            ],
            alternativeTitle: "The Big Picture",
            alternativeText: "An emergency fund turns a crisis or a huge opportunity into a simple, manageable event. It's the difference between reacting from a place of fear and responding from a place of power.",
            alternativeIcon: Plane,
            reflectionPrompt: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?"
        },
        {
            id: 2,
            scenarioTitle: "Scenario 2: The Sudden Career Pivot",
            scenarioText: "You're unexpectedly injured and you've decided to pivot! You land an entry-level interview in a new field. The job offers huge opportunities for growth but initially, it's a pay cut.",
            scenarioQuestion: "What's your move?",
            choices: [
                {
                    id: 'choice1',
                    text: "Panic and decline. You can't afford the pay cut, so you stay in the familiar grind of dance gigs."
                },
                {
                    id: 'choice2',
                    text: "Take the job but pile on extra teaching hours nights/weekends to make ends meet, risking burnout."
                },
                {
                    id: 'choice3',
                    text: "Confidently accept, knowing your emergency fund can cover the income gap for the first year."
                }
            ],
            responses: [
                "This is the classic trap. Without a buffer, it's incredibly difficult to take the initial leap into a new career, even if it has a much higher earning potential later. You're forced to prioritize short-term survival over long-term growth.",
                "This is the classic trap. Without a buffer, it's incredibly difficult to take the initial leap into a new career, even if it has a much higher earning potential later. You're forced to prioritize short-term survival over long-term growth.",
                "This is strategic. Your emergency fund acts as a 'career transition bridge'. It gives you the runway to gain experience, prove your value, and ease into life as a full-time salaried employee without the constant financial anxiety."
            ],
            followUpTexts: [
                "Without a financial buffer, it's nearly impossible to take career leaps, even when they offer much higher long-term potential.",
                "Overworking to compensate for the pay cut risks burnout and defeats the purpose of making a strategic career move.",
                "Your emergency fund bridges the income gap, allowing you to invest in your future without constant financial stress."
            ],
            alternativeTitle: "Career Transition Confidence",
            alternativeText: "Your emergency fund gives you the freedom to make strategic career moves without financial panic holding you back.",
            alternativeIcon: Briefcase,
            reflectionPrompt: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?"
        },
        {
            id: 3,
            scenarioTitle: "Scenario 3: The Family Emergency",
            scenarioText: "You get a call that a parent back home has had a medical emergency. You need to book a last-minute flight across the country and may need to stay for a while to help out.",
            scenarioQuestion: "What is your first thought?",
            choices: [
                {
                    id: 'choice1',
                    text: "\"How much will this cost?\" Your first feeling is dread, overshadowing your concern."
                },
                {
                    id: 'choice2',
                    text: "\"I need to ask my director for an advance on my pay.\" You feel uncomfortable adding a financial conversation to a stressful time."
                },
                {
                    id: 'choice3',
                    text: "\"I'll book the next flight out.\" Your first and only thought is getting home."
                }
            ],
            responses: [
                "It's heartbreaking when financial stress compounds a family crisis. The guilt and worry about money can make it impossible to be fully present for your loved ones when they need you most.",
                "It's heartbreaking when financial stress compounds a family crisis. The guilt and worry about money can make it impossible to be fully present for your loved ones when they need you most.",
                "This is peace of mind. An emergency fund allows you to be there for your family immediately and without hesitation. It protects your relationships and your mental health during life's most difficult moments."
            ],
            followUpTexts: [
                "When financial stress compounds a family crisis, it becomes nearly impossible to be fully present for loved ones when they need you most.",
                "Adding financial negotiations to an already stressful situation creates unnecessary burden during a difficult time.",
                "With an emergency fund, you can focus entirely on being there for your family without financial worry clouding the moment."
            ],
            alternativeTitle: "Family First, Financially Secure",
            alternativeText: "An emergency fund ensures you can be there for your loved ones without financial stress adding to an already difficult situation.",
            alternativeIcon: Heart,
            reflectionPrompt: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?"
        }
    ];

    const welcomeScreen = {
        title: "Your Financial Safety Net",
        descriptions: [
            "Life is full of surprises. An emergency fund isn't just money in the bank… it's your ticket to handling a crisis with grace, not panic.",
            "Let's walk through a few scenarios. Choose what you'd do, and we'll show you how a safety net changes the game."
        ],
        learningBox: {
            title: "What You'll Explore",
            items: [
                { id: 1, text: "How to handle unexpected career opportunities" },
                { id: 2, text: "Navigating career transitions with confidence" },
                { id: 3, text: "Being there for family during emergencies" },
                { id: 4, text: "Building financial peace of mind" }
            ]
        },
        welcomeFooter: "Your emergency fund is more than just savings—it's your freedom to make choices that align with your values, not just your bank account.",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "4",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Emergency",
            journalInstruction: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?",
            moodLabel: "",
            saveButtonText: "Save Reflection"
        },
        buttonText: "Begin Scenarios"
    };

    const engineIntroScreen = {
        title: "Emergency Scenarios",
        descriptions: [
            "Let's explore how a financial safety net can transform your ability to handle life's unexpected moments. Choose what you'd do in each scenario."
        ],
        buttonText: "Begin"
    };

    const reflectionScreen = {
        title: "Your Financial Safety Net",
        descriptions: [
            "An emergency fund isn't about being paranoid. It's about being prepared. It's the key that unlocks:",
            "• Career Opportunities without debt",
            "• Career Transitions without panic",
            "• Family Support without hesitation",
            "Your first goal is $500. Then go for one month's expenses. Then three. Start building your safety net today. You never know when you'll need to use it, but you'll always be glad it's there."
        ],
        reflectionEmphasis: "Remember, small consistent steps build your emergency fund. Even $20 per week adds up to over $1,000 in a year. Start where you are and build from there.",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "4",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Emergency",
            journalInstruction: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?",
            moodLabel: "",
            saveButtonText: "Save Reflection"
        },
        buttonText: "Mark As Complete"
    };

    const finalScreen = {
        title: "Your Financial Safety Net",
        descriptions: [
            "An emergency fund isn't about being paranoid. It's about being prepared. It's the key that unlocks:",
            "• Career Opportunities without debt",
            "• Career Transitions without panic",
            "• Family Support without hesitation",
            "Your first goal is $500. Then go for one month's expenses. Then three. Start building your safety net today. You never know when you'll need to use it, but you'll always be glad it's there."
        ],
        alternativeClosing: "Remember, small consistent steps build your emergency fund. Even $20 per week adds up to over $1,000 in a year. Start where you are and build from there.",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "4",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Emergency",
            journalInstruction: "Which emergency scenario resonated most with you, and what would having a financial safety net mean for your peace of mind?",
            moodLabel: "",
            saveButtonText: "Save Reflection"
        },
        buttonText: "Mark As Complete"
    };

    return (
        <RoleplayPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            engineTitle="Your Financial Safety Net"
            engineInstructions="Handle life's surprises with confidence"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}