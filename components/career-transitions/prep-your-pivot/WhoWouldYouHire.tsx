import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Users, Award } from 'lucide-react-native';

interface WhoWouldYouHireProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WhoWouldYouHire({ onComplete, onBack }: WhoWouldYouHireProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Sales Assistant Role",
            scenarioText: "You're hiring a sales assistant. The role involves facing rejection from customers and staying motivated. Two dancers explain their experience. Who would you hire?",
            scenarioQuestion: "Who would you hire?",
            choices: [
                {
                    id: 'choice1',
                    text: "In dance, I went to hundreds of auditions and didn't always get the part. It was tough, but I learned to deal with it and move on."
                },
                {
                    id: 'choice2',
                    text: "As a professional dancer, I experienced rejection almost daily at auditions. I developed resilience, learned how to take constructive feedback, and kept improving my performance. These are qualities I'll bring to handling challenges in sales."
                },
            ],
            responses: [
                "Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a struggle. The other dancer saw it as a strength. Employers are drawn to resilience and growth.",
                "We'd hire her too! Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a strength. The other dancer saw it as a struggle. Employers are drawn to resilience and growth."
            ],
            alternativeTitle: "Key Takeaway",
            alternativeText: "Both dancers have the same experience, but how they frame it makes all the difference. Employers value resilience, growth mindset, and clear articulation of transferable skills.",
            alternativeIcon: Users,
            reflectionPrompt: "How can you reframe your dance experiences to highlight resilience and growth?",
            question1: undefined,
            question2: undefined,
            formula: undefined,
            followUpTexts: undefined
        },
        {
            id: 2,
            scenarioTitle: "Project Coordinator Role",
            scenarioText: "You're hiring a project coordinator. The role involves clear communication and guiding a team through deadlines. Two dancers explain their experience. Who would you hire?",
            scenarioQuestion: "Who would you hire?",
            choices: [
                {
                    id: 'choice1',
                    text: "I've taught a lot of dance classes to both kids and adults so I'm comfortable speaking in front of an audience and communicating my ideas."
                },
                {
                    id: 'choice2',
                    text: "I led weekly dance classes of up to 30 kids, adapted my teaching style to different learning needs, and motivated dancers to be performance-ready in time for recital. These are skills directly applicable to managing a team here."
                },
            ],
            responses: [
                "The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose started to dive into her transferable skills but stopped short.",
                "We'd hire her too! The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose took the opportunity to highlight clear transferable skills from her teaching experience."
            ],
            alternativeTitle: "Key Takeaway",
            alternativeText: "Specificity matters. Quantifying your experience (30 kids, weekly classes) and directly connecting skills to the role requirements makes your experience more compelling to employers.",
            alternativeIcon: Users,
            reflectionPrompt: "What specific numbers and outcomes can you highlight from your teaching experience?",
            question1: undefined,
            question2: undefined,
            formula: undefined,
            followUpTexts: undefined
        },
        {
            id: 3,
            scenarioTitle: "Events Management Role",
            scenarioText: "You're hiring for a front-facing client role in events management. The role requires professional presence. Two dancers explain their experience. Who would you hire?",
            scenarioQuestion: "Who would you hire?",
            choices: [
                {
                    id: 'choice1',
                    text: "As a dancer, I'm used to taking care of my appearance, performing in large crowds, and looking the part."
                },
                {
                    id: 'choice2',
                    text: "As a dancer, I understand the importance of professional presentation and body language. I know how to create a strong first impression, carry myself with confidence, and adapt my appearance to suit the occasion."
                },
            ],
            responses: [
                "The dancer you chose put a solid foot forward, but presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. Dancers already excel at this, and employers value it.",
                "We'd hire her too! Presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. The dancer you chose showed that she already excels at this, and employers value it."
            ],
            alternativeTitle: "Key Takeaway",
            alternativeText: "Professional presence goes beyond appearance. It's about confidence, adaptability, and understanding how to represent yourself and the organization effectively in different situations.",
            alternativeIcon: Users,
            reflectionPrompt: "How can you articulate the professional presence skills you've developed as a dancer?",
            question1: undefined,
            question2: undefined,
            formula: undefined,
            followUpTexts: undefined
        }
    ];

    const welcomeScreen = {
        title: "Who would you hire?",
        descriptions: [
            "Take yourself out of the equation and pretend YOU are the hiring manager putting another dancer in the hot seat for an interview. Put yourself in their shoes and decide who you would hire.",
            "You'll see how the same dance experience can be framed in different ways, and learn what employers are really looking for when they hear your story."
        ],
        buttonText: "Let's Begin",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Who Would You Hire?",
            journalInstruction: "What are you hoping to learn about framing your dance experience for interviews?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        }
    };

    const reflectionScreen = {
        title: "Interview Framing Complete",
        descriptions: [
            "You've completed all the interview scenarios! You've seen how the same dance experience can be framed in different ways to highlight different strengths.",
            "Remember that employers are looking for candidates who can clearly articulate how their experiences translate to the specific role they're applying for."
        ],
        buttonText: "Continue to Final Thoughts",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Who Would You Hire?",
            journalInstruction: "What insights did you gain about framing your dance experience for different types of roles?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        }
    };

    const finalScreen = {
        title: "Both candidates did well.",
        descriptions: [
            "The difference is in how they translated their skills, focused on their strengths, and highlighted how they could add value to the particular role they applied for.",
            "When preparing for your interviews, keep putting yourself in the employer's shoes and choose your answers based on what will resonate for them."
        ],
        alternativeClosing: "See you for your final step tomorrow.",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Who Would You Hire?",
            journalInstruction: "What did you learn about how to frame your dance experience for interviews?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Mark As Complete",
    };

    return (
        <RoleplayPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            imageSource="https://pivotfordancers.com/assets/logo.png"
            engineTitle="Who Would You Hire"
            engineInstructions="Practice framing your dance experience for interviews"
            scenarios={scenarios}
            welcomeScreen={welcomeScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
            flowType="simpleChoice"
        />
    );
}