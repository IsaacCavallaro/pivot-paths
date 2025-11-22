import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface MissingDanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MissingDance({ onComplete, onBack }: MissingDanceProps) {
    const cards = [
        {
            id: 1,
            title: "Create a \"feels like me\" playlist",
            description: "Build a playlist of songs that light you up. They could be tunes from a show you loved or your favorite cast's backstage pump up song. Whenever you need a reminder, blast this playlist to remember, you're still that girl.",
            buttonText: "Cue the playlist!"
        },
        {
            id: 2,
            title: "Move your body!",
            description: "It might seem obvious, but as dancers, we feel best in motion. In your new job, you're likely not moving as much. So whether you take a dance class or find a new workout routine altogether, get moving to feel like yourself again.",
            buttonText: "Get moving!"
        },
        {
            id: 3,
            title: "Find a new creative outlet",
            description: "Obvious choices could be painting or writing, but there are so many ways to explore your creativity that are practical too. Gardening, cooking, and interior design are all new ways to tap into your creative side.",
            buttonText: "The juices are flowing!"
        },
        {
            id: 4,
            title: "Reconnect with dance friends",
            description: "There's no friends like dance friends and even if it feels isolating to pivot, you're really not alone. Schedule a coffee or call with a dance friend you haven't seen in a while.",
            buttonText: "Call her up!"
        },
        {
            id: 5,
            title: "Design a structured routine",
            description: "Former dancers often miss the structure of dance more than anything. Daily, repetitive movements ground us and comfort us. Create a short ritual like a warm-up routine or ballet barre that grounds you.",
            buttonText: "Create routine"
        },
        {
            id: 6,
            title: "Support the arts",
            description: "With your new salary and time off, you probably have more time to actually go support the arts. Warning: The first few times you're in the audience can be triggering. But instead of wishing you were up there, what if you allowed yourself to feel the joy of experiencing art?",
            buttonText: "Support arts"
        },
        {
            id: 7,
            title: "Just dance!",
            description: "It's easy to feel like if you're not dancing professionally that you can't still tap into your dancer side. Stay in class, drop in for a performance if you have time, create your own show.",
            buttonText: "Dance!"
        }
    ];

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="benefit"
            primaryButtonText="Continue"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={{
                title: "Missing Dance?",
                descriptions: [
                    "When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic."
                ],
                buttonText: "Let's Begin",
                journalSectionProps: {
                    pathTag: "financial-futureproofing",
                    day: "6",
                    category: "Mindset and Wellness",
                    pathTitle: "Mindset Shifts",
                    dayTitle: "Missing Dance",
                    journalInstruction: "Before we begin, take a moment to reflect: What do you miss most about dance, and how has that absence shown up in your life recently?",
                    moodLabel: "",
                    saveButtonText: "Save Entry"
                }
            }}
            secondaryIntroScreen={{
                title: "Missing Dance?",
                descriptions: [
                    "When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic."
                ],
                buttonText: "Start Exploring"
            }}
            cards={cards}
            reflectionScreen={{
                title: "You'll Always Be a Dancer",
                description: "You don't need to abandon dance (even if it sometimes feels like it's abandoning you). You'll always be a dancer, and it's ok to prioritize those little things that help you feel like your dancer self again when you're missing the comforts of your first love.",
                buttonText: "Continue"
            }}
            finalScreen={{
                title: "Now It's Your Turn",
                descriptions: [
                    "Missing dance is a natural part of transitioning away from the stage. The connection you built with movement, creativity, and community doesn't disappear just because your career path has changed. These tips are tools you can return to whenever you need to reconnect with your dancer identity."
                ],
                buttonText: "Mark As Complete",
                alternativeClosing: "See you tomorrow for your final step.",
                journalSectionProps: {
                    pathTag: "financial-futureproofing",
                    day: "6",
                    category: "Mindset and Wellness",
                    pathTitle: "Mindset Shifts",
                    dayTitle: "Missing Dance",
                    journalInstruction: "Reflect on today's practice. Which tip resonated most with you, and how will you incorporate it into your routine when you're missing dance?",
                    moodLabel: "",
                    saveButtonText: "Save Entry"
                }
            }}
        />
    );
}