import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Target, Star, Users, ExternalLink } from 'lucide-react-native';

interface EmbraceTheBeginnerProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function EmbraceTheBeginner({ onComplete, onBack }: EmbraceTheBeginnerProps) {
    const introDescriptions = [
        "Starting something new can feel intimidating, but every expert was once a beginner. This is your opportunity to explore, learn, and grow without pressure.",
        "In this session, we'll guide you through embracing the beginner mindset - a powerful approach that opens you up to new possibilities and reduces the fear of not being perfect right away.",
    ];

    const preparationSection = [
        "Find a comfortable space where you won't be interrupted",
        "Bring a curious and open mindset",
        "Remember that growth happens outside your comfort zone",
        "Get ready to embrace the learning process",
    ];

    const ebookDescriptions = [
        "You're ready to dream bigger and step into a full and rich life beyond dance. You've embraced the beginner mindset - now it's time to build on that foundation.",
        "Take it one step further with our How to Pivot ebook. Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples that will help you navigate your career transition with confidence.",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Actionable activities" },
        { icon: Target, text: "Real-life examples" },
        { icon: Users, text: "Career transition guidance" },
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Embrace The Beginner"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "upskilling-pathfinder",
                day: "6",
                category: "Career Transitions",
                pathTitle: "Upskilling Pathfinder",
                dayTitle: "Embrace The Beginner",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Embrace The Beginner"
            voiceMessageDescription="Tap to listen to guidance on embracing the beginner mindset"
            journalReflectionTitle="Reflect on Your Beginner Journey"
            journalReflectionDescription="Take a moment to reflect on what it felt like to embrace the beginner mindset. What fears came up? What felt exciting? Capture your thoughts about this learning experience."
            journalReflectionSectionProps={{
                pathTag: "upskilling-pathfinder",
                day: "6",
                category: "Career Transitions",
                pathTitle: "Upskilling Pathfinder",
                dayTitle: "Embrace The Beginner",
                journalInstruction: "Reflect on embracing the beginner mindset",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for more?",
                descriptions: ebookDescriptions,
                callout: "Life is yours for the taking. Will you reach out and grab it?",
                link: "https://pivotfordancers.com/how-to-pivot-ebook/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: ExternalLink,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
        />
    );
}
