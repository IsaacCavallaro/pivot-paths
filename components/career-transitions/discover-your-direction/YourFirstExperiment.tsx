import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface YourFirstExperimentProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function YourFirstExperiment({ onComplete, onBack }: YourFirstExperimentProps) {
    const introScreen = {
        title: "Take the Leap: Your First Career Experiment",
        descriptions: [
            "It's time to put ideas into action. Today, you're going to try one small experiment to explore a career you're curious about. The goal isn't perfection… it's discovery.",
        ],
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Your First Experiment",
            journalInstruction: "Before we begin, what career ideas are you most excited to explore through this experiment?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's experiment",
    };

    const secondaryIntroScreen = {
        title: "Your Experiment Journey",
        descriptions: [
            "Follow these 6 simple steps to conduct your first career experiment. Each step is designed to be completed in a day or less. Remember, the goal is learning, not perfection!",
        ],
        buttonText: "Start Step 1",
    };

    const cards = [
        {
            id: 1,
            title: "Step 1: Choose Your Focus",
            prompt: "Pick one career idea from your exploration so far. Don't overthink it. Choose the one that excites you most right now.",
            buttonText: "I've chosen my focus"
        },
        {
            id: 2,
            title: "Step 2: Find a Resource",
            prompt: "Find one free way to step into that world:\n\n• Go down a rabbit hole on YouTube for 30 minutes\n• Read 10 blogs or articles on the role\n• Listen to a podcast by someone in that field",
            buttonText: "I found my resource"
        },
        {
            id: 3,
            title: "Step 3: Set a Small Goal",
            prompt: "Decide on one tangible thing you will do today:\n\n• Write down 3 job titles in that industry\n• List 3 questions you want answered by an expert\n• Identify one skill you want to try",
            buttonText: "Goal set!"
        },
        {
            id: 4,
            title: "Step 4: Connect With Someone",
            prompt: "Reach out to one person connected to that career:\n\n• Send a short message to a friend, mentor, or LinkedIn contact\n• Ask about their experience or for a tip to get started",
            buttonText: "Connection made"
        },
        {
            id: 5,
            title: "Step 5: Reflect",
            prompt: "After completing your experiment, ask yourself:\n\n• What surprised me?\n• What felt exciting or energizing?\n• What felt challenging or uncomfortable?\n\nTake a few minutes to write your observations.",
            buttonText: "I've reflected"
        },
        {
            id: 6,
            title: "Step 6: Decide Next Move",
            prompt: "Based on what you learned, pick your next small step:\n\n• Repeat a similar experiment (we're building on momentum here!)\n• This time, try a different career idea\n• Or reach deeper into this field with a workshop, class, or volunteer opportunity",
            buttonText: "Next move decided"
        }
    ];

    const reflectionScreen = {
        title: "Cultivating Your Experiment Mindset",
        description: "You've taken an important step by conducting your first career experiment. The insights you've gained today are valuable clues about what might truly work for you in your next chapter.",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Your First Experiment",
            journalInstruction: "Reflect on your experiment experience. What did you learn? What surprised you? What would you do differently next time?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Make Progress Every Day",
        descriptions: [
            "Every big career change starts with small daily experiments. You don't need to know everything today. The goal is to learn, test, and explore, one step at a time.",
        ],
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "7",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Your First Experiment",
            journalInstruction: "Based on today's experiment, what's one small step you could take to continue exploring this week?",
            moodLabel: "",
            saveButtonText: "Save Action Step",
        },
        alternativeClosing: "Great work on completing your first experiment!",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="experiment"
            primaryButtonText="Let's experiment"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}