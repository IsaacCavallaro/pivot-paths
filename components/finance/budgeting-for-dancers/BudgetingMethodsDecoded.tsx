import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { Calculator } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface BudgetingMethod {
    id: number;
    title: string;
    description: string;
    breakdown: string;
    bestFor: string;
    steps: string[];
    proTip: string;
}

const budgetingMethods: BudgetingMethod[] = [
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
        proTip: "This rule is a guide, not a straitjacket. Adjust the percentages to fit your reality."
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
        proTip: "Use a free budgeting app or a simple spreadsheet to make this easier."
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
        proTip: "You can use a digital version with separate savings accounts named for each category. But be firm with this approach! When it's gone, it's gone!"
    }
];

interface BudgetingMethodsDecodedProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function BudgetingMethodsDecoded({ onComplete, onBack }: BudgetingMethodsDecodedProps) {
    const [currentMethodIndex, setCurrentMethodIndex] = useState(0);
    const [showHowToStart, setShowHowToStart] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ methodIndex: number, showHowTo: boolean }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('budgeting-for-dancers');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ methodIndex: 0, showHowTo: false }]);
        scrollToTop();
    };

    const handleContinueToMethods = () => {
        setScreenHistory([{ methodIndex: -3, showHowTo: false }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (showHowToStart) {
            // Move to next method
            if (currentMethodIndex < budgetingMethods.length - 1) {
                // Fade out current card
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    const newMethodIndex = currentMethodIndex + 1;

                    // Reset animations BEFORE updating state
                    fadeAnim.setValue(0);

                    // Update state
                    setCurrentMethodIndex(newMethodIndex);
                    setShowHowToStart(false);

                    // Animate in the next card with a slight delay
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.spring(progressAnim, {
                                toValue: (newMethodIndex + 1) / budgetingMethods.length,
                                tension: 50,
                                friction: 7,
                                useNativeDriver: false,
                            })
                        ]).start();
                    }, 50);

                    setScreenHistory(prev => [...prev, { methodIndex: newMethodIndex, showHowTo: false }]);
                    scrollToTop();
                });
            } else {
                // All methods completed, go to reflection screen
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setScreenHistory(prev => [...prev, { methodIndex: -2, showHowTo: false }]);
                    fadeAnim.setValue(1);
                    scrollToTop();
                });
            }
        } else {
            // Show how to start for current method
            setShowHowToStart(true);
            setScreenHistory(prev => [...prev, { methodIndex: currentMethodIndex, showHowTo: true }]);
            scrollToTop();
        }
    }, [showHowToStart, currentMethodIndex, fadeAnim, progressAnim, scrollToTop]);

    const handleComplete = () => {
        // Add a subtle scale animation on complete
        Animated.sequence([
            Animated.timing(cardScale, {
                toValue: 1.02,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            onComplete();
        });
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentMethodIndex(0);
            setShowHowToStart(false);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.methodIndex === -1 || prevScreen.methodIndex === -2 || prevScreen.methodIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentMethodIndex(prevScreen.methodIndex);
            setShowHowToStart(prevScreen.showHowTo);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentMethodIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentMethodIndex + 1) / budgetingMethods.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentMethodIndex]);

    // Intro Screen with Journal
    if (screenHistory.length === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Calculator size={40} color="#928490" />
                            </View>

                            <Text style={commonStyles.introTitle}>Budgeting Methods Decoded</Text>
                            <Text style={commonStyles.introDescription}>
                                You know you need a budget, but where to start? Dancers thrive with structure so let's find a financial framework that fits your flow.
                                {"\n\n"}
                                We'll walk through three popular methods. Your job is to see which one is best for you.
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="3"
                                category="finance"
                                pathTitle="Budgeting For Dancers"
                                dayTitle="Budgeting Methods Decoded"
                                journalInstruction="Before we begin, what's your current relationship with budgeting? What hopes or concerns do you have?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Begin" onPress={handleContinueToMethods} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Methods Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.methodIndex === -3) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Calculator size={40} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Find Your Financial Flow</Text>
                            <Text style={styles.introDescription}>
                                Budgeting isn't about restriction—it's about intention. It's deciding where your hard-earned money goes, instead of wondering where it disappeared to.
                                {"\n\n"}
                                Let's explore three different approaches to find the one that feels most natural to you.
                            </Text>

                            <PrimaryButton title="Explore Methods" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen.methodIndex === -2) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.reflectionHeader}>
                                <Text style={styles.reflectionTitle}>Find Your Fit</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Reflect for a moment. Which method made the most sense to you?
                                    {"\n\n"}
                                    • The Simple Guide (50/30/20)
                                    {"\n"}
                                    • The Detailed Plan (Zero-Based)
                                    {"\n"}
                                    • The Physical Limit (Envelope)
                                    {"\n\n"}
                                    There's no wrong answer. The best budget is the one you'll actually stick with.
                                </Text>
                            </View>

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

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { methodIndex: -1, showHowTo: false }]);
                                    scrollToTop();
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with Journal
    if (currentScreen.methodIndex === -1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Calculator size={40} color="#928490" />
                            </View>

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>Your Financial Foundation</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    With a budget, you're not restricting your life, you're funding it. You're deciding where your hard-earned money goes, instead of wondering where it disappeared to.
                                    {"\n\n"}
                                    This is the foundation of financial freedom.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="3"
                                category="finance"
                                pathTitle="Budgeting For Dancers"
                                dayTitle="Budgeting Methods Decoded"
                                journalInstruction="Which budgeting method resonated most with you? What's one small step you'll take this week to implement it?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                You're building the financial confidence to support your dance journey!
                            </Text>

                            <View style={commonStyles.finalButtonContainer}>
                                <PrimaryButton
                                    title="Mark As Complete"
                                    onPress={handleComplete}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Method Screens
    const currentMethod = budgetingMethods[currentMethodIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentMethodIndex + 1} of ${budgetingMethods.length}`}
                progress={(currentMethodIndex + 1) / budgetingMethods.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={commonStyles.centeredContent}>
                    <Animated.View style={[styles.methodContainer, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
                        <Card style={commonStyles.baseCard}>
                            {!showHowToStart ? (
                                // Method Overview
                                <>
                                    <Text style={styles.methodTitle}>{currentMethod.title}</Text>
                                    <Text style={styles.methodDescription}>{currentMethod.description}</Text>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>The Breakdown:</Text>
                                        <Text style={styles.sectionContent}>{currentMethod.breakdown}</Text>
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Best for:</Text>
                                        <Text style={styles.sectionContent}>{currentMethod.bestFor}</Text>
                                    </View>

                                    <PrimaryButton
                                        title="How to start"
                                        onPress={handleContinue}
                                    />
                                </>
                            ) : (
                                // How to Start
                                <>
                                    <Text style={styles.howToTitle}>How to Start {currentMethod.title}</Text>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Do this:</Text>
                                        {currentMethod.steps.map((step, index) => (
                                            <Text key={index} style={styles.stepText}>
                                                {index + 1}. {step}
                                            </Text>
                                        ))}
                                    </View>

                                    <View style={styles.section}>
                                        <Text style={styles.sectionTitle}>Pro Tip:</Text>
                                        <Text style={styles.proTipText}>{currentMethod.proTip}</Text>
                                    </View>

                                    <PrimaryButton
                                        title={currentMethodIndex < budgetingMethods.length - 1 ? 'Next Method' : 'See All Methods'}
                                        onPress={handleContinue}
                                    />
                                </>
                            )}
                        </Card>
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    methodContainer: {
        width: width * 0.85,
    },
    methodTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    howToTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    methodDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    section: {
        marginBottom: 24,
        alignSelf: 'stretch',
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        marginBottom: 12,
    },
    sectionContent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#746C70',
        lineHeight: 20,
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#746C70',
        lineHeight: 20,
        marginBottom: 8,
    },
    proTipText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14,
        color: '#647C90',
        lineHeight: 20,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
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
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 0,
        fontWeight: '600',
    },
});