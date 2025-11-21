import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface WorkBackwardsProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WorkBackwards({ onComplete, onBack }: WorkBackwardsProps) {
    const introScreen = {
        title: "Work Backwards from Job Descriptions",
        descriptions: [
            "Not sure what skills to learn first? The best place to look is in real job descriptions. They show you what employers *actually* value.",
            "Let's go step by step on how to scan a role and figure out where to start upskilling."
        ],
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Work Backwards",
            journalInstruction: "Before we begin, what kind of roles are you curious about exploring? What skills do you think might be important for those roles?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's go",
    };

    const secondaryIntroScreen = {
        title: "The 5-Step Process",
        descriptions: [
            "We'll walk through a simple 5-step process to analyze job descriptions and identify the most valuable skills to learn first.",
            "This method will save you time and help you focus on what really matters to employers."
        ],
        buttonText: "Start Learning",
    };

    const cards = [
        {
            id: 1,
            prompt: "Step 1: Pick a Target Role\n\nSearch on job boards like Seek, Indeed, or LinkedIn for roles you're curious about. (Or go back to Day 1 and start with your strengths to find job titles that might fit!)\n\nExamples:\n• Event Coordinator\n• Marketing Assistant\n• Studio Manager\n• Community Engagement Officer\n• Project Manager",
            buttonText: "Got it, what's next?"
        },
        {
            id: 2,
            prompt: "Step 2: Scan for Repeats\n\nLook at at least 10 job postings for the same role. Highlight skills or software that show up more than once.\n\nFor Event Coordinator roles, you might end up with a list including:\n• Time management\n• Vendor communication\n• Budget tracking\n• Asana",
            buttonText: "Makes sense!"
        },
        {
            id: 3,
            prompt: "Step 3: Spot the \"Must-Haves\" vs. \"Nice-to-Haves\"\n\n• Must-Haves = Skills mentioned in almost every description (These go at the top of your upskill list.)\n• Nice-to-Haves = Skills mentioned sometimes (Tackle these later.)\n\nFor Marketing Assistant roles, this could look like:\n\n• Must-Haves: Social media scheduling, Canva, copywriting\n• Nice-to-Haves: Video editing skills, basic SEO",
            buttonText: "I'm following along"
        },
        {
            id: 4,
            prompt: "Step 4: Make an Action Plan\n\nOnce you've spotted the must-haves, research free or affordable courses to learn these essential skills.\n\n• Free: Start with YouTube\n• Affordable: Udemy, Skillshare, LinkedIn Learning\n\nPro tip: Most course platforms offer a free trial. Take advantage of those first!",
            buttonText: "Ready to learn!"
        },
        {
            id: 5,
            prompt: "Step 5: Test & Apply Your New Skills\n\nDon't wait until you feel like an expert. Use your new skills in small, safe ways:\n\n• Create a mock event budget\n• Write a sample social media calendar\n• Set up a pretend email marketing flow\n\nPro tip: This way, you're building both skills and confidence while filling your portfolio.",
            buttonText: "Let's do this!"
        }
    ];

    const reflectionScreen = {
        title: "Building Your Learning Path",
        description: "You've learned a powerful method for identifying the most valuable skills to learn first. By working backwards from job descriptions, you're focusing your energy on what employers actually want.",
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Work Backwards",
            journalInstruction: "Which step in the process was most helpful for you? What insights did you gain about the skills needed for your target roles?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Start Learning Today!",
        descriptions: [
            "Upskilling doesn't have to be overwhelming.",
            "Work backwards from the jobs you want → start with the most common skills → and practice as you go.",
            "Each step builds momentum. You'll be surprised how quickly you start to feel \"hire ready.\""
        ],
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "3",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Work Backwards",
            journalInstruction: "Based on what you learned today, what are 2-3 skills you want to focus on first? What's one small action you can take this week to start learning?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you tomorrow for your next step!",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="swipe"
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