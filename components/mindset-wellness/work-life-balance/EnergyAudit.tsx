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

interface EnergyResult {
    type: string;
    title: string;
    description: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When do you feel most motivated?",
        options: [
            {
                id: 'a',
                text: 'First thing in the morning',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Midday after lunch',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Late afternoon/evening',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "When tackling a new task, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Diving in immediately',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Planning first',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking for guidance',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "After a long day of dance, I usually feel…",
        options: [
            {
                id: 'a',
                text: 'Energized and ready to do more',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Tired but okay',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Completely drained',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "I focus best when…",
        options: [
            {
                id: 'a',
                text: 'Listening and observing',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking and collaborating',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Moving and doing',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When learning something new, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Reading instructions or watching examples',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking it through with someone',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Jumping in and figuring it out as I go',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "I feel recharged after…",
        options: [
            {
                id: 'a',
                text: 'A quiet solo activity like journaling or a walk',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Socializing or connecting with friends',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Physical movement or dancing',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "During a busy week, I notice my energy dips…",
        options: [
            {
                id: 'a',
                text: 'Early in the day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Mid-afternoon',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Later in the evening',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "I handle stress best when…",
        options: [
            {
                id: 'a',
                text: 'I have a clear routine and plan',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I talk it through with someone I trust',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I move my body or do something physical',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "If I have free time, I naturally gravitate toward…",
        options: [
            {
                id: 'a',
                text: 'Calm, reflective activities',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Social or collaborative activities',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Active, hands-on activities',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "I feel most productive when…",
        options: [
            {
                id: 'a',
                text: 'Everything is quiet and planned (Early Bird)',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I can mix social, solo, and active tasks (Balanced)',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I can tackle tasks later in the day or evening (Night Owl)',
                type: 'C'
            }
        ]
    }
];

const energyResults: { [key: string]: EnergyResult } = {
    'A': {
        type: 'A',
        title: 'The Reflector',
        description: 'You thrive when you have quiet, focused time. You gain energy from planning, observing, and processing internally. To make the most of your energy, schedule tasks that allow deep focus, reflection, or learning independently.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Connector',
        description: 'You thrive when you\'re interacting with others. Energy comes from collaboration, conversation, and shared experiences. To maximize your productivity, plan tasks that involve teamwork, brainstorming, or mentoring — and balance with some solo downtime.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Doer',
        description: 'You thrive when you\'re active and hands-on. You get your energy from movement and taking immediate action. To make the most of your week, focus on tasks where you can dive in and learn by doing, and build in short breaks to recharge.',
        color: '#647C90'
    }
};

interface EnergyAuditProps {
    onComplete: (result: EnergyResult) => void;
    onBack?: () => void;
}

export default function EnergyAudit({ onComplete, onBack }: EnergyAuditProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<EnergyResult | null>(null);

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

        const finalResult = energyResults[dominantType];
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
                            <Text style={styles.titleText}>Energy Audit</Text>
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

                            <Text style={styles.introTitle}>Energy Audit</Text>

                            <Text style={styles.introDescription}>
                                Let's find out when your energy is at its peak and when it dips to help you plan your work, hobbies, and rest.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Get Started</Text>
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
                            <Text style={styles.titleText}>Understanding Your Energy</Text>
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

                            <Text style={styles.finalTitle}>Understanding Your Energy</Text>

                            <Text style={styles.finalDescription}>
                                Your energy is a valuable resource. Be sure to use it wisely.
                            </Text>

                            <Text style={styles.finalDescription}>
                                Understanding your energy and honoring your ebbs and flows can make the process of finding balance much more achievable. Quit working against your energy and learn to finally work with it.
                            </Text>

                            <Text style={styles.finalDescription}>
                                See you tomorrow for more.
                            </Text>

                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={handleComplete}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.completeButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.completeButtonText}>Mark As Complete</Text>
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
    if (currentScreen === 11 && result) {
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
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
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
        marginBottom: 32,
        textAlign: 'center',
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