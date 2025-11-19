import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, PlusCircle, Check, DollarSign } from 'lucide-react-native';
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
        type: 'Cool' | 'Warm' | 'Hot';
    }[];
}

interface SpendingTemperatureResult {
    type: string;
    title: string;
    description: string;
    subtitle: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "You get $50 extra this week. Do you:",
        options: [
            {
                id: 'a',
                text: 'Add it straight to savings',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy dance gear you\'ve been eyeing',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Treat yourself to dinner',
                type: 'Warm'
            }
        ]
    },
    {
        id: 2,
        question: "A friend invites you to brunch, but money's tight. Do you:",
        options: [
            {
                id: 'a',
                text: 'Suggest a lower-cost hang like a coffee walk',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Say yes and put it on your credit card',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Go but order the cheapest thing',
                type: 'Warm'
            }
        ]
    },
    {
        id: 3,
        question: "You're offered a gig that pays less than you hoped. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline (it undervalues your time)',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Accept because it\'s still money',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Negotiate (but feel a little unsure)',
                type: 'Warm'
            }
        ]
    },
    {
        id: 4,
        question: "Your shoes are worn but not destroyed. Do you:",
        options: [
            {
                id: 'a',
                text: 'Keep wearing them until they really need replacing',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Upgrade to a nicer brand',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Ask friends if anyone\'s selling theirs secondhand',
                type: 'Warm'
            }
        ]
    },
    {
        id: 5,
        question: "You want a new outfit for a night out. Do you:",
        options: [
            {
                id: 'a',
                text: 'Borrow or restyle what you own',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Buy it full price (you deserve it)',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Hit the sales rack',
                type: 'Warm'
            }
        ]
    },
    {
        id: 6,
        question: "You get a big paycheck. Do you:",
        options: [
            {
                id: 'a',
                text: 'Put some toward savings right away',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Celebrate with a splurge',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save half and use the other half on something fun',
                type: 'Warm'
            }
        ]
    },
    {
        id: 7,
        question: "Rehearsal runs late. Do you:",
        options: [
            {
                id: 'a',
                text: 'Eat leftovers at home',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Treat yourself to delivery',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Grab cheap takeout',
                type: 'Warm'
            }
        ]
    },
    {
        id: 8,
        question: "You dream of a trip abroad. Do you:",
        options: [
            {
                id: 'a',
                text: 'Plan a backpacking trip that\'s super economical',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Put it on credit so you can go sooner',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Save up and plan ahead',
                type: 'Warm'
            }
        ]
    },
    {
        id: 9,
        question: "You're invited to a wedding out of town. Do you:",
        options: [
            {
                id: 'a',
                text: 'Decline, you can\'t swing it right now',
                type: 'Cool'
            },
            {
                id: 'b',
                text: 'Go but stress about the cost',
                type: 'Hot'
            },
            {
                id: 'c',
                text: 'Use the sinking fund you prepared for travel',
                type: 'Warm'
            }
        ]
    }
];

const spendingTemperatureResults: { [key: string]: SpendingTemperatureResult } = {
    'Cool': {
        type: 'Cool',
        title: 'Cool Spender',
        description: 'You\'re cautious and thoughtful with money, sometimes holding back too much. Remember: spending on things that bring joy or growth is part of a healthy budget.',
        subtitle: 'You prioritize saving but might benefit from some mindful spending.',
        color: '#6B9BD1'
    },
    'Warm': {
        type: 'Warm',
        title: 'Warm Spender',
        description: 'You make intentional choices... sometimes saving, sometimes spending. With a little structure, you\'ll feel even more confident.',
        subtitle: 'You balance saving and spending with thoughtful choices.',
        color: '#928490'
    },
    'Hot': {
        type: 'Hot',
        title: 'Hot Spender',
        description: 'You lean toward spending in the moment. That passion is great, but with more planning you can enjoy the fun *and* still hit your goals.',
        subtitle: 'You enjoy spending but could benefit from more planning.',
        color: '#928490'
    }
};

interface SpendingTemperatureCheckProps {
    onComplete: (result: SpendingTemperatureResult) => void;
    onBack?: () => void;
}

