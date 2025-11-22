import React from 'react';
import MatchGameEngine from '@/components/shared/match-game-engine/MatchGameEngine';

interface DanceSkillMatchProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function DanceSkillMatch({ onComplete, onBack }: DanceSkillMatchProps) {
    const pairs = [
        {
            id: 1,
            leftText: "Auditioned in a room of 500",
            rightText: "Performs well under pressure",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 2,
            leftText: "Learned choreography in under an hour",
            rightText: "Quick learner who thrives in fast-paced environments",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 3,
            leftText: "Performed the same show 12 times a week for months",
            rightText: "Reliable, consistent, and committed to excellence",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 4,
            leftText: "Toured internationally with minimal support",
            rightText: "Adaptable and self-sufficient in high-stress situations",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 5,
            leftText: "Collaborated with diverse casts and creative teams",
            rightText: "Strong communicator and team player across cultures and personalities",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 6,
            leftText: "Trained in an elite form of dance for 24 years",
            rightText: "Disciplined and motivated with the ability to follow-through",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 7,
            leftText: "Always made sure headshots and resumes were printed for auditions",
            rightText: "Experience in administration, organization, and project management",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 8,
            leftText: "Maintained a successful freelance dance career for 11 years",
            rightText: "A self-starter with a determined, entrepreneurial spirit",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 9,
            leftText: "Held various part-time jobs at once to support the dance lifestyle",
            rightText: "Hard-working with the ability to balance competing priorities",
            leftType: "dance",
            rightType: "career"
        },
        {
            id: 10,
            leftText: "Acted as dance captain to a cast of 12 dancers",
            rightText: "Able to give and receive feedback to ensure high-quality output",
            leftType: "dance",
            rightType: "career"
        }
    ];

    const welcomeScreen = {
        title: "Welcome to Dance Skill Match!",
        descriptions: [
            "Your dance background has equipped you with incredible transferable skills that are highly valuable in any career.",
            "Today, we'll explore how your dance experiences translate directly to workplace competencies that employers are looking for."
        ],
        learningBox: {
            title: "What You'll Discover:",
            items: [
                { id: 1, text: "How dance skills translate to career competencies" },
                { id: 2, text: "The hidden value in your dance experiences" },
                { id: 3, text: "How to articulate your dance background in job interviews" },
            ],
        },
        welcomeFooter: "You'll be playing a match game to help you recognize and value the incredible skills you've developed through dance.",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "4",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Dance Skill Match",
            journalInstruction: "Before we begin, let's take a moment to reflect on your dance journey. What skills do you think you've developed through dance that might be valuable in other careers?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Continue",
    };

    const gameIntroScreen = {
        title: "Dance Skill Match",
        descriptions: [
            "Let's match dance experiences with their career value to recognize the incredible skills you've developed."
        ],
        buttonText: "Start the Game",
    };

    const reflectionScreen = {
        title: "Time for Reflection",
        descriptions: [
            "Which skill translation was most surprising or meaningful to you?",
            "Take a moment to reflect on how your dance background has prepared you for success in any career path."
        ],
        reflectionEmphasis: "If you're having trouble recalling, feel free to go back and play the match game again",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "4",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Dance Skill Match",
            journalInstruction: "Looking at the skills you've matched, which ones feel most authentic to your experience? How might you describe these skills in a job interview or on your resume?",
            moodLabel: "",
            saveButtonText: "Add to Journal",
        },
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "You're Recognizing Your Value!",
        descriptions: [
            "Your dance experience has given you valuable transferable skills that are highly sought after in many careers.",
            "Recognizing these connections can help you see the true value of your dance background beyond the studio or stage and articulate your unique strengths to potential employers.",
            "Check out this additional resource to learn more about translating dance skills:"
        ],
        videoLink: "https://www.youtube.com/shorts/YOUR_VIDEO_ID",
        alternativeClosing: "See you tomorrow for more.",
        buttonText: "Mark As Complete",
    };

    return (
        <MatchGameEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            gameTitle="Dance Skill Match"
            gameInstructions="Tap to match dance experiences with their career value"
            leftColumnTitle="Experience"
            rightColumnTitle="Career Skill"
            pairs={pairs}
            welcomeScreen={welcomeScreen}
            gameIntroScreen={gameIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}