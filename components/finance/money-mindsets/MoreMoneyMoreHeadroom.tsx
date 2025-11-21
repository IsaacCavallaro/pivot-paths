import React from 'react';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';

interface MoreMoneyMoreHeadroomProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MoreMoneyMoreHeadroom({ onComplete, onBack }: MoreMoneyMoreHeadroomProps) {
    const introScreen = {
        title: "More Headroom",
        descriptions: [
            "Wanting more isn't about greed… it's about creating breathing room so your mind can think, create, and choose. Go through the following reflections. Each one ends with a tiny action you can actually try this week.",
        ],
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "6",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "More Money More Headroom",
            journalInstruction: "Before we begin, take a moment to reflect on your current financial headspace. What money pressures are you feeling right now?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's Explore",
    };

    const secondaryIntroScreen = {
        title: "More Headroom Strategies",
        descriptions: [
            "Let's explore practical ways to create financial and mental breathing room in your life.",
        ],
        buttonText: "Start Exploring",
    };

    const cards = [
        {
            id: 1,
            oldBelief: "Name the Pressure",
            newBelief: "Why it matters:\nStress narrows your thinking. Naming the money pressures gives you power over them.\n\nReflection question:\nWhat three money worries show up most often?\n\nTiny action:\nSpend 10 minutes listing those three items in your phone notes.",
            buttonText: "Next"
        },
        {
            id: 2,
            oldBelief: "Start a Cushion",
            newBelief: "Why it matters:\nEven a small cushion buys time to make better choices.\n\nReflection question:\nHow much calmer would you feel if your bills were covered for the next week? What about the next month?\n\nTiny action:\nSet a simple savings target: one week's living costs. If you can't do the full amount, set aside one small recurring transfer.",
            buttonText: "Next"
        },
        {
            id: 3,
            oldBelief: "Pay Yourself First",
            newBelief: "Why it matters:\nTreat savings like a non-negotiable. It builds discipline.\n\nReflection question:\nWhat amount feels doable to move automatically from each paycheck?\n\nTiny action:\nSet up an automatic transfer (even $10) to a 'headroom' savings account.",
            buttonText: "Next"
        },
        {
            id: 4,
            oldBelief: "Declutter Your Money Life",
            newBelief: "Why it matters:\nMultiple accounts and subscriptions create cognitive noise. Fewer moving parts = clearer thinking.\n\nReflection question:\nWhich subscription or recurring payment drains your headspace?\n\nTiny action:\nSpend 15 minutes to list subscriptions and cancel at least one you haven't used this week.",
            buttonText: "Next"
        },
        {
            id: 5,
            oldBelief: "Budget for Time Off",
            newBelief: "Why it matters:\nKnowing you can afford a break removes the 'always-on' anxiety dancers know well.\n\nReflection question:\nWhat small trip or weekend would recharge you? How much would it cost?\n\nTiny action:\nCreate a 'Time Off' savings bucket and schedule an automatic weekly or monthly transfer (start tiny).",
            buttonText: "Next"
        },
        {
            id: 6,
            oldBelief: "Practice One Negotiation Line",
            newBelief: "Why it matters:\nNegotiation creates more headroom faster than tiny savings alone. You already advocate for yourself in rehearsal… this is another form of that skill.\n\nReflection question:\nWhat's a job you could ask for more pay on this month?\n\nTiny action:\nCopy this and adapt: 'I'm excited about this role! Based on the responsibilities, I was expecting $X. Is there flexibility on the rate?' Say it out loud and consider how it makes you feel.",
            buttonText: "Next"
        },
        {
            id: 7,
            oldBelief: "Build a Small 'Support & Generosity' Fund",
            newBelief: "Why it matters:\nGenerosity feels better when it doesn't come from scarcity. What would it be like to give freely without stress.\n\nReflection question:\nWho would you most like to help if money wasn't the barrier?\n\nTiny action:\nStart making a list of the people you'd be thrilled to help support and keep this in mind whenever you try to back out of going for more.",
            buttonText: "Next"
        },
        {
            id: 8,
            oldBelief: "A Weekly 15-Minute Money Check",
            newBelief: "Why it matters:\nRegular micro-checkins keep anxiety from accumulating into overwhelm. It's rehearsal for financial calm.\n\nReflection question:\nWhich day feels easiest this week to do a 15-minute check-in?\n\nTiny action:\nBlock 15 minutes on that day now. Use these prompts: What's my balance? One quick win? One small next step?",
            buttonText: "Finish"
        }
    ];

    const reflectionScreen = {
        title: "Moving Towards Clarity",
        description: "Hopefully, some of these reflections help you imagine a headspace that's clearer and more at peace. There are so many ways more money = more headroom and these ideas only just scratch the surface of what's possible.",
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Creating Headroom",
        descriptions: [
            "You've explored powerful ways to create more financial and mental headroom in your life. These practices will help you build the breathing room needed to make clearer decisions and reduce financial stress.",
        ],
        journalSectionProps: {
            pathTag: "money-mindsets",
            day: "6",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "More Money More Headroom",
            journalInstruction: "Reflect on today's exercise. Which tiny action resonated most with you? How will you implement these headroom-creating practices?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "We're wrapping up tomorrow. See you then.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="flip"
            primaryButtonText="Let's Explore"
            imageSource="https://pivotfordancers.com/assets/logo.png"
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}