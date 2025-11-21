import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { Star, Target, Users } from 'lucide-react-native';

interface GoalSettingProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function GoalSetting({ onComplete, onBack }: GoalSettingProps) {
    const introDescriptions = [
        "Welcome to your goal setting session. This exercise will help you explore your relationship with money and set powerful financial intentions for your future.",
        "We'll begin with a guided reflection to help you identify and release any shame or limiting beliefs around money, then move into setting clear, achievable financial goals.",
    ];

    const preparationSection = [
        "Find a quiet space where you can reflect",
        "Have a journal or notebook ready",
        "Be open and honest with yourself",
        "Release judgment about your financial past",
    ];

    const ebookCardFeatures = [
        { icon: Target, text: "Actionable goal-setting exercises" },
        { icon: Users, text: "Real-life success stories" },
        { icon: Star, text: "Step-by-step guidance" },
    ];

    const ebookDescriptions = [
        "You're ready to dream bigger and step into a full and rich life beyond dance. Now, take it one step further with our How to Pivot ebook.",
        "Dive deeper into your values, mindset, and next steps with actionable activities and real-life examples that will help you create the life you truly want.",
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Money Mindset Reflection"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "budgeting-for-dancers",
                day: "1",
                category: "finance",
                pathTitle: "Budgeting For Dancers",
                dayTitle: "Goal Setting",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Money Mindset Reflection"
            voiceMessageDescription="Watch the guided reflection video below on overcoming financial shame"
            journalReflectionTitle="Reflect on Your Money Mindset"
            journalReflectionDescription="Take a moment to capture your thoughts and feelings about money after the reflection exercise. What insights emerged about your relationship with finances?"
            journalReflectionSectionProps={{
                pathTag: "budgeting-for-dancers",
                day: "1",
                category: "finance",
                pathTitle: "Budgeting For Dancers",
                dayTitle: "Goal Setting",
                journalInstruction: "Reflect on your money mindset and financial goals",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "Ready for More?",
                descriptions: ebookDescriptions,
                callout: "Life is yours for the taking. Will you reach out and grab it?",
                link: "https://pivotfordancers.com/how-to-pivot-ebook/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: Star,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Get the Ebook",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}