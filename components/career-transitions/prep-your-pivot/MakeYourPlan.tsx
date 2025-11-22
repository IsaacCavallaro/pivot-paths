import React from 'react';
import ThisOrThatEngine from '@/components/shared/this-or-that-prompt-engine/ThisOrThatPromptEngine';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';
import { Target } from 'lucide-react-native';

interface PlanChoice {
    id: number;
    option1: string;
    option2: string;
    storyKey: string;
}

interface MakeYourPlanProps {
    onComplete: () => void;
    onBack?: () => void;
}

const planChoices: PlanChoice[] = [
    {
        id: 1,
        option1: 'I want to start my career change now',
        option2: 'I want to start my career change soon',
        storyKey: 'timing'
    },
    {
        id: 2,
        option1: 'I have a clear direction and goal',
        option2: 'I\'m honestly lost',
        storyKey: 'direction'
    },
    {
        id: 3,
        option1: 'I have the skills I need to pivot',
        option2: 'I\'ll need to upskill for sure',
        storyKey: 'skills'
    },
    {
        id: 4,
        option1: 'I have a strong network outside of dance',
        option2: 'I don\'t have many non-dance connections',
        storyKey: 'network'
    },
    {
        id: 5,
        option1: 'I have some savings stashed away',
        option2: 'I\'m living paycheck to paycheck',
        storyKey: 'finances'
    },
    {
        id: 6,
        option1: 'I have a Bachelor\'s degree',
        option2: 'I never went to college/university',
        storyKey: 'education'
    },
    {
        id: 7,
        option1: 'I live in a big city like New York or London',
        option2: 'I live somewhere with fewer opportunities',
        storyKey: 'location'
    },
    {
        id: 8,
        option1: 'I have a support system around me',
        option2: 'I\'m pretty isolated at the moment',
        storyKey: 'support'
    },
    {
        id: 9,
        option1: 'I\'ve worked on my non-dance resume already',
        option2: 'I still only have a dance resume',
        storyKey: 'resume'
    },
    {
        id: 10,
        option1: 'I feel ready to take on my pivot',
        option2: 'I\'m nervous about starting this career change',
        storyKey: 'readiness'
    }
];

