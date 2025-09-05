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
        type: 'A' | 'B' | 'C' | 'D';
    }[];
}

interface EnergizerResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "At the end of a day, you feel most satisfied if you've…",
        options: [
            {
                id: 'a',
                text: 'Helped people directly',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Solved a tough problem',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Created something new',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Practiced and improved a skill',
                type: 'D'
            }
        ]
    },
    {
        id: 2,
        question: "Which type of environment excites you most?",
        options: [
            {
                id: 'a',
                text: 'A buzzing, people-filled space',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A quiet zone where you can focus',
                type: 'B'
            },
            {
                id: 'c',
                text: 'A flexible setting with freedom',
                type: 'C'
            },
            {
                id: 'd',
                text: 'A structured space with clear rules',
                type: 'D'
            }
        ]
    },
    {
        id: 3,
        question: "When you lose track of time, what are you usually doing?",
        options: [
            {
                id: 'a',
                text: 'Talking and connecting',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Analyzing or organizing',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Designing or brainstorming',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Training or mastering a technique',
                type: 'D'
            }
        ]
    },
    {
        id: 4,
        question: "Which kind of project feels fun, not draining?",
        options: [
            {
                id: 'a',
                text: 'Organizing a group event',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Researching or troubleshooting',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Making art, writing, or content',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Practicing until you nail it',
                type: 'D'
            }
        ]
    },
    {
        id: 5,
        question: "When you face a challenge, your first instinct is to…",
        options: [
            {
                id: 'a',
                text: 'Ask for input or advice',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Break it into smaller parts',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Get creative with a new approach',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Keep at it until you master it',
                type: 'D'
            }
        ]
    },
    {
        id: 6,
        question: "What type of feedback energizes you?",
        options: [
            {
                id: 'a',
                text: '"You really made me feel supported."',
                type: 'A'
            },
            {
                id: 'b',
                text: '"You solved that perfectly."',
                type: 'B'
            },
            {
                id: 'c',
                text: '"That was so creative!"',
                type: 'C'
            },
            {
                id: 'd',
                text: '"Your progress is amazing."',
                type: 'D'
            }
        ]
    },
    {
        id: 7,
        question: "Which role in a group excites you most?",
        options: [
            {
                id: 'a',
                text: 'The one connecting people',
                type: 'A'
            },
            {
                id: 'b',
                text: 'The one organizing details',
                type: 'B'
            },
            {
                id: 'c',
                text: 'The one brainstorming ideas',
                type: 'C'
            },
            {
                id: 'd',
                text: 'The one practicing skills until solid',
                type: 'D'
            }
        ]
    },
    {
        id: 8,
        question: "What excites you most about starting something new?",
        options: [
            {
                id: 'a',
                text: 'Meeting new people',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Learning how it all works',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Trying new creative ideas',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Building up skills over time',
                type: 'D'
            }
        ]
    },
    {
        id: 9,
        question: "Which \"win\" would leave you buzzing?",
        options: [
            {
                id: 'a',
                text: 'Seeing someone light up from your help',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Cracking a code or fixing something broken',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Bringing a vision to life',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Reaching a new level of mastery',
                type: 'D'
            }
        ]
    },
    {
        id: 10,
        question: "Imagine you land your dream role. The part that keeps you motivated is…",
        options: [
            {
                id: 'a',
                text: 'Connecting and uplifting others',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Solving problems and improving systems',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Innovating and creating',
                type: 'C'
            },
            {
                id: 'd',
                text: 'Growing stronger and more skilled every day',
                type: 'D'
            }
        ]
    }
];

const energizerResults: { [key: string]: EnergizerResult } = {
    'A': {
        type: 'A',
        title: 'The Connector',
        description: 'You thrive on people, support, and collaboration. Careers in teaching, coaching, communication, or leadership could light you up.',
        subtitle: 'Your superpower is bringing people together and lifting them up.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Problem-Solver',
        description: 'You\'re fueled by analysis and clarity. Data, strategy, and troubleshooting roles could feel natural and satisfying.',
        subtitle: 'You see puzzles where others see problems, and that\'s your strength.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Creator',
        description: 'You\'re energized by imagination and making new things. Creative industries, design, content, and innovation are strong paths for you.',
        subtitle: 'Your ideas and vision have the power to change the world.',
        color: '#928490'
    },
    'D': {
        type: 'D',
        title: 'The Builder',
        description: 'You thrive on growth and steady mastery. Roles with training opportunities, unique challenges, or long-term development will keep you motivated.',
        subtitle: 'Every day is a chance to get stronger, and that drives you forward.',
        color: '#928490'
    }
};

interface WhatEnergizesYouProps {
    onComplete: (result: EnergizerResult) => void;
    onBack?: () => void;
}

export default function WhatEnergizesYou({ onComplete, onBack }: WhatEnergizesYouProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<EnergizerResult | null>(null);

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
        const typeCounts = { A: 0, B: 0, C: 0, D: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C' | 'D']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C' | 'D'] > typeCounts[b[0] as 'A' | 'B' | 'C' | 'D'] ? a : b
        )[0];

        const finalResult = energizerResults[dominantType];
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
                        <Zap size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>What Energizes You?</Text>

                    <Text style={styles.introDescription}>
                        Some work drains you. Other work *fuels* you. This quiz helps you spot the tasks, environments, and wins that give you real energy, so you can steer your career in that direction.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.startButtonText}>Let's find out</Text>
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

                    <Text style={styles.finalTitle}>Your energy is a compass.</Text>

                    <Text style={styles.finalDescription}>
                        When you follow it, you'll find careers that don't just work for you, they *work with you*.
                    </Text>

                    <Text style={styles.finalClosing}>
                        See you tomorrow for more.
                    </Text>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <View
                            style={[styles.completeButtonGradient, { backgroundColor: '#928490' }]}
                        >
                            <Text style={styles.completeButtonText}>Mark as Complete</Text>
                            <ChevronRight size={16} color="#928490" />
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
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    finalTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 25,
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
        marginBottom: 40,
    },
    completeButton: {
        borderRadius: 12,
        overflow: 'hidden',
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
        borderColor: 'black', // Added border color
        borderWidth: 1, // Added border width to make the border visible
    },
});