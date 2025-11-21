import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';
import { Briefcase, DollarSign, Clock, Home, GraduationCap } from 'lucide-react-native';

interface TheTotalPackageProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TheTotalPackage({ onComplete, onBack }: TheTotalPackageProps) {
    const introScreen = {
        title: "The Total Package",
        descriptions: [
            "Your salary is just one part of your compensation. The full package includes benefits that can be even more valuable than a slight pay raise.",
        ],
        subtext: "If an employer can't meet your salary request, you can often negotiate for other perks that provide financial security, flexibility, and peace of mind. Let's explore your options.",
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "4",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Taming Your Debt",
            journalInstruction: "Before we explore benefits, let's check in with your current mindset about compensation. What are your thoughts on negotiating beyond just salary?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Explore Benefits",
    };

    const cards = [
        {
            id: 1,
            title: "The Retirement Boost (401(k) Match)",
            description: "A powerful tool for long-term wealth building.",
            whatItIs: "Many companies will match your retirement contributions up to a certain percentage of your salary (e.g. your employer makes 50% of your contributions up to 6% of your salary.)",
            whyValuable: "This is free money that grows tax-free for decades. A higher match can be worth thousands more per year.",
            howToAsk: "\"Is there any flexibility with the 401(k) matching structure?\"",
            bestFor: "Dancers thinking about their long-term financial future.",
            buttonText: "Next Benefit"
        },
        {
            id: 2,
            title: "The Flexibility Factor (Remote/Hybrid Work)",
            description: "Time is money, and flexibility is priceless.",
            whatItIs: "The ability to work from home (fully remote) or split time between home and the office (hybrid).",
            whyValuable: "Saves money and time on commuting, reduces stress, and allows for a better work-life balance. This can be a game-changer for auditioning or taking class.",
            howToAsk: "\"What is the policy on remote or hybrid work arrangements?\"",
            bestFor: "Dancers who value control over their time and schedule.",
            buttonText: "Next Benefit"
        },
        {
            id: 3,
            title: "The Value of Time (Paid Time Off - PTO)",
            description: "More time off means more time for your art, life, and rest.",
            whatItIs: "Additional paid vacation days, sick days, or personal days.",
            whyValuable: "It protects your income when you need to recharge, travel, or deal with unexpected life events. It directly improves your quality of life.",
            howToAsk: "\"Is there any flexibility with the number of paid vacation days?\"",
            bestFor: "Everyone. You can't pour from an empty cup.",
            buttonText: "Next Benefit"
        },
        {
            id: 4,
            title: "Skill Building (Professional Development Fund)",
            description: "Investing in your future earning potential.",
            whatItIs: "A stipend or budget to use for courses, certifications, conferences, or workshops.",
            whyValuable: "It allows you to gain new, valuable skills for free, making you more marketable for your next role or promotion.",
            howToAsk: "\"Does the company offer a professional development stipend or cover costs for relevant certifications?\"",
            bestFor: "Dancers planning a long-term career pivot and wanting to build new skills.",
            buttonText: "See Game Plan"
        }
    ];

    const reflectionScreen = {
        title: "Your Negotiation Game Plan",
        customContent: (
            <View style={styles.stepsContainer}>
                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>
                        <Text style={styles.stepBold}>Prioritize:</Text> If the salary isn't flexible, which one or two of these benefits would have the biggest impact on your life? Don't try to negotiate all of them!
                    </Text>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>
                        <Text style={styles.stepBold}>Do Your Homework:</Text> Know the standard for the industry and role.
                    </Text>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>
                        <Text style={styles.stepBold}>Frame it Collaboratively:</Text> Use phrases like, "I'm really excited about this role. If the salary is firm at $X, would you be open to discussing a more flexible work arrangement / additional week of PTO to help make it work?"
                    </Text>
                </View>

                <View style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>4</Text>
                    </View>
                    <Text style={styles.stepText}>
                        <Text style={styles.stepBold}>Get it in Writing:</Text> Any negotiated benefit must be documented in your official offer letter.
                    </Text>
                </View>
            </View>
        ),
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Complete",
        descriptions: [
            "Remember, negotiation is a conversation. You're not being demanding, you're being strategic. A good employer will respect you for it.",
            "These benefits build the foundation for a sustainable and fulfilling career.",
        ],
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "4",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Taming Your Debt",
            journalInstruction: "Reflect on which benefits resonated most with you and why. How might you approach your next compensation discussion differently?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you again tomorrow.",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="benefit"
            primaryButtonText="Explore Benefits"
            iconComponent={<Briefcase size={48} color="#928490" />}
            introScreen={introScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}

const styles = StyleSheet.create({
    stepsContainer: {
        marginBottom: 30,
        width: '100%',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#5A7D7B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 2,
    },
    stepNumberText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: '#E2DED0',
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        flex: 1,
        lineHeight: 22,
    },
    stepBold: {
        fontFamily: 'Montserrat-SemiBold',
    },
});