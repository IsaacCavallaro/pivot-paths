import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronRight, ArrowLeft, Zap, Check } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
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

interface EnergyResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When do you feel most motivated?",
        options: [
            {
                id: 'a',
                text: 'First thing in the morning',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Midday after lunch',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Late afternoon/evening',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "When tackling a new task, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Diving in immediately',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Planning first',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Asking for guidance',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "After a long day of dance, I usually feel…",
        options: [
            {
                id: 'a',
                text: 'Energized and ready to do more',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Tired but okay',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Completely drained',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "I focus best when…",
        options: [
            {
                id: 'a',
                text: 'Listening and observing',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking and collaborating',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Moving and doing',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When learning something new, I prefer…",
        options: [
            {
                id: 'a',
                text: 'Reading instructions or watching examples',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Talking it through with someone',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Jumping in and figuring it out as I go',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "I feel recharged after…",
        options: [
            {
                id: 'a',
                text: 'A quiet solo activity like journaling or a walk',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Socializing or connecting with friends',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Physical movement or dancing',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "During a busy week, I notice my energy dips…",
        options: [
            {
                id: 'a',
                text: 'Early in the day',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Mid-afternoon',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Later in the evening',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "I handle stress best when…",
        options: [
            {
                id: 'a',
                text: 'I have a clear routine and plan',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I talk it through with someone I trust',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I move my body or do something physical',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "If I have free time, I naturally gravitate toward…",
        options: [
            {
                id: 'a',
                text: 'Calm, reflective activities',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Social or collaborative activities',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Active, hands-on activities',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "I feel most productive when…",
        options: [
            {
                id: 'a',
                text: 'Everything is quiet and planned (Early Bird)',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I can mix social, solo, and active tasks (Balanced)',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I can tackle tasks later in the day or evening (Night Owl)',
                type: 'C'
            }
        ]
    }
];

const energyResults: { [key: string]: EnergyResult } = {
    'A': {
        type: 'A',
        title: 'The Reflector',
        description: 'You thrive when you have quiet, focused time. You gain energy from planning, observing, and processing internally. To make the most of your energy, schedule tasks that allow deep focus, reflection, or learning independently.',
        subtitle: 'Your energy flows when you honor your need for space and reflection.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Connector',
        description: "You thrive when you're interacting with others. Energy comes from collaboration, conversation, and shared experiences. To maximize your productivity, plan tasks that involve teamwork, brainstorming, or mentoring — and balance with some solo downtime.",
        subtitle: 'Your energy amplifies through connection and shared experiences.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Doer',
        description: "You thrive when you're active and hands-on. You get your energy from movement and taking immediate action. To make the most of your week, focus on tasks where you can dive in and learn by doing, and build in short breaks to recharge.",
        subtitle: 'Your energy ignites through action and physical engagement.',
        color: '#647C90'
    }
};

interface EnergyAuditProps {
    onComplete: (result: EnergyResult) => void;
    onBack?: () => void;
}

export default function EnergyAudit({ onComplete, onBack }: EnergyAuditProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<EnergyResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

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
        const typeCounts = { A: 0, B: 0, C: 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'A' | 'B' | 'C']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'A' | 'B' | 'C'] > typeCounts[b[0] as 'A' | 'B' | 'C'] ? a : b
        )[0];

        const finalResult = energyResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(12);
        scrollToTop();
    };

    const handleContinueToEnergyMaster = () => {
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
                await AsyncStorage.setItem('day1EnergyAuditResult', JSON.stringify(result));
                onComplete(result);
            } catch (error) {
                console.error('Error saving energy audit result to AsyncStorage:', error);
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
                                Welcome to Your Energy Audit
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Understanding your energy patterns is the first step toward creating sustainable balance in your life. Let's discover when you're at your best and how to work with your natural rhythms.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="1"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Energy Audit"
                                journalInstruction="Before we begin, take a moment to reflect: How has your energy been flowing lately?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to your energy reflections later. Ready to uncover your unique energy pattern?
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
                            <Image
                                source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                style={commonStyles.heroImage}
                            />

                            <Text style={commonStyles.introTitle}>
                                Discover Your Energy Pattern
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Your energy isn't constant throughout the day. By understanding your unique rhythm, you can schedule demanding tasks when you're at your peak and restorative activities when you need them most.
                            </Text>

                            <PrimaryButton
                                title="Start Energy Audit"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // The Energy Master Screen
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

                            <Text style={styles.energyMasterTitle}>
                                Here's What You Could Be:
                            </Text>

                            <Text style={styles.energyMasterTitleBold}>
                                The Energy Master
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Energy Master understands that energy flows in cycles and honors their natural rhythm <Text style={{ fontStyle: 'italic' }}>without judgment</Text>.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This approach transforms how you approach your day, allowing you to achieve more with less effort by aligning tasks with your energy peaks and respecting your need for restoration.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Energy Master doesn't fight against low energy periods but uses them strategically for reflection, planning, and gentle activities that replenish rather than drain.
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
                        'How can I structure my day to honor my reflective nature?',
                        'What activities drain my energy the most?',
                        'When do I feel most focused and clear-headed?'
                    ];
                case 'B':
                    return [
                        'How can I build more connection into my routine?',
                        'What social interactions energize me vs. drain me?',
                        'How can I balance social time with necessary solo work?'
                    ];
                case 'C':
                    return [
                        'How can I incorporate more movement into my day?',
                        'What physical activities help me recharge?',
                        'When do I feel most energized and active?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'A':
                    return 'I can honor my reflective energy by...';
                case 'B':
                    return 'I can optimize my social energy by...';
                case 'C':
                    return 'I can channel my active energy by...';
                default:
                    return 'Write your energy plan here...';
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
                            <Text style={styles.takeActionTitle}>Take Action</Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Now that you understand your energy pattern as <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text>, let's create a plan to work with your natural rhythm.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The goal isn't to change who you are, but to become an <Text style={styles.highlightText}>energy master</Text> who knows how to flow with their natural energy cycles.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Create Your Energy Plan</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Reflect on these questions to build your personalized energy strategy:
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
                                pathTag="work-life-balance"
                                day="1"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Energy Audit"
                                journalInstruction="Based on your energy type and reflection questions, create your personalized energy plan below."
                                moodLabel="How energized are you feeling?"
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
                                You've taken a powerful step toward understanding your energy patterns and creating sustainable balance. By working with your natural rhythm instead of against it, you're setting yourself up for long-term success and well-being.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your balanced energy awaits!
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
                                onPress={handleContinueToEnergyMaster}
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
                    <Card style={styles.baseCardEnergy}>
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
    // The Energy Master Screen Styles
    energyMasterTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    energyMasterTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    // Take Action Screen Styles
    takeActionTitle: {
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
    baseCardEnergy: {
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