export default function SpendingTemperatureCheck({ onComplete, onBack }: SpendingTemperatureCheckProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<SpendingTemperatureResult | null>(null);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('money-mindsets');

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
        const typeCounts = { 'Cool': 0, 'Warm': 0, 'Hot': 0 };

        Object.values(finalAnswers).forEach(answer => {
            typeCounts[answer as 'Cool' | 'Warm' | 'Hot']++;
        });

        const dominantType = Object.entries(typeCounts).reduce((a, b) =>
            typeCounts[a[0] as 'Cool' | 'Warm' | 'Hot'] > typeCounts[b[0] as 'Cool' | 'Warm' | 'Hot'] ? a : b
        )[0];

        const finalResult = spendingTemperatureResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(11);
        scrollToTop();
    };

    const handleContinueToMindfulSpender = () => {
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
                await AsyncStorage.setItem('day2SpendingTemperatureResult', JSON.stringify(result));
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
                                Welcome to Your Money Mindset Journey
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Understanding your relationship with money is the first step toward financial confidence. Let's explore your spending habits in a judgment-free way.
                            </Text>

                            <JournalEntrySection
                                pathTag="budgeting-for-dancers"
                                day="2"
                                category="finance"
                                pathTitle="Budgeting For Dancers"
                                dayTitle="Know Your Value"
                                journalInstruction="Before we begin, take a moment to reflect: What's your current relationship with money like?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to your reflections later. Ready to discover your spending temperature?
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
                                What's Your Spending Temperature?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                How do you feel about spending money? Let's check your spending temperature and see if you tend to run hot (spend easily), cold (hold back), or warm (somewhere in between). Understanding your natural tendencies helps you make more intentional financial choices.
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

    // The Mindful Spender Screen
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

                            <Text style={styles.mindfulTitle}>
                                Here's What You Could Be:
                            </Text>

                            <Text style={styles.mindfulTitleBold}>
                                The Mindful Spender
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Mindful Spender is someone who makes financial decisions with both intention and awareness. They understand that money is a tool for creating the life they want, not something to fear or worship.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This spender balances present enjoyment with future security, making conscious choices that align with their values and goals. They give themselves permission to spend on what truly matters while staying grounded in their financial reality.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Mindful Spender doesn't let emotions drive financial decisions. Instead, they use awareness to create healthy spending habits that support both their current needs and future aspirations.
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
                case 'Cool':
                    return [
                        'Is it serving me to be the Cool Spender?',
                        'How can I allow myself to enjoy money more while still being responsible?',
                        'What would mindful spending look like for me?'
                    ];
                case 'Warm':
                    return [
                        'Is it serving me to be the Warm Spender?',
                        'How can I bring more intention to my spending decisions?',
                        'What systems would help me feel more confident with money?'
                    ];
                case 'Hot':
                    return [
                        'Is it serving me to be the Hot Spender?',
                        'How can I create more balance between enjoying money and planning for the future?',
                        'What small changes could help me feel more in control?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'Cool':
                    return 'I can become more mindful by allowing myself to...';
                case 'Warm':
                    return 'I can enhance my mindful spending by...';
                case 'Hot':
                    return 'I can create better balance by...';
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
                                Do you feel that <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> describes you? Whatever thoughts come up, acknowledge them without judgment.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Now, how can you cultivate the <Text style={styles.highlightText}>mindful spender</Text> within?
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Let's explore how to create a healthier relationship with money through mindful awareness.
                            </Text>

                            {/* Reflection Section */}
                            <View style={styles.reflectionSection}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                    <View style={styles.sectionDivider} />
                                </View>

                                <Text style={styles.reflectionInstruction}>
                                    Reflect on these questions about your money mindset:
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
                                pathTag="budgeting-for-dancers"
                                day="2"
                                category="finance"
                                pathTitle="Budgeting For Dancers"
                                dayTitle="Know Your Value"
                                journalInstruction="Write your reflections as a journal entry below."
                                moodLabel="How are you feeling about money?"
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
                                You've taken an important step toward understanding your money mindset. By recognizing your spending temperature, you're building awareness that will help you make more intentional financial choices.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your mindful financial future awaits!
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
                                onPress={handleContinueToMindfulSpender}
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
                    <Card style={styles.baseCardSpending}>
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
    // The Mindful Spender Screen Styles
    mindfulTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    mindfulTitleBold: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    // takeaction Screen Styles
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
    baseCardSpending: {
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