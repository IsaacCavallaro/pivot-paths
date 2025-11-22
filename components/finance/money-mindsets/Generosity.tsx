import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Gift } from 'lucide-react-native';

interface GenerosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Generosity({ onComplete, onBack }: GenerosityProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Your Sibling's Big Day",
            scenarioText: "It's a year from now and your youngest sibling is about to graduate college. They've always looked up to you and your dream is to surprise them with a meaningful graduation gift or experience.",
            scenarioQuestion: "What will you do?",
            choices: [
                { id: 'choice1', text: "You write them a heartfelt letter and skip the gift, your budget is too tight." },
                { id: 'choice2', text: "You chip in a small amount with other family members, even though you'd love to give more." },
                { id: 'choice3', text: "You find something affordable but it's not exactly what you dreamed of giving them." }
            ],
            responses: [
                "You're showing love in the best way you can, and that matters. But the financial strain is limiting how you express generosity.",
                "Collaborating with family is thoughtful, but deep down, you wish you could contribute more freely.",
                "You've found a way to give, but you still feel the tug of wishing you could do more without stress or compromise."
            ],
            followUpTexts: [
                "Your heart wants to give generously, but your current financial situation creates limitations. This doesn't reflect on your character - it reflects the reality of your resources. When money is tight, generosity often becomes the first thing we sacrifice, even when it brings us so much joy.",
                "You're finding creative ways to give within your means, which shows incredible thoughtfulness. But that lingering feeling of 'I wish I could do more' is telling you something important. True generosity should feel expansive, not restrictive.",
                "You're making compromises between what you'd love to give and what you can practically afford. This balancing act between your generous spirit and financial reality creates internal tension that diminishes the joy of giving."
            ],
            alternativeTitle: "But what if money wasn't an object?",
            alternativeText: "You've transitioned into a new career that pays you well and gives you financial breathing room. When your sibling graduates, you book a weekend trip for the two of you to celebrate, covering everything without a second thought.\n\nThat's the real gift of financial stability: freedom to give your time, energy, and experiences.",
            alternativeIcon: Gift,
            reflectionPrompt: "How would financial stability change your ability to celebrate important moments with loved ones?"
        },
        {
            id: 2,
            scenarioTitle: "Supporting Your Roots",
            scenarioText: "Your hometown dance studio is running a fundraiser to stay afloat. You'd love to support them. After all, they gave you so much growing up.",
            scenarioQuestion: "What will you do?",
            choices: [
                { id: 'choice1', text: "Share their fundraiser on social media. Unfortunately, you can't afford to donate right now." },
                { id: 'choice2', text: "Pitch in a small donation, even though you wish you could do more." },
                { id: 'choice3', text: "Volunteer your time since you can't afford a monetary donation." }
            ],
            responses: [
                "Sharing helps, but you can't shake the feeling that you'd love to back it up with action.",
                "Donating is meaningful, but you know in your heart you want to give without worrying about the cost.",
                "Volunteering is huge and super helpful. You just wish you could make more of an impact to the place that helped raise you."
            ],
            followUpTexts: [
                "Your heart wants to give generously, but your current financial situation creates limitations. This doesn't reflect on your character - it reflects the reality of your resources. When money is tight, generosity often becomes the first thing we sacrifice, even when it brings us so much joy.",
                "You're finding creative ways to give within your means, which shows incredible thoughtfulness. But that lingering feeling of 'I wish I could do more' is telling you something important. True generosity should feel expansive, not restrictive.",
                "You're making compromises between what you'd love to give and what you can practically afford. This balancing act between your generous spirit and financial reality creates internal tension that diminishes the joy of giving."
            ],
            alternativeTitle: "But what if money wasn't an object?",
            alternativeText: "In your new career, you not only buy a ticket to every recital, but you also create a scholarship for students facing financial hardship. You're fueling the future of dance while still volunteering when you can. You're making a real difference and earning more money has been the biggest driver of this generosity.",
            alternativeIcon: Gift,
            reflectionPrompt: "How would you support the communities that shaped you if money wasn't a limitation?"
        },
        {
            id: 3,
            scenarioTitle: "A Friend in Need",
            scenarioText: "A friend from your previous company has been struggling to cover physical therapy bills after an injury. They're too proud to ask, but you know they could use some help.",
            scenarioQuestion: "What will you do?",
            choices: [
                { id: 'choice1', text: "Offer emotional support, but money isn't something you can give right now." },
                { id: 'choice2', text: "Send them an UberEats gift card, even though it means cutting corners for yourself this month." },
                { id: 'choice3', text: "Promise to check in later, but avoid the money conversation." }
            ],
            responses: [
                "Your presence matters, but you wish you could do more than words.",
                "It feels good to help even a little, but it also leaves you more stressed about your own bills.",
                "You feel guilty… you want to help but don't have the financial room to step in."
            ],
            followUpTexts: [
                "Your heart wants to give generously, but your current financial situation creates limitations. This doesn't reflect on your character - it reflects the reality of your resources. When money is tight, generosity often becomes the first thing we sacrifice, even when it brings us so much joy.",
                "You're finding creative ways to give within your means, which shows incredible thoughtfulness. But that lingering feeling of 'I wish I could do more' is telling you something important. True generosity should feel expansive, not restrictive.",
                "You're making compromises between what you'd love to give and what you can practically afford. This balancing act between your generous spirit and financial reality creates internal tension that diminishes the joy of giving."
            ],
            alternativeTitle: "Picture this:",
            alternativeText: "You offer to cover a few of your friend's PT sessions without a second thought, helping them heal faster. You even set aside a small \"support fund\" each month for moments like this. Generosity becomes part of your lifestyle, not a rare stretch.",
            alternativeIcon: Gift,
            reflectionPrompt: "How would financial freedom change your ability to support friends during difficult times?"
        }
    ];

    const welcomeScreen = {
        title: "The Power of Generosity",
        descriptions: [
            "Welcome to Day 3 of Money Mindsets! Today we'll explore how financial stability can transform your ability to give back to the people and causes you care about most.",
            "Generosity isn't just about money - it's about having the freedom to express your love and support without financial constraints holding you back."
        ],
        learningBox: {
            title: "What You'll Explore Today",
            items: [
                { id: 1, text: "How money amplifies your ability to give" },
                { id: 2, text: "The emotional impact of financial generosity" },
                { id: 3, text: "Creating a lifestyle of giving" },
                { id: 4, text: "Supporting your community and loved ones" },
            ],
        },
        welcomeFooter: "Get ready to imagine how financial freedom could transform your ability to support the people and causes that matter most to you.",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Generosity",
            journalInstruction: "Before we begin, what do you think your spending choices might reveal about your values?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Begin Exploring",
    };

    const engineIntroScreen = {
        title: "How Money Creates Generosity",
        descriptions: [
            "Let's explore scenarios where your financial situation influences how much you can give back. Choose what you'd do and then see what other options might open up if you had more stability and income."
        ],
        buttonText: "Begin",
    };

    const reflectionScreen = {
        title: "Amplifying Your Generosity",
        descriptions: [
            "These scenarios show how financial stability transforms generosity from something you carefully budget for to something that flows naturally from your lifestyle.",
            "When money isn't a constant concern, you can focus on what truly matters: showing up for the people you love and supporting the causes that align with your values.",
            "Financial freedom gives you the capacity to make a real difference - whether it's for family, your dance community, or friends in need."
        ],
        reflectionEmphasis: "Take a detour to see how our founder has done it, but don't forget to come back and mark this day as complete!",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Generosity",
            journalInstruction: "How would your ability to give back change if you had more financial stability? What causes or people would you love to support more generously?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Generosity Complete!",
        descriptions: [
            "You've explored how financial stability can transform your ability to give generously to the people and causes that matter most to you.",
            "Remember, true generosity flows from abundance - not just financial abundance, but the abundance of spirit that comes from knowing you have enough to share."
        ],
        videoLink: "https://www.youtube.com/shorts/s-hpQ9XBGP4",
        alternativeClosing: "Keep cultivating your generous spirit!",
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "3",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Your Personal Space",
            journalInstruction: "Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Mark Day As Complete",
    };

    return (
        <RoleplayPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            engineTitle="The Power of Generosity"
            engineInstructions="Explore how financial stability transforms giving"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
            flowType="standard"
        />
    );
}