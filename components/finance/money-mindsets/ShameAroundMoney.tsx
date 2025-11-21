import React from 'react';
import AudioPromptEngine from '@/components/shared/audio-prompt-engine/AudioPromptEngine';
import { BookOpen, Star, Target, Users } from 'lucide-react-native';

interface ShameAroundMoneyProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function ShameAroundMoney({ onComplete, onBack }: ShameAroundMoneyProps) {
    const introDescriptions = [
        "Money shame can be a heavy burden, especially for dancers navigating financial uncertainty. This exercise will help you identify and release the shame that might be holding you back from financial freedom.",
        "We'll start with a guided reflection to help you uncover and confront money shame, followed by an opportunity to reflect on your experience.",
    ];

    const preparationSection = [
        "Find a quiet, comfortable space to reflect",
        "Be honest and gentle with yourself",
        "Remember that money shame is common and you're not alone",
        "Get ready to release what no longer serves you",
    ];

    const ebookCardFeatures = [
        { icon: Star, text: "Comprehensive career transition guide" },
        { icon: Target, text: "Practical financial strategies" },
        { icon: Users, text: "Dancer-specific advice" },
    ];

    const ebookDescriptions = [
        "There's often a lot of shame baked into dealing with money (dancer or not). In fact, generational shame and trauma around finances can seep into how you feel about your finances. But when you leave the past in the past, you can start to move forward. Half the battle is accepting that you're not in the best money situation. Start there.",
    ];

    return (
        <AudioPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            introTitle="Confront Money Shame"
            introDescriptions={introDescriptions}
            journalIntroSectionProps={{
                pathTag: "money-mindsets",
                day: "3",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Shame Around Money",
                journalInstruction: "A quick check in before we start this session",
                moodLabel: "",
                saveButtonText: "Save Entry",
            }}
            preparationSection={preparationSection}
            voiceMessageTitle="Confront Money Shame"
            voiceMessageDescription="Watch the guided reflection video below on money mindset"
            journalReflectionTitle="Reflect on Money Shame"
            journalReflectionDescription="Take a moment to reflect on what came up during the guided reflection. What feelings or thoughts emerged around money? What insights did you gain about your relationship with finances?"
            journalReflectionSectionProps={{
                pathTag: "money-mindsets",
                day: "3",
                category: "finance",
                pathTitle: "Money Mindsets",
                dayTitle: "Shame Around Money",
                journalInstruction: "Reflect on your experience with money shame",
                moodLabel: "",
                saveButtonText: "Save Reflection",
            }}
            ebookProps={{
                title: "How did that feel?",
                descriptions: ebookDescriptions,
                callout: "Ready to dive deeper into transforming your money mindset?",
                link: "https://pivotfordancers.com/products/how-to-pivot/",
                cardTitle: "How to Pivot Ebook",
                cardIcon: BookOpen,
                cardFeatures: ebookCardFeatures,
                cardButtonText: "Learn More",
            }}
            youtubeVideoId="16JMiSPzlBE"
        />
    );
}