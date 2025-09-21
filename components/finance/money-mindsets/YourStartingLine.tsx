import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <DollarSign size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Your Starting Line</Text>

                    <Text style={styles.introDescription}>
                        Before you can move forward with money, it helps to know where you're standing. Answer these 10 quick questions to uncover your money starting line. No shame, just awareness. Let's go.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Start Quiz</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 12) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Image
                            source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                            style={styles.heroImage}
                        />
                    </View>

                    <Text style={styles.finalTitle}>Your Starting Line</Text>

                    <Text style={styles.finalDescription}>
                        Knowing where you're starting is half the battle, the other half is your mindset.
                    </Text>

                    <Text style={styles.finalDescription}>
                        Now that you know where you are and hopefully, where you could be, you can start to take action (perhaps on one of our other Finance Paths!).
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark as Complete</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 11 && result) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[result.color, `${result.color}CC`]}
                    style={styles.resultHeader}
                >
                    <Text style={styles.resultTitle}>{result.title}</Text>
                </LinearGradient>

                <ScrollView style={styles.resultContent} contentContainerStyle={styles.resultContentContainer}>
                    <Text style={styles.resultDescription}>{result.description}</Text>

                    <TouchableOpacity style={styles.continueButton} onPress={handleContinueToFinal}>
                        <LinearGradient
                            colors={[result.color, `${result.color}DD`]}
                            style={styles.continueButtonGradient}
                        >
                            <Text style={styles.continueButtonText}>Continue</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Question Screens
    const question = quizQuestions[currentScreen - 1];
    const progress = (currentScreen / 10) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {currentScreen} of 10
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question}</Text>

                <View style={styles.optionsContainer}>
                    {question.options.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={styles.optionButton}
                            onPress={() => handleAnswer(option.type)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionText}>
                                {option.emoji ? `${option.emoji} ` : ''}{option.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ChevronLeft size={24} color="#647C90" />
                <Text style={styles.backButtonText}>
                    {currentScreen === 1 ? 'Back to Intro' : 'Previous'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2DED0',
    },
    topBackButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 1,
        padding: 8,
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
    header: {
        padding: 20,
        paddingTop: 60,
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#647C90',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(100, 124, 144, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#928490',
        borderRadius: 3,
    },
    questionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    questionText: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        lineHeight: 28,
        marginBottom: 30,
        textAlign: 'center',
    },
    optionsContainer: {
        gap: 15,
    },
    optionButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
        textAlign: 'center',
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
    resultHeader: {
        paddingTop: 60,
        padding: 30,
        alignItems: 'center',
    },
    resultTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#E2DED0',
        textAlign: 'center',
    },
    resultContent: {
        flex: 1,
        backgroundColor: '#E2DED0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 10,
    },
    resultContentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    resultDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 30,
        textAlign: 'center',
    },
    continueButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 30,
    },
    continueButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#E2DED0',
        marginRight: 8,
    },
    finalContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    finalIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
    },
    finalDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 20,
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
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderColor: 'black',
        borderWidth: 1,
    },
});