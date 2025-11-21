import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardPromptEngine from '@/components/shared/card-prompt-engine/CardPromptEngine';
import { PiggyBank, Target, Trash2 } from 'lucide-react-native';

interface SavingsSprintProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SavingsSprint({ onComplete, onBack }: SavingsSprintProps) {
    const introScreen = {
        title: "The 30-Day Savings Sprint",
        descriptions: [
            "Think you can't save? Think again. This isn't about huge sacrifices, it's about small, consistent actions that prove you are in control of your money.",
        ],
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "2",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Know Your Value",
            journalInstruction: "Before we begin, let's check in with your current relationship with saving. What comes to mind when you think about saving money?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Let's begin",
    };

    const secondaryIntroScreen = {
        title: "Your Savings Journey",
        descriptions: [
            "Let's walk through three simple challenges. Your only job is to pick one and start. Remember, this isn't about huge amounts - it's about building the habit.",
        ],
        buttonText: "Start Exploring Challenges",
    };

    const cards = [
        {
            id: 1,
            title: "The Spare Change Round-Up",
            description: "A micro-habit challenge that builds consistency.",
            goal: "Save a small amount of money every single day for 30 days.",
            target: "$1 - $5 per day.",
            result: "$30 to $150 in one month.",
            bestFor: "Anyone. It proves that saving is a daily habit, not a grand gesture.",
            steps: [
                "Get a jar or create a separate account in your banking app.",
                "Each night, add $1-$5 to the pot.",
                "Don't overthink it. The amount doesn't matter as much as the action.",
                "Watch it grow. The daily act builds momentum and makes saving automatic."
            ],
            proTip: "Set a daily phone reminder for 9 PM that says 'Save $3 Today.'",
            buttonText: "Next Challenge"
        },
        {
            id: 2,
            title: "The No-Brainer",
            description: "A one-and-done challenge that practices 'paying yourself first.'",
            goal: "Immediately move 10% to savings from your next paycheck.",
            target: "Paying yourself first",
            result: "Savings secured instantly",
            bestFor: "Dancers who want a quick win and ready to master an important rule of saving.",
            steps: [
                "Know your next pay date. Is it this Friday? Next Wednesday?",
                "Set an alert on your phone for that morning: 'TRANSFER 10% TO SAVINGS.'",
                "Do it immediately. Before you pay bills, before you buy groceries. Pay yourself first.",
                "Forget it exists. Let it sit in your savings account. You've already won the challenge."
            ],
            proTip: "If 10% feels like too much, start with just $50. The principle is what counts.",
            buttonText: "Next Challenge"
        },
        {
            id: 3,
            title: "The 30-Day Declutter",
            description: "A bonus challenge that turns clutter into cash.",
            goal: "Sell one item each week for a month.",
            target: "4 items in 30 days.",
            result: "An easy $50 to $200+ from stuff you don't use.",
            bestFor: "Dancers who have stuff to sell and likes the idea of 'free money.' It's girl math!",
            steps: [
                "Week 1: Find 1-2 items (old dance shoes, costumes, unused electronics, books).",
                "Week 2: Take good photos and list them on Facebook Marketplace or Poshmark.",
                "Week 3: As things sell, immediately transfer the money to your savings account.",
                "Week 4: Repeat! Find more items, list them, and watch your savings grow."
            ],
            proTip: "Price items to sell. The goal is fast cash, not maximum value.",
            buttonText: "Choose Your Challenge"
        }
    ];

    const selectionScreen = {
        title: "Choose Your Saving Style",
        description: "Reflect for a moment. Which challenge felt the most doable?",
        options: [
            {
                id: 1,
                title: "The Daily Habit (Spare Change)",
                icon: <PiggyBank size={32} color="#928490" />
            },
            {
                id: 2,
                title: "The One-Time Win (10% Transfer)",
                icon: <Target size={32} color="#928490" />
            },
            {
                id: 3,
                title: "The Bonus Round (Declutter)",
                icon: <Trash2 size={32} color="#928490" />
            }
        ],
        footer: "There is no wrong answer. The best challenge is the one you'll actually do.",
        buttonText: "Confirm Selection",
    };

    const finalScreen = {
        title: "Your Mission",
        descriptions: [
            "You've chosen your challenge! Now it's time to put it into action. Remember, the goal isn't perfection - it's progress.",
        ],
        customContent: (
            <View style={styles.missionSteps}>
                <Text style={styles.missionStep}>
                    1. Pick one challenge to commit to for the next 30 days.
                </Text>
                <Text style={styles.missionStep}>
                    2. Schedule it. Put the actionable step in your calendar or set those reminders.
                </Text>
                <Text style={styles.missionStep}>
                    3. Name your savings goal. What is this pot of money for? Emergency Fund, Pivot Savings, Breathing Room
                </Text>
                <Text style={styles.missionEncouragement}>
                    You are building proof that you can do this.
                </Text>
            </View>
        ),
        journalSectionProps: {
            pathTag: "budgeting-for-dancers",
            day: "2",
            category: "finance",
            pathTitle: "Money Mindsets",
            dayTitle: "Know Your Value",
            journalInstruction: "What excites you most about starting this savings challenge? What feels challenging?",
            moodLabel: "",
            saveButtonText: "Save Entry",
        },
        buttonText: "Mark As Complete",
    };

    return (
        <CardPromptEngine
            onComplete={onComplete}
            onBack={onBack}
            cardType="challenge"
            primaryButtonText="Let's begin"
            iconComponent={<PiggyBank size={48} color="#928490" />}
            introScreen={introScreen}
            secondaryIntroScreen={secondaryIntroScreen}
            cards={cards}
            selectionScreen={selectionScreen}
            finalScreen={finalScreen}
        />
    );
}

const styles = StyleSheet.create({
    missionSteps: {
        marginBottom: 30,
        width: '100%',
    },
    missionStep: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        marginBottom: 15,
        lineHeight: 24,
    },
    missionEncouragement: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#928490',
        textAlign: 'center',
        marginTop: 10,
    },
});