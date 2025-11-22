import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';

interface MeetYourMustHavesProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MeetYourMustHaves({ onComplete, onBack }: MeetYourMustHavesProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Spotify Premium vs Gym membership",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Spotify Premium or Gym membership?",
                choice1: "Spotify Premium",
                choice2: "Gym membership",
                response1: "Spotify Premium is non-negotiable for you, allowing you to stream with no ads.",
                response2: "Staying fit and healthy with a gym membership is essential for you."
            },
            alternativeText: "Your choice reveals your priorities in entertainment versus health.",
            reflectionPrompt: "What does your choice between entertainment and fitness say about your current priorities?"
        },
        {
            id: 2,
            scenarioTitle: "Daily coffee vs Streaming subscriptions",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Daily coffee or Streaming subscriptions?",
                choice1: "Daily coffee",
                choice2: "Streaming subscriptions",
                response1: "Your daily joy comes from small treats like your coffee habit, a ritual you protect.",
                response2: "You value entertainment and relaxation, choosing a full suite of streaming subscriptions over daily coffees. You'd rather create a cozy night in than a cafe trip."
            },
            alternativeText: "Your choice shows your preference for daily rituals versus entertainment options.",
            reflectionPrompt: "How do small daily expenses versus subscription services fit into your lifestyle?"
        },
        {
            id: 3,
            scenarioTitle: "Organic groceries vs Dining out",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Organic groceries or Dining out?",
                choice1: "Organic groceries",
                choice2: "Dining out",
                response1: "You prioritize health and quality ingredients, choosing to cook at home with your organic groceries.",
                response2: "You value convenience and social experiences, preferring to dine out at quality restaurants."
            },
            alternativeText: "Your food choices reflect your balance between health, convenience, and social life.",
            reflectionPrompt: "What role does food play in your social life and health priorities?"
        },
        {
            id: 4,
            scenarioTitle: "Dance classes vs Massage appointments",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Dance classes or Massage appointments?",
                choice1: "Dance classes",
                choice2: "Massage appointments",
                response1: "You invest in your passion and skill development through regular dance classes.",
                response2: "You prioritize recovery and self-care through regular massage appointments."
            },
            alternativeText: "Your wellness spending shows your focus on active passion versus restorative care.",
            reflectionPrompt: "How do you balance pursuing passions with taking care of your body?"
        },
        {
            id: 5,
            scenarioTitle: "New clothes vs Travel fund",
            scenarioText: "Which would you choose?",
            question1: {
                text: "New clothes or Travel fund?",
                choice1: "New clothes",
                choice2: "Travel fund",
                response1: "You believe in looking the part and presenting yourself well, investing in new clothes over a distant travel fund.",
                response2: "You clearly value experiences, choosing to put money toward your travel fund over updating your wardrobe."
            },
            alternativeText: "Your choice reveals your preference for personal presentation versus life experiences.",
            reflectionPrompt: "Do you prioritize how you present yourself or the experiences you collect?"
        },
        {
            id: 6,
            scenarioTitle: "Savings vs Investments",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Savings or Investments?",
                choice1: "Savings",
                choice2: "Investments",
                response1: "You prefer the security and accessibility of consistently contributing to your savings account.",
                response2: "You're focused on growth potential, putting money into investments for future gains."
            },
            alternativeText: "Your financial approach shows your balance between security and growth.",
            reflectionPrompt: "How do you approach the balance between financial security and potential growth?"
        },
        {
            id: 7,
            scenarioTitle: "Phone upgrade vs Concert tickets",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Phone upgrade or Concert tickets?",
                choice1: "Phone upgrade",
                choice2: "Concert tickets",
                response1: "You value having reliable, up-to-date technology for staying connected and productive.",
                response2: "You prioritize memorable experiences and live entertainment over material upgrades."
            },
            alternativeText: "Your splurge choices show your preference for practical upgrades versus memorable experiences.",
            reflectionPrompt: "When you splurge, do you lean toward practical improvements or memorable experiences?"
        },
        {
            id: 8,
            scenarioTitle: "Charity donations vs Gifts for friends and family",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Charity donations or Gifts for friends and family?",
                choice1: "Charity donations",
                choice2: "Gifts for friends and family",
                response1: "You believe in supporting causes and communities through regular charity donations.",
                response2: "You express love and appreciation through thoughtful gifts for friends and family."
            },
            alternativeText: "Your giving habits reflect your values around community support versus personal relationships.",
            reflectionPrompt: "How do you express your values through giving - to communities or loved ones?"
        },
        {
            id: 9,
            scenarioTitle: "Hair/nail appointments vs Home decor",
            scenarioText: "Which would you choose?",
            question1: {
                text: "Hair/nail appointments or Home decor?",
                choice1: "Hair or nail appointments",
                choice2: "Home decor",
                response1: "You invest in personal grooming and self-care through regular hair and nail appointments.",
                response2: "You prioritize creating a comfortable and beautiful living space through home decor."
            },
            alternativeText: "Your self-care spending shows your focus on personal presentation versus home environment.",
            reflectionPrompt: "Where do you prefer to invest in your comfort - in your personal appearance or your living space?"
        }
    ];

    const welcomeScreen = {
        title: "Meet Your Must-Haves",
        descriptions: [
            "This is a game of instincts. We're going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don't overthink it!",
            "There's no right or wrong. Let's see what you build."
        ],
        learningBox: {
            title: "What You'll Discover",
            items: [
                { id: 1, text: "Your core spending values" },
                { id: 2, text: "Patterns in your financial priorities" },
                { id: 3, text: "Areas where your money aligns with your values" },
                { id: 4, text: "Opportunities for better financial alignment" },
            ],
        },
        welcomeFooter: "Ready to uncover what truly matters to you? Let's begin!",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Meet Your Must Haves",
            journalInstruction: "Before we begin, what do you think your spending choices might reveal about your values?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Begin Choosing",
    };

    const engineIntroScreen = {
        title: "How It Works",
        descriptions: [
            "You'll go through several scenarios where you choose between different spending options.",
            "For each pair, select the option that feels most essential to you. Go with your gut instinct - don't overthink it!",
            "Your choices will build a personalized financial portrait that reveals what you truly value."
        ],
        buttonText: "Start Choosing",
    };

    const reflectionScreen = {
        title: "Your Financial Portrait",
        descriptions: [
            "Look at the patterns in your choices. Your spending reveals your values in action.",
            "A budget that fuels what you love and cuts what you don't is a budget that works for you.",
            "The goal isn't restriction, it's alignment between your money and your values."
        ],
        reflectionEmphasis: "How does this financial portrait feel?",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Meet Your Must Haves",
            journalInstruction: "How do your spending choices reflect your core values? What surprised you about your must-haves?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue to Summary",
    };

    const finalScreen = {
        title: "Your Budget Shows Your Values",
        descriptions: [
            "How does this financial portrait feel? Use this as a starting point to craft a budget that truly reflects your values. A budget that fuels what you love and cuts what you don't.",
            "The goal isn't restriction, it's alignment.",
            "Let's keep going tomorrow."
        ],
        alternativeClosing: "Your money should support the life you want to live.",
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "5",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Your Personal Space",
            journalInstruction: "Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Mark As Complete",
    };

    return (
        <RoleplayPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            engineTitle="Meet Your Must-Haves"
            engineInstructions="Discover your spending values through quick choices"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
            flowType="mustHaves"
        />
    );
}