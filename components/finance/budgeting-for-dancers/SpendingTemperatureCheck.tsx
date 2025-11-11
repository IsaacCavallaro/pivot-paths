import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, DollarSign, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        type: 'Cool' | 'Warm' | 'Hot';
    }[];
}

interface SpendingTemperatureResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const { width, height } = Dimensions.get('window');

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "You get $50 extra this week. Do you:",
        options: [
            {
                id: 'a',
                text: 'Add it straight to savings',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy dance gear you\'ve been eyeing',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Treat yourself to dinner',
                type: 'Warm'
            }
        ]
    },
    {
        id: 2,
        question: "A friend invites you to brunch, but money's tight. Do you:",
        options: [
            {
                id: 'a',
                text: 'Suggest a lower-cost hang like a coffee walk',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Say yes and put it on your credit card',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Go but order the cheapest thing',
                type: 'Warm'
            }
        ]
    },
    {
        id: 3,
        question: "You're offered a gig that pays less than you hoped. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline (it undervalues your time)',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Accept because it\'s still money',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Negotiate (but feel a little unsure)',
                type: 'Warm'
            }
        ]
    },
    {
        id: 4,
        question: "Your shoes are worn but not destroyed. Do you:",
        options: [
            {
                id: 'a',
                text: 'Keep wearing them until they really need replacing',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Upgrade to a nicer brand',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Ask friends if anyone\'s selling theirs secondhand',
                type: 'Warm'
            }
        ]
    },
    {
        id: 5,
        question: "You want a new outfit for a night out. Do you:",
        options: [
            {
                id: 'a',
                text: 'Borrow or restyle what you own',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy it full price (you deserve it)',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Hit the sales rack',
                type: 'Warm'
            }
        ]
    },
    {
        id: 6,
        question: "You get a big paycheck. Do you:",
        options: [
            {
                id: 'a',
                text: 'Put some toward savings right away',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Celebrate with a splurge',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save half and use the other half on something fun',
                type: 'Warm'
            }
        ]
    },
    {
        id: 7,
        question: "Rehearsal runs late. Do you:",
        options: [
            {
                id: 'a',
                text: 'Eat leftovers at home',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Treat yourself to delivery',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Grab cheap takeout',
                type: 'Warm'
            }
        ]
    },
    {
        id: 8,
        question: "You dream of a trip abroad. Do you:",
        options: [
            {
                id: 'a',
                text: 'Plan a backpacking trip that\'s super economical',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Put it on credit so you can go sooner',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save up and plan ahead',
                type: 'Warm'
            }
        ]
    },
    {
        id: 9,
        question: "You're invited to a wedding out of town. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline, you can\'t swing it right now',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Go but stress about the cost',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Use the sinking fund you prepared for travel',
                type: 'Warm'
            }
        ]
    }
];

const spendingTemperatureResults: { [key: string]: SpendingTemperatureResult } = {
    'Cool': {
        type: 'Cool',
        title: 'Cool Spender',
        description: 'You\'re cautious and thoughtful with money, sometimes holding back too much. Remember: spending on things that bring joy or growth is part of a healthy budget.',
        subtitle: 'You prioritize saving but might benefit from some mindful spending.',
        color: '#6B9BD1'
    },
    'Warm': {
        type: 'Warm',
        title: 'Warm Spender',
        description: 'You make intentional choices... sometimes saving, sometimes spending. With a little structure, you\'ll feel even more confident.',
        subtitle: 'You balance saving and spending with thoughtful choices.',
        color: '#928490'
    },
    'Hot': {
        type: 'Hot',
        title: 'Hot Spender',
        description: 'You lean toward spending in the moment. That passion is great, but with more planning you can enjoy the fun *and* still hit your goals.',
        subtitle: 'You enjoy spending but could benefit from more planning.',
        color: '#928490'
    }
};

interface SpendingTemperatureCheckProps {
    onComplete: (result: SpendingTemperatureResult) => void;
    onBack?: () => void;
}

export default function SpendingTemperatureCheck({ onComplete, onBack }: SpendingTemperatureCheckProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = questions, 10 = result, 11 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<SpendingTemperatureResult | null>(null);

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

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: { [key: number]: string }) => {
        const typeCounts = { 'Cool': 0, 'Warm': 0, 'Hot': 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'Cool' | 'Warm' | 'Hot']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'Cool' | 'Warm' | 'Hot'] > typeCounts[b[0] as 'Cool' | 'Warm' | 'Hot'] ? a : b
        )[0];

        const finalResult = spendingTemperatureResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(10);
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(11);
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
                            <Text style={styles.titleText}>Temperature Check</Text>
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

                            <Text style={styles.introTitle}>Spending Temperature Check</Text>

                            <Text style={styles.introDescription}>
                                How do you feel about spending money? Let's check your <Text style={styles.emphasisText}>spending temperature</Text> and see if you tend to run hot (spend easily), cold (hold back), or warm (somewhere in between).
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Get started</Text>
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
                            <Text style={styles.titleText}>Your Temperature</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <DollarSign size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <View style={styles.finalHeader}>
                                <DollarSign size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Check Your Spending Habits</Text>
                                <DollarSign size={24} color="#928490" />
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    Your spending temperature is just a snapshot of how you relate to money right now. There's no "good" or "bad" zone... just information you can use to make clearer choices.
                                </Text>
                            </View>

                            <Text style={styles.finalText}>
                                Think about where you landed: are you spending in a way that supports your current *and* future self?
                            </Text>

                            <Text style={styles.finalText}>
                                Small shifts in awareness can make a big difference. Take note of one choice you want to make differently this week.
                            </Text>

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow.
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
                            <Text style={styles.titleText}>Your Result</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.resultCard}>
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: result.color }]}>
                                    <DollarSign size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.resultTitle}>{result.title}</Text>

                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText}>{result.description}</Text>
                            </View>

                            <View style={styles.resultSubtitleContainer}>
                                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
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
    const question = quizQuestions[currentScreen - 1];
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
                                    onPress={() => handleAnswer(option.type)}
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
        marginBottom: 32,
        fontStyle: 'italic',
    },
    emphasisText: {
        fontStyle: 'italic',
        fontWeight: '600',
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
        marginBottom: 24,
    },
    resultText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
    },
    resultSubtitleContainer: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        width: '100%',
    },
    resultSubtitle: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 22,
        fontStyle: 'italic',
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
        marginBottom: 20,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
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
});