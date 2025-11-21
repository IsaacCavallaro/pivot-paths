import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Zap } from 'lucide-react-native';

interface AskForMoreProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function AskForMore({ onComplete, onBack }: AskForMoreProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Salary Negotiation Scenario",
            scenarioText: "You just had a great interview for a new contract role at a reputable company. The hiring manager says, \"We'd love to have you! The salary we'd like to offer you is $50,000. Does that work for you?\"",
            scenarioQuestion: "What do you do?",
            choices: [
                {
                    id: 'choice1',
                    text: "\"Yes, that's fine!\" You accept immediately, pushing down the feeling that you're undervaluing yourself."
                },
                {
                    id: 'choice2',
                    text: "\"Thank you! I'm really excited to get started. Based on my [X years] of experience and the industry standard, my salary expectation is $65,000. Is that possible?\" You negotiate politely and professionally."
                },
                {
                    id: 'choice3',
                    text: "\"No, thank you.\" You decline and walk away, feeling frustrated."
                }
            ],
            responses: [
                "The people-pleasing instinct is real! You've secured the job, which feels safe. But saying \"yes\" too quickly often leads to resentment later. When you undercharge, you not only lose income but also signal that your expertise is worth less, making it harder to raise your rates later.",
                "Outstanding! You've shown confidence and professionalism. You stated your value clearly, based on research, and left the door open for a conversation. This is how you build a career based on respect, not just gigs.",
                "You're protecting your boundaries and refusing to be undervalued, which is powerful. However, walking away from a negotiation without a conversation can close doors. A direct but polite counteroffer often gets you closer to your goal without burning a bridge."
            ],
            alternativeTitle: "Remember This",
            alternativeText: "Negotiation is a normal part of business. The worst they can say is \"no,\" and you can then decide whether to accept their original rate or not.\n\nBut you'd be surprised how often they say \"yes,\" or meet you in the middle. That extra $5,000 or $10,000 can go a long way and becomes much harder to ask for once you're in the role.\n\nBack yourself and ask for more.",
            alternativeIcon: Zap,
            formula: {
                title: "Polite, Prepared Negotiation",
                text: "You don't have to be aggressive to be effective. Here's a simple script you can adapt:",
                steps: [
                    {
                        number: 1,
                        title: "Show Enthusiasm",
                        text: "\"Thank you so much for the offer! I'm really excited about the opportunity to work with you.\""
                    },
                    {
                        number: 2,
                        title: "State Your Rate Clearly",
                        text: "\"Based on my [number] years of professional experience and certification in [specific skill], my salary expectations fall between $X and $X.\""
                    },
                    {
                        number: 3,
                        title: "Open the Door for Discussion",
                        text: "\"I am very flexible and would love to make this work. Is there room to adjust the offer to match my experience?\""
                    }
                ],
                note: "This approach is collaborative, not confrontational."
            },
            reflectionPrompt: "What would change in your life if you felt confident negotiating your worth in every professional situation?"
        }
    ];

    const welcomeScreen = {
        title: "Ask for More",
        descriptions: [
            "In the dance world, talking about money can feel uncomfortable. But knowing your value and advocating for it is a non-negotiable skill for financial futureproofing.",
            "Let's practice. Choose how you'd handle this common scenario."
        ],
        learningBox: {
            title: "What You'll Learn",
            items: [
                { id: 1, text: "How to negotiate with confidence" },
                { id: 2, text: "Professional scripts for asking for more" },
                { id: 3, text: "Overcoming people-pleasing tendencies" },
                { id: 4, text: "Setting your financial worth" }
            ]
        },
        welcomeFooter: "This practice will give you concrete tools to advocate for your financial value in any professional situation.",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Ask For More",
            journalInstruction: "What would change in your life if you felt confident negotiating your worth in every professional situation?",
            moodLabel: "",
            saveButtonText: "Save Entry"
        },
        buttonText: "Begin Practice"
    };

    const engineIntroScreen = {
        title: "Salary Negotiation Scenario",
        descriptions: [
            "You just had a great interview for a new contract role at a reputable company. The hiring manager says, \"We'd love to have you! The salary we'd like to offer you is $50,000. Does that work for you?\"",
            "You know that for your experience and in this city, average salaries range between $60,000 to $80,000."
        ],
        buttonText: "See Your Options"
    };

    const reflectionScreen = {
        title: "Your Negotiation Power",
        descriptions: [
            "You now have the tools to confidently negotiate your worth. Remember that asking for what you deserve is not greedy—it's professional and shows self-respect.",
            "Every time you advocate for your financial value, you're not just earning more money—you're building a career based on mutual respect and professional boundaries.",
            "Take a moment to reflect on how you can apply these negotiation skills in your current or next professional opportunity."
        ],
        reflectionEmphasis: "Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Ask For More",
            journalInstruction: "What would change in your life if you felt confident negotiating your worth in every professional situation?",
            moodLabel: "",
            saveButtonText: "Save Entry"
        },
        buttonText: "Mark As Complete"
    };

    const finalScreen = {
        title: "Your Negotiation Power",
        descriptions: [
            "You now have the tools to confidently negotiate your worth. Remember that asking for what you deserve is not greedy—it's professional and shows self-respect.",
            "Every time you advocate for your financial value, you're not just earning more money—you're building a career based on mutual respect and professional boundaries.",
            "Take a moment to reflect on how you can apply these negotiation skills in your current or next professional opportunity."
        ],
        videoLink: "https://www.youtube.com/shorts/s-hpQ9XBGP4",
        alternativeClosing: "See you tomorrow.",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Ask For More",
            journalInstruction: "What would change in your life if you felt confident negotiating your worth in every professional situation?",
            moodLabel: "",
            saveButtonText: "Save Entry"
        },
        buttonText: "Mark As Complete"
    };

    return (
        <RoleplayPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            engineTitle="Ask for More"
            engineInstructions="Practice negotiating with confidence and professionalism"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}