import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
        color: '#F4A460'
    },
    'Hot': {
        type: 'Hot',
        title: 'Hot Spender',
        description: 'You lean toward spending in the moment. That passion is great, but with more planning you can enjoy the fun *and* still hit your goals.',
        subtitle: 'You enjoy spending but could benefit from more planning.',
        color: '#E74C3C'
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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <DollarSign size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Spending Temperature Check</Text>

                    <Text style={styles.introDescription}>
                        How do you feel about spending money? Let's check your <Text style={styles.emphasisText}>spending temperature</Text> and see if you tend to run hot (spend easily), cold (hold back), or warm (somewhere in between).
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Get started</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 11) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <DollarSign size={40} color="#928490" />
                    </View>

                    <Text style={styles.finalTitle}>Check Your Spending Habits</Text>

                    <Text style={styles.finalDescription}>
                        Your spending temperature is just a snapshot of how you relate to money right now. There's no "good" or "bad" zone... just information you can use to make clearer choices.
                    </Text>

                    <Text style={styles.finalClosing}>
                        Think about where you landed: are you spending in a way that supports your current *and* future self?
                    </Text>

                    <Text style={styles.finalClosing}>
                        Small shifts in awareness can make a big difference. Take note of one choice you want to make differently this week.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow.
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
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 10 && result) {
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

                    <View style={styles.resultSubtitleContainer}>
                        <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                    </View>

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
    const progress = (currentScreen / 9) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {currentScreen} of 9
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
                            <Text style={styles.optionText}>{option.text}</Text>
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
    emphasisText: {
        fontStyle: 'italic',
        fontWeight: '600',
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
        marginBottom: 20,
        textAlign: 'center',
    },
    resultSubtitleContainer: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
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
    finalClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
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
});