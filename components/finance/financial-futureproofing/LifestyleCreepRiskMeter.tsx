import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

interface LifestyleQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        score: number; // 0 = low risk, 1 = medium risk, 2 = high risk
    }[];
}

interface LifestyleResult {
    riskLevel: 'low' | 'moderate' | 'high';
    title: string;
    description: string;
    color: string;
}

const { width, height } = Dimensions.get('window');

const lifestyleQuestions: LifestyleQuestion[] = [
    {
        id: 1,
        question: "When you get a raise, what's the first thing you think of?",
        options: [
            {
                id: 'a',
                text: "Finally, I can save more.",
                score: 0
            },
            {
                id: 'b',
                text: "I'll treat myself just this once.",
                score: 1
            },
            {
                id: 'c',
                text: "Time to upgrade my wardrobe/apartment/phone.",
                score: 2
            }
        ]
    },
    {
        id: 2,
        question: "You've been eyeing a new piece of furniture or tech. What's your process?",
        options: [
            {
                id: 'a',
                text: "Wait, research, and only buy if it fits my budget.",
                score: 0
            },
            {
                id: 'b',
                text: "I'll buy it soon, but only if there's a sale.",
                score: 1
            },
            {
                id: 'c',
                text: "I usually just go for it. I deserve it.",
                score: 2
            }
        ]
    },
    {
        id: 3,
        question: "Do you know how much your monthly expenses actually cost?",
        options: [
            {
                id: 'a',
                text: "Yes, down to the dollar.",
                score: 0
            },
            {
                id: 'b',
                text: "I have a ballpark idea.",
                score: 1
            },
            {
                id: 'c',
                text: "Not really. I just hope my card doesn't decline.",
                score: 2
            }
        ]
    },
    {
        id: 4,
        question: "If your side gigs suddenly stopped, could you cover your living expenses with your current income?",
        options: [
            {
                id: 'a',
                text: "Yes, easily.",
                score: 0
            },
            {
                id: 'b',
                text: "Probably, but it would be tight.",
                score: 1
            },
            {
                id: 'c',
                text: "No, I rely on multiple streams to get by.",
                score: 2
            }
        ]
    },
    {
        id: 5,
        question: "When your friends suggest an overseas trip, what do you do?",
        options: [
            {
                id: 'a',
                text: "I check my budget first.",
                score: 0
            },
            {
                id: 'b',
                text: "I say yes most of the time, but I try to cut back elsewhere.",
                score: 1
            },
            {
                id: 'c',
                text: "I usually say yes without thinking.",
                score: 2
            }
        ]
    },
    {
        id: 6,
        question: "What happens to your savings rate when your income goes up?",
        options: [
            {
                id: 'a',
                text: "I increase it.",
                score: 0
            },
            {
                id: 'b',
                text: "I keep it the same.",
                score: 1
            },
            {
                id: 'c',
                text: "Honestly… it usually goes down.",
                score: 2
            }
        ]
    },
    {
        id: 7,
        question: "What's your relationship with credit card balances?",
        options: [
            {
                id: 'a',
                text: "I pay them off in full every month.",
                score: 0
            },
            {
                id: 'b',
                text: "I carry a small balance sometimes.",
                score: 1
            },
            {
                id: 'c',
                text: "I carry balances often, but I plan to pay them off later.",
                score: 2
            }
        ]
    },
    {
        id: 8,
        question: "When you compare yourself to friends or colleagues, how do you feel?",
        options: [
            {
                id: 'a',
                text: "I'm focused on my own goals.",
                score: 0
            },
            {
                id: 'b',
                text: "I sometimes feel the pressure to keep up.",
                score: 1
            },
            {
                id: 'c',
                text: "I often upgrade my lifestyle to match theirs.",
                score: 2
            }
        ]
    },
    {
        id: 9,
        question: "If you doubled your income tomorrow, what would you do?",
        options: [
            {
                id: 'a',
                text: "Automate savings and stick to my current lifestyle.",
                score: 0
            },
            {
                id: 'b',
                text: "Save some, but definitely spend some too.",
                score: 1
            },
            {
                id: 'c',
                text: "Upgrade nearly everything — I've been waiting for this moment!",
                score: 2
            }
        ]
    }
];

const lifestyleResults: { [key: string]: LifestyleResult } = {
    'low': {
        riskLevel: 'low',
        title: 'Low Risk of Lifestyle Creep',
        description: "You're mindful of your expenses and stay grounded, even when your income grows. In fact, you're probably more at risk of underspending and holding too tightly to the purse strings. Spending is a skill too and it might help to give yourself some guilt-free options.",
        color: '#5A7D7B' // Green for low risk
    },
    'moderate': {
        riskLevel: 'moderate',
        title: 'Moderate Risk of Lifestyle Creep',
        description: "You're doing okay, but there are a few 'treat yourself' habits that can creep up on you. Focus on setting rules for when you'll increase expenses and when you'll bank the difference instead.",
        color: '#928490' // Purple for moderate risk
    },
    'high': {
        riskLevel: 'high',
        title: 'High Risk of Lifestyle Creep',
        description: "Your lifestyle is rising right alongside (or faster than) your income. That can feel fun in the moment, but it leaves you vulnerable long-term. Try setting a 'cap' on upgrades and funneling extra money toward savings or investments first. You can still spend, but make sure your bases are covered.",
        color: '#C76B6B' // Red for high risk
    }
};

interface LifestyleCreepRiskMeterProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LifestyleCreepRiskMeter({ onComplete, onBack }: LifestyleCreepRiskMeterProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [result, setResult] = useState<LifestyleResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const handleScreenChange = async (newScreen: number) => {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        setCurrentScreen(newScreen);
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleWelcomeContinue = () => {
        handleScreenChange(1);
    };

    const handleStartQuiz = () => {
        handleScreenChange(2);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleAnswer = (optionId: string, score: number) => {
        setSelectedOption(optionId);

        const questionIndex = currentScreen - 2;
        const newAnswers = { ...answers, [questionIndex]: score };
        setAnswers(newAnswers);
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult(answers);
        }

        setIsTransitioning(false);
    };

    const calculateResult = (finalAnswers: { [key: number]: number }) => {
        const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / Object.keys(finalAnswers).length;

        let riskLevel: 'low' | 'moderate' | 'high';

        if (averageScore < 0.8) {
            riskLevel = 'low';
        } else if (averageScore < 1.5) {
            riskLevel = 'moderate';
        } else {
            riskLevel = 'high';
        }

        const finalResult = lifestyleResults[riskLevel];
        setResult(finalResult);
        setCurrentScreen(11);
        scrollToTop();
    };

    const handleContinueToFinal = () => {
        handleScreenChange(12);
    };

    const handleComplete = async () => {
        try {
            await AsyncStorage.setItem('day6LifestyleCreepResult', JSON.stringify(result));
            onComplete();
        } catch (error) {
            console.error('Error saving quiz result to AsyncStorage:', error);
            onComplete();
        }
    };

    const goBack = () => {
        if (currentScreen === 0) {
            if (onBack) onBack();
        } else if (currentScreen === 1) {
            handleScreenChange(0);
        } else if (currentScreen > 1 && currentScreen <= 10) {
            setCurrentScreen(currentScreen - 1);
            setSelectedOption(null);
            scrollToTop();
        } else if (currentScreen === 11) {
            handleScreenChange(10);
        } else if (currentScreen === 12) {
            handleScreenChange(11);
        }
    };

    // Welcome Screen with Journal Prompt
    if (currentScreen === 0) {
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>
                                Welcome to Your Financial Assessment
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Taking this honest look at your spending habits is a powerful step toward financial freedom. Understanding your relationship with money helps you build a future that supports your dreams, not just your lifestyle.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Lifestyle Creep Risk Meter"
                                journalInstruction="Before we begin, let's check in with your current feelings about money and spending. How are you feeling about your financial habits right now?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to these reflections later. Ready to discover your lifestyle creep risk level?
                                </Text>
                            </View>

                            <PrimaryButton
                                title="I'm Ready to Begin"
                                onPress={handleWelcomeContinue}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Intro Screen
    if (currentScreen === 1) {
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>
                                Lifestyle Creep Risk Meter
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Lifestyle creep happens when your income rises, but your spending rises right alongside it (or faster). This quiz will help you see how at risk you are, and what you can do to keep more of your hard-earned money.
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Answer honestly! This is just for your awareness!
                            </Text>

                            <PrimaryButton
                                title="Start Assessment"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Financial Freedom Screen
    if (currentScreen === 12 && result) {
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
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.financialFreedomTitle}>
                                Here's What You're Working Toward:
                            </Text>

                            <Text style={styles.financialFreedomTitleBold}>
                                Financial Freedom
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Financial freedom isn't about having unlimited money—it's about having control over your money so it supports the life you want to live.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                It means your spending aligns with your values, you have security for the future, and you can make choices based on what matters to you, not just what you can afford.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                By understanding your lifestyle creep risk, you're already taking the first step toward building this kind of freedom.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="6"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Lifestyle Creep Risk Meter"
                                journalInstruction="Based on your results and what you've learned, what's one small change you can make to improve your financial habits?"
                                moodLabel="How are you feeling about your financial future?"
                                saveButtonText="Add to Journal"
                            />

                            <PrimaryButton
                                title="Continue"
                                onPress={handleComplete}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 11 && result) {
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
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: result.color }]}>
                                    <AlertTriangle size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>{result.title}</Text>
                            <Text style={styles.resultDescription}>{result.description}</Text>

                            <View style={styles.resultHighlight}>
                                <Text style={styles.resultHighlightText}>
                                    No matter your result, awareness is the first step toward financial freedom.
                                </Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToFinal}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Question Screens with smooth transitions
    const question = lifestyleQuestions[currentScreen - 2];
    const progress = ((currentScreen - 1) / 9) * 100;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreen - 1} of 9`}
                progress={progress / 100}
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
                    <Card style={styles.baseCard}>
                        <Text style={styles.questionText}>
                            {question.question}
                        </Text>

                        <View style={styles.optionsContainer}>
                            {question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedOption === option.id && styles.optionButtonSelected
                                    ]}
                                    onPress={() => handleAnswer(option.id, option.score)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        selectedOption === option.id && styles.optionTextSelected
                                    ]}>
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <PrimaryButton
                            title={currentScreen < 10 ? 'Continue' : 'See Results'}
                            onPress={handleContinue}
                            disabled={selectedOption === null || isTransitioning}
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    welcomeHighlight: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    welcomeHighlightText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // Icon Styles
    introIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    resultIconContainer: {
        marginBottom: 24,
    },
    resultIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    // Question Styles
    questionText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 22,
        color: '#647C90',
        lineHeight: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontWeight: '700',
    },
    optionsContainer: {
        gap: 16,
        marginBottom: 32,
    },
    optionButton: {
        borderRadius: 16,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
        padding: 20,
    },
    optionButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
    },
    optionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    // Result Styles
    resultDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    resultHighlight: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    resultHighlightText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // Financial Freedom Screen Styles
    financialFreedomTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    financialFreedomTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    // Card Styles
    baseCard: {
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
        marginTop: 50,
    },
});