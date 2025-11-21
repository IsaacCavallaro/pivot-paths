import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Target, Star, Users } from 'lucide-react-native';

interface CelebrateTheWinsProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function CelebrateTheWins({ onComplete, onBack }: CelebrateTheWinsProps) {
    const introDescriptions = [
        "You've been building powerful money mindsets and taking concrete steps toward financial future-proofing. Every small win deserves recognition.",
        "Now, we're going to take a moment to celebrate your achievements and acknowledge how far you've come on this financial journey.",
    ];

    const preparationSection = [
        "Find a comfortable space where you can focus",
        "Think about your recent financial wins, big or small",
        "Allow yourself to feel proud of your progress",
        "Get ready to acknowledge your achievements",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Financial mindset strategies" },
        { icon: Target, text: "Practical financial planning" },
        { icon: Users, text: "Real-life examples" },
    ];

    const ebookDescriptions = [
        "You've taken incredible steps toward building financial confidence and future-proofing your life beyond dance. Now, imagine having a comprehensive guide to help you navigate financial decisions with clarity.",
        "Our How to Pivot ebook provides deeper insights into financial planning, mindset shifts, and practical strategies to build the abundant life you deserve.",
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Celebrate Your Progress"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "financial-futureproofing",
                day: "7",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Celebrate The Wins",
                journalInstruction: "A quick check in before we celebrate your wins",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Celebrate Your Wins"
            voiceMessageDescription="Tap to celebrate your financial achievements"
            journalReflectionTitle="Reflect on Your Financial Journey"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings about your financial progress. What money mindsets have shifted? What achievements are you most proud of?"
            journalReflectionSectionProps={{
                pathTag: "financial-celebration-reflection",
                day: "7",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Celebrate The Wins",
                journalInstruction: "Reflect on your financial wins and progress",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for More Financial Confidence?",
                descriptions: ebookDescriptions,
                callout: "Your financial future is yours to design. Will you take the next step?",
                link: "https://pivotfordancers.com/how-to-pivot-ebook/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: Target,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}