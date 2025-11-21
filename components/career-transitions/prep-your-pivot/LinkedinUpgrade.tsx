import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface LinkedInUpgradeProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LinkedInUpgrade({ onComplete, onBack }: LinkedInUpgradeProps) {
    const introScreen = {
        title: "LinkedIn Upgrade",
        descriptions: [
            "Most dancers aren't active on LinkedIn. But the truth is, this is the main platform where recruiters and employers are definitely hanging out.",
            "So, to kick off your pivot with an action plan you can do TODAY, let's go step by step through how to set up your LinkedIn for success."
        ],
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "5",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Linkedin Upgrade",
            journalInstruction: "Before we begin optimizing your LinkedIn, what are your current thoughts or concerns about creating a professional online presence?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Get started",
    };

    const secondaryIntroScreen = {
        title: "LinkedIn Upgrade",
        descriptions: [
            "Let's go through each section of your LinkedIn profile step by step to make it stand out to recruiters and employers.",
        ],
        buttonText: "Start with Step 1",
    };

    const cards = [
        {
            id: 1,
            prompt: "Nail Your First Impression\n\nDo this:\n\n• Upload a clear headshot. (But opt out from using the ultra glam dance shots and definitely no midriff!)\n• Add a banner using the skyline of your city or a subtle colour palette.",
            buttonText: "Continue to Step 2"
        },
        {
            id: 2,
            prompt: "Claim Your Handle\n\nDo this:\n\n• Edit your public profile URL → linkedin.com/in/yourname.\n• Add contact info with a professional Gmail account",
            buttonText: "Continue to Step 3"
        },
        {
            id: 3,
            prompt: "Headline That Translates Dance into Value\n\nFormula: Who you help + what you do + dance edge.\n\nExamples:\n\n• \"Project Coordinator | Turning performance discipline into on-time delivery\"\n• \"Creative Producer | Storytelling + stakeholder wrangling | Ex-pro dancer\"\n• \"Customer Success | Empathy, coaching, retention | Former dance educator\"",
            buttonText: "Continue to Step 4"
        },
        {
            id: 4,
            prompt: "Write an About Summary\n\nTemplate:\n\n1. Past → \"I'm a former/pro dancer & educator.\"\n2. Transfer → \"I bring X, Y, Z.\"\n3. Now → \"I'm focused on ___ roles where I can ___.\"\n\nExample:\n\"I'm a former professional dancer turned project coordinator. Years on stage taught me precision under pressure, learning fast, and team leadership. I'm now focused on marketing ops roles where I can streamline launches and support creative teams.\"",
            buttonText: "Continue to Step 5"
        },
        {
            id: 5,
            prompt: "Add Experience with Transferable Skills\n\nExamples:\n\n• Choreographer / Rehearsal Director\n  - Led 20-person teams to success, set timelines, delivered 15+ productions on schedule.\n\n• Dance Teacher\n  - Designed 12-month curriculum, tracked individual dancer progress, improved retention by 25% YOY\n\n• Touring Performer/Swing\n  - Coordinated travel/logistics across 40 cities, learned 7 different tracks for 3 separate shows",
            buttonText: "Continue to Step 6"
        },
        {
            id: 6,
            prompt: "Tag Skills to Match Your Pivot\n\nPick 10 (or choose your own!):\n\n• Project Coordination\n• Stakeholder Management\n• Public Speaking\n• Coaching\n• Event Ops\n• Content Creation\n• Customer Service\n• Time Management\n• Team Leadership\n• Visual Storytelling",
            buttonText: "Continue to Step 7"
        },
        {
            id: 7,
            prompt: "Add Your Education\n\nDo this:\n\n• List formal training and notable intensives.\n• Add short courses (Google Project Management, Meta Social Media, HubSpot, etc.).\n• Start your free LinkedIn Learning trial (but remember to cancel if you don't want to get charged!)",
            buttonText: "Continue to Step 8"
        },
        {
            id: 8,
            prompt: "Ask for Recommendations\n\nGo to the Recommendations section and click +\n\nWho to ask: Directors, teachers, clients, stage managers.\n\nMessage template:\n\"Hi ___! I'm updating my LinkedIn for a career pivot into ___ roles. Would you be open to a 2–3 sentence recommendation about my reliability, teamwork, and discipline from our ___ project?\"",
            buttonText: "Continue to Step 9"
        },
        {
            id: 9,
            prompt: "Show Up\n\nFor 10 minutes per week:\n\n• Comment thoughtfully on 3 posts\n• Connect with at least 2 people in your network\n• Consider posting\n\nDon't forget to follow Pivot for Dancers on LinkedIn too!",
            buttonText: "Continue to Step 10"
        },
        {
            id: 10,
            prompt: "Final Polish\n\nDo this:\n\n• Check privacy (public name/headline), name pronunciation (optional), contact visible.\n• Read aloud for clarity. Fix typos.",
            buttonText: "Complete LinkedIn Setup"
        }
    ];

    const reflectionScreen = {
        title: "LinkedIn Optimization Complete",
        description: "You've successfully gone through all the key sections of your LinkedIn profile. Remember that your profile is a living document - continue to update it as you gain new skills and experiences.",
        buttonText: "Continue to Final Steps",
    };

    const finalScreen = {
        title: "And that's it!",
        descriptions: [
            "With your LinkedIn profile finally up to scratch, you're ready to start applying to jobs right on the platform. Message your connections and start networking! We'll see you there.",
        ],
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "5",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Linkedin Upgrade",
            journalInstruction: "How do you feel about your LinkedIn profile now? What was the most helpful tip you learned today?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="swipe"
            primaryButtonText="Get started"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}