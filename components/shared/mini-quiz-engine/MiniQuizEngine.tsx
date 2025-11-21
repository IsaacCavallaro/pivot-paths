import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { Check } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { MiniQuizEngineProps, QuizResult } from '@/types/miniQuizEngine';

export default function MiniQuizEngine({
    onComplete,
    onBack,
    imageSource,
    totalQuestions,
    quizQuestions,
    quizResults,
    baseCardStyle,
    welcomeScreen,
    quizIntroScreen,
    mainResultScreen,
    takeActionScreen,
    finalCompletionScreen,
}: MiniQuizEngineProps) {
    const [currentScreen, setCurrentScreen] = useState(0); // 0: Welcome, 1: Quiz Intro, 2+: Questions, Result Screen Index (totalQuestions + 2), Take Action Index (totalQuestions + 3), Final Index (totalQuestions + 4)
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [result, setResult] = useState<QuizResult | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    const resultScreenIndex = totalQuestions + 2;
    const mainResultScreenIndex = totalQuestions + 2;
    const takeActionScreenIndex = totalQuestions + 3;
    const finalCompletionScreenIndex = totalQuestions + 4;

    useEffect(() => {
        scrollToTop();
    }, [currentScreen]);

    const handleScreenChange = useCallback(async (newScreen: number) => {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        setCurrentScreen(newScreen);
        scrollToTop();
        setIsTransitioning(false);
    }, []);

    const handleBackPress = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const goBack = useCallback(() => {
        if (currentScreen === 0) {
            handleBackPress();
        } else if (currentScreen === 1) {
            handleScreenChange(0);
        } else if (currentScreen >= 2 && currentScreen < mainResultScreenIndex) {
            setCurrentScreen(currentScreen - 1);
            setSelectedOption(null);
            scrollToTop();
        } else if (currentScreen === mainResultScreenIndex) {
            handleScreenChange(currentScreen - 1); // Back to last question
        } else if (currentScreen === takeActionScreenIndex) {
            handleScreenChange(mainResultScreenIndex);
        } else if (currentScreen === finalCompletionScreenIndex) {
            handleScreenChange(takeActionScreenIndex);
        }
    }, [currentScreen, mainResultScreenIndex, takeActionScreenIndex, finalCompletionScreenIndex, handleScreenChange, handleBackPress]);

    const handleAnswer = useCallback((optionId: string, optionType: string) => {
        setSelectedOption(optionId);
        const questionIndex = currentScreen - 2;
        const newAnswers = { ...answers, [questionIndex]: optionType };
        setAnswers(newAnswers);
    }, [currentScreen, answers]);

    const calculateResult = useCallback(() => {
        const typeCounts: { [key: string]: number } = {};
        Object.values(quizResults).forEach(res => typeCounts[res.type] = 0); // Initialize counts

        Object.values(answers).forEach(answer => {
            if (typeCounts[answer] !== undefined) {
                typeCounts[answer]++;
            }
        });

        let dominantType = '';
        let maxCount = -1;

        for (const type in typeCounts) {
            if (typeCounts[type] > maxCount) {
                maxCount = typeCounts[type];
                dominantType = type;
            }
        }

        const finalResult = quizResults[dominantType];
        if (!finalResult) {
            console.error(`Error: Could not find quiz result for dominant type '${dominantType}'. Check quizResults prop. Answers: ${JSON.stringify(answers)}, Quiz Results: ${JSON.stringify(quizResults)}`);
            // Attempt to recover or provide a generic error, or simply stop
            // For now, returning to prevent crash, but this implies data mismatch.
            return;
        }
        setResult(finalResult);
        handleScreenChange(mainResultScreenIndex);
    }, [answers, quizResults, mainResultScreenIndex, handleScreenChange]);

    const handleContinue = useCallback(async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        if (currentScreen < totalQuestions + 1) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
            scrollToTop();
        } else {
            calculateResult();
        }
        setIsTransitioning(false);
    }, [selectedOption, isTransitioning, currentScreen, totalQuestions, calculateResult]);

    const handleComplete = useCallback(() => {
        if (result) {
            onComplete(result);
        }
    }, [result, onComplete]);

    const openYouTubeVideo = useCallback(async (videoId?: string) => {
        if (!videoId) return;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        try {
            const supported = await Linking.canOpenURL(youtubeUrl);
            if (supported) {
                await Linking.openURL(youtubeUrl);
            } else {
                console.log("YouTube app not available or URL is invalid:", youtubeUrl);
            }
        } catch (error) {
            console.error("Error opening YouTube video:", error);
        }
    }, []);

    // Screen rendering logic
    // Welcome Screen (0)
    if (currentScreen === 0) {
        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={handleBackPress} />
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
                                {imageSource && (
                                    <Image source={{ uri: imageSource }} style={commonStyles.heroImage} />
                                )}
                            </View>
                            <Text style={commonStyles.introTitle}>{welcomeScreen.title}</Text>
                            {welcomeScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>{desc}</Text>
                            ))}
                            <JournalEntrySection {...welcomeScreen.journalSectionProps} />
                            <View style={styles.welcomeHighlight}>
                                <Text style={styles.welcomeHighlightText}>{welcomeScreen.welcomeHighlightText}</Text>
                            </View>
                            <PrimaryButton title={welcomeScreen.buttonText} onPress={() => handleScreenChange(1)} disabled={isTransitioning} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Quiz Intro Screen (1)
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
                                {imageSource && (
                                    <Image source={{ uri: imageSource }} style={commonStyles.heroImage} />
                                )}
                            </View>
                            <Text style={commonStyles.introTitle}>{quizIntroScreen.title}</Text>
                            {quizIntroScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>{desc}</Text>
                            ))}
                            <PrimaryButton title={quizIntroScreen.buttonText} onPress={() => handleScreenChange(2)} disabled={isTransitioning} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Main Result Screen (after quiz completion)
    if (currentScreen === mainResultScreenIndex && result) {
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
                                {result.subtitle && (
                                    <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                                )}
                                {result.challenge && (
                                    <Text style={styles.resultChallenge}>{result.challenge}</Text>
                                )}
                            </View>
                            <PrimaryButton
                                title={mainResultScreen.buttonText}
                                onPress={() => handleScreenChange(takeActionScreenIndex)}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Take Action Screen
    if (currentScreen === takeActionScreenIndex && result) {
        const descriptionsWithResult = takeActionScreen.descriptions(result.title);
        const videoId = takeActionScreen.videoLink ? takeActionScreen.videoLink.split('v=')[1] || takeActionScreen.videoLink.split('/').pop() : undefined;

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
                            <Text style={styles.takeactionTitle}>{takeActionScreen.title}</Text>
                            {descriptionsWithResult.map((desc, index) => (
                                <Text key={index} style={commonStyles.reflectionDescription}>{desc}</Text>
                            ))}

                            {/* Reflection Section */}
                            {(result.reflectionQuestions && result.reflectionQuestions.length > 0) && (
                                <View style={styles.reflectionSection}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>Time for Reflection</Text>
                                        <View style={styles.sectionDivider} />
                                    </View>
                                    <Text style={styles.reflectionInstruction}>
                                        Consider these questions as you reflect on your curiosity style:
                                    </Text>
                                    <View style={styles.reflectionQuestionsContainer}>
                                        {result.reflectionQuestions.map((question, index) => (
                                            <View key={index} style={styles.reflectionQuestionCard}>
                                                <View style={styles.questionNumber}>
                                                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                                                </View>
                                                <Text style={styles.reflectionQuestion}>{question}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {videoId && (
                                <View style={styles.videoSection}>
                                    <View style={styles.videoHeader}>
                                        <Text style={styles.videoTitle}>Watch & Learn</Text>
                                    </View>
                                    <View style={styles.videoContainer}>
                                        <View style={styles.youtubePlayer}>
                                            <YoutubePlayer
                                                height={140}
                                                play={false}
                                                videoId={videoId}
                                                webViewStyle={styles.youtubeWebView}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            <JournalEntrySection
                                {...takeActionScreen.journalSectionProps}
                                placeholder={result.journalPlaceholder}
                            />
                            <PrimaryButton
                                title={takeActionScreen.buttonText}
                                onPress={() => handleScreenChange(finalCompletionScreenIndex)}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Completion Screen
    if (currentScreen === finalCompletionScreenIndex) {
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
                            <Text style={styles.congratulationsTitle}>{finalCompletionScreen.title}</Text>
                            {finalCompletionScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.reflectionDescription}>{desc}</Text>
                            ))}
                            <Text style={styles.congratulationsClosing}>{finalCompletionScreen.closingText}</Text>
                            <PrimaryButton
                                title={finalCompletionScreen.buttonText}
                                onPress={handleComplete}
                                disabled={isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Question Screens
    const question = quizQuestions[currentScreen - 2];
    const progress = ((currentScreen - 1) / totalQuestions) * 100;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentScreen - 1} of ${totalQuestions}`}
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
                    <Card style={baseCardStyle || commonStyles.baseCard}>
                        <Text style={styles.questionText}>{question.question}</Text>
                        <View style={styles.optionsContainer}>
                            {question.options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
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
                            ))}
                        </View>
                        <PrimaryButton
                            title={currentScreen < totalQuestions + 1 ? 'Continue' : 'See Results'}
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