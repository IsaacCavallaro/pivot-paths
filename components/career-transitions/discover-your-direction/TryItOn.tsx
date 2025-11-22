import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Palette, Briefcase, Heart } from 'lucide-react-native';

interface TryItOnProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TryItOn({ onComplete, onBack }: TryItOnProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Your First Client Meeting",
            scenarioText: "Creative Role: Graphic Designer",
            question1: {
                text: "The client asks you directly: \"What do you think of our brand colors?\"\n\nYou weren't expecting to give an opinion.",
                choice1: "\"I'm not sure, I'll need to think about it.\"",
                choice2: "\"They're strong colors, but I'd love to explore a version that feels more modern.\"",
                response1: "If you're not sure, this answer is fine. But if you do have an opinion, you might try offering something more meaningful.",
                response2: "Nice! You leaned in with curiosity and creativity, which is what clients value."
            },
            question2: {
                text: "Later, the client requests multiple design changes last-minute. How do you handle it?",
                choice1: "Stress out and agree to everything immediately.",
                choice2: "Acknowledge their request, then suggest priorities to make sure the deadline is realistic.",
                response1: "It's natural to feel pressure, but burnout comes quickly if you say yes to everything. This is a common dancer response, but let's learn from it and take a different path.",
                response2: "Excellent, you're practicing boundaries while still being collaborative."
            },
            reflection: "Creative roles often mean balancing your own voice with client needs. How did that feel to you? Energizing, stressful, or a mix of both?\n\nLet's try another scenario.",
            alternativeText: "Creative roles often mean balancing your own voice with client needs. How did that feel to you? Energizing, stressful, or a mix of both?",
            alternativeIcon: Palette,
            reflectionPrompt: "Creative roles often mean balancing your own voice with client needs. How did that feel to you?",
        },
        {
            id: 2,
            scenarioTitle: "The Team Huddle",
            scenarioText: "Corporate Role: Project Coordinator",
            question1: {
                text: "The manager says: \"Let's go around—what are you working on today?\"\n\nIt's your turn.",
                choice1: "\"I'm just doing the tasks I was assigned.\"",
                choice2: "\"I'm updating the schedule for Project X and checking in with the design team this afternoon.\"",
                response1: "You kept it vague, but in these meetings, clarity helps the whole team.",
                response2: "Great! Short, specific updates keep projects moving smoothly."
            },
            question2: {
                text: "Next, a teammate asks you to help track deadlines, but you're already at capacity.",
                choice1: "Agree anyway. You don't want to let anyone down.",
                choice2: "Thank them, explain your current workload, and offer to revisit after finishing priority tasks.",
                response1: "Saying yes feels supportive, but it can backfire if you burn out.",
                response2: "Smart move—clear communication helps you set healthy expectations."
            },
            reflection: "Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?\n\nTry one more roleplay.",
            alternativeText: "Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?",
            alternativeIcon: Briefcase,
            reflectionPrompt: "Corporate roles are often about communication and juggling tasks. Did this pace and structure feel like a fit for you?",
        },
        {
            id: 3,
            scenarioTitle: "First Day With Clients",
            scenarioText: "People-Focused Role: Youth Counselor",
            question1: {
                text: "One teen immediately challenges you: \"Why should we listen to you?\"",
                choice1: "Stay quiet and hope the group calms down.",
                choice2: "Acknowledge their feelings and explain you're here to support everyone, not to control them.",
                response1: "Staying quiet is safe, but it may make it harder to connect with the group.",
                response2: "Excellent! You're establishing respect and showing leadership in a supportive way."
            },
            question2: {
                text: "Later, a teen confides something personal and emotional.",
                choice1: "Offer a quick solution and move on.",
                choice2: "Listen actively, validate their feelings, and discuss next steps collaboratively.",
                response1: "It's natural to want to \"fix\" things, but listening builds trust.",
                response2: "Perfect, you're practicing empathy and showing you can be present with others' challenges."
            },
            reflection: "Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role? Did you notice yourself enjoying the interaction, or did it feel challenging?",
            alternativeText: "Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role?",
            alternativeIcon: Heart,
            reflectionPrompt: "Helping roles are about presence, patience, and balancing guidance with autonomy. How did it feel to step into this role?",
        }
    ];

    const welcomeScreen = {
        title: "Try It On",
        descriptions: [
            "Let's try on some new careers to see how they might feel in the real world. We'll show you a few scenarios and you'll choose what you'd do in each situations."
        ],
        learningBox: {
            title: "What You'll Experience",
            items: [
                { id: 1, text: "Real-world career scenarios" },
                { id: 2, text: "Practical decision-making practice" },
                { id: 3, text: "Insight into different work environments" },
                { id: 4, text: "Personal reflection on career fit" },
            ],
        },
        welcomeFooter: "Get ready to explore different career paths and discover what feels most natural to you!",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "4",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Try It On",
            journalInstruction: "Before we begin, what challenges do you hope to tackle in these roleplay scenarios? What skills do you want to develop?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Begin",
    };

    const engineIntroScreen = {
        title: "Try It On",
        descriptions: [
            "You'll experience three different career scenarios. For each one, you'll make choices in realistic work situations and see how they play out.",
            "Pay attention to which roles feel most natural and energizing to you - this can be a great clue about your ideal career path!"
        ],
        buttonText: "Start First Scenario",
    };

    const reflectionScreen = {
        title: "How did that feel?",
        descriptions: [
            "You just \"tried on\" your first week in a new role. When you put yourself in those shoes, which one felt most aligned? Perhaps that's a good place to start as you dive deeper into your exploration.",
            "Remember that career exploration is about discovering what works for you. There's no right or wrong answer - only what feels authentic and sustainable."
        ],
        reflectionEmphasis: "Take time to reflect on which scenarios felt most natural and energizing to you!",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "4",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Try It On",
            journalInstruction: "Which career scenario felt most natural to you? What surprised you about your choices in these roleplay situations?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue to Final Thoughts",
    };

    const finalScreen = {
        title: "Roleplay Complete!",
        descriptions: [
            "Congratulations on completing the career roleplay scenarios! You've taken valuable steps in exploring different career paths and understanding what work environments might suit you best.",
            "Remember, career exploration is a journey. The insights you gained today can guide your next steps as you continue to map your direction beyond dance."
        ],
        alternativeClosing: "Meet you here again tomorrow.",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "4",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
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
            engineTitle="Try It On"
            engineInstructions="Explore different career paths!"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
            flowType="tryItOn"
        />
    );
}