export default function MakeYourPlan({ onComplete, onBack }: MakeYourPlanProps) {
    const getStoryText = (screenNumber: number, gameChoices: { [key: string]: string }) => {
        switch (screenNumber) {
            case 12:
                return "Make Your Plan";
            case 13:
                return `${gameChoices.timing === 'I want to start my career change now'
                    ? 'You\'re ready to start your career change which is so exciting.'
                    : 'You\'re not quite ready to start your career change which is completely ok.'} ${gameChoices.direction === 'I have a clear direction and goal'
                        ? 'And the good news is, you have a clear vision for your future with a solid goal to aim for.'
                        : 'But you\'re feeling a little lost and directionless. Start with your interests and values to discover what path you might want to go down.'}`;
            case 14:
                return `${gameChoices.skills === 'I have the skills I need to pivot'
                    ? 'You already have the skills you need to launch your next career.'
                    : 'You\'ll definitely need to upskill so YouTube, Skillshare, and Udemy will become your best friends.'} ${gameChoices.network === 'I have a strong network outside of dance'
                        ? 'And your strong connections outside of dance will be so important in this transition. Reach out to your network!'
                        : 'But, it\'s important to start building a network outside of dance. Go to events, find an internship, or talk to people in other departments at work.'} It's the best way to find new opportunities!`;
            case 15:
                const financesText = gameChoices.finances === 'I have some savings stashed away'
                    ? 'Your savings will be a godsend during your transition. Invest in courses and networking events to give yourself a leg up.'
                    : 'It\'s tough living paycheck to paycheck, but now\'s the time to really cut back on expenses and save up as much as humanly possible.';

                const educationText = gameChoices.education === 'I have a Bachelor\'s degree'
                    ? 'And since you already have a degree, leverage it in your new career. Completing a degree is an accomplishment in and of itself, regardless of the subject matter.'
                    : 'And no degree? Start with free and low-cost learning options like YouTube and Udemy first. Then, if you\'re in the U.S., check out the LEAP program which offers college credit for professional dance experience!';

                return `${financesText} ${educationText}`;
            case 16:
                const locationText = gameChoices.location === 'I live in a big city like New York or London'
                    ? 'In a big city, the opportunities are boundless. Get out there!'
                    : 'In a place with fewer opportunities, consider remote work to get your foot in the door with bigger companies.';

                const supportText = gameChoices.support === 'I have a support system around me'
                    ? 'You\'ll also want to prep your support system that you\'re embarking on a big change. You\'re going to need them!'
                    : 'Focus on building your relationships now. A strong support system is key to any major life change.';

                return `${locationText} ${supportText}`;
            case 17:
                const resumeText = gameChoices.resume === 'I\'ve worked on my non-dance resume already'
                    ? 'Your muggle resume is locked and loaded. Good work!'
                    : 'Find the transferable skills within your dance resume and find a Canva template to bring your muggle resume to life!';

                const readinessText = gameChoices.readiness === 'I feel ready to take on my pivot'
                    ? 'You are SO ready to step onto your next stage!'
                    : 'It\'s ok to be nervous but what if you reframed that feeling into excitement? Nerves just mean that something is important to you and you\'re stepping into the unknown. Give yourself permission to take the next step.';

                return `${resumeText} ${readinessText}`;
            case 18:
                return "Start Your Pivot\n\nNow you have a game plan and all that's left to do is follow-through. You know what you have to work on so it's time to get going!\n\nGo deeper with our Happy Trials, a 5-year career change roadmap for before, during, and after your pivot.";
            default:
                return "";
        }
    };

    const engineProps: ThisOrThatEngineProps = {
        onComplete,
        onBack,
        gameTitle: "Prep Your Pivot",
        gameDescription: "Welcome back to your career transition journey. This is where we'll help you create a personalized game plan based on your current situation. Before we begin planning your pivot, let's check in with where you're starting from.",
        choices: planChoices,
        totalChoices: 10,
        pathTag: "prep-your-pivot",
        day: "1",
        category: "Career Transitions",
        pathTitle: "Prep Your Pivot",
        dayTitle: "Make Your Plan",
        morningJournalPrompt: "Before we begin planning your career pivot, take a moment to reflect on your current situation. What brings you to this point in your journey?",
        introButtonText: "Let's plan",
        introScreenDescription: "Choose the answer that best describes your situation to help you create your career game plan. But there's no right or wrong! It's just your starting point and we'll build from there.",
        morningIntroText: "Welcome back to your career transition journey. This is where we'll help you create a personalized game plan based on your current situation.",
        reflectionTitle: "Make Your Plan",
        reflectionDescription: "Your personalized career plan is being generated based on your choices...",
        finalReflectionPrompt: [
            "Now you have a game plan and all that's left to do is follow-through. You know what you have to work on so it's time to get going!",
            "Remember that this is just the beginning of your journey. Every small step you take brings you closer to your new career."
        ],
        finalJournalPrompt: "As you complete Day 1, reflect on your personalized game plan. What feels most achievable? What areas will need the most attention?",
        getStoryText,
        storyStartScreen: 12,
        storyEndScreen: 18,
        ebookTitle: "Happy Trials - 5-Year Career Roadmap",
        ebookDescription: "Go deeper with our Happy Trials, a 5-year career change roadmap for before, during, and after your pivot.",
        ebookLink: "https://pivotfordancers.com/happy-trials",
        alternativeClosing: "Ready to dive deeper into your career change?",
        customFinalHeader: {
            icon: Target,
            title: "Start Your Pivot"
        },
        skipStoryScreens: false,
        showEbookCallout: true
    };

    return <ThisOrThatEngine {...engineProps} />;
}