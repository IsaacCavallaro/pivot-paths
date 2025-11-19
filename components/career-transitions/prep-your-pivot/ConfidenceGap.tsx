import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, Target, Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
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
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<ConfidenceGapResult | null>(null);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('prep-your-pivot');

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

    const handleAnswer = (optionId: string, optionType: string) => {
        setSelectedOption(optionId);

        const questionIndex = currentScreen - 2;
        const newAnswers = { ...answers, [questionIndex]: optionType };
        setAnswers(newAnswers);
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);

        await new Promise(resolve => setTimeout(resolve, 150));

        if (currentScreen < 10) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult(answers);
        }

        setIsTransitioning(false);
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
        setCurrentScreen(11);
        scrollToTop();
    };

    const handleContinueToConfidentSelf = () => {
        handleScreenChange(12);
    };

    const handleContinueToTakeAction = () => {
        handleScreenChange(13);
    };

    const goBack = () => {
        if (currentScreen === 0) {
            if (onBack) onBack();
        } else if (currentScreen === 1) {
            handleScreenChange(0);
        } else if (currentScreen > 1 && currentScreen <= 10) {
            setCurrentScreen(currentScreen - 1);
            setSelectedOption(null);
            scrollToTop();
        } else if (currentScreen === 11) {
            handleScreenChange(10);
        } else if (currentScreen === 12) {
            handleScreenChange(11);
        } else if (currentScreen === 13) {
            handleScreenChange(12);
        } else if (currentScreen === 14) {
            handleScreenChange(13);
        }
    };

    const handleComplete = async () => {
        if (result) {
            try {
                await AsyncStorage.setItem('day1ConfidenceGapResult', JSON.stringify(result));
                onComplete(result);
            } catch (error) {
                console.error('Error saving quiz result to AsyncStorage:', error);
                onComplete(result);
            }
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
                                Welcome to Your Confidence Journey
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Making a big career change is as much about mindset as it is about skills. Taking this first step to understand your confidence patterns shows incredible self-awareness and courage.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="1"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Confidence Gap"
                                journalInstruction="Before we begin, let's check in with how you're feeling about your career transition journey right now."
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    Understanding where your confidence dips will help you build it back up, stronger than ever. Ready to discover your confidence gap?
                                </Text>
                            </View>

                            <PrimaryButton
                                title="I'm Ready to Begin"
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
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>
                                Where's your confidence gap?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                This quick check will help you see where your confidence tends to dip—whether it's in your mindset, your skills, or taking action—so you know exactly what to focus on as you prep your pivot.
                            </Text>

                            <PrimaryButton
                                title="Let's find out"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // The Confident Self Screen
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
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={styles.confidentTitle}>
                                Here's Who You Can Become:
                            </Text>

                            <Text style={styles.confidentTitleBold}>
                                The Confident Self
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Confident Self is someone who trusts their abilities <Text style={{ fontStyle: 'italic' }}>without hesitation</Text>.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This version of you understands that your dance background has equipped you with incredible transferable skills: discipline, resilience, creativity, and the ability to learn quickly. You use these strengths to navigate new career paths with assurance.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Confident Self doesn't wait for permission to try new things. Instead, they see challenges as opportunities and trust that each step forward builds more evidence of their capability.
                            </Text>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToTakeAction}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Take Action Screen
    if (currentScreen === 13 && result) {
        const getReflectionQuestions = () => {
            switch (result.type) {
                case 'Mindset':
                    return [
                        'Is it serving me to have a mindset confidence gap?',
                        'How can I reframe my dance experience as an asset?',
                        'What evidence do I have that I can succeed in new areas?'
                    ];
                case 'Skills':
                    return [
                        'Is it serving me to focus only on skill gaps?',
                        'What skills do I already have that I\'m underestimating?',
                        'How can I build confidence through small skill wins?'
                    ];
                case 'Action-Ready':
                    return [
                        'Is it serving me to hesitate before taking action?',
                        'What small action can I take today to build momentum?',
                        'How have past actions proven my capability?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'Mindset':
                    return 'I can build my confidence mindset by...';
                case 'Skills':
                    return 'I can build confidence in my skills by...';
                case 'Action-Ready':
                    return 'I can build confidence through action by...';
                default:
                    return 'Write your reflections here...';
            }
        };

        const reflectionQuestions = getReflectionQuestions();
        const journalPlaceholder = getJournalPlaceholder();

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
                            <Text style={styles.takeactionTitle}>Build Your Confidence</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Recognizing your <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> is the first step toward building unshakeable confidence in your career transition.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Now, let's explore how you can develop into <Text style={styles.highlightText}>the confident self</Text> and close that gap for good.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Reflect on these questions to start building your confidence:
                                </Text>

                                {/* Dynamic Reflection Questions */}
                                <View style={styles.reflectionQuestionsContainer}>
                                    {reflectionQuestions.map((question, index) => (
                                        <View key={index} style={styles.reflectionQuestionCard}>
                                            <View style={styles.questionNumber}>
                                                <Text style={styles.questionNumberText}>{index + 1}</Text>
                                            </View>
                                            <Text style={styles.reflectionQuestion}>{question}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="1"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Confidence Gap"
                                journalInstruction="Write your reflections as a journal entry below to solidify your confidence-building plan."
                                moodLabel="How are you feeling about your confidence now?"
                                saveButtonText="Add to Journal"
                                placeholder={journalPlaceholder}
                            />

                            <PrimaryButton
                                title="Continue Your Journey"
                                onPress={() => handleScreenChange(14)}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Congratulations and Mark as Complete Screen
    if (currentScreen === 14 && result) {
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
                            <Text style={styles.congratulationsTitle}>Congratulations!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                You've taken a powerful first step toward becoming your most confident self. By understanding where your confidence dips, you're already building the self-awareness needed to close that gap.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your confident future awaits!
                            </Text>

                            <PrimaryButton
                                title="Mark as Complete"
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
    if (currentScreen === 11 && result) {
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

                            <View style={styles.resultSubtitleContainer}>
                                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToConfidentSelf}
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
    const progress = ((currentScreen - 1) / 9) * 100;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreen - 1} of 9`}
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
                    <Card style={styles.baseCardConfidence}>
                        <Text style={styles.questionText}>
                            {question.question}
                        </Text>

                        <View style={styles.optionsContainer}>
                            {question.options.map((option, index) => (
                                <View key={option.id}>
                                    <TouchableOpacity
                                        style={[
                                            styles.optionButton,
                                            selectedOption === option.id && styles.optionButtonSelected
                                        ]}
                                        onPress={() => handleAnswer(option.id, option.type)}
                                        activeOpacity={0.8}
                                        disabled={isTransitioning}
                                    >
                                        <View style={styles.optionContent}>
                                            {selectedOption === option.id && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <View style={styles.optionTextContainer}>
                                                <Text style={[
                                                    styles.optionText,
                                                    selectedOption === option.id && styles.optionTextSelected
                                                ]}>
                                                    {option.text}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        <PrimaryButton
                            title={currentScreen < 10 ? 'Continue' : 'See Results'}
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
        paddingRight: 50,
    },
    optionTextContainer: {
        flex: 1,
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
    selectedIndicator: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
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
    resultSubtitleContainer: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    resultSubtitle: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // The Confident Self Screen Styles
    confidentTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    confidentTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    // Take Action Screen Styles
    takeactionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    highlightText: {
        fontFamily: 'Montserrat-SemiBold',
        color: '#928490',
        fontWeight: '600',
    },
    reflectionSection: {
        marginBottom: 32,
    },
    reflectionInstruction: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
        marginBottom: 15,
    },
    reflectionQuestionsContainer: {
        marginBottom: 0,
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
    // Congratulations Screen Styles
    congratulationsTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    congratulationsClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // Journal Section Styles
    sectionHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 22,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    sectionDivider: {
        width: 60,
        height: 3,
        backgroundColor: '#928490',
        borderRadius: 2,
    },
    baseCardConfidence: {
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