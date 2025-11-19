import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, RotateCcw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

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
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [result, setResult] = useState<ReflectionResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('work-life-balance');

    const handleScreenChange = async (newScreen: number) => {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        setCurrentScreen(newScreen);
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleWelcomeContinue = () => {
        handleScreenChange(1);
    };

    const handleStartQuiz = () => {
        handleScreenChange(2);
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleAnswer = (optionId: string, score: number) => {
        setSelectedOption(optionId);

        const questionIndex = currentScreen - 2;
        const newAnswers = { ...answers, [questionIndex]: score };
        setAnswers(newAnswers);
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        if (currentScreen < 11) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult(answers);
        }

        setIsTransitioning(false);
    };

    const calculateResult = (finalAnswers: { [key: number]: number }) => {
        const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0);
        const maxScore = 20;

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
        setCurrentScreen(12);
        scrollToTop();
    };

    const handleContinueToFinal = () => {
        handleScreenChange(13);
    };

    const handleComplete = async () => {
        if (result) {
            try {
                await AsyncStorage.setItem('day7ReflectAndAdjustResult', JSON.stringify(result));
                onComplete(result);
            } catch (error) {
                console.error('Error saving reflection result to AsyncStorage:', error);
                onComplete(result);
            }
        }
    };

    const goBack = () => {
        if (currentScreen === 0) {
            if (onBack) onBack();
        } else if (currentScreen === 1) {
            handleScreenChange(0);
        } else if (currentScreen > 1 && currentScreen <= 11) {
            setCurrentScreen(currentScreen - 1);
            setSelectedOption(null);
            scrollToTop();
        } else if (currentScreen === 12) {
            handleScreenChange(11);
        } else if (currentScreen === 13) {
            handleScreenChange(12);
        }
    };

    // Welcome Screen with Journal Prompt
    if (currentScreen === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>
                                Welcome to Your Reflection
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                You've tried new things this week to bring more balance into your life. Taking time to reflect on your progress is a powerful way to understand what's working and what you might want to adjust moving forward.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="7"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Reflect And Adjust"
                                journalInstruction="Before we begin, take a moment to check in with yourself. How are you feeling about your work-life balance journey so far?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to how you're feeling later. Ready to reflect on your week and see what's working?
                                </Text>
                            </View>

                            <PrimaryButton
                                title="I'm Ready to Reflect"
                                onPress={handleWelcomeContinue}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Intro Screen
    if (currentScreen === 1) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <RotateCcw size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>
                                Reflect & Adjust
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                You've tried new things this week to bring more balance into your life. Let's reflect on how it felt. Your answers will help you see what's working and what to adjust.
                            </Text>

                            <PrimaryButton
                                title="Start Reflection"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen
    if (currentScreen === 13 && result) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={styles.finalTitle}>Keep Going!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Finding balance isn't something you do once. It's something you constantly have to rediscover. And for us dancers, putting our own wants and needs at the forefront can feel particularly unfamiliar.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                But keep going, you're on the right track.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="7"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Reflect And Adjust"
                                journalInstruction="What's one insight you gained from this reflection that you want to carry forward?"
                                moodLabel="How are you feeling now?"
                                saveButtonText="Add to Journal"
                            />

                            <PrimaryButton
                                title="Mark As Complete"
                                onPress={handleComplete}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Result Screen
    if (currentScreen === 12 && result) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />

                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={() => scrollToTop()}
                    onLayout={() => scrollToTop()}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            <Text style={commonStyles.introTitle}>{result.title}</Text>
                            <Text style={styles.resultDescription}>{result.description}</Text>

                            <View style={styles.reflectionQuestionsContainer}>
                                <View style={styles.reflectionQuestionCard}>
                                    <View style={styles.questionNumber}>
                                        <Text style={styles.questionNumberText}>1</Text>
                                    </View>
                                    <Text style={styles.reflectionQuestion}>
                                        What's one area where I feel I made real progress this week?
                                    </Text>
                                </View>
                                <View style={styles.reflectionQuestionCard}>
                                    <View style={styles.questionNumber}>
                                        <Text style={styles.questionNumberText}>2</Text>
                                    </View>
                                    <Text style={styles.reflectionQuestion}>
                                        What's one small adjustment I can make for next week?
                                    </Text>
                                </View>
                            </View>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="7"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Reflect And Adjust"
                                journalInstruction="Reflect on these questions based on your results:"
                                moodLabel="How are you feeling about your results?"
                                saveButtonText="Add Reflection to Journal"
                            />

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToFinal}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Question Screens with smooth transitions
    const question = quizQuestions[currentScreen - 2];
    const progress = ((currentScreen - 1) / 10) * 100;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreen - 1} of 10`}
                progress={progress / 100}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={commonStyles.centeredContent}>
                    <Card style={styles.baseCardReflect}>
                        <Text style={styles.questionText}>
                            {question.question}
                        </Text>

                        <View style={styles.optionsContainer}>
                            {question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.optionButton,
                                        selectedOption === option.id && styles.optionButtonSelected
                                    ]}
                                    onPress={() => handleAnswer(option.id, option.score)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        <Text style={[
                                            styles.optionText,
                                            selectedOption === option.id && styles.optionTextSelected
                                        ]}>
                                            {option.text}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <PrimaryButton
                            title={currentScreen < 11 ? 'Continue' : 'See Results'}
                            onPress={handleContinue}
                            disabled={selectedOption === null || isTransitioning}
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Welcome Screen Styles
    welcomeHighlight: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    welcomeHighlightText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // Intro Icon Styles
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
    // Question Styles
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
    optionButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
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
    optionTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    // Result Styles
    resultDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    reflectionQuestionsContainer: {
        marginBottom: 24,
    },
    reflectionQuestionCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.1)',
    },
    questionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        marginTop: 2,
    },
    questionNumberText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: '#E2DED0',
        fontWeight: '700',
    },
    reflectionQuestion: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 22,
        flex: 1,
        paddingTop: 2,
    },
    // Final Screen Styles
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    // Card Styles
    baseCardReflect: {
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
        marginTop: 50,
    },
});