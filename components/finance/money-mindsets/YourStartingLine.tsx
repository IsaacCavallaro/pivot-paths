import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, TextInput, Alert } from 'react-native';
import { ChevronRight, ArrowLeft, DollarSign, Check } from 'lucide-react-native';
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
        emoji?: string;
        type: 'A' | 'B' | 'C';
    }[];
}

interface FinancialResult {
    type: string;
    title: string;
    description: string;
    color: string;
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "When you think about money, what's your first reaction?",
        options: [
            {
                id: 'a',
                text: 'Stress and avoidance',
                emoji: '',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Neutral, I don\'t think about it much',
                emoji: '',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Motivation and possibility',
                emoji: '',
                type: 'C'
            }
        ]
    },
    {
        id: 2,
        question: "How often do you check your bank account?",
        options: [
            {
                id: 'a',
                text: 'Rarely, I\'d rather not look',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A few times a month',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Weekly or daily',
                type: 'C'
            }
        ]
    },
    {
        id: 3,
        question: "Do you know how much you spend in an average week?",
        options: [
            {
                id: 'a',
                text: 'Not really, I just hope it balances',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Sort of, I have a ballpark idea',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I track it or budget regularly',
                type: 'C'
            }
        ]
    },
    {
        id: 4,
        question: "Savings… where are you at?",
        options: [
            {
                id: 'a',
                text: '$0 or close to it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'A little, but not consistent',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I save regularly and have a cushion',
                type: 'C'
            }
        ]
    },
    {
        id: 5,
        question: "When you get paid for gigs, what happens next?",
        options: [
            {
                id: 'a',
                text: 'Money disappears before I know it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I cover essentials first, then figure the rest out',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I intentionally allocate it (savings, bills, fun, etc.)',
                type: 'C'
            }
        ]
    },
    {
        id: 6,
        question: "Negotiating pay makes me feel…",
        options: [
            {
                id: 'a',
                text: 'Terrified, I\'d never ask',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Nervous, but I might try if I had a script',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Confident, I know my worth',
                type: 'C'
            }
        ]
    },
    {
        id: 7,
        question: "If a $500 emergency bill came up, what would you do?",
        options: [
            {
                id: 'a',
                text: 'Panic, I\'d have no idea',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Put it on a credit card or ask for help',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Pay from savings or planned funds',
                type: 'C'
            }
        ]
    },
    {
        id: 8,
        question: "How do you feel about dancers and money?",
        options: [
            {
                id: 'a',
                text: 'We\'re doomed to be underpaid',
                type: 'A'
            },
            {
                id: 'b',
                text: 'It\'s possible to earn more, but I don\'t see myself making a ton of money',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Dance skills are valuable and I can leverage them',
                type: 'C'
            }
        ]
    },
    {
        id: 9,
        question: "Do you set financial goals?",
        options: [
            {
                id: 'a',
                text: 'Never, feels pointless',
                type: 'A'
            },
            {
                id: 'b',
                text: 'Occasionally, but I don\'t stick with them',
                type: 'B'
            },
            {
                id: 'c',
                text: 'Yes, I set and track them',
                type: 'C'
            }
        ]
    },
    {
        id: 10,
        question: "When you picture your future, what role does money play?",
        options: [
            {
                id: 'a',
                text: 'I avoid thinking about it',
                type: 'A'
            },
            {
                id: 'b',
                text: 'I hope to have enough, but I\'m unsure how',
                type: 'B'
            },
            {
                id: 'c',
                text: 'I see money as a tool for freedom and choices',
                type: 'C'
            }
        ]
    }
];

const financialResults: { [key: string]: FinancialResult } = {
    'A': {
        type: 'A',
        title: 'The Avoider',
        description: 'You\'ve been avoiding money because it feels overwhelming which is totally normal in dance culture. But avoidance costs headroom. Your next step isn\'t a complicated budget… it\'s simply looking into it. Build awareness with tiny, shame-free check-ins. Once you face your numbers, you\'ll start to feel lighter.',
        color: '#928490'
    },
    'B': {
        type: 'B',
        title: 'The Juggler',
        description: 'You\'ve got some systems, but they\'re patchy. You pay bills and try to save, but it\'s inconsistent, so money still feels stressful. The good news? You\'re already halfway there. With a bit more structure, you\'ll free up huge mental space.',
        color: '#928490'
    },
    'C': {
        type: 'C',
        title: 'The Builder',
        description: 'You\'ve already done some work with money. You track, plan, or save regularly — and now it\'s time to level up. For you, headroom comes from asking for more (negotiating, raising rates, growing income streams). You\'re ready to use money as a tool, not just survival fuel.',
        color: '#928490'
    }
};

