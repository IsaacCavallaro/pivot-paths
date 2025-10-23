import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, DollarSign, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        emoji?: string;
        type: 'A' | 'B' | 'C';
    }[];
}

interface FinancialResult {
    type: string;
    title: string;
    description: string;
    color: string;
}

const { width, height } = Dimensions.get('window');

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you think about money, what's your first reaction?",
        options: [
            {
                id: 'a',
                text: 'Stress and avoidance',
                emoji: '😬',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Neutral, I don\'t think about it much',
                emoji: '🤷‍♀️',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Motivation and possibility',
                emoji: '💪',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "How often do you check your bank account?",
        options: [
            {
                id: 'a',
                text: 'Rarely, I\'d rather not look',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A few times a month',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Weekly or daily',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "Do you know how much you spend in an average week?",
        options: [
            {
                id: 'a',
                text: 'Not really, I just hope it balances',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Sort of, I have a ballpark idea',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I track it or budget regularly',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "Savings… where are you at?",
        options: [
            {
                id: 'a',
                text: '$0 or close to it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A little, but not consistent',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I save regularly and have a cushion',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When you get paid for gigs, what happens next?",
        options: [
            {
                id: 'a',
                text: 'Money disappears before I know it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I cover essentials first, then figure the rest out',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I intentionally allocate it (savings, bills, fun, etc.)',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Negotiating pay makes me feel…",
        options: [
            {
                id: 'a',
                text: 'Terrified, I\'d never ask',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Nervous, but I might try if I had a script',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Confident, I know my worth',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "If a $500 emergency bill came up, what would you do?",
        options: [
            {
                id: 'a',
                text: 'Panic, I\'d have no idea',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Put it on a credit card or ask for help',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Pay from savings or planned funds',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "How do you feel about dancers and money?",
        options: [
            {
                id: 'a',
                text: 'We\'re doomed to be underpaid',
                type: 'A'
            },
            {
                id: 'b',
                text: 'It\'s possible to earn more, but I don\'t see myself making a ton of money',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Dance skills are valuable and I can leverage them',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "Do you set financial goals?",
        options: [
            {
                id: 'a',
                text: 'Never, feels pointless',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Occasionally, but I don\'t stick with them',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I set and track them',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "When you picture your future, what role does money play?",
        options: [
            {
                id: 'a',
                text: 'I avoid thinking about it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I hope to have enough, but I\'m unsure how',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I see money as a tool for freedom and choices',
                type: 'C'
            }
        ]
    }
];

const financialResults: { [key: string]: FinancialResult } = {
    'A': {
        type: 'A',
        title: 'The Avoider',
        description: 'You\'ve been avoiding money because it feels overwhelming which is totally normal in dance culture. But avoidance costs headroom. Your next step isn\'t a complicated budget… it\'s simply looking into it. Build awareness with tiny, shame-free check-ins. Once you face your numbers, you\'ll start to feel lighter.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Juggler',
        description: 'You\'ve got some systems, but they\'re patchy. You pay bills and try to save, but it\'s inconsistent, so money still feels stressful. The good news? You\'re already halfway there. With a bit more structure, you\'ll free up huge mental space.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Builder',
        description: 'You\'ve already done some work with money. You track, plan, or save regularly — and now it\'s time to level up. For you, headroom comes from asking for more (negotiating, raising rates, growing income streams). You\'re ready to use money as a tool, not just survival fuel.',
        color: '#928490'
    }
};

interface YourStartingLineProps {
    onComplete: (result: FinancialResult) => void;
    onBack?: () => void;
}

export default function YourStartingLine({ onComplete, onBack }: YourStartingLineProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<FinancialResult | null>(null);

    const handleStartQuiz = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleAnswer = (optionType: string) => {
        const questionIndex = currentScreen - 1;
        const newAnswers = { ...answers, [questionIndex]: optionType };
        setAnswers(newAnswers);

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: { [key: number]: string }) => {
        const typeCounts = { A: 0, B: 0, C: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
        )[0];

        const finalResult = financialResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(11);
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(12);
    };

    const handleComplete = () => {
        if (result) {
            onComplete(result);
        }
    };

    const goBack = () => {
        if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1) {
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
                            <Text style={styles.titleText}>Your Starting Line</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <DollarSign size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Your Starting Line</Text>

                            <Text style={styles.introDescription}>
                                Before you can move forward with money, it helps to know where you're standing. Answer these 10 quick questions to uncover your money starting line. No shame, just awareness. Let's go.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start Quiz</Text>
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
    if (currentScreen === 12) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Starting Line</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <Image
                                        source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                        style={styles.heroImage}
                                    />
                                </View>
                            </View>

                            <View style={styles.finalHeader}>
                                <DollarSign size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Your Starting Line</Text>
                                <DollarSign size={24} color="#928490" />
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    Knowing where you're starting is half the battle, the other half is your mindset.
                                </Text>
                                <Text style={styles.finalText}>
                                    Now that you know where you are and hopefully, where you could be, you can start to take action (perhaps on one of our other Finance Paths!).
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                See you again tomorrow.
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
    if (currentScreen === 11 && result) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Starting Line</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.resultCard}>
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: '#928490' }]}>
                                    <DollarSign size={40} color="#E2DED0" />
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
                                <View style={[styles.continueButtonContent, { backgroundColor: '#928490' }]}>
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
    const question = quizQuestions[currentScreen - 1];
    const progress = (currentScreen / 10) * 100;

    return (
        <View style={styles.container}>
            {/* Sticky Header with Progress */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>Question {currentScreen} of 10</Text>
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
                                    onPress={() => handleAnswer(option.type)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.choiceButtonText}>
                                        {option.emoji ? `${option.emoji} ` : ''}{option.text}
                                    </Text>
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
        marginBottom: 32,
        fontStyle: 'italic',
    },
    startButton: {
        borderRadius: 30,
        overflow: 'hidden',
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
        marginBottom: 20,
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
    heroImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});