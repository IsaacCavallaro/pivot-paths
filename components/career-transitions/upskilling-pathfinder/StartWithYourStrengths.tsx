import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface StartWithYourStrengthsProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function StartWithYourStrengths({ onComplete, onBack }: StartWithYourStrengthsProps) {
    const pairs = [
        {
            id: 1,
            leftText: "Creative expression",
            rightText: "Marketing, Graphic Design, or Creative Direction",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 2,
            leftText: "Leadership in rehearsals",
            rightText: "Project Manager, Team Lead, or People Manager",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 3,
            leftText: "Physical awareness & technique",
            rightText: "Physiotherapist, Occupational Therapist, or Personal Trainer",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 4,
            leftText: "Resilience through rejection",
            rightText: "Sales, Entrepreneurship, or Start-up Founder",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 5,
            leftText: "Attention to detail in choreography",
            rightText: "Data Analyst, Quality Assurance, or UX Designer",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 6,
            leftText: "Improvisation on stage",
            rightText: "Event Manager, Crisis Response, or Innovation Specialist",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 7,
            leftText: "Teaching younger dancers",
            rightText: "Educator, Corporate Trainer, or Learning & Development Specialist",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 8,
            leftText: "Balancing rehearsals, gigs & jobs",
            rightText: "Operations Manager, Administrative Coordinator, or Executive Assistant",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 9,
            leftText: "Performing under pressure",
            rightText: "Public Relations, Broadcaster, or Presenter",
            leftType: "strength",
            rightType: "jobTitles"
        },
        {
            id: 10,
            leftText: "Collaborating with casts & choreographers",
            rightText: "Human Resources, Community Manager, or Team Coordinator",
            leftType: "strength",
            rightType: "jobTitles"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Start With Your Strengths!",
        descriptions: [
            "Your journey as a dancer has equipped you with unique strengths that are highly valuable in many career paths.",
            "Today, we'll explore how your dance skills translate to various professional roles through an interactive matching game."
        ],
        learningBox: {
            title: "What You'll Discover:",
            items: [
                { id: 1, text: "How your dance skills transfer to other careers" },
                { id: 2, text: "Potential job titles that align with your strengths" },
                { id: 3, text: "New career paths you may not have considered" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to connect your dancer strengths with relevant career opportunities.",
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "1",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Start With Your Strengths",
            journalInstruction: "Before we begin, let's take a moment to reflect. What do you consider to be your greatest strengths as a dancer? Are there any careers you've already considered that might use these skills?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Start With Your Strengths",
        descriptions: [
            "Match your natural strengths as a dancer with relevant job titles."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which strength-to-career connections were most surprising or interesting to you?",
            "Take a moment to reflect on how your dance skills can open doors to new career possibilities."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "upskilling-pathfinder",
            day: "1",
            category: "Career Transitions",
            pathTitle: "Upskilling Pathfinder",
            dayTitle: "Start With Your Strengths",
            journalInstruction: "Which career paths that you discovered today are you most excited to explore further? What skills would you need to develop to pursue them?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "You've Discovered Your Transferable Strengths!",
        descriptions: [
            "Remember that these are just starting points for your career exploration. The best career path for you will depend on your unique interests, values, and goals.",
            "We encourage you to use these connections as inspiration for further research and networking in fields that interest you.",
            "Check out this additional resource to learn more about translating dance skills to other careers:"
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID",
        alternativeClosing: "We'll build on this tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Start With Your Strengths"
            gameInstructions="Tap to match dancer strengths with relevant job titles"
            leftColumnTitle="Strength"
            rightColumnTitle="Title"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}