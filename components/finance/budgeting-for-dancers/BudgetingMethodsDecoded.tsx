import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';
import { Calculator } from 'lucide-react-native';

interface BudgetingMethodsDecodedProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function BudgetingMethodsDecoded({ onComplete, onBack }: BudgetingMethodsDecodedProps) {
    const introScreen = {
        title: "Budgeting Methods Decoded",
        descriptions: [
            "You know you need a budget, but where to start? Dancers thrive with structure so let's find a financial framework that fits your flow.",
            "We'll walk through three popular methods. Your job is to see which one is best for you.",
        ],
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "3",
            category: "finance",
            pathTitle: "Budgeting For Dancers",
            dayTitle: "Budgeting Methods Decoded",
            journalInstruction: "Before we begin, what's your current relationship with budgeting? What hopes or concerns do you have?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's Begin",
    };

    const secondaryIntroScreen = {
        title: "Find Your Financial Flow",
        descriptions: [
            "Budgeting isn't about restriction—it's about intention. It's deciding where your hard-earned money goes, instead of wondering where it disappeared to.",
            "Let's explore three different approaches to find the one that feels most natural to you.",
        ],
        buttonText: "Explore Methods",
    };

    const cards = [
        {
            id: 1,
            title: "The 50/30/20 Rule",
            description: "A simple, flexible framework for balancing your money.",
            breakdown: "• 50% Needs: Rent, groceries, utilities, insurance, basic transportation.\n• 30% Wants: Dining out, travel, new dancewear, subscriptions, entertainment.\n• 20% Savings/Debt: Emergency fund, retirement, paying down credit cards.",
            bestFor: "Dancers who want a straightforward, easy-to-start budget.",
            steps: [
                "Calculate your after-tax average monthly income.",
                "Multiply that number by 0.50, 0.30, and 0.20.",
                "Those are your monthly targets for Needs, Wants, and Savings/Debt.",
                "Track your spending to see how you measure up."
            ],
            proTip: "This rule is a guide, not a straitjacket. Adjust the percentages to fit your reality.",
            buttonText: "Next Method"
        },
        {
            id: 2,
            title: "Zero-Based Budgeting (ZBB)",
            description: "Give every single dollar a job to do, until your income minus your expenses equals zero.",
            breakdown: "• Income - Expenses = $0. It's an equation.\n• You plan where all your money will go before the month begins.\n• Categories can be as specific as 'Groceries', 'Gas', 'Saving for New Laptop.'",
            bestFor: "Dancers who love detail, want maximum control, and have irregular income.",
            steps: [
                "List your expected income for the upcoming month.",
                "List every expense and financial goal (savings counts!).",
                "Adjust your spending categories until Income - Expenses = $0.",
                "Track every transaction throughout the month and adjust categories as needed."
            ],
            proTip: "Use a free budgeting app or a simple spreadsheet to make this easier.",
            buttonText: "Next Method"
        },
        {
            id: 3,
            title: "The Envelope System",
            description: "A classic, cash-based method for tactile learners. Physically limits your spending.",
            breakdown: "• You withdraw cash for your variable spending categories (Groceries, Fun Money, Eating Out).\n• You put the cash into separate, labeled envelopes.\n• When the envelope is empty, you stop spending in that category.",
            bestFor: "Dancers who tend to overspend and need a physical, visual cue to stop.",
            steps: [
                "Decide which spending categories are hard to control (Food, Entertainment).",
                "Based on your budget, withdraw the cash you've allocated for each category for the month.",
                "Place the cash in separate envelopes and label them.",
                "Only spend the cash from the corresponding envelope.",
                "Leave your debit/credit cards at home."
            ],
            proTip: "You can use a digital version with separate savings accounts named for each category. But be firm with this approach! When it's gone, it's gone!",
            buttonText: "See All Methods"
        }
    ];

    const reflectionScreen = {
        title: "Find Your Fit",
        description: "Reflect for a moment. Which method made the most sense to you?\n\n• The Simple Guide (50/30/20)\n• The Detailed Plan (Zero-Based)\n• The Physical Limit (Envelope)\n\nThere's no wrong answer. The best budget is the one you'll actually stick with.",
        customContent: (
            <View style={styles.assignmentSection}>
                <Text style={styles.assignmentTitle}>Your First Assignment</Text>
                <Text style={styles.assignmentText}>
                    Do this today:
                    {"\n\n"}
                    1. Choose one budgeting method to try for the next 30 days.
                    {"\n"}
                    2. Set up your system in a simple spreadsheet.
                    {"\n"}
                    3. Schedule 10 minutes in your calendar every Sunday to plan for the next week.
                    {"\n\n"}
                    You don't have to be perfect. You just have to start. The goal is awareness, not perfection.
                </Text>
            </View>
        ),
        buttonText: "Continue",
    };

    const finalScreen = {
        title: "Your Financial Foundation",
        descriptions: [
            "With a budget, you're not restricting your life, you're funding it. You're deciding where your hard-earned money goes, instead of wondering where it disappeared to.",
            "This is the foundation of financial freedom.",
        ],
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "3",
            category: "finance",
            pathTitle: "Budgeting For Dancers",
            dayTitle: "Budgeting Methods Decoded",
            journalInstruction: "Which budgeting method resonated most with you? What's one small step you'll take this week to implement it?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        alternativeClosing: "You're building the financial confidence to support your dance journey!",
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="method"
            primaryButtonText="Let's Begin"
            iconComponent={<Calculator size={40} color="#928490" />}
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            reflectionScreen={reflectionScreen}
            finalScreen={finalScreen}
        />
    );
}

const styles = StyleSheet.create({
    assignmentSection: {
        marginBottom: 30,
        alignSelf: 'stretch',
    },
    assignmentTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        marginBottom: 12,
        textAlign: 'center',
    },
    assignmentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#746C70',
        lineHeight: 20,
    },
});