import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface SparkCuriosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SparkCuriosity({ onComplete, onBack }: SparkCuriosityProps) {
    const introScreen = {
        title: "Welcome to Your Curiosity Journey",
        descriptions: [
            "Before we begin exploring new possibilities, let's check in with where you are right now. This will help us track your progress and reflections.",
        ],
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Spark Your Curiosity",
            journalInstruction: "How are you feeling about exploring new career possibilities right now? What hopes or concerns come to mind?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue to Curiosity",
    };

    const secondaryIntroScreen = {
        title: "Spark Curiosity",
        descriptions: [
            "Curiosity is the engine of your pivot. Today we're here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.",
            "Swipe through each card, reflect, and take note of what excites you.",
        ],
        buttonText: "Let's go",
    };

    const cards = [
        {
            id: 1,
            prompt: "Think of a career you've admired from afar. What is it about this role that catches your attention?",
            buttonText: "Write it down"
        },
        {
            id: 2,
            prompt: "If you could spend one day in someone else's job, who would it be and why?",
            buttonText: "Think about it"
        },
        {
            id: 3,
            prompt: "What tasks or activities make time fly for you? Could these appear in a career?",
            buttonText: "Let's reflect"
        },
        {
            id: 4,
            prompt: "Imagine a time when you felt fully confident. What environment, people, and responsibilities helped create that confidence?",
            buttonText: "Hmm… interesting"
        },
        {
            id: 5,
            prompt: "Pick an industry you know nothing about. What's one question you'd ask someone working there to learn more?",
            buttonText: "Start asking"
        },
        {
            id: 6,
            prompt: "Think about a problem you enjoyed solving in your dance career. Could that same mindset apply in another context?",
            buttonText: "Do some reflection"
        },
        {
            id: 7,
            prompt: "Who do you know with a career you're curious about? What would you want to ask them if you had 15 minutes?",
            buttonText: "Get thinking"
        },
        {
            id: 8,
            prompt: "If you had unlimited time for learning, what skill or craft would you dive into next?",
            buttonText: "Let's learn"
        },
        {
            id: 9,
            prompt: "Picture your ideal workday five years from now. What are three things you'd do that excite you most?",
            buttonText: "Sounds good!"
        }
    ];

    const reflectionScreen = {
        title: "Cultivating Your Curiosity",
        description: "You've taken an important step by exploring these curiosity prompts. The questions that resonated with you today are clues to what might truly excite you in your next chapter.",
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Spark Your Curiosity",
            journalInstruction: "Which curiosity prompts stood out to you the most? What new possibilities or ideas did they spark?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "It's Time to Reflect",
        descriptions: [
            "Exploring your curiosity doesn't mean you have to have all the answers right now. Each question is a doorway to possibilities, and the more you engage with them, the clearer your path becomes.",
            "Take note of anything that excites you. You'll come back to it as you explore career options in the coming days.",
        ],
        journalSectionProps: {
            pathTag: "map-your-direction",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Map Your Direction",
            dayTitle: "Spark Your Curiosity",
            journalInstruction: "Based on today's exploration, what's one small step you could take to follow your curiosity this week?",
            moodLabel: "",
            saveButtonText: "Save Action Step",
        },
        alternativeClosing: "See you tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="swipe"
            primaryButtonText="Continue to Curiosity"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}
