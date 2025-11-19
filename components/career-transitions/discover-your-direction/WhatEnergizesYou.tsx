import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Check, Smile, Frown, Meh, Laugh, Angry, Heart } from 'lucide-react-native';
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
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<EnergizerResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('what-energizes-you');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('what-energizes-you');

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

        if (currentScreen < 11) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult(answers);
        }

        setIsTransitioning(false);
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
        setCurrentScreen(12);
        scrollToTop();
    };

    const handleContinueToEnergyGuide = () => {
        handleScreenChange(13);
    };

    const handleContinueToTakeAction = () => {
        handleScreenChange(14);
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
        } else if (currentScreen === 14) {
            handleScreenChange(13);
        } else if (currentScreen === 15) {
            handleScreenChange(14);
        }
    };

    const handleComplete = async () => {
        if (result) {
            try {
                await AsyncStorage.setItem('whatEnergizesYouResult', JSON.stringify(result));
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
                                Welcome to Your Energy Discovery
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Understanding what truly energizes you is key to building a career that feels fulfilling and sustainable. Let's explore the activities and environments that light you up.
                            </Text>

                            <JournalEntrySection
                                pathTag="map-your-direction"
                                day="2"
                                category="Career Transitions"
                                pathTitle="Map Your Direction"
                                dayTitle="What Energizes You?"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. What activities have felt most energizing to you recently?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to how you're feeling a bit later. But now, are you ready to discover what truly energizes you?
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
                                What Energizes You?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Some work drains you. Other work fuels you. This quiz helps you spot the tasks, environments, and wins that give you real energy, so you can steer your career in that direction.
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

    // The Energy Guide Screen
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

                            <Text style={styles.energyGuideTitle}>
                                Here's How You Can Use Your Energy:
                            </Text>

                            <Text style={styles.energyGuideTitleBold}>
                                Your Personal Energy Guide
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Understanding your energy type is the first step toward building a career that doesn't just work for you, but works <Text style={{ fontStyle: 'italic' }}>with</Text> you.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Your dance background has given you incredible discipline and awareness of your body and mind. Now you can use that same awareness to notice what energizes you in your career.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                When you align your work with your natural energy sources, you'll find yourself more engaged, motivated, and fulfilled in your daily life.
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
    if (currentScreen === 14 && result) {
        const getReflectionQuestions = () => {
            switch (result.type) {
                case 'A':
                    return [
                        'How can I incorporate more connection into my daily work?',
                        'What environments help me feel most energized around people?',
                        'How can my natural ability to connect serve me in new careers?'
                    ];
                case 'B':
                    return [
                        'What types of problems do I enjoy solving most?',
                        'How can I create more focused, analytical work in my life?',
                        'What systems or processes could benefit from my problem-solving skills?'
                    ];
                case 'C':
                    return [
                        'What creative outlets bring me the most joy?',
                        'How can I make space for innovation in my daily routine?',
                        'What ideas have I been wanting to bring to life?'
                    ];
                case 'D':
                    return [
                        'What skills am I most excited to develop further?',
                        'How can I create a structured path for my growth?',
                        'What mastery would feel most fulfilling to achieve?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'A':
                    return 'I feel most energized when connecting with others by...';
                case 'B':
                    return 'Solving problems energizes me because...';
                case 'C':
                    return 'My creative energy comes alive when...';
                case 'D':
                    return 'Building mastery energizes me through...';
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
                                Now that you know you're <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text>, how can you use this knowledge to shape your career path?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Let's hear from someone who learned to follow their energy and built a career that truly lights them up.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Start by watching the video below and reflect on these questions:
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
                                pathTag="map-your-direction"
                                day="2"
                                category="Career Transitions"
                                pathTitle="Map Your Direction"
                                dayTitle="What Energizes You?"
                                journalInstruction="As you're watching, write your reflections as a journal entry below."
                                moodLabel="How are you feeling?"
                                saveButtonText="Add to Journal"
                                placeholder={journalPlaceholder}
                            />

                            <PrimaryButton
                                title="Continue Your Journey"
                                onPress={() => handleScreenChange(15)}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Congratulations and Mark as Complete Screen
    if (currentScreen === 15 && result) {
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
                                You've taken an important step toward understanding what truly energizes you. By recognizing your natural energy sources, you're better equipped to build a career that feels fulfilling and sustainable.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your energy is your compass - follow it to work that lights you up!
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

                            <View style={styles.resultSubtitleContainer}>
                                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToEnergyGuide}
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
                    <Card style={styles.baseCardEnergizes}>
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
    // The Energy Guide Screen Styles
    energyGuideTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    energyGuideTitleBold: {
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
    baseCardEnergizes: {
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