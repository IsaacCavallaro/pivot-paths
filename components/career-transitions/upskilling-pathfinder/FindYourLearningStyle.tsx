import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Check, BookOpen } from 'lucide-react-native';
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
        text: string | React.ReactElement;
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
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<LearningStyleResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('upskilling-pathfinder');

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
        const typeCounts = { A: 0, B: 0, C: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
        )[0];

        const finalResult = learningStyleResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(11);
        scrollToTop();
    };

    const handleContinueToEffectiveLearner = () => {
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
                await AsyncStorage.setItem('day2LearningStyleResult', JSON.stringify(result));
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
                                Welcome back!
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Today, we're going to discover how you learn best. Understanding your learning style will help you choose the most effective upskilling path for your career transition.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfinder"
                                day="2"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Find Your Learning Style"
                                journalInstruction="Before we begin, take a moment to reflect: What's your relationship with learning new things? Do you enjoy it, or does it feel challenging?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    Knowing how you learn best will save you time and frustration as you build new skills. Ready to discover your learning style?
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
                                What's your learning style?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Let's face it. Starting your career change will likely require you to learn a thing or two (at least!). So it's useful to know how you learn best so that when it comes to upskilling, you can choose the most effective path.
                            </Text>

                            <PrimaryButton
                                title="Let's do it"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // The Effective Learner Screen
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

                            <Text style={styles.effectiveTitle}>
                                Here's What You Could Be:
                            </Text>

                            <Text style={styles.effectiveTitleBold}>
                                The Effective Learner
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Effective Learner understands their natural strengths and uses them to their advantage. They don't fight against their learning style—they embrace it.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This learner knows that when you work with your natural tendencies, learning becomes faster, more enjoyable, and more sustainable. They choose learning methods that align with how their brain processes information best.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Effective Learner doesn't just acquire skills—they master them in a way that feels natural and empowering.
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
                case 'A':
                    return [
                        'How can I incorporate more visual elements into my learning?',
                        'What types of visual resources work best for me?',
                        'How can I create my own visual learning materials?'
                    ];
                case 'B':
                    return [
                        'How can I include more auditory elements in my learning process?',
                        'What audio resources would be most helpful for me?',
                        'How can I use discussion and conversation to enhance my learning?'
                    ];
                case 'C':
                    return [
                        'How can I create more hands-on learning opportunities?',
                        'What types of practical projects would help me learn best?',
                        'How can I incorporate movement and action into my study routine?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'A':
                    return 'I learn best visually by...';
                case 'B':
                    return 'I learn best through listening and discussion by...';
                case 'C':
                    return 'I learn best through hands-on experience by...';
                default:
                    return 'Write your learning reflections here...';
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
                                Now that you know you're a <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text>, how can you use this knowledge to become a more effective learner?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Let's explore some practical ways to apply your learning style to your career transition journey.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Consider these questions about your learning style:
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
                                pathTag="upskilling-pathfinder"
                                day="2"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Find Your Learning Style"
                                journalInstruction="Based on your learning style and the video, write your action plan below."
                                moodLabel="How are you feeling about your learning journey?"
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
                                You've taken an important step toward becoming an Effective Learner. By understanding your learning style, you're setting yourself up for success in your career transition.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Remember: There's no right or wrong learning style. Work with your nature, not against it!
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
                                onPress={handleContinueToEffectiveLearner}
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
                    <Card style={styles.baseCardSkills}>
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
                                                {typeof option.text === 'string' ? (
                                                    <Text style={[
                                                        styles.optionText,
                                                        selectedOption === option.id && styles.optionTextSelected
                                                    ]}>
                                                        {option.text}
                                                    </Text>
                                                ) : (
                                                    <View style={styles.jsxOptionWrapper}>
                                                        {option.text}
                                                    </View>
                                                )}
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
    jsxOptionWrapper: {
        // You can add specific styling for JSX options if needed
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
    // The Effective Learner Screen Styles
    effectiveTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    effectiveTitleBold: {
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
    baseCardSkills: {
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