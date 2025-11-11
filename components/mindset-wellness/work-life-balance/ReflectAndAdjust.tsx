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
        color: '#928490'
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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Reflect & Adjust</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <RotateCcw size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>Reflect & Adjust</Text>

                            <Text style={styles.introDescription}>
                                You've tried new things this week to bring more balance into your life. Let's reflect on how it felt. Your answers will help you see what's working and what to adjust.
                            </Text>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleStartQuiz}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.startButtonContent, { backgroundColor: '#928490' }]}>
                                    <Text style={styles.startButtonText}>Start Quiz</Text>
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
                            <Text style={styles.titleText}>Keep Going!</Text>
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

                            <Text style={styles.finalTitle}>Keep Going!</Text>

                            <Text style={styles.finalDescription}>
                                Finding balance isn't something you do once. It's something you constantly have to rediscover. And for us dancers, putting our own wants and needs at the forefront can feel particularly unfamiliar.
                            </Text>

                            <Text style={styles.finalDescription}>
                                But keep going, you're on the right track.
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
                                    onPress={() => handleAnswer(option.score)}
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