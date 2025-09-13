import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, Target, ArrowLeft } from 'lucide-react-native';

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
                {onBack && (
                    <TouchableOpacity style={styles.topBackButton} onPress={handleBack}>
                        <ArrowLeft size={28} color="#647C90" />
                    </TouchableOpacity>
                )}
                <ScrollView style={styles.content} contentContainerStyle={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Target size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>Where's your confidence gap?</Text>

                    <Text style={styles.introDescription}>
                        Making a big career change is as much about mindset as it is about skills. This quick check will help you see where your confidence tends to dip, so you know what to focus on as you prep your pivot.
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
                        <Target size={40} color="#928490" />
                    </View>

                    <Text style={styles.finalTitle}>Nobody's Perfect</Text>

                    <Text style={styles.finalDescription}>
                        Everyone's confidence looks different, and it grows with practice. Whether your gap is mindset, skills, or action, you're already one step closer just by naming it.
                    </Text>

                    <Text style={styles.finalClosing}>
                        Keep this in mind as you prep for your pivot, and remember: confidence builds through small wins, not perfection.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow for your next step!
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