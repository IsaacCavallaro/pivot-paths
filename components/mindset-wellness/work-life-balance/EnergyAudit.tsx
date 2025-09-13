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
        color: '#5A7D7B'
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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Zap size={32} color="#5A7D7B" />
                    </View>

                    <Text style={styles.introTitle}>Energy Audit</Text>

                    <Text style={styles.introDescription}>
                        Let's find out when your energy is at its peak and when it dips to help you plan your work, hobbies, and rest.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#5A7D7B' }]}
                        >
                            <Text style={styles.startButtonText}>Get Started</Text>
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

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#5A7D7B' }]}
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
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
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
        backgroundColor: '#5A7D7B',
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
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
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