import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { BookOpen, Target, Star } from 'lucide-react-native';

interface BreakOutOfYourBubbleProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function BreakOutOfYourBubble({ onComplete, onBack }: BreakOutOfYourBubbleProps) {
    const introDescriptions = [
        "You've been building incredible momentum in discovering your path beyond dance. Now it's time to take that crucial step outside your comfort zone and into the world of possibilities waiting for you.",
        "This exercise will help you visualize what it feels like to step beyond the familiar and embrace the growth that comes from trying something new.",
    ];

    const preparationSection = [
        "Find a comfortable space where you can focus",
        "Headphones will enhance the experience",
        "Allow 5 minutes for the visualization",
        "Get ready to imagine new possibilities",
    ];

    const ebookDescriptions = [
        "Stepping out of your comfort zone and into the world outside of dance isn't going to feel good. In fact, it might actually feel pretty bad for a while. But deep down, you know that on the other side of that discomfort is the life you've been craving. So go ahead, break out of that bubble! See what happens next.",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Step-by-step framework" },
        { icon: Target, text: "Practical exercises" },
        { icon: BookOpen, text: "Real dancer stories" },
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Break Out of Your Bubble"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "map-your-direction",
                day: "5",
                category: "Career Transitions",
                pathTitle: "Map Your Direction",
                dayTitle: "Break Out Of Your Bubble",
                journalInstruction: "How are you feeling about stepping outside your comfort zone?",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Visualize Your Dream"
            voiceMessageDescription="Tap to listen to a guided visualization"
            journalReflectionTitle="Reflect on Breaking Out"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings after the visualization. What did it feel like to imagine stepping outside your bubble? What possibilities felt most exciting or challenging?"
            journalReflectionSectionProps={{
                pathTag: "map-your-direction",
                day: "5",
                category: "Career Transitions",
                pathTitle: "Map Your Direction",
                dayTitle: "Break Out Of Your Bubble",
                journalInstruction: "Reflect on your bubble-breaking experience",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "How did that feel?",
                descriptions: ebookDescriptions,
                callout: "Join us again tomorrow!",
                link: "https://pivotfordancers.com/products/how-to-pivot/",
                cardTitle: "How to Pivot Guide",
                cardIcon: BookOpen,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Guide",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}
