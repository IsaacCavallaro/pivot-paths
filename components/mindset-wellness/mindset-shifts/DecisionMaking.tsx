import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';
import { Sparkles } from 'lucide-react-native';

interface DecisionTactic {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface DecisionMakingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const decisionTactics: DecisionTactic[] = [
    { id: 1, option1: 'Break a problem down into smaller chunks', option2: 'Brainstorm multiple potential solutions', storyKey: 'novelProblem' },
    { id: 2, option1: 'Keep asking "Why?" to get to the root of an issue', option2: 'Zoom out and imagine how your Ideal Self would decide', storyKey: 'rootIssue' },
    { id: 3, option1: 'List the pros and cons', option2: 'Talk it out with a trusted friend', storyKey: 'analysis' },
    { id: 4, option1: 'Make the best choice you can and adjust later', option2: 'Gather more info before acting', storyKey: 'flexibleApproach' },
    { id: 5, option1: 'Note your gut instinct, but pause before acting', option2: 'Research what\'s worked for others', storyKey: 'balancedApproach' },
    { id: 6, option1: 'Start with the easiest task', option2: 'Tackle the hardest task first', storyKey: 'progress' },
    { id: 7, option1: 'Sleep on it and revisit tomorrow', option2: 'Fail fast, learn from mistakes, and move forward', storyKey: 'reflection' }
];

export default function DecisionMaking({ onComplete, onBack }: DecisionMakingProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        switch (screenNumber) {
            case 8:
                return "Decision-Making is a Skill";
            case 9:
                return "And it's a skill that many dancers haven't mastered. As you embark on the challenge of deciding which path to take post-dance, refer to these tactics to help you move more towards the life you really want.";
            case 10:
                return "The more you practice, the more you'll trust yourself to choose (and to adjust when needed).";
            default:
                return "";
        }
    };

    const engineProps: ThisOrThatEngineProps = {
        onComplete,
        onBack,
        gameTitle: "Decision-Making Practice",
        gameDescription: "This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve. Because the truth is, by following the dance path, there's a chance you've never really made a decision for yourself that wasn't based on the path laid out for you.",
        choices: decisionTactics,
        totalChoices: 7,
        pathTag: "mindset-shifts",
        day: "3",
        category: "Mindset and Wellness",
        pathTitle: "Mindset Shifts",
        dayTitle: "Decision Making",
        morningJournalPrompt: "Before we begin, let's take a moment to check in with yourself. How are you feeling about making decisions for your future?",
        introButtonText: "Start practicing",
        introScreenDescription: "Swipe through and pick a decision-making tactic that makes the most sense to you. There's no right or wrong!\n\nBeware: This isn't about making the perfect decision (no such thing), but about learning different ways to problem solve.",
        morningIntroText: "As dancers, you know how to follow directions. But now, you're the choreographer of your choices.",
        reflectionTitle: "Decision-Making is a Skill",
        reflectionDescription: [
            "And it's a skill that many dancers haven't mastered. As you embark on the challenge of deciding which path to take post-dance, refer to these tactics to help you move more towards the life you really want.",
            "The more you practice, the more you'll trust yourself to choose (and to adjust when needed)."
        ],
        finalReflectionPrompt: [
            "Take a moment to reflect on today's decision-making practice. Which tactics resonated with you the most?",
            "Remember that decision-making is like any other skill - it improves with practice and patience.",
            "Every choice you make, big or small, is strengthening your ability to navigate life beyond dance."
        ],
        finalJournalPrompt: "Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling about your decision-making abilities after today's practice?",
        getStoryText,
        storyStartScreen: 8,
        storyEndScreen: 10,
        alternativeClosing: "See you for more tomorrow",
        customFinalHeader: {
            icon: Sparkles,
            title: "Decision-Making is a Skill"
        },
        skipStoryScreens: false,
        showEbookCallout: false
    };

    return <ThisOrThatEngine {...engineProps} />;
}