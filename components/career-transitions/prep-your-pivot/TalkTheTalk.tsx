import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface TalkTheTalkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TalkTheTalk({ onComplete, onBack }: TalkTheTalkProps) {
    const introScreen = {
        title: "Talk the Talk",
        descriptions: [
            "When it comes to interviewing and networking, it can come down to learning how to \"talk the talk\" in a way the outside world understands. Capitalize on your dance experience by talking about it in muggle terms.",
        ],
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Talk The Talk",
            journalInstruction: "Before we begin, let's take a moment to check in with yourself. How are you feeling about learning to translate your dance experience?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's go",
    };

    const secondaryIntroScreen = {
        title: "Talk the Talk",
        descriptions: [
            "Employers and hiring managers are looking for transferable strengths they can immediately recognize. The more you learn to \"speak their language\", the more doors you open.",
        ],
        buttonText: "Start Learning",
    };

    const cards = [
        {
            id: 1,
            oldBelief: "I've spent my whole life training and performing as a dancer.",
            newBelief: "I worked in the highly competitive dance industry where discipline, teamwork, and constant feedback are part of the job. It's taught me how to perform under pressure and deliver results consistently.",
            buttonText: "See the difference?"
        },
        {
            id: 2,
            oldBelief: "I'm used to memorizing choreography quickly.",
            newBelief: "I'm a fast learner who can absorb complex information and apply it immediately, whether that's a new system, process, or way of working.",
            buttonText: "Nice!"
        },
        {
            id: 3,
            oldBelief: "I'm comfortable performing on stage.",
            newBelief: "I'm confident presenting ideas, speaking in front of groups, and adapting to high-stakes situations with professionalism.",
            buttonText: "Look at those transferable skills!"
        },
        {
            id: 4,
            oldBelief: "I've done a lot of auditions, so I'm used to rejection.",
            newBelief: "I'm resilient. I can take feedback, stay motivated, and keep improving… qualities that help me persist through challenges at work.",
            buttonText: "Ok, she's evolving!"
        },
        {
            id: 5,
            oldBelief: "I've always worked in dance companies.",
            newBelief: "In the dance companies I performed with, collaboration, trust, and communication were essential for success.",
            buttonText: "Look at you!"
        },
        {
            id: 6,
            oldBelief: "I'm totally dedicated to dance.",
            newBelief: "I'm committed and passionate. When I take on a role or a project, I give it my complete focus and follow through until it's done.",
            buttonText: "You're in your growth era!"
        },
        {
            id: 7,
            oldBelief: "I was a dance teacher while performing.",
            newBelief: "I have experience leading groups, explaining complex concepts in simple ways, and motivating people to reach their goals. These skills translate directly into leadership and communication in any setting.",
            buttonText: "We love that skill translation!"
        }
    ];

    const reflectionScreen = {
        title: "Mastering Interview Language",
        description: "Learning to translate your dance experience into business language is a skill that takes practice. Remember that every interview and networking conversation is an opportunity to refine your message.",
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Can you \"talk the talk\"?",
        descriptions: [
            "Employers and hiring managers are looking for transferable strengths they can immediately recognize. The more you learn to \"speak their language\", the more doors you open.",
        ],
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Talk The Talk",
            journalInstruction: "Write down your own translations for your dance experience. What specific skills from your dance career can you articulate in business terms?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "Let's keep going. See you here again tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="flip"
            primaryButtonText="Let's go"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}