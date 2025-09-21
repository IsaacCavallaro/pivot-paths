import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, PiggyBank, ArrowLeft, ChevronLeft, Target, Trash2 } from 'lucide-react-native';

interface ChallengeOption {
    id: number;
    title: string;
    description: string;
    goal: string;
    target: string;
    result: string;
    bestFor: string;
    steps: string[];
    proTip: string;
    icon: React.ReactNode;
}

const challengeOptions: ChallengeOption[] = [
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
        icon: <PiggyBank size={32} color="#928490" />
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
        icon: <Target size={32} color="#928490" />
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
        icon: <Trash2 size={32} color="#928490" />
    }
];

interface SavingsSprintProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SavingsSprint({ onComplete, onBack }: SavingsSprintProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0: intro, 1-3: challenge details, 4: choose, 5: mission
    const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);
    const [screenHistory, setScreenHistory] = useState<number[]>([0]);

    const handleBack = useCallback(() => {
        if (onBack && screenHistory.length === 1) {
            onBack();
            return;
        }

        if (screenHistory.length > 1) {
            const newHistory = [...screenHistory];
            newHistory.pop();
            setScreenHistory(newHistory);
            setCurrentScreen(newHistory[newHistory.length - 1]);
        }
    }, [onBack, screenHistory]);

    const navigateTo = (screen: number) => {
        setScreenHistory([...screenHistory, screen]);
        setCurrentScreen(screen);
    };

    const handleSelectChallenge = (id: number) => {
        setSelectedChallenge(id);
        navigateTo(4); // Go to choose your style screen
    };

    const handleComplete = () => {
        onComplete();
    };

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <PiggyBank size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>The 30-Day Savings Sprint</Text>

                    <Text style={styles.introDescription}>
                        Think you can't save? Think again. This isn't about huge sacrifices, it's about small, consistent actions that prove you are in control of your money.
                    </Text>

                    <Text style={styles.introSubtext}>
                        Let's walk through three simple challenges. Your only job is to pick one and start.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={() => navigateTo(1)}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's begin</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Challenge Detail Screens (1-3)
    if (currentScreen >= 1 && currentScreen <= 3) {
        const challenge = challengeOptions[currentScreen - 1];

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.challengeContainer}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>{challenge.description}</Text>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>The Goal:</Text>
                        <Text style={styles.infoText}>{challenge.goal}</Text>

                        <Text style={styles.infoLabel}>The Target:</Text>
                        <Text style={styles.infoText}>{challenge.target}</Text>

                        <Text style={styles.infoLabel}>The Result:</Text>
                        <Text style={styles.infoText}>{challenge.result}</Text>

                        <Text style={styles.infoLabel}>Best for:</Text>
                        <Text style={styles.infoText}>{challenge.bestFor}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>How to Do It</Text>

                    <View style={styles.stepsContainer}>
                        {challenge.steps.map((step, index) => (
                            <View key={index} style={styles.stepRow}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.proTipContainer}>
                        <Text style={styles.proTipText}>Pro Tip: {challenge.proTip}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => {
                            if (currentScreen < 3) {
                                navigateTo(currentScreen + 1);
                            } else {
                                navigateTo(4); // Go to choose screen after last challenge
                            }
                        }}
                    >
                        <LinearGradient
                            colors={['#928490', '#746C70']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>
                                {currentScreen < 3 ? 'Next Challenge' : 'Choose Your Challenge'}
                            </Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Choose Your Saving Style Screen
    if (currentScreen === 4) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.chooseContainer}>
                    <Text style={styles.chooseTitle}>Choose Your Saving Style</Text>
                    <Text style={styles.chooseDescription}>
                        Reflect for a moment. Which challenge felt the most doable?
                    </Text>

                    {challengeOptions.map((challenge) => (
                        <TouchableOpacity
                            key={challenge.id}
                            style={[
                                styles.challengeOption,
                                selectedChallenge === challenge.id && styles.challengeOptionSelected
                            ]}
                            onPress={() => setSelectedChallenge(challenge.id)}
                        >
                            <View style={styles.challengeOptionIcon}>
                                {challenge.icon}
                            </View>
                            <View style={styles.challengeOptionText}>
                                <Text style={styles.challengeOptionTitle}>
                                    {challenge.id === 1 && "The Daily Habit (Spare Change)"}
                                    {challenge.id === 2 && "The One-Time Win (10% Transfer)"}
                                    {challenge.id === 3 && "The Bonus Round (Declutter)"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <Text style={styles.chooseFooter}>
                        There is no wrong answer. The best challenge is the one you'll actually do.
                    </Text>

                    <TouchableOpacity
                        style={[styles.continueButton, !selectedChallenge && styles.continueButtonDisabled]}
                        onPress={() => navigateTo(5)}
                        disabled={!selectedChallenge}
                    >
                        <LinearGradient
                            colors={['#5A7D7B', '#647C90']}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>Confirm Selection</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Mission Screen
    if (currentScreen === 5) {
        const selectedChallengeData = challengeOptions.find(c => c.id === selectedChallenge);

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.missionContainer}>
                    <Text style={styles.missionTitle}>Your Mission, Should You Choose to Accept It</Text>

                    <View style={styles.missionSteps}>
                        <Text style={styles.missionStep}>1. Pick one challenge to commit to for the next 30 days.</Text>
                        <Text style={styles.missionStep}>2. Schedule it. Put the actionable step in your calendar or set those reminders.</Text>
                        <Text style={styles.missionStep}>3. Name your savings goal. What is this pot of money for? Emergency Fund, Pivot Savings, Breathing Room</Text>
                    </View>

                    <Text style={styles.missionEncouragement}>
                        You are building proof that you can do this.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark as complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ChevronLeft size={20} color="#647C90" />
                    <Text style={styles.backButtonText}>Previous</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    content: {
        flex: 1,
    },
    introContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    introIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 10,
    },
    introSubtext: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    startButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
    },
    challengeContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    challengeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    challengeDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
    },
    infoLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        marginBottom: 5,
    },
    infoText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#746C70',
        marginBottom: 15,
        lineHeight: 22,
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 22,
        color: '#4E4F50',
        marginBottom: 15,
    },
    stepsContainer: {
        marginBottom: 20,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#928490',
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
    proTipContainer: {
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#5A7D7B',
    },
    proTipText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 22,
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 10,
    },
    continueButtonDisabled: {
        opacity: 0.5,
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    chooseContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    chooseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    chooseDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    challengeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
    },
    challengeOptionSelected: {
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderWidth: 2,
        borderColor: '#5A7D7B',
    },
    challengeOptionIcon: {
        marginRight: 15,
    },
    challengeOptionText: {
        flex: 1,
    },
    challengeOptionTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
    },
    chooseFooter: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#746C70',
        textAlign: 'center',
        marginVertical: 20,
    },
    missionContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    missionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    missionSteps: {
        marginBottom: 30,
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
        color: '#5A7D7B',
        textAlign: 'center',
        marginBottom: 40,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    completeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },
    backButtonText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginLeft: 8,
    },
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
    },
});