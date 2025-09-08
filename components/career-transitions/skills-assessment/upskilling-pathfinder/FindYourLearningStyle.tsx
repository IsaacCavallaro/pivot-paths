import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, BookOpen, ArrowLeft } from 'lucide-react-native';

interface QuizQuestion {
    id: number;
    question: string;
    options: {
        id: string;
        text: string;
        type: 'A' | 'B' | 'C';
    }[];
}

interface LearningStyleResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you learned choreography, what helped you most?",
        options: [
            {
                id: 'a',
                text: 'Watching someone else perform the steps',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Counting out loud or repeating the rhythm with others',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Jumping in and trying the steps myself',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "In school, which was the most helpful?",
        options: [
            {
                id: 'a',
                text: 'Slides, diagrams, or examples on the screen',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A lively Q&A or discussion with the instructor',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Doing a short exercise or practice activity',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "When you read instructions for something new, how do you usually respond?",
        options: [
            {
                id: 'a',
                text: 'I want a picture or diagram to make sense of it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I\'d rather someone explain it out loud',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I skim it quickly and just figure it out by doing',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "In rehearsal, if you forgot a step, how would you recall it fastest?",
        options: [
            {
                id: 'a',
                text: 'Watch the video or ask the choreographer to clarify with a demo',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Remember from the counts, music, or cues someone said',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Mark the routine until it comes back into my body',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "How do you usually learn a new app or tool?",
        options: [
            {
                id: 'a',
                text: 'By watching a video tutorial',
                type: 'A'
            },
            {
                id: 'b',
                text: 'By listening to someone explain the features',
                type: 'B'
            },
            {
                id: 'c',
                text: 'By clicking around and experimenting',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Which note-taking style works best for you?",
        options: [
            {
                id: 'a',
                text: 'Color-coded notes, sketches, or mind maps',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Recording voice memos or talking it through',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I always use pen to paper, no digital notes',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "When someone gives you directions to a new place…",
        options: [
            {
                id: 'a',
                text: 'I need to see a map',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I ask them to tell me step by step',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I prefer to go and get my bearings',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "If you had to explain a new idea to someone else, how would you do it?",
        options: [
            {
                id: 'a',
                text: 'Draw a sketch or show them with visuals',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talk it through using storytelling',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Get them to try it out with me',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "When you're inspired by something new, what's your instinct?",
        options: [
            {
                id: 'a',
                text: 'Watch video explainers on the topic',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talk to someone about it or listen to a podcast',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Experiment with it right away',
                type: 'C'
            }
        ]
    }
];

const learningStyleResults: { [key: string]: LearningStyleResult } = {
    'A': {
        type: 'A',
        title: 'Visual Learner',
        description: 'You learn best when you can see it. Whether it\'s watching a demo, video, or using visuals to connect ideas, your brain thrives on imagery. For your career pivot, prioritize YouTube videos and mapping out your ideas.',
        subtitle: 'Your mind connects best with what your eyes can see.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'Auditory Learner',
        description: 'You learn best by listening and speaking. Conversations and verbal repetition help things stick. For your pivot, find a mentor to talk things through with, listen to podcasts, or record your own voice notes to organize your thoughts.',
        subtitle: 'Your ears are the gateway to understanding.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'Kinesthetic Learner',
        description: 'You learn best by doing. Trial, error, and action are your teachers. You need to put concepts into practice immediately. For your pivot, jump into small projects, internships, or hands-on workshops since you\'ll learn fastest through experience.',
        subtitle: 'Your hands and body are your learning tools.',
        color: '#928490'
    }
};

interface FindYourLearningStyleProps {
    onComplete: (result: LearningStyleResult) => void;
    onBack?: () => void;
}

export default function FindYourLearningStyle({ onComplete, onBack }: FindYourLearningStyleProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0 = intro, 1-9 = questions, 10 = result, 11 = final
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<LearningStyleResult | null>(null);

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
        const typeCounts = { A: 0, B: 0, C: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
        )[0];

        const finalResult = learningStyleResults[dominantType];
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
                        <BookOpen size={32} color="#928490" />
                    </View>

                    <Text style={styles.introTitle}>What's your learning style?</Text>

                    <Text style={styles.introDescription}>
                        Let's face it. Starting your career change will likely require you to learn a thing or two (at least!). So it's useful to know how you learn best so that when it comes to upskilling, you can choose the most effective path.
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
                        <BookOpen size={40} color="#928490" />
                    </View>

                    <Text style={styles.finalTitle}>There's no right or wrong</Text>

                    <Text style={styles.finalDescription}>
                        When it comes to learning styles, there's no right or wrong. Keep your learning style in mind when you start to upskill. No use working against your nature!
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
                    <Text style={styles.resultHeading}>You're a</Text>
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
    resultHeading: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#E2DED0',
        textAlign: 'center',
        marginBottom: 5,
        opacity: 0.9,
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
});