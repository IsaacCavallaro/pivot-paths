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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Ignite Your Curiosity</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Zap size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Ignite Your Curiosity</Text>

                            <Text style={styles.introDescription}>
                                Curiosity isn't something you either have or don't.. it's like a muscle. This quiz will stretch your curiosity and help you practice seeing the world with fresh eyes.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Let's Play</Text>
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
    if (currentScreen === 10) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Curiosity Spark</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
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

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={handleComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                                    <ChevronRight size={16} color="#E2DED0" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 9 && result) {
        return (
            <View style={styles.container}>
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: result.color }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>{result.title}</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.resultCard}>
                            <Text style={styles.resultDescription}>{result.description}</Text>

                            <View style={styles.resultSubtitleContainer}>
                                <Text style={styles.resultSubtitle}>Your challenge:</Text>
                                <Text style={styles.resultChallenge}>{result.challenge}</Text>
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
    const progress = (currentScreen / 8) * 100;

    return (
        <View style={styles.container}>
            {/* Sticky Header with Progress */}
            <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <ArrowLeft size={28} color="#E2DED0" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.progressText}>Question {currentScreen} of 8</Text>
                    </View>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.questionCard}>
                        <Text style={styles.questionText}>{question.question}</Text>

                        <View style={styles.optionsContainer}>
                            {question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={styles.optionButton}
                                    onPress={() => handleAnswer(option.type)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.optionContent}>
                                        <Text style={styles.optionText}>{option.text}</Text>
                                    </View>
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
    },
    content: {
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
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
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
        fontSize: 28,
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
    questionCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
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
    },
    optionButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionContent: {
        padding: 20,
    },
    optionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    resultCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    resultDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    resultSubtitleContainer: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    resultSubtitle: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '500',
    },
    resultChallenge: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
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
    },
    continueButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    finalCard: {
        marginHorizontal: 24,
        marginTop: 50,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    finalIconContainer: {
        marginBottom: 32,
    },
    heroImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#647C90',
        borderWidth: 2,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
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
        borderRadius: 30,
        overflow: 'hidden',
        marginTop: 20,
    },
    completeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E2DED0',
    },
    completeButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
});