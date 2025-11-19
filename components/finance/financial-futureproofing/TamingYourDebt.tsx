import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { TrendingDown } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DebtMethod {
    id: number;
    title: string;
    description: string;
    strategy: string;
    why: string;
    result: string;
    bestFor: string;
    steps: string[];
    proTip: string;
}

const debtMethods: DebtMethod[] = [
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
        proTip: "This method is about behavior change. The momentum is more valuable than the interest saved."
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
        proTip: "This requires discipline, as it can take longer to see your first debt fully paid off. Keep your eye on the long-term prize."
    }
];

interface TamingYourDebtProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TamingYourDebt({ onComplete, onBack }: TamingYourDebtProps) {
    const [currentMethodIndex, setCurrentMethodIndex] = useState(0);
    const [showHowToExecute, setShowHowToExecute] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ methodIndex: number, showHowTo: boolean }>>([]);
    const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('financial-futureproofing');

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

    const handleContinueToStrategies = () => {
        setScreenHistory([{ methodIndex: -3, showHowTo: false }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (showHowToExecute) {
            // Move to next method
            if (currentMethodIndex < debtMethods.length - 1) {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    const newMethodIndex = currentMethodIndex + 1;

                    // Reset animations
                    fadeAnim.setValue(0);

                    // Update state
                    setCurrentMethodIndex(newMethodIndex);
                    setShowHowToExecute(false);

                    // Animate in the next card
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.spring(progressAnim, {
                                toValue: (newMethodIndex + 1) / debtMethods.length,
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
                // All methods completed, go to choice screen
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setScreenHistory(prev => [...prev, { methodIndex: -1, showHowTo: false }]);
                    fadeAnim.setValue(1);
                    scrollToTop();
                });
            }
        } else {
            // Show how to execute for current method
            setShowHowToExecute(true);
            setScreenHistory(prev => [...prev, { methodIndex: currentMethodIndex, showHowTo: true }]);
            scrollToTop();
        }
    }, [showHowToExecute, currentMethodIndex, fadeAnim, progressAnim, scrollToTop]);

    const handleMethodSelect = (methodId: number) => {
        setSelectedMethod(methodId);
        setScreenHistory(prev => [...prev, { methodIndex: -2, showHowTo: false }]);
        scrollToTop();
    };

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
            setShowHowToExecute(false);
            setSelectedMethod(null);
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
            scrollToTop();
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentMethodIndex(prevScreen.methodIndex);
            setShowHowToExecute(prevScreen.showNew);
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
            toValue: (currentMethodIndex + 1) / debtMethods.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentMethodIndex]);

    // NEW: Intro Screen with Journal
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
                                <TrendingDown size={40} color="#928490" />
                            </View>

                            <Text style={commonStyles.introTitle}>Taming Your Debt</Text>
                            <Text style={commonStyles.introDescription}>
                                Debt can feel like a weight holding you back. But think of it like a complex dance routine: it can be mastered one step at a time with a clear plan.
                                {"\n\n"}
                                You're not alone in this. Let's choose a strategy and build your payoff plan.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="1"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Taming Your Debt"
                                journalInstruction="Before we begin, take a moment to reflect on your current relationship with debt. What emotions come up when you think about your financial situation?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's go" onPress={handleContinueToStrategies} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Strategies Intro Screen
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
                                <TrendingDown size={40} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Explore Debt Strategies</Text>
                            <Text style={styles.introDescription}>
                                There are two main approaches to tackling debt, each with its own strengths. Let's explore both methods to find which one resonates with your personality and financial style.
                            </Text>

                            <PrimaryButton title="Explore Strategies" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Method Choice Screen
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
                            <Text style={styles.choiceDescription}>
                                Reflect for a moment. Which strategy resonates with you?
                                {"\n\n"}
                                • The Momentum Builder (Snowball)
                                {"\n"}
                                • The Interest Slayer (Avalanche)
                                {"\n\n"}
                                There is no wrong answer. The best strategy is the one you will actually stick with. Your willpower is your most valuable asset here.
                            </Text>

                            <View style={styles.methodButtonsContainer}>
                                <PrimaryButton
                                    title="Snowball Method"
                                    subtitle="Momentum Builder"
                                    onPress={() => handleMethodSelect(1)}
                                />

                                <PrimaryButton
                                    title="Avalanche Method"
                                    subtitle="Interest Slayer"
                                    onPress={() => handleMethodSelect(2)}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Assignment Screen with Journal
    if (currentScreen.methodIndex === -2) {
        const selectedMethodData = debtMethods.find(method => method.id === selectedMethod);

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
                                <TrendingDown size={40} color="#928490" />
                            </View>

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>Your Debt-Taming Assignment</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Your strategic plan is ready. Now it's time to execute.
                                    {"\n\n"}
                                    Do this today:
                                    {"\n\n"}
                                    1. Gather Your Intel: Open a note on your phone. List every debt you have with its balance, interest rate, and minimum payment.
                                    {"\n"}
                                    2. Choose Your Strategy: Based on your list and your personality, pick {selectedMethodData?.title.replace("Method", "").trim()} or the other method. Reorder your list accordingly.
                                    {"\n"}
                                    3. Schedule Your Attack: Pick a date each month to make your extra payment. Set a calendar reminder.
                                    {"\n"}
                                    4. Automate the Minimums: Ensure all minimum payments are on auto-pay to avoid late fees.
                                    {"\n\n"}
                                    You've got this. This is the first step toward true financial freedom.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="1"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Taming Your Debt"
                                journalInstruction="What feels most achievable about your chosen debt strategy? What concerns or questions do you still have?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for the next step in your financial journey!
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
    const currentMethod = debtMethods[currentMethodIndex];

    if (!showHowToExecute) {
        // Show method overview
        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`Method ${currentMethodIndex + 1} of ${debtMethods.length}`}
                    progress={(currentMethodIndex + 1) / debtMethods.length}
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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.methodTitle}>{currentMethod.title}</Text>
                                <Text style={styles.methodDescription}>{currentMethod.description}</Text>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>The Strategy:</Text>
                                    <Text style={styles.sectionContent}>{currentMethod.strategy}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>The Why:</Text>
                                    <Text style={styles.sectionContent}>{currentMethod.why}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>The Result:</Text>
                                    <Text style={styles.sectionContent}>{currentMethod.result}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Best for:</Text>
                                    <Text style={styles.sectionContent}>{currentMethod.bestFor}</Text>
                                </View>

                                <PrimaryButton
                                    title="How to execute"
                                    onPress={handleContinue}
                                />
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    } else {
        // Show how to execute
        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`Method ${currentMethodIndex + 1} of ${debtMethods.length}`}
                    progress={(currentMethodIndex + 1) / debtMethods.length}
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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.executeTitle}>How to Execute {currentMethod.title}</Text>

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
                                    title={currentMethodIndex < debtMethods.length - 1 ? 'Next Method' : 'Choose Strategy'}
                                    onPress={handleContinue}
                                />
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    // Intro screen styles
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
    // Method screen styles
    methodTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    executeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    methodDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    section: {
        marginBottom: 30,
        width: '100%',
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        marginBottom: 12,
    },
    sectionContent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 22,
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 22,
        marginBottom: 8,
    },
    proTipText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 16,
        color: '#647C90',
        lineHeight: 22,
    },
    // Choice screen styles
    choiceDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 24,
        marginBottom: 40,
        textAlign: 'center',
    },
    methodButtonsContainer: {
        gap: 20,
        marginBottom: 40,
        width: '100%',
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