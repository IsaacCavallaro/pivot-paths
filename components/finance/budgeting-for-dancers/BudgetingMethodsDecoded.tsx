import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Calculator, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ methodIndex: 0, showHowTo: false }]);
    };

    const handleContinue = () => {
        if (showHowToStart) {
            // Move to next method
            if (currentMethodIndex < budgetingMethods.length - 1) {
                const newMethodIndex = currentMethodIndex + 1;
                setCurrentMethodIndex(newMethodIndex);
                setShowHowToStart(false);
                setScreenHistory([...screenHistory, { methodIndex: newMethodIndex, showHowTo: false }]);
            } else {
                // All methods completed, go to reflection screen
                setScreenHistory([...screenHistory, { methodIndex: -1, showHowTo: false }]);
            }
        } else {
            // Show how to start for current method
            setShowHowToStart(true);
            setScreenHistory([...screenHistory, { methodIndex: currentMethodIndex, showHowTo: true }]);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            // If we're at the first screen, go back to intro
            setScreenHistory([]);
            setCurrentMethodIndex(0);
            setShowHowToStart(false);
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        if (prevScreen.methodIndex === -1) {
            // Shouldn't happen as we handle final screen separately
            return;
        }

        setCurrentMethodIndex(prevScreen.methodIndex);
        setShowHowToStart(prevScreen.showHowTo);
    };

    // Calculate progress for method screens
    const methodProgress = ((currentMethodIndex + 1) / budgetingMethods.length) * 100;

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
                            <Text style={styles.headerTitle}>Budgeting Methods</Text>
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
                                <Calculator size={32} color="#928490" />
                            </View>

                            <Text style={styles.introTitle}>Budgeting Methods Decoded</Text>
                            <Text style={styles.introDescription}>
                                You know you need a budget, but where to start? Dancers thrive with structure so let's find a financial framework that fits your flow.
                                {"\n\n"}
                                We'll walk through three popular methods. Your job is to see which one is best for you.
                            </Text>

                            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's begin</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }

    // Reflection Screen
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
                            <Text style={styles.headerTitle}>Budgeting Methods</Text>
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
                            <View style={styles.finalIcon}>
                                <Calculator size={40} color="#928490" />
                            </View>
                            <Text style={styles.introTitle}>Find Your Fit</Text>
                            <Text style={styles.finalText}>
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

                            <Text style={styles.finalClosing}>
                                With a budget, you're not restricting your life, you're funding it. You're deciding where your hard-earned money goes, instead of wondering where it disappeared to.
                                {"\n\n"}
                                This is the foundation of financial freedom.
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
    const currentMethod = budgetingMethods[currentMethodIndex];

    if (!showHowToStart) {
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
                                {currentMethodIndex + 1} of {budgetingMethods.length}
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
                                <Text style={styles.sectionTitle}>The Breakdown:</Text>
                                <Text style={styles.sectionContent}>{currentMethod.breakdown}</Text>
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
                                    <Text style={styles.continueButtonText}>How to start</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    } else {
        // Show how to start
        return (
            <View style={styles.container}>
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backIconWrapper} onPress={goBack}>
                            <ChevronLeft size={24} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>
                                {currentMethodIndex + 1} of {budgetingMethods.length}
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

                            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                                <LinearGradient
                                    colors={['#5A7D7B', '#647C90']}
                                    style={styles.continueButtonContent}
                                >
                                    <Text style={styles.continueButtonText}>
                                        {currentMethodIndex < budgetingMethods.length - 1 ? 'Next Method' : 'See All Methods'}
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
    backIconWrapper: {
        width: 40,
        alignItems: 'center'
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center'
    },
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
        marginTop: 120,
    },
    introIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(146,132,144,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
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

    startButton: {
        borderRadius: 12,
        overflow: 'hidden'
    },
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

    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
    },
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

    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(146,132,144,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
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
        marginBottom: 20,
    },
    finalClosing: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden'
    },
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