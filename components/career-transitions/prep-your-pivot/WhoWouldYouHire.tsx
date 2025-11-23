import React from 'react';
import RoleplayPromptEngine from '@/components/shared/roleplay-prompt-engine/RoleplayPromptEngine';
import { RoleplayScenarioContent } from '@/types/roleplayPromptEngine';
import { Users, Target, Award } from 'lucide-react-native';

interface WhoWouldYouHireProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function WhoWouldYouHire({ onComplete, onBack }: WhoWouldYouHireProps) {
    const scenarios: RoleplayScenarioContent[] = [
        {
            id: 1,
            scenarioTitle: "Sales Assistant Role",
            scenarioText: "You're hiring a sales assistant. The role involves facing rejection from customers and staying motivated.",
            scenarioQuestion: "Two dancers explain their experience with setbacks. Who would you hire?",
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
                "If Button 1: Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a struggle. The other dancer saw it as a strength. Employers are drawn to resilience and growth.",
                "If Button 2: We'd hire her too! Both candidates have the same background but the dancer you chose framed how she dealt with rejection as a strength. The other dancer saw it as a struggle. Employers are drawn to resilience and growth."
            ],
            followUpTexts: [
                "Let's try another one.",
                "Let's try another one."
            ],
            alternativeTitle: "Key Insight",
            alternativeText: "Both dancers have the same experience, but how they frame it makes all the difference. Employers value resilience, growth mindset, and clear articulation of transferable skills.",
            alternativeIcon: Users,
            reflectionPrompt: "How can you reframe your dance experiences to highlight resilience and growth?",
            question1: undefined,
            question2: undefined,
            formula: undefined
        },
        {
            id: 2,
            scenarioTitle: "Project Coordinator Role",
            scenarioText: "You're hiring a project coordinator. The role requires clear communication and guiding a team through deadlines.",
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
                "If button 1: The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose started to dive into her transferable skills but stopped short.",
                "If button 2: We'd hire her too! The same experience can sound casual or highly professional depending on how it's presented. The dancer you chose took the opportunity to highlight clear transferable skills from her teaching experience."
            ],
            followUpTexts: [
                "Let's go through one more!",
                "Let's go through one more!"
            ],
            alternativeTitle: "Key Insight",
            alternativeText: "Specificity matters. Quantifying your experience (30 kids, weekly classes) and directly connecting skills to the role requirements makes your experience more compelling to employers.",
            alternativeIcon: Target,
            reflectionPrompt: "What specific numbers and outcomes can you highlight from your teaching experience?",
            question1: undefined,
            question2: undefined,
            formula: undefined
        },
        {
            id: 3,
            scenarioTitle: "Events Management Role",
            scenarioText: "You're hiring for a front-facing client role in events management. Professional presence is key.",
            scenarioQuestion: "Two candidates describe how they present themselves. Who would you hire?",
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
                "If button 1: The dancer you chose put a solid foot forward, but presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. Dancers already excel at this, and employers value it.",
                "If button 2: We'd hire her too! Presentation isn't just about appearance. It's about professionalism, confidence, and representing yourself well. The dancer you chose showed that she already excels at this, and employers value it."
            ],
            followUpTexts: [
                "Ready for the final reflection?",
                "Ready for the final reflection?"
            ],
            alternativeTitle: "Key Insight",
            alternativeText: "Professional presence goes beyond appearance. It's about confidence, adaptability, and understanding how to represent yourself and the organization effectively in different situations.",
            alternativeIcon: Award,
            reflectionPrompt: "How can you articulate the professional presence skills you've developed as a dancer?",
            question1: undefined,
            question2: undefined,
            formula: undefined
        }
    ];

    const welcomeScreen = {
        title: "Who Would You Hire?",
        descriptions: [
            "Take yourself out of the equation and pretend YOU are the hiring manager putting another dancer in the hot seat for an interview. Put yourself in their shoes and decide who you would hire.",
            "You'll see how the same dance experience can be framed in different ways, and learn what employers are really looking for when they hear your story."
        ],
        learningBox: {
            title: "What You'll Learn",
            items: [
                { id: 1, text: "How to frame dance experience professionally" },
                { id: 2, text: "What employers value in interview answers" },
                { id: 3, text: "How to highlight transferable skills" },
                { id: 4, text: "The power of specific, quantified examples" },
            ],
        },
        welcomeFooter: "Get ready to think like a hiring manager and discover what makes a candidate stand out!",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Who Would You Hire?",
            journalInstruction: "What are you hoping to learn about framing your dance experience for interviews?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Begin",
    };

    const engineIntroScreen = {
        title: "Think Like a Hiring Manager",
        descriptions: [
            "In this exercise, you'll review three different interview scenarios where two dancers with similar backgrounds answer the same question differently.",
            "Your job is to choose which candidate you would hire based on how they frame their dance experience. Pay attention to what makes one answer stronger than the other!",
            "Remember: both candidates have the same dance background - the difference is in how they translate their experience for the specific role."
        ],
        buttonText: "Start First Scenario",
    };

    const reflectionScreen = {
        title: "Interview Framing Insights",
        descriptions: [
            "You've completed all the interview scenarios! You've seen firsthand how the same dance experience can be framed in different ways to highlight different strengths.",
            "Both candidates did well in each scenario. The difference was in how they translated their skills, focused on their strengths, and highlighted how they could add value to the particular role they applied for."
        ],
        reflectionEmphasis: "When preparing for your interviews, keep putting yourself in the employer's shoes!",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Who Would You Hire?",
            journalInstruction: "What insights did you gain about framing your dance experience for different types of roles? What surprised you most?",
            moodLabel: "",
            saveButtonText: "Save Reflection",
        },
        buttonText: "Continue to Final Thoughts",
    };

    const finalScreen = {
        title: "Congratulations!",
        descriptions: [
            "You've successfully completed the 'Who Would You Hire' exercise! You've gained valuable insights into how hiring managers think and what makes interview answers stand out.",
            "Remember: The way you frame your dance experience can make all the difference. Focus on resilience, specific examples, and clear connections to the role you're applying for."
        ],
        alternativeClosing: "See you for your next career exploration step!",
        journalSectionProps: {
            pathTag: "prep-your-pivot",
            day: "6",
            category: "Career Transitions",
            pathTitle: "Prep Your Pivot",
            dayTitle: "Your Interview Prep Space",
            journalInstruction: "Remember, feel free to use the journal tab at any time to practice framing your answers. The more you practice, the more natural it will feel!",
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
            engineIntroScreen={engineIntroScreen}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
            flowType="standard"
        />
    );
}