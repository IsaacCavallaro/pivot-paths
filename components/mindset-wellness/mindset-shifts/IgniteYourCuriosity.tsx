import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Zap, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        type: 'A' | 'B' | 'C';
    }[];
}

interface CuriosityResult {
    type: string;
    title: string;
    description: string;
    challenge: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "If you had a free hour today, what could you do (instead of scrolling)?",
        options: [
            {
                id: 'a',
                text: 'Wander a nearby neighborhood you\'ve never been to',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Watch a documentary on a random topic',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Strike up a conversation with the barista',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "Pick a way to add novelty to your week:",
        options: [
            {
                id: 'a',
                text: 'Take a different route home',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Try a new recipe',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Go to a class for something you\'ve never done',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "You overhear someone talking about a field you know nothing about. You could…",
        options: [
            {
                id: 'a',
                text: 'Ask them a question',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Look it up later',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Let it inspire a new idea of your own',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "If you could shadow someone for a day, you'd choose:",
        options: [
            {
                id: 'a',
                text: 'An artist in a medium you\'ve never tried',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A scientist or researcher',
                type: 'B'
            },
            {
                id: 'c',
                text: 'A business owner or entrepreneur',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When faced with something unfamiliar, you could try to:",
        options: [
            {
                id: 'a',
                text: 'Dive in and try it hands-on',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Observe first, then engage',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Learn by asking lots of questions',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Pick an experiment to try this week:",
        options: [
            {
                id: 'a',
                text: 'Journal one "curiosity question" a day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Say yes to the next unusual opportunity that comes your way',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Visit a place you\'d never normally go',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "Imagine going back to being a kid for a day. You'd spend it…",
        options: [
            {
                id: 'a',
                text: 'Exploring outside',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Building or making something',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking endless "why" questions',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "You get an invitation to something out of your comfort zone. You could…",
        options: [
            {
                id: 'a',
                text: 'Jump in without overthinking',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Hesitate but eventually say yes',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Bring a friend along for support',
                type: 'C'
            }
        ]
    }
];

const curiosityResults: { [key: string]: CuriosityResult } = {
    'A': {
        type: 'A',
        title: 'The Explorer',
        description: 'You\'re curious through *experience*. You learn by stepping into new spaces and saying yes to adventures.',
        challenge: 'Keep adding little twists to your daily routine (new routes, new foods, new people).',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Learner',
        description: 'Your curiosity thrives on *knowledge*. You want to understand the "why" behind things.',
        challenge: 'Follow one random question down the rabbit hole each week and let learning be playful, not just practical.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Creator',
        description: 'You turn curiosity into *expression*. What you discover becomes fuel for making, shaping, and sharing.',
        challenge: 'Channel your curiosity into a small project. Even if it\'s messy, let it be fun.',
        color: '#928490'
    }
};

interface IgniteYourCuriosityProps {
    onComplete: (result: CuriosityResult) => void;
    onBack?: () => void;
}

export default function IgniteYourCuriosity({ onComplete, onBack }: IgniteYourCuriosityProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-8 = questions, 9 = result, 10 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<CuriosityResult | null>(null);

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

        if (currentScreen < 8) {
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

        const finalResult = curiosityResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(9);
    };

    const handleContinueToFinal = () => {
        setCurrentScreen(10);
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
                        <Zap size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Ignite Your Curiosity</Text>

                    <Text style={styles.introDescription}>
                        Curiosity isn't something you either have or don't.. it's like a muscle. This quiz will stretch your curiosity and help you practice seeing the world with fresh eyes.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's Play</Text>
                            <ChevronRight size={16} color="#E2DED0" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 10) {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.content} contentContainerStyle={styles.finalContainer}>
                    <View style={styles.finalIcon}>
                        <Image
                            source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                            style={styles.heroImage}
                        />
                    </View>

                    <Text style={styles.finalTitle}>Your Curiosity Spark</Text>

                    <Text style={styles.finalDescription}>
                        The way you answered shows how you can practice being curious, not as something abstract, but as actions you can take right now.
                    </Text>

                    <Text style={styles.finalDescription}>
                        Curiosity is like dance… the more you practice, the more natural it feels. Keep experimenting, asking, and trying, and you'll open doors you never even knew existed.
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
    if (currentScreen === 9 && result) {
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
                        <Text style={styles.resultSubtitle}>Your challenge:</Text>
                        <Text style={styles.resultChallenge}>{result.challenge}</Text>
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
    const progress = (currentScreen / 8) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {currentScreen} of 8
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
        marginBottom: 8,
    },
    resultChallenge: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
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
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
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