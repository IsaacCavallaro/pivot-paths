import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Target, Star, Users } from 'lucide-react-native';

interface GriefProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function Grief({ onComplete, onBack }: GriefProps) {
    const introDescriptions = [
        "Acknowledging and processing grief is an essential step in moving forward. This session will help you honor your feelings while opening space for new possibilities.",
        "We'll begin with a guided exercise to help you process emotions, followed by reflection to integrate your experience.",
    ];

    const preparationSection = [
        "Find a quiet, comfortable space where you won't be interrupted",
        "Have tissues nearby if needed",
        "Allow yourself to feel whatever comes up",
        "Remember this is a safe space for your emotions",
    ];

    const ebookDescriptions = [
        "You've taken a brave step in processing grief and creating space for new beginnings. Now, imagine having comprehensive guidance to help you navigate this transition with clarity and confidence.",
        "Our How to Pivot ebook provides detailed exercises, real-life examples, and actionable strategies to help you identify your values, shift your mindset, and create a concrete plan for your next chapter.",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Values identification exercises" },
        { icon: Users, text: "Real-life transition stories" },
        { icon: Target, text: "Actionable planning tools" },
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Navigating Grief"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "mindset-shifts",
                day: "1",
                category: "Mindset and Wellness",
                pathTitle: "Mindset Shifts",
                dayTitle: "Grief",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Processing Grief"
            voiceMessageDescription="Tap to listen to a guided grief processing exercise"
            journalReflectionTitle="Reflect on Your Experience"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings after the grief processing exercise. What emotions surfaced? What insights emerged about your journey?"
            journalReflectionSectionProps={{
                pathTag: "mindset-shifts",
                day: "1",
                category: "Mindset and Wellness",
                pathTitle: "Mindset Shifts",
                dayTitle: "Grief",
                journalInstruction: "Reflect on your grief processing experience",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for More Guidance?",
                descriptions: ebookDescriptions,
                callout: "Your future is waiting to be built. Let's create it together.",
                link: "https://pivotfordancers.com/how-to-pivot-ebook/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: Target,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
        />
    );
}