interface YourStartingLineProps {
    onComplete: (result: FinancialResult) => void;
    onBack?: () => void;
}

export default function YourStartingLine({ onComplete, onBack }: YourStartingLineProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<FinancialResult | null>(null);
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

        const finalResult = financialResults[dominantType];
        setResult(finalResult);
        setCurrentScreen(12);
        scrollToTop();
    };

    const handleContinueToFinancialFreedom = () => {
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
                await AsyncStorage.setItem('day2MoneyMindsetsResult', JSON.stringify(result));
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
                                Welcome to Your Money Journey
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Taking this first step towards understanding your money mindset is something to be truly proud of. It takes courage to look at your financial habits and explore what might be holding you back from financial freedom.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Know Your Value"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How do you feel about money right now?"
                                moodLabel=""
                                saveButtonText="Add to Journal"
                            />

                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>
                                    We'll come back to how you're feeling a bit later. But now, are you ready to discover your financial starting line?
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
                                What's your financial starting line?
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                Before you can move forward with money, it helps to know where you're standing. Answer these 10 quick questions to uncover your money starting line. No shame, just awareness. Let's go.
                            </Text>

                            <PrimaryButton
                                title="Start Quiz"
                                onPress={handleStartQuiz}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // The Financially Free Screen
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

                            <Text style={styles.expansiveTitle}>
                                Here's What You Could Be:
                            </Text>

                            <Text style={styles.expansiveTitleBold}>
                                The Financially Free
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Financially Free dancer is someone who sees money as a tool for creating the life they want <Text style={{ fontStyle: 'italic' }}>without stress or shame</Text>.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                This mindset understands that financial awareness brings freedom, not restriction. They use their dance discipline to create consistent financial habits that support their artistic journey and future goals.
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                The Financially Free dancer doesn't avoid money conversations or opportunities. Instead, they see financial literacy as another skill to master, giving them more choices and reducing stress in their dance career.
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
                        'Is it serving me to be The Avoider?',
                        'What would change if I faced my financial situation without shame?',
                        'What small step can I take today to build financial awareness?'
                    ];
                case 'B':
                    return [
                        'Is it serving me to be The Juggler?',
                        'How can I create more consistency in my financial habits?',
                        'What system would help me feel more in control?'
                    ];
                case 'C':
                    return [
                        'Is it serving me to be The Builder?',
                        'How can I leverage my current financial habits to create more opportunities?',
                        'What financial goal would excite me to work towards?'
                    ];
                default:
                    return [];
            }
        };

        const getJournalPlaceholder = () => {
            switch (result.type) {
                case 'A':
                    return 'I can start building financial awareness by...';
                case 'B':
                    return 'I can create more consistency by...';
                case 'C':
                    return 'I can leverage my current habits to...';
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
                                Do you feel that <Text style={styles.highlightText}>{result.title.toLowerCase()}</Text> describes you? Whatever's coming up for you, go with it. We got you!
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Now, how can you unlock the <Text style={styles.highlightText}>financially free</Text> mindset within?!
                            </Text>

                            <Text style={commonStyles.reflectionDescription}>
                                Let's explore how to transform your relationship with money starting today.
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
                                            videoId={'ZsvNvXLtcC4'} // Replace with actual financial mindset video ID
                                            webViewStyle={styles.youtubeWebView}
                                        />
                                    </View>
                                </View>
                            </View>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Know Your Value"
                                journalInstruction="As you're reflecting, write your thoughts as a journal entry below."
                                moodLabel="How are you feeling about money now?"
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
                                You've taken the first step toward becoming Financially Free. By understanding your current money mindset, you're already opening yourself up to new financial possibilities and reducing money-related stress.
                            </Text>

                            <Text style={styles.congratulationsClosing}>
                                Your financially free future awaits!
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

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinueToFinancialFreedom}
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
                                                <Text style={[
                                                    styles.optionText,
                                                    selectedOption === option.id && styles.optionTextSelected
                                                ]}>
                                                    {option.emoji ? `${option.emoji} ` : ''}{option.text}
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
    // The Financially Free Screen Styles
    expansiveTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    expansiveTitleBold: {
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