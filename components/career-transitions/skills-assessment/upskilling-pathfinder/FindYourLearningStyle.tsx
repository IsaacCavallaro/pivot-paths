import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ChevronLeft, BookOpen, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
                {/* Sticky Header */}
                <View style={[styles.stickyHeader, { backgroundColor: '#928490' }]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <ArrowLeft size={28} color="#E2DED0" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleText}>Learning Style</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.introCard}>
                            <View style={styles.introIconContainer}>
                                <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                    <BookOpen size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={styles.introTitle}>What's your learning style?</Text>

                            <Text style={styles.introDescription}>
                                Let's face it. Starting your career change will likely require you to learn a thing or two (at least!). So it's useful to know how you learn best so that when it comes to upskilling, you can choose the most effective path.
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
                            <Text style={styles.titleText}>Your Learning Style</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.finalCard}>
                            <View style={styles.finalIconContainer}>
                                <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                    <BookOpen size={40} color="#E2DED0" />
                                </View>
                            </View>

                            <View style={styles.finalHeader}>
                                <BookOpen size={24} color="#928490" />
                                <Text style={styles.finalHeading}>There's no right or wrong</Text>
                                <BookOpen size={24} color="#928490" />
                            </View>

                            <View style={styles.finalTextContainer}>
                                <Text style={styles.finalText}>
                                    When it comes to learning styles, there's no right or wrong. Keep your learning style in mind when you start to upskill. No use working against your nature!
                                </Text>
                            </View>

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
                                        <Text style={styles.continueButtonText}>Mark as complete</Text>
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
                            <Text style={styles.titleText}>Your Learning Style</Text>
                        </View>
                        <View style={styles.backButton} />
                    </View>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.centeredContent}>
                        <View style={styles.resultCard}>
                            <View style={styles.resultIconContainer}>
                                <View style={[styles.resultIconGradient, { backgroundColor: '#928490' }]}>
                                    <BookOpen size={40} color="#E2DED0" />
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