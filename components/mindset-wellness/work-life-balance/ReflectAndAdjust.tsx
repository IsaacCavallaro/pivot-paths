import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, RotateCcw, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        score: number;
    }[];
}

interface ReflectionResult {
    type: string;
    title: string;
    description: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "Did you schedule time for hobbies this week?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'Not yet', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 2,
        question: "Did you notice energy dips or times you felt drained?",
        options: [
            { id: 'a', text: 'Yes', score: 0 },
            { id: 'b', text: 'Sometimes', score: 1 },
            { id: 'c', text: 'No', score: 2 }
        ]
    },
    {
        id: 3,
        question: "Did you practice at least one boundary (with work, people, or yourself)?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'I thought about it', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 4,
        question: "Did you try a movement or workout you actually enjoyed?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: "It's on the schedule", score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 5,
        question: "Did you make time for social connection (friends, family, or community)?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'I have plans to', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 6,
        question: "Did you set aside quiet time for yourself (journaling, rest, reading, or just doing nothing)?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'Not yet', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 7,
        question: "Did you feel like \"yourself\" outside of work this week?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'Somewhat', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 8,
        question: "When work got busy, were you able to keep balance in at least one area (movement, hobbies, or rest)?",
        options: [
            { id: 'a', text: 'Yes', score: 2 },
            { id: 'b', text: 'I tried to', score: 1 },
            { id: 'c', text: 'No', score: 0 }
        ]
    },
    {
        id: 9,
        question: "How balanced do you feel overall, on a scale of 1–5?",
        options: [
            { id: 'a', text: '5 (Very balanced)', score: 2 },
            { id: 'b', text: '3 (Somewhat balanced)', score: 1 },
            { id: 'c', text: '1 (Not balanced at all)', score: 0 }
        ]
    },
    {
        id: 10,
        question: "Looking back, how proud are you of the effort you put in?",
        options: [
            { id: 'a', text: 'Incredibly proud', score: 2 },
            { id: 'b', text: 'I know I did well', score: 1 },
            { id: 'c', text: 'I can do better', score: 0 }
        ]
    }
];

const reflectionResults: { [key: string]: ReflectionResult } = {
    'high': {
        type: 'high',
        title: "You're Finding Your Flow",
        description: "You're creating real space for balance in your life. It's working and the best part is, you're proving it's possible. Keep nurturing what energizes you and protecting what matters.",
        color: '#5A7D7B'
    },
    'medium': {
        type: 'medium',
        title: "You're Making Progress",
        description: "Balance is a process, and you're building it piece by piece. You're noticing shifts, but there's still room to experiment. Keep testing small changes until you find your sweet spot.",
        color: '#928490'
    },
    'low': {
        type: 'low',
        title: "You're Ready to Reset",
        description: "This week showed you what isn't working… which is just as valuable as knowing what *is*. But you didn't fail, you're just not used to it. Try one new boundary, one hobby, or one rest ritual next week to reset your balance.",
        color: '#647C90'
    }
};

interface ReflectAndAdjustProps {
    onComplete: (result: ReflectionResult) => void;
    onBack?: () => void;
}

export default function ReflectAndAdjust({ onComplete, onBack }: ReflectAndAdjustProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-10 = questions, 11 = result, 12 = final
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [result, setResult] = useState<ReflectionResult | null>(null);

    const handleStartQuiz = () => {
        setCurrentScreen(1);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleAnswer = (score: number) => {
        const questionIndex = currentScreen - 1;
        const newAnswers = { ...answers, [questionIndex]: score };
        setAnswers(newAnswers);

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: { [key: number]: number }) => {
        const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0);
        const maxScore = 20; // 10 questions * 2 max points each

        let resultType: string;
        if (totalScore >= 14) {
            resultType = 'high';
        } else if (totalScore >= 8) {
            resultType = 'medium';
        } else {
            resultType = 'low';
        }

        const finalResult = reflectionResults[resultType];
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
                        <RotateCcw size={32} color="#5A7D7B" />
                    </View>

                    <Text style={styles.introTitle}>Reflect & Adjust</Text>

                    <Text style={styles.introDescription}>
                        You've tried new things this week to bring more balance into your life. Let's reflect on how it felt. Your answers will help you see what's working and what to adjust.
                    </Text>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                        <View
                            style={[styles.startButtonGradient, { backgroundColor: '#5A7D7B' }]}
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

                    <Text style={styles.finalTitle}>Keep going!</Text>

                    <Text style={styles.finalDescription}>
                        Finding balance isn't something you do once. It's something you constantly have to rediscover. And for us dancers, putting our own wants and needs at the forefront can feel particularly unfamiliar.
                    </Text>

                    <Text style={styles.finalDescription}>
                        But keep going, you're on the right track.
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
                            onPress={() => handleAnswer(option.score)}
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