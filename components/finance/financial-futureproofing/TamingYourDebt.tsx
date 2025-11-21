import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';
import { TrendingDown } from 'lucide-react-native';

interface TamingYourDebtProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TamingYourDebt({ onComplete, onBack }: TamingYourDebtProps) {
    const introScreen = {
        title: "Taming Your Debt",
        descriptions: [
            "Debt can feel like a weight holding you back. But think of it like a complex dance routine: it can be mastered one step at a time with a clear plan.",
            "You're not alone in this. Let's choose a strategy and build your payoff plan.",
        ],
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "1",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Taming Your Debt",
            journalInstruction: "Before we begin, take a moment to reflect on your current relationship with debt. What emotions come up when you think about your financial situation?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's go",
    };

    const secondaryIntroScreen = {
        title: "Explore Debt Strategies",
        descriptions: [
            "There are two main approaches to tackling debt, each with its own strengths. Let's explore both methods to find which one resonates with your personality and financial style.",
        ],
        buttonText: "Explore Strategies",
    };

    const cards = [
        {
            id: 1,
            title: "The Debt Snowball Method",
            description: "A psychology-first approach that builds powerful momentum.",
            strategy: "Pay off your debts from the smallest balance to the largest, regardless of the interest rate.",
            why: "The quick wins from eliminating entire debts keep you motivated and committed to the process.",
            result: "You build unstoppable momentum as each debt is cleared.",
            bestFor: "Dancers who feel overwhelmed and need motivational wins to stay on track.",
            steps: [
                "List your debts from smallest to largest balance.",
                "Make minimum payments on all your debts every month.",
                "Attack the smallest debt. Throw every extra dollar you can find at this one debt.",
                "Celebrate! When the smallest debt is gone, take that full payment amount and add it to the minimum payment of the next smallest debt (like a snowball!).",
                "Repeat. Watch your debt disappear faster and faster."
            ],
            proTip: "This method is about behavior change. The momentum is more valuable than the interest saved.",
            buttonText: "Next Method"
        },
        {
            id: 2,
            title: "The Debt Avalanche Method",
            description: "A math-first approach that saves you the most money.",
            strategy: "Pay off your debts from the highest interest rate to the lowest.",
            why: "This is the most efficient method mathematically. You'll pay less interest overall and get out of debt slightly faster.",
            result: "You save the most money on interest payments in the long run.",
            bestFor: "Dancers who are motivated by numbers, efficiency, and saving the maximum amount of money.",
            steps: [
                "List your debts from highest to lowest interest rate.",
                "Make minimum payments on all your debts every month.",
                "Attack the highest-rate debt. Pour all your extra cash into this debt first.",
                "Snowball the payments. Once the highest-rate debt is gone, take that payment and apply it to the next debt on your list.",
                "Repeat. Methodically eliminate your most expensive debts first."
            ],
            proTip: "This requires discipline, as it can take longer to see your first debt fully paid off. Keep your eye on the long-term prize.",
            buttonText: "Choose Strategy"
        }
    ];

    const selectionScreen = {
        title: "",
        description: "Reflect for a moment. Which strategy resonates with you?\n\n• The Momentum Builder (Snowball)\n• The Interest Slayer (Avalanche)\n\nThere is no wrong answer. The best strategy is the one you will actually stick with. Your willpower is your most valuable asset here.",
        useButtons: true,
        options: [
            {
                id: 1,
                title: "Snowball Method",
                subtitle: "Momentum Builder"
            },
            {
                id: 2,
                title: "Avalanche Method",
                subtitle: "Interest Slayer"
            }
        ],
    };

    const finalScreen = {
        title: "Your Debt-Taming Assignment",
        descriptions: [
            "Your strategic plan is ready. Now it's time to execute.",
        ],
        customContent: (
            <View style={styles.assignmentContainer}>
                <Text style={styles.assignmentTitle}>Do this today:</Text>
                <Text style={styles.assignmentText}>
                    1. Gather Your Intel: Open a note on your phone. List every debt you have with its balance, interest rate, and minimum payment.
                    {"\n\n"}
                    2. Choose Your Strategy: Based on your list and your personality, pick Snowball or Avalanche. Reorder your list accordingly.
                    {"\n\n"}
                    3. Schedule Your Attack: Pick a date each month to make your extra payment. Set a calendar reminder.
                    {"\n\n"}
                    4. Automate the Minimums: Ensure all minimum payments are on auto-pay to avoid late fees.
                    {"\n\n"}
                    You've got this. This is the first step toward true financial freedom.
                </Text>
            </View>
        ),
        journalSectionProps: {
            pathTag: "financial-futureproofing",
            day: "1",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Taming Your Debt",
            journalInstruction: "What feels most achievable about your chosen debt strategy? What concerns or questions do you still have?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "See you tomorrow for the next step in your financial journey!",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="method"
            primaryButtonText="Let's go"
            iconComponent={<TrendingDown size={40} color="#928490" />}
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            selectionScreen={selectionScreen}
            finalScreen={finalScreen}
        />
    );
}

const styles = StyleSheet.create({
    assignmentContainer: {
        width: '100%',
        marginBottom: 30,
    },
    assignmentTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        marginBottom: 15,
    },
    assignmentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 24,
    },
});