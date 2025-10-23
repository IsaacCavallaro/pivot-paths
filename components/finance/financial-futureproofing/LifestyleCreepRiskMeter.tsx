import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, AlertTriangle, ArrowLeft, ChevronLeft } from 'lucide-react-native';

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
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = questions, 10 = result, 11 = final
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [result, setResult] = useState<LifestyleResult | null>(null);
    const [randomizedQuestions, setRandomizedQuestions] = useState<LifestyleQuestion[]>([]);

    useEffect(() => {
        // Use questions in order (no randomization for this assessment)
        setRandomizedQuestions([...lifestyleQuestions]);
    }, []);

    const handleStartQuiz = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleAnswer = (score: number) => {
        const questionIndex = currentScreen - 1;
        const newAnswers = { ...answers, [questionIndex]: score };
        setAnswers(newAnswers);

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
        } else {
            calculateResult(newAnswers);
        }
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
        setCurrentScreen(10);
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(11);
    };

    const handleComplete = () => {
        onComplete();
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 9) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    // Intro Screen
    if (currentScreen === 0) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Risk Meter</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Lifestyle Creep Risk Meter</Text>

                            <Text style={styles.introDescription}>
                                Lifestyle creep happens when your income rises, but your spending rises right alongside it (or faster). This quiz will help you see how at risk you are, and what you can do to keep more of your hard-earned money.
                            </Text>

                            <Text style={styles.introDescription}>
                                Answer honestly! This is just for your awareness!
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start Assessment</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 11) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Lifestyle Creep</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <AlertTriangle size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <View style={styles.finalHeader}>
                                <AlertTriangle size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Controlling Lifestyle Creep</Text>
                                <AlertTriangle size={24} color="#928490" />
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    No matter your result, awareness is the first step. Lifestyle creep is sneaky because it doesn't feel like overspending… it feels like rewarding yourself. But when you create boundaries around upgrades and commit to paying yourself first, you build a financial future that actually supports your freedom, not just your lifestyle.
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for the next step.
                            </Text>

                            <View style={styles.finalButtonContainer}>
                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={handleComplete}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
                                        <Text style={styles.continueButtonText}>Mark As Complete</Text>
                                        <ChevronRight size={16} color="#E2DED0" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 10 && result) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: result.color }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Results</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.resultCard}>
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: result.color }]}>
                                    <AlertTriangle size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.resultTitle}>{result.title}</Text>

                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText}>{result.description}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinueToFinal}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.continueButtonContent, { backgroundColor: result.color }]}>
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Question Screens
    if (randomizedQuestions.length === 0) {
        return <View style={styles.container} />;
    }

    const question = randomizedQuestions[currentScreen - 1];
    const progress = (currentScreen / 9) * 100;

    return (
        <View style={styles.container}>
            {/* Sticky Header with Progress */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>Question {currentScreen} of 9</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.centeredContent}>
                    <View style={styles.choiceCard}>
                        <Text style={styles.questionText}>{question.question}</Text>

                        <View style={styles.choiceButtons}>
                            {question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.choiceButton}
                                    onPress={() => handleAnswer(option.score)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonText}>{option.text}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
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
    scrollView: {
        flex: 1,
        marginTop: 100,
        zIndex: 1,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height - 200,
        paddingBottom: 30,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 28,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 25,
        color: '#E2DED0',
        textAlign: 'center',
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#E2DED0',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(226, 222, 208, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 12,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E2DED0',
        borderRadius: 3,
    },
    introCard: {
        width: width * 0.85,
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
    },
    introIconContainer: {
        marginBottom: 24,
    },
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
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#928490',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        fontStyle: 'italic',
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 10,
    },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    startButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    choiceCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginVertical: 20,
    },
    questionText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        lineHeight: 28,
        marginBottom: 30,
        textAlign: 'center',
    },
    choiceButtons: {
        gap: 15,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
        textAlign: 'center',
    },
    resultCard: {
        width: width * 0.85,
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
    resultTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    resultTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    resultText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
    },
    continueButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    continueButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
        minWidth: width * 0.5,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    finalCard: {
        width: width * 0.85,
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
    },
    finalIconContainer: {
        marginBottom: 30,
    },
    finalIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 12,
    },
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    finalTextContainer: {
        width: '100%',
        marginBottom: 40,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 28,
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 20,
        fontWeight: '600',
    },
    finalButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
});