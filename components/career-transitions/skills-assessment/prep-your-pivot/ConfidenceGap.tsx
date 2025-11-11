import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Target, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        type: 'Mindset' | 'Skills' | 'Action-Ready';
    }[];
}

interface ConfidenceGapResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When someone asks about your career plans, how do you usually respond?",
        options: [
            {
                id: 'a',
                text: 'I feel tongue-tied and struggle to explain',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'I can talk about it, but I doubt my skills',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'I explain clearly and feel motivated',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 2,
        question: "When you see a job description that excites you, what's your first thought?",
        options: [
            {
                id: 'a',
                text: '"I\'m not qualified enough."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I need more training before I could apply."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"I\'m applying now!"',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 3,
        question: "If a recruiter asked why you'd be a good fit, how would you feel?",
        options: [
            {
                id: 'a',
                text: 'Unsure what to say about myself',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'A little prepared, but I\'d want more practice',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Confident—I know how to frame my story',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 4,
        question: "When you think about leaving dance, what feels hardest?",
        options: [
            {
                id: 'a',
                text: 'Believing I can succeed in a different world',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'Learning the practical skills for a new career',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Taking the leap and actually applying',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 5,
        question: "If you failed at something in your new path, what's your reaction?",
        options: [
            {
                id: 'a',
                text: '"I knew I wasn\'t cut out for this."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I need to study or train more."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"Failure is just part of the process."',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 6,
        question: "How do you talk about your dance career to non-dancers?",
        options: [
            {
                id: 'a',
                text: 'I freeze and worry they won\'t understand',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'I try, but I\'m not sure I explain it well',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'I confidently connect my dance skills to their world',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 7,
        question: "When you think about networking, what's your gut reaction?",
        options: [
            {
                id: 'a',
                text: '"I\'m too nervous to reach out."',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: '"I\'d do better if I had scripts or practice."',
                type: 'Skills'
            },
            {
                id: 'c',
                text: '"I\'m excited to meet people and share my story."',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 8,
        question: "Imagine walking into your first interview outside of dance. How do you picture yourself?",
        options: [
            {
                id: 'a',
                text: 'Anxious and doubtful',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'A bit shaky but somewhat prepared',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Confident, prepared, and ready to connect',
                type: 'Action-Ready'
            }
        ]
    },
    {
        id: 9,
        question: "What would make you feel most prepared for your career change?",
        options: [
            {
                id: 'a',
                text: 'Learning to trust myself more',
                type: 'Mindset'
            },
            {
                id: 'b',
                text: 'Gaining new skills and practice',
                type: 'Skills'
            },
            {
                id: 'c',
                text: 'Just getting out there and taking action',
                type: 'Action-Ready'
            }
        ]
    }
];

const confidenceGapResults: { [key: string]: ConfidenceGapResult } = {
    'Mindset': {
        type: 'Mindset',
        title: 'Your Confidence Gap is Mindset',
        description: 'Your biggest hurdle isn\'t your skills—it\'s believing you belong in a new space. Build your confidence by reframing your dance background as an asset and practicing self-trust. You\'re more capable than you think.',
        subtitle: 'Focus on believing in your inherent worth and capabilities.',
        color: '#928490'
    },
    'Skills': {
        type: 'Skills',
        title: 'Your Confidence Gap is Skills',
        description: 'You believe in yourself, but you want more tools in your belt. Upskilling, training, and practicing interviews will boost your confidence. Focus on building what you need so you can walk into opportunities prepared.',
        subtitle: 'Your confidence grows through preparation and practice.',
        color: '#928490'
    },
    'Action-Ready': {
        type: 'Action-Ready',
        title: 'Your Confidence Gap is Action',
        description: 'You\'ve got the right mindset and enough skills, but hesitation can hold you back. Confidence comes from doing. Start applying, networking, and saying "yes"—you\'ll build proof of your capability as you go.',
        subtitle: 'Your path forward is through taking the first step.',
        color: '#928490'
    }
};

interface ConfidenceGapProps {
    onComplete: (result: ConfidenceGapResult) => void;
    onBack?: () => void;
}

export default function ConfidenceGap({ onComplete, onBack }: ConfidenceGapProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = questions, 10 = result, 11 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<ConfidenceGapResult | null>(null);

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
        const typeCounts = { 'Mindset': 0, 'Skills': 0, 'Action-Ready': 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'Mindset' | 'Skills' | 'Action-Ready']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'Mindset' | 'Skills' | 'Action-Ready'] > typeCounts[b[0] as 'Mindset' | 'Skills' | 'Action-Ready'] ? a : b
        )[0];

        const finalResult = confidenceGapResults[dominantType];
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
                            <Text style={styles.titleText}>Confidence Gap</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Where's your confidence gap?</Text>

                            <Text style={styles.introDescription}>
                                Making a big career change is as much about mindset as it is about skills. This quick check will help you see where your confidence tends to dip, so you know what to focus on as you prep your pivot.
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
                            <Text style={styles.titleText}>Your Confidence Gap</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <View style={styles.finalHeader}>
                                <Target size={24} color="#928490" />
                                <Text style={styles.finalHeading}>Nobody's Perfect</Text>
                                <Target size={24} color="#928490" />
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    Everyone's confidence looks different, and it grows with practice. Whether your gap is mindset, skills, or action, you're already one step closer just by naming it.
                                </Text>
                            </View>

                            <Text style={styles.alternativeClosing}>
                                Keep this in mind as you prep for your pivot, and remember: confidence builds through small wins, not perfection.
                            </Text>

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for your next step!
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
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <View style={styles.backButton} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Your Confidence Gap</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.resultCard}>
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: '#928490' }]}>
                                    <Target size={40} color="#E2DED0" />
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
        marginBottom: 24,
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
        marginBottom: 32,
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
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