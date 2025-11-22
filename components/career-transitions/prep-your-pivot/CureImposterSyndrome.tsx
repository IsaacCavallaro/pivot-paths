import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Target, Star, Users } from 'lucide-react-native';

interface CureImposterSyndromeProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function CureImposterSyndrome({ onComplete, onBack }: CureImposterSyndromeProps) {
    const introDescriptions = [
        "Imposter syndrome can hold you back from pursuing the career you deserve. Many dancers experience these feelings when transitioning to new fields.",
        "In this session, we'll work through exercises and guided visualization to help you recognize your worth, celebrate your achievements, and step confidently into your next chapter.",
    ];

    const preparationSection = [
        "Find a comfortable, quiet place to sit",
        "Headphones are recommended for the best experience",
        "Allow yourself 5-10 minutes of uninterrupted time",
        "Get ready to overcome self-doubt and embrace your capabilities",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Comprehensive career transition guide" },
        { icon: Users, text: "Real-life dancer success stories" },
        { icon: Target, text: "Actionable exercises and worksheets" },
    ];

    const ebookDescriptions = [
        "You've taken important steps to overcome imposter syndrome and recognize your worth. Now, imagine having comprehensive guidance to help you navigate your career transition with confidence.",
        "Our How to Pivot ebook provides detailed exercises, real-life examples, and actionable strategies to help you identify your transferable skills, build confidence, and create a concrete plan for your career pivot.",
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Cure Imposter Syndrome"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "prep-your-pivot",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Prep Your Pivot",
                dayTitle: "Cure Imposter Syndrome",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Overcome Imposter Syndrome"
            voiceMessageDescription="Watch the guided exercise video below for overcoming imposter syndrome"
            journalReflectionTitle="Reflect on Your Experience"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings after the imposter syndrome exercise. What insights emerged about your capabilities and worth?"
            journalReflectionSectionProps={{
                pathTag: "prep-your-pivot",
                day: "2",
                category: "Career Transitions",
                pathTitle: "Prep Your Pivot",
                dayTitle: "Cure Imposter Syndrome",
                journalInstruction: "Reflect on your imposter syndrome exercise",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for More Guidance?",
                descriptions: ebookDescriptions,
                callout: "Your dream career is within reach. Let's make it happen together.",
                link: "https://pivotfordancers.com/products/how-to-pivot/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: Target,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}