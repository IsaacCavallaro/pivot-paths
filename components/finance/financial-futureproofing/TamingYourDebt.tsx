import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, TrendingDown, ArrowLeft, ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ methodIndex: 0, showHowTo: false }]);
    };

    const handleContinue = () => {
        if (showHowToExecute) {
            // Move to next method
            if (currentMethodIndex < debtMethods.length - 1) {
                const newMethodIndex = currentMethodIndex + 1;
                setCurrentMethodIndex(newMethodIndex);
                setShowHowToExecute(false);
                setScreenHistory([...screenHistory, { methodIndex: newMethodIndex, showHowTo: false }]);
            } else {
                // All methods completed, go to choice screen
                setScreenHistory([...screenHistory, { methodIndex: -1, showHowTo: false }]);
            }
        } else {
            // Show how to execute for current method
            setShowHowToExecute(true);
            setScreenHistory([...screenHistory, { methodIndex: currentMethodIndex, showHowTo: true }]);
        }
    };

    const handleMethodSelect = (methodId: number) => {
        setSelectedMethod(methodId);
        setScreenHistory([...screenHistory, { methodIndex: -2, showHowTo: false }]);
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentMethodIndex(0);
            setShowHowToExecute(false);
            setSelectedMethod(null);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.methodIndex === -1 || prevScreen.methodIndex === -2) {
            setSelectedMethod(null);
            return;
        }

        setCurrentMethodIndex(prevScreen.methodIndex);
        setShowHowToExecute(prevScreen.showHowTo);
    };

    // Calculate progress for method screens
    const methodProgress = ((currentMethodIndex + 1) / debtMethods.length) * 100;

    // Intro Screen
    if (screenHistory.length === 0) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        {onBack ? (
                            <TouchableOpacity style={styles.backIconWrapper} onPress={handleBack}>
                                <ArrowLeft size={24} color="#E2DED0" />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backIconWrapper} />
                        )}
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Taming Your Debt</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.introIcon}>
                                <TrendingDown size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Taming Your Debt</Text>
                            <Text style={styles.introDescription}>
                                Debt can feel like a weight holding you back. But think of it like a complex dance routine: it can be mastered one step at a time with a clear plan.
                                {"\n\n"}
                                You're not alone in this. Let's choose a strategy and build your payoff plan.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Explore Strategies</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Method Choice Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.methodIndex === -1) {
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Choose Your Fighter</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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
                                <TouchableOpacity
                                    style={styles.methodButton}
                                    onPress={() => handleMethodSelect(1)}
                                >
                                    <Text style={styles.methodButtonText}>Snowball Method</Text>
                                    <Text style={styles.methodButtonSubtext}>Momentum Builder</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.methodButton}
                                    onPress={() => handleMethodSelect(2)}
                                >
                                    <Text style={styles.methodButtonText}>Avalanche Method</Text>
                                    <Text style={styles.methodButtonSubtext}>Interest Slayer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Assignment Screen
    if (currentScreen.methodIndex === -2) {
        const selectedMethodData = debtMethods.find(method => method.id === selectedMethod);

        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Assignment</Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.assignmentIcon}>
                                <TrendingDown size={40} color="#928490" />
                            </View>
                            <Text style={styles.assignmentTitle}>Your Debt-Taming Assignment</Text>
                            <Text style={styles.assignmentSubtitle}>
                                Your strategic plan is ready. Now it's time to execute.
                            </Text>

                            <Text style={styles.assignmentText}>
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
                                {"\n\n"}
                                See you tomorrow.
                            </Text>

                            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Method Screens
    const currentMethod = debtMethods[currentMethodIndex];

    if (!showHowToExecute) {
        // Show method overview
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                Method {currentMethodIndex + 1} of {debtMethods.length}
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${methodProgress}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <LinearGradient
                                    colors={['#928490', '#746C70']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>How to execute</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    } else {
        // Show how to execute
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#647C90' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                Method {currentMethodIndex + 1} of {debtMethods.length}
                            </Text>
                        </View>
                        <View style={styles.backIconWrapper} />
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${methodProgress}%` }]} />
                    </View>
                </View>

                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
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

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <LinearGradient
                                    colors={['#5A7D7B', '#647C90']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>
                                        {currentMethodIndex < debtMethods.length - 1 ? 'Next Method' : 'Choose Strategy'}
                                    </Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0'
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },

    stickyHeader: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backIconWrapper: { width: 40, alignItems: 'center' },
    headerTitleContainer: { flex: 1, alignItems: 'center' },
    headerTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#E2DED0',
    },

    card: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 150,
    },
    introIcon: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(146,132,144,0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 30,
    },
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
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
        marginBottom: 40,
    },

    startButton: { borderRadius: 12, overflow: 'hidden' },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
    },

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
    continueButton: { borderRadius: 12, overflow: 'hidden' },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },

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
    methodButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    methodButtonText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 8,
    },
    methodButtonSubtext: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#647C90',
        textAlign: 'center',
    },

    assignmentIcon: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 30,
    },
    assignmentTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    assignmentSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    assignmentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 40,
    },
    completeButton: { borderRadius: 12, overflow: 'hidden' },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },

    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
});