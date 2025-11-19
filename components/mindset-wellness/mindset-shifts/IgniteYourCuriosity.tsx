import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Check, Smile, Frown, Meh, Laugh, Angry, Heart, Zap } from 'lucide-react-native';
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
        type: 'A' | 'B' | 'C';
    }[];
}

interface CuriosityResult {
    type: string;
    title: string;
    description: string;
    challenge: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "If you had a free hour today, what could you do (instead of scrolling)?",
        options: [
            {
                id: 'a',
                text: 'Wander a nearby neighborhood you\'ve never been to',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Watch a documentary on a random topic',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Strike up a conversation with the barista',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "Pick a way to add novelty to your week:",
        options: [
            {
                id: 'a',
                text: 'Take a different route home',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Try a new recipe',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Go to a class for something you\'ve never done',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "You overhear someone talking about a field you know nothing about. You could…",
        options: [
            {
                id: 'a',
                text: 'Ask them a question',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Look it up later',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Let it inspire a new idea of your own',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "If you could shadow someone for a day, you'd choose:",
        options: [
            {
                id: 'a',
                text: 'An artist in a medium you\'ve never tried',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A scientist or researcher',
                type: 'B'
            },
            {
                id: 'c',
                text: 'A business owner or entrepreneur',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When faced with something unfamiliar, you could try to:",
        options: [
            {
                id: 'a',
                text: 'Dive in and try it hands-on',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Observe first, then engage',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Learn by asking lots of questions',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Pick an experiment to try this week:",
        options: [
            {
                id: 'a',
                text: 'Journal one "curiosity question" a day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Say yes to the next unusual opportunity that comes your way',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Visit a place you\'d never normally go',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "Imagine going back to being a kid for a day. You'd spend it…",
        options: [
            {
                id: 'a',
                text: 'Exploring outside',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Building or making something',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking endless "why" questions',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "You get an invitation to something out of your comfort zone. You could…",
        options: [
            {
                id: 'a',
                text: 'Jump in without overthinking',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Hesitate but eventually say yes',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Bring a friend along for support',
                type: 'C'
            }
        ]
    }
];

const curiosityResults: { [key: string]: CuriosityResult } = {
    'A': {
        type: 'A',
        title: 'The Explorer',
        description: 'You\'re curious through *experience*. You learn by stepping into new spaces and saying yes to adventures.',
        challenge: 'Keep adding little twists to your daily routine (new routes, new foods, new people).',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Learner',
        description: 'Your curiosity thrives on *knowledge*. You want to understand the "why" behind things.',
        challenge: 'Follow one random question down the rabbit hole each week and let learning be playful, not just practical.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Creator',
        description: 'You turn curiosity into *expression*. What you discover becomes fuel for making, shaping, and sharing.',
        challenge: 'Channel your curiosity into a small project. Even if it\'s messy, let it be fun.',
        color: '#928490'
    }
};

interface IgniteYourCuriosityProps {
    onComplete: (result: CuriosityResult) => void;
    onBack?: () => void;
}

export default function IgniteYourCuriosity({ onComplete, onBack }: IgniteYourCuriosityProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<CuriosityResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('mindset-shifts');

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

        if (currentScreen < 9) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult(answers);
        }

        setIsTransitioning(false);
    };

    const calculateResult = (finalAnswers: { [key: number]: string }) => {
        const typeCounts = { A: 0, B: 0, C: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
        )[0];

        const finalResult = curiosityResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(9);
        scrollToTop();
    };

    const handleContinueToCuriousExplorer = () => {
        handleScreenChange(10);
    };

    const handleContinueToTakeAction = () => {
        handleScreenChange(11);
    };

    const goBack = () => {
        if (currentScreen === 0) {
            if (onBack) onBack();
        } else if (currentScreen === 1) {
            handleScreenChange(0);
        } else if (currentScreen > 1 && currentScreen <= 9) {
            setCurrentScreen(currentScreen - 1);
            setSelectedOption(null);
            scrollToTop();
        } else if (currentScreen === 9) {
            handleScreenChange(8);
        } else if (currentScreen === 10) {
            handleScreenChange(9);
        } else if (currentScreen === 11) {
            handleScreenChange(10);
        } else if (currentScreen === 12) {
            handleScreenChange(11);
        }
    };

    const handleComplete = async () => {
        if (result) {
            try {
                await AsyncStorage.setItem('day7CuriosityResult', JSON.stringify(result));
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
                                Welcome to Your Curiosity Journey
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Taking this first step to explore your curiosity is something to be truly proud of. It takes courage to look inward and discover new ways of seeing the world around you.
                            </Text>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="7"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Ignite Your Curiosity"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling as you begin this journey of exploration?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to how you're feeling a bit later. But now, are you ready to discover your curiosity style?
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
                                <View style={[styles.curiosityIconContainer, { backgroundColor: '#928490' }]}>
                                    <Zap size={32} color="#E2DED0" />
                                </View>
                            </View>

                            <Text style={commonStyles.introTitle}>
                                What's Your Curiosity Style?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Curiosity isn't something you either have or don't... it's like a muscle. This quiz will stretch your curiosity and help you practice seeing the world with fresh eyes.
                            </Text>

                            <PrimaryButton
                                title="Let's Play"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // The Curious Explorer Screen
    if (currentScreen === 10 && result) {
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

                            <Text style={styles.curiousTitle}>
                                Here's What You Could Be:
                            </Text>

                            <Text style={styles.curiousTitleBold}>
                                The Curious Explorer
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Curious Explorer is someone who approaches life with wonder and openness, seeing every day as an opportunity to discover something new.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This explorer understands that curiosity isn't about having all the answers, but about asking better questions. They embrace uncertainty and find joy in the journey of discovery itself.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Curious Explorer doesn't wait for inspiration to strike—they actively seek it out in ordinary moments, turning routine into adventure and familiarity into fascination.
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
    if (currentScreen === 11 && result) {
        const getReflectionQuestions = () => {
            switch (result.type) {
                case 'A':
                    return [
                        'Is it serving me to be the Explorer?',
                        'How can I incorporate more exploration into my daily routine?',
                        'What did I learn about my curiosity style?'
                    ];
                case 'B':
                    return [
                        'Is it serving me to be the Learner?',
                        'How can I make learning more playful in my life?',
                        'What did I learn about my curiosity style?'
                    ];
                case 'C':
                    return [
                        'Is it serving me to be the Creator?',
                        'How can I channel my curiosity into creative expression?',
                        'What did I learn about my curiosity style?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'A':
                    return 'I can embrace exploration by...';
                case 'B':
                    return 'I can make learning playful by...';
                case 'C':
                    return 'I can channel curiosity creatively by...';
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
                            <Text style={styles.takeactionTitle}>Take Action</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Do you feel that <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> describes you? Or are you surprised by the results? Whatever's coming up for you, go with it. We got you!
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Now, how can you unlock the <Text style={styles.highlightText}>curious explorer</Text> within?!
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Let's explore how curiosity can transform your perspective and open up new possibilities.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Consider these questions as you reflect on your curiosity style:
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

                            {/* YouTube Video Player */}
                            <View style={styles.videoSection}>
                                <View style={styles.videoHeader}>
                                    <Text style={styles.videoTitle}>Watch & Learn</Text>
                                </View>
                                <View style={styles.videoContainer}>
                                    <View style={styles.youtubePlayer}>
                                        <YoutubePlayer
                                            height={140}
                                            play={false}
                                            videoId={'ZsvNvXLtcC4'}
                                            webViewStyle={styles.youtubeWebView}
                                        />
                                    </View>
                                </View>
                            </View>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="7"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Ignite Your Curiosity"
                                journalInstruction="As you're reflecting, write your thoughts as a journal entry below."
                                moodLabel="How are you feeling?"
                                saveButtonText="Add to Journal"
                                placeholder={journalPlaceholder}
                            />

                            <PrimaryButton
                                title="Continue Your Journey"
                                onPress={() => handleScreenChange(12)}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Congratulations and Mark as Complete Screen
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
                            <Text style={styles.congratulationsTitle}>Congratulations!</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                You've taken an important step toward becoming more curious and open to the world around you. By understanding your curiosity style, you're already opening yourself up to new experiences and perspectives.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your curious journey awaits!
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
    if (currentScreen === 9 && result) {
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
                                <Text style={styles.resultChallenge}>{result.challenge}</Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToCuriousExplorer}
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
    const progress = ((currentScreen - 1) / 8) * 100;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreen - 1} of 8`}
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
                    <Card style={styles.baseCardCuriosity}>
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
                            title={currentScreen < 9 ? 'Continue' : 'See Results'}
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
    resultChallenge: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
        fontWeight: '500',
    },
    // The Curious Explorer Screen Styles
    curiousTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    curiousTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    curiosityIconContainer: {
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
    videoSection: {
        marginBottom: 32,
    },
    videoHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    videoTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    videoContainer: {
        width: '100%',
    },
    youtubePlayer: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    youtubeWebView: {
        borderRadius: 16,
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
    baseCardCuriosity: {
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