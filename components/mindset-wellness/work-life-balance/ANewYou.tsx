import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { ExternalLink, Star, Target, Users } from 'lucide-react-native';

interface ANewYouProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function ANewYou({ onComplete, onBack }: ANewYouProps) {
    const introDescriptions = [
        "You've been exploring what work-life balance means to you and how to create a lifestyle that supports your wellbeing. Now it's time to visualize the new version of yourself that embodies this balance.",
        "In this session, we'll guide you through a visualization exercise to help you connect with the person you're becoming - someone who thrives in both work and life.",
    ];

    const preparationSection = [
        "Find a comfortable, quiet place to sit",
        "Headphones are recommended for the best experience",
        "Allow yourself 5-10 minutes of uninterrupted time",
        "Get ready to connect with your future balanced self",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Actionable activities" },
        { icon: Target, text: "Real-life examples" },
        { icon: Users, text: "Step-by-step guidance" },
    ];

    const ebookDescriptions = [
        "You're ready to dream bigger and step into a full and rich life beyond dance. You've visualized the new, balanced you - now it's time to make it real.",
        "Take it one step further with our How to Pivot ebook. Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples that will help you build the balanced life you just envisioned.",
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="A New You"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "work-life-balance",
                day: "6",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "A New You",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Visualize Your Dream"
            voiceMessageDescription="Watch the guided visualization video below"
            journalReflectionTitle="Reflect on Your Experience"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings after the visualization exercise. What did you discover about the new version of yourself? How does this balanced person show up in the world?"
            journalReflectionSectionProps={{
                pathTag: "work-life-balance",
                day: "6",
                category: "Mindset and Wellness",
                pathTitle: "Work Life Balance",
                dayTitle: "A New You",
                journalInstruction: "Reflect on your visualization experience",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for more?",
                descriptions: ebookDescriptions,
                callout: "Life is yours for the taking. Will you reach out and grab it?",
                link: "https://pivotfordancers.com/products/how-to-pivot/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: ExternalLink,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}