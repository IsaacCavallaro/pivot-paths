import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { X, Check, Users, Award, Gift, ChevronRight, Target } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { RoleplayPromptEngineProps, RoleplayScenarioContent } from '@/types/roleplayPromptEngine';

const { width, height } = Dimensions.get('window');

export default function RoleplayPromptEngine({
    onComplete,
    onBack,
    imageSource,
    engineTitle,
    engineInstructions,
    scenarios,
    welcomeScreen,
    engineIntroScreen,
    reflectionScreen,
    finalScreen,
    flowType = 'standard',
}: RoleplayPromptEngineProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
    const [roleplayStep, setRoleplayStep] = useState(0);
    const [selectedChoices, setSelectedChoices] = useState<{ [key: number]: number }>({});
    const [currentResultIndex, setCurrentResultIndex] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    useEffect(() => {
        scrollToTop();
    }, [currentScreen, roleplayStep, currentScenarioIndex]);

    const handleBackPress = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const goBack = () => {
        if (flowType === 'tryItOn') {
            handleTryItOnBack();
        } else if (flowType === 'mustHaves') {
            handleMustHavesBack();
        } else if (flowType === 'simpleChoice') {
            handleSimpleChoiceBack();
        } else {
            handleStandardBack();
        }
    };

    const handleStandardBack = () => {
        if (currentScreen === 0 && welcomeScreen) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            if (roleplayStep > 0) {
                setRoleplayStep(prev => prev - 1);
                if (roleplayStep === 1) {
                    setSelectedChoiceIndex(null);
                }
            } else if (currentScenarioIndex > 0) {
                setCurrentScenarioIndex(prev => prev - 1);
                setRoleplayStep(3);
                setSelectedChoiceIndex(null);
            } else if (engineIntroScreen) {
                setCurrentScreen(0);
            } else {
                setCurrentScreen(-1);
            }
        } else if (currentScreen === 2) {
            setCurrentScreen(1);
            setRoleplayStep(3);
        } else if (currentScreen === 3) {
            setCurrentScreen(2);
        } else if (currentScreen === -1) {
            handleBackPress();
        }
        scrollToTop();
    };

    const handleTryItOnBack = () => {
        if (currentScreen === -1) {
            handleBackPress();
        } else if (currentScreen === 0) {
            // Engine intro → Welcome
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            // First scenario → Engine intro
            setCurrentScreen(0);
        } else if (currentScreen === 2) {
            // First choice → First scenario
            setCurrentScreen(1);
            setSelectedChoices(prev => {
                const newChoices = { ...prev };
                delete newChoices[1];
                return newChoices;
            });
        } else if (currentScreen === 3) {
            // First response → First choice
            setCurrentScreen(2);
        } else if (currentScreen === 4) {
            // Second question → First response
            setCurrentScreen(3);
        } else if (currentScreen === 5) {
            // Second choice → Second question
            setCurrentScreen(4);
            setSelectedChoices(prev => {
                const newChoices = { ...prev };
                delete newChoices[2];
                return newChoices;
            });
        } else if (currentScreen === 6) {
            // Second response → Second choice
            setCurrentScreen(5);
        } else if (currentScreen === 7) {
            // Reflection → Second response
            if (currentScenarioIndex > 0) {
                setCurrentScenarioIndex(prev => prev - 1);
                setCurrentScreen(6);
            } else {
                setCurrentScreen(6);
            }
        } else if (currentScreen === 8) {
            // Final reflection → Last scenario reflection
            setCurrentScreen(7);
            setCurrentScenarioIndex(scenarios.length - 1);
        }
        scrollToTop();
    };

    const handleMustHavesBack = () => {
        if (currentScreen === -1) {
            handleBackPress();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen >= 1 && currentScreen <= 8) {
            if (currentScenarioIndex > 0) {
                setCurrentScenarioIndex(prev => prev - 1);
                setCurrentScreen(currentScreen - 1);
            } else {
                setCurrentScreen(0);
            }
        } else if (currentScreen === 9) {
            setCurrentScreen(8);
            setCurrentScenarioIndex(scenarios.length - 1);
        } else if (currentScreen === 10) {
            setCurrentScreen(9);
            setCurrentResultIndex(0);
        } else if (currentScreen === 11) {
            setCurrentScreen(10);
        }
        scrollToTop();
    };

    const handleSimpleChoiceBack = () => {
        if (currentScreen === -1) {
            handleBackPress();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen === 2) {
            setCurrentScreen(1);
        } else if (currentScreen === 3) {
            setCurrentScreen(2);
            setSelectedChoiceIndex(null);
        } else if (currentScreen === 4) {
            setCurrentScreen(3);
        }
        scrollToTop();
    };

    const startRoleplay = () => {
        setCurrentScreen(1);
        setCurrentScenarioIndex(0);
        setRoleplayStep(0);
        setSelectedChoiceIndex(null);
        setSelectedChoices({});
    };

    const handleChoiceSelect = (choiceIndex: number) => {
        setSelectedChoiceIndex(choiceIndex);
    };

    const handleTryItOnChoiceSelect = (questionNumber: number, choiceNumber: number) => {
        setSelectedChoices(prev => ({
            ...prev,
            [questionNumber]: choiceNumber
        }));
    };

    const handleMustHavesChoiceSelect = (choiceNumber: number) => {
        const newChoices = { ...selectedChoices, [currentScenarioIndex + 1]: choiceNumber };
        setSelectedChoices(newChoices);
    };

    const handleSimpleChoiceSelect = (choiceIndex: number) => {
        setSelectedChoiceIndex(choiceIndex);
    };

    const handleContinueRoleplay = () => {
        if (flowType === 'tryItOn') {
            handleTryItOnContinue();
        } else if (flowType === 'mustHaves') {
            handleMustHavesContinue();
        } else if (flowType === 'simpleChoice') {
            handleSimpleChoiceContinue();
        } else {
            handleStandardContinue();
        }
    };

    const handleStandardContinue = () => {
        if (currentScreen === 1) {
            if (roleplayStep === 0) {
                if (selectedChoiceIndex !== null) {
                    setRoleplayStep(1);
                }
            } else if (roleplayStep === 1) {
                setRoleplayStep(2);
            } else if (roleplayStep === 2) {
                setRoleplayStep(3);
            } else if (roleplayStep === 3) {
                if (currentScenarioIndex < scenarios.length - 1) {
                    setCurrentScenarioIndex(prev => prev + 1);
                    setRoleplayStep(0);
                    setSelectedChoiceIndex(null);
                } else {
                    setCurrentScreen(2);
                }
            }
        } else {
            if (currentScreen === -1 && (engineIntroScreen || currentScenarioIndex >= 0)) {
                setCurrentScreen(engineIntroScreen ? 0 : 1);
            } else if (currentScreen === 0 && engineIntroScreen) {
                startRoleplay();
            } else if (currentScreen === 2) {
                setCurrentScreen(3);
            } else if (currentScreen === 3) {
                onComplete();
            }
        }
        scrollToTop();
    };

    const handleTryItOnContinue = () => {
        if (currentScreen === -1) {
            // Welcome → Engine Intro
            setCurrentScreen(0);
        } else if (currentScreen === 0) {
            // Engine Intro → First Scenario
            startRoleplay();
        } else if (currentScreen === 1) {
            // Scenario Intro → First Choice
            setCurrentScreen(2);
        } else if (currentScreen === 2) {
            // First Choice → First Response
            if (selectedChoices[1] !== undefined) {
                setCurrentScreen(3);
            }
        } else if (currentScreen === 3) {
            // First Response → Second Question
            setCurrentScreen(4);
        } else if (currentScreen === 4) {
            // Second Question → Second Choice
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            // Second Choice → Second Response
            if (selectedChoices[2] !== undefined) {
                setCurrentScreen(6);
            }
        } else if (currentScreen === 6) {
            // Second Response → Scenario Reflection
            setCurrentScreen(7);
        } else if (currentScreen === 7) {
            // Scenario Reflection → Next Scenario or Final Reflection
            if (currentScenarioIndex < scenarios.length - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
                setSelectedChoices({});
                setCurrentScreen(1); // Back to scenario intro for next scenario
            } else {
                setCurrentScreen(8); // All scenarios complete → Final reflection
            }
        } else if (currentScreen === 8) {
            // Final Reflection → Complete
            onComplete();
        }
        scrollToTop();
    };

    const handleMustHavesContinue = () => {
        if (currentScreen === -1) {
            setCurrentScreen(0); // Welcome → Choice screens
        } else if (currentScreen >= 0 && currentScreen <= 8) {
            // Choice screens
            if (currentScenarioIndex < scenarios.length - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
                setCurrentScreen(currentScreen + 1);
            } else {
                setCurrentScreen(9); // All choices complete → Results overview
            }
        } else if (currentScreen === 9) {
            setCurrentScreen(10); // Results overview → Results screens
        } else if (currentScreen === 10) {
            // Results screens
            if (currentResultIndex < getPersonalizedResults().length - 1) {
                setCurrentResultIndex(prev => prev + 1);
            } else {
                setCurrentScreen(11); // All results shown → Final summary
                setCurrentResultIndex(0);
            }
        } else if (currentScreen === 11) {
            onComplete();
        }
        scrollToTop();
    };

    const handleSimpleChoiceContinue = () => {
        if (currentScreen === -1) {
            setCurrentScreen(0); // Welcome → Scenario Intro
        } else if (currentScreen === 0) {
            setCurrentScreen(1); // Scenario Intro → Choices
        } else if (currentScreen === 1) {
            setCurrentScreen(2); // Choices → Response
        } else if (currentScreen === 2) {
            // Response → Next scenario or final
            if (currentScenarioIndex < scenarios.length - 1) {
                setCurrentScenarioIndex(currentScenarioIndex + 1);
                setSelectedChoiceIndex(null);
                setCurrentScreen(1); // Back to scenario intro for next scenario
            } else {
                setCurrentScreen(4); // All scenarios complete → Final screen
            }
        } else if (currentScreen === 4) {
            onComplete();
        }
        scrollToTop();
    };

    const handleNextResult = () => {
        if (currentResultIndex < getPersonalizedResults().length - 1) {
            setCurrentResultIndex(currentResultIndex + 1);
        } else {
            setCurrentScreen(11);
            setCurrentResultIndex(0);
        }
        scrollToTop();
    };

    // Generate personalized results based on user choices - same as original
    const getPersonalizedResults = () => {
        const results = [];

        // Spotify vs Gym
        if (selectedChoices[1] === 1) {
            results.push("Spotify Premium is non-negotiable for you, allowing you to stream with no ads.");
        } else {
            results.push("staying fit and healthy with a gym membership is essential for you.");
        }

        // Coffee vs Streaming
        if (selectedChoices[2] === 1) {
            results.push("Your daily joy comes from small treats like your coffee habit, a ritual you protect.");
        } else {
            results.push("You value entertainment and relaxation, choosing a full suite of streaming subscriptions over daily coffees. You'd rather create a cozy night in than a cafe trip.");
        }

        // Groceries vs Dining & Dance vs Massage
        const foodChoice = selectedChoices[3] === 1 ? "cooking at home with your organic groceries" : "dining out at quality restaurants";
        const wellnessChoice = selectedChoices[4] === 1 ? "dance classes" : "massages";
        results.push(`You love ${foodChoice}. And you invest in your body through regular ${wellnessChoice}, knowing it's essential for your well-being.`);

        // Clothes vs Travel
        if (selectedChoices[5] === 1) {
            results.push("You believe in looking the part and presenting yourself well, investing in new clothes over a distant travel fund.");
        } else {
            results.push("You clearly value experiences, choosing to put money toward your travel fund over updating your wardrobe.");
        }

        // Savings vs Investments & Charity vs Gifts
        const financeChoice = selectedChoices[6] === 1 ? "consistently contributing to your savings account" : "putting money into investments for potential future gains";
        const givingChoice = selectedChoices[8] === 1 ? "charity donations" : "thoughtful gifts";
        results.push(`You're building a foundation for the future, ${financeChoice}. You also believe in supporting your community and loved ones, setting aside money for ${givingChoice}.`);

        // Phone vs Concerts & Beauty vs Home
        const splurgeChoice = selectedChoices[7] === 1 ? "a phone upgrade" : "concert tickets";
        const selfCareChoice = selectedChoices[9] === 1 ? "hair and nail appointments" : "home decor";
        results.push(`And you haven't forgotten how to live in the moment. You splurge on ${splurgeChoice} and treat yourself to ${selfCareChoice} to create a space that feels like you.`);

        return results;
    };

    const getVideoId = (url: string): string | null => {
        if (!url) return null;

        // Comprehensive regex that handles:
        // - https://www.youtube.com/shorts/VIDEO_ID
        // - https://youtu.be/VIDEO_ID
        // - https://www.youtube.com/watch?v=VIDEO_ID
        // - https://www.youtube.com/embed/VIDEO_ID
        // - Shortened formats, etc.
        const regExp =
            /^.*(youtu\.be\/|youtube\.com\/(watch\?.*v=|embed\/|shorts\/|v\/))([^#&?]*).*/;

        const match = url.match(regExp);
        const candidate = match && match[3] ? match[3] : null;

        // YouTube video IDs are always 11 characters
        if (candidate && candidate.length === 11) {
            return candidate;
        }

        return null;
    };

    const openVideoModal = useCallback(() => {
        if (finalScreen.videoLink || reflectionScreen.videoLink) {
            setShowVideoModal(true);
            setIsPlaying(true);
        }
    }, [finalScreen.videoLink, reflectionScreen.videoLink]);

    const closeVideoModal = useCallback(() => {
        setIsPlaying(false);
        setShowVideoModal(false);
    }, []);

    const openYouTubeShort = useCallback(async (videoLink: string) => {
        if (!videoLink) return;
        try {
            const supported = await Linking.canOpenURL(videoLink);
            if (supported) {
                await Linking.openURL(videoLink);
            } else {
                openVideoModal();
            }
        } catch (error) {
            console.log("Error opening YouTube:", error);
            openVideoModal();
        }
    }, [openVideoModal]);

    // Mock interview handler for TryItOn flow
    const handleMockInterviewOpen = () => {
        Linking.openURL('https://pivotfordancers.com/services/mock-interviews/');
    };

    // SimpleChoice Flow Screens
    if (flowType === 'simpleChoice') {
        const currentScenario = scenarios[currentScenarioIndex];

        // Welcome Screen
        if (currentScreen === -1) {
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
                                        <Image
                                            source={{ uri: imageSource }}
                                            style={commonStyles.heroImage}
                                        />
                                    )}
                                </View>

                                <Text style={commonStyles.introTitle}>{welcomeScreen.title}</Text>
                                {welcomeScreen.descriptions.map((desc, index) => (
                                    <Text key={index} style={commonStyles.introDescription}>
                                        {desc}
                                    </Text>
                                ))}

                                <PrimaryButton title={welcomeScreen.buttonText} onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Scenario Intro Screen
        if (currentScreen === 0) {
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
                                <Text style={styles.scenarioTitle}>Scenario {currentScenarioIndex + 1} of {scenarios.length}</Text>

                                <Text style={styles.scenarioText}>
                                    {currentScenario.scenarioText}
                                </Text>

                                <PrimaryButton title="See Their Answers" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Choices Screen
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
                                <Text style={styles.choicesTitle}>Who would you hire?</Text>

                                <View style={styles.choicesContainer}>
                                    {currentScenario.choices?.map((option, index) => (
                                        <TouchableOpacity
                                            key={option.id || index}
                                            style={[
                                                styles.choiceButton,
                                                selectedChoiceIndex === index && styles.choiceButtonSelected
                                            ]}
                                            onPress={() => handleSimpleChoiceSelect(index)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.choiceContent}>
                                                {selectedChoiceIndex === index && (
                                                    <View style={styles.selectedIndicator}>
                                                        <Check size={16} color="#E2DED0" />
                                                    </View>
                                                )}
                                                <Text style={[
                                                    styles.choiceText,
                                                    selectedChoiceIndex === index && styles.choiceTextSelected
                                                ]}>
                                                    {option.text}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <PrimaryButton
                                    title="Continue"
                                    onPress={handleContinueRoleplay}
                                    disabled={selectedChoiceIndex === null}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Response Screen
        if (currentScreen === 2) {
            const responseText = selectedChoiceIndex !== null ? currentScenario.responses?.[selectedChoiceIndex] : "";

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
                                <Text style={styles.responseTitle}>Here's our take</Text>

                                <Text style={styles.responseText}>{responseText}</Text>

                                <Text style={styles.continuePrompt}>
                                    {currentScenarioIndex < scenarios.length - 1 ? "Let's try another one." : "Ready for the final thoughts?"}
                                </Text>

                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Final Screen
        if (currentScreen === 4) {
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
                                        <Image
                                            source={{ uri: imageSource }}
                                            style={commonStyles.heroImage}
                                        />
                                    )}
                                </View>

                                <Text style={commonStyles.reflectionTitle}>{finalScreen.title}</Text>

                                {finalScreen.descriptions.map((desc, index) => (
                                    <Text key={index} style={commonStyles.reflectionDescription}>
                                        {desc}
                                    </Text>
                                ))}

                                {finalScreen.alternativeClosing && (
                                    <Text style={styles.conclusionClosing}>
                                        {finalScreen.alternativeClosing}
                                    </Text>
                                )}

                                <JournalEntrySection {...finalScreen.journalSectionProps} />

                                {finalScreen.journalSectionProps && (
                                    <View style={styles.journalCallout}>
                                        <Text style={styles.journalCalloutTitle}>Your Interview Prep Space</Text>
                                        <Text style={styles.journalCalloutText}>
                                            Use the journal tab anytime to practice framing your dance experience for different roles. The more you practice, the more natural it will feel!
                                        </Text>
                                    </View>
                                )}

                                <PrimaryButton title={finalScreen.buttonText} onPress={onComplete} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }

    // MustHaves Flow Screens
    if (flowType === 'mustHaves') {
        // Day 5 Welcome Screen
        if (currentScreen === -1) {
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
                                    <View style={[styles.introIconGradient, { backgroundColor: '#928490' }]}>
                                        <Target size={32} color="#E2DED0" />
                                    </View>
                                </View>

                                <Text style={commonStyles.introTitle}>Meet Your Must-Haves</Text>

                                <Text style={commonStyles.introDescription}>
                                    This is a game of instincts. We're going to uncover what you truly value by having you choose between common spending categories. Your choices will help us build a personalized snapshot of your financial priorities. Don't overthink it!
                                </Text>

                                <Text style={commonStyles.introDescription}>
                                    There's no right or wrong. Let's see what you build.
                                </Text>

                                <PrimaryButton title="Begin Choosing" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Choice Screens (0-8)
        if (currentScreen >= 0 && currentScreen <= 8) {
            const currentPair = scenarios[currentScenarioIndex];
            const choiceProgress = ((currentScreen + 1) / scenarios.length) * 100;

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
                                <View style={styles.progressContainer}>
                                    <Text style={styles.progressText}>
                                        {currentScreen + 1} of {scenarios.length} choices
                                    </Text>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${choiceProgress}%` }]} />
                                    </View>
                                </View>

                                <Text style={styles.choiceTitle}>Which would you choose?</Text>

                                <View style={styles.choicesContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoices[currentScenarioIndex + 1] === 1 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleMustHavesChoiceSelect(1)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoices[currentScenarioIndex + 1] === 1 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoices[currentScenarioIndex + 1] === 1 && styles.choiceTextSelected
                                            ]}>
                                                {currentPair.question1?.choice1}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoices[currentScenarioIndex + 1] === 2 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleMustHavesChoiceSelect(2)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoices[currentScenarioIndex + 1] === 2 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoices[currentScenarioIndex + 1] === 2 && styles.choiceTextSelected
                                            ]}>
                                                {currentPair.question1?.choice2}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <PrimaryButton
                                    title="Continue"
                                    onPress={handleContinueRoleplay}
                                    disabled={!selectedChoices[currentScenarioIndex + 1]}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Results Overview Screen
        if (currentScreen === 9) {
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
                                <View style={styles.overviewIconContainer}>
                                    <View style={[styles.overviewIconGradient, { backgroundColor: '#928490' }]}>
                                        <Target size={40} color="#E2DED0" />
                                    </View>
                                </View>

                                <Text style={styles.overviewTitle}>Explore Your Spending Values</Text>

                                <PrimaryButton title="See Your Results" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Results Screens
        if (currentScreen === 10) {
            const personalizedResults = getPersonalizedResults();

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
                                <Text style={styles.resultTitle}>Here's what your choices reveal</Text>

                                <Text style={styles.resultText}>{personalizedResults[currentResultIndex]}</Text>

                                <PrimaryButton
                                    title={currentResultIndex < personalizedResults.length - 1 ? 'Continue' : 'See Summary'}
                                    onPress={handleNextResult}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Final Summary Screen with Journal
        if (currentScreen === 11) {
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
                                <View style={styles.finalIconContainer}>
                                    <View style={[styles.finalIconGradient, { backgroundColor: '#928490' }]}>
                                        <Target size={40} color="#E2DED0" />
                                    </View>
                                </View>

                                <Text style={styles.finalTitle}>Your Budget Shows Your Values</Text>

                                <Text style={styles.finalText}>
                                    How does this financial portrait feel? Use this as a starting point to craft a budget that truly reflects your values. A budget that fuels what you love and cuts what you don't.
                                    {"\n\n"}
                                    The goal isn't restriction, it's alignment.
                                    {"\n\n"}
                                    Let's keep going tomorrow.
                                </Text>

                                <JournalEntrySection
                                    pathTag="budgeting-for-dancers"
                                    day="5"
                                    category="finance"
                                    pathTitle="Money Mindsets"
                                    dayTitle="Meet Your Must Haves"
                                    journalInstruction="How do your spending choices reflect your core values? What surprised you about your must-haves?"
                                    moodLabel=""
                                    saveButtonText="Save Entry"
                                />

                                <View style={styles.journalCallout}>
                                    <Text style={styles.journalCalloutTitle}>Your Personal Space</Text>
                                    <Text style={styles.journalCalloutText}>
                                        Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!
                                    </Text>
                                </View>

                                <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }

    // Welcome Screen
    if (currentScreen === -1) {
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
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.introTitle}>{welcomeScreen.title}</Text>
                            {welcomeScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {welcomeScreen.learningBox && (
                                <View style={styles.celebrationBox}>
                                    <Text style={styles.celebrationTitle}>{welcomeScreen.learningBox.title}</Text>
                                    {welcomeScreen.learningBox.items.map((item) => (
                                        <Text key={item.id} style={styles.celebrationItem}>
                                            • {item.text}
                                        </Text>
                                    ))}
                                </View>
                            )}

                            {welcomeScreen.welcomeFooter && (
                                <Text style={styles.welcomeFooter}>
                                    {welcomeScreen.welcomeFooter}
                                </Text>
                            )}

                            <JournalEntrySection {...welcomeScreen.journalSectionProps} />

                            <PrimaryButton title={welcomeScreen.buttonText} onPress={handleContinueRoleplay} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Engine Intro Screen
    if (currentScreen === 0 && engineIntroScreen) {
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
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.introTitle}>{engineIntroScreen.title}</Text>
                            {engineIntroScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            <PrimaryButton title={engineIntroScreen.buttonText} onPress={handleContinueRoleplay} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // TryItOn Specific Screens
    if (flowType === 'tryItOn') {
        const currentScenario = scenarios[currentScenarioIndex];

        // Screen 1: Scenario Intro
        if (currentScreen === 1) {
            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.scenarioTitle}>{currentScenario.scenarioTitle}</Text>
                                <Text style={styles.scenarioSubtitle}>({currentScenario.scenarioText})</Text>

                                <Text style={styles.scenarioText}>
                                    {currentScenario.question1?.text}
                                </Text>

                                <PrimaryButton
                                    title="What will you do?"
                                    onPress={handleContinueRoleplay}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 2: First Choice
        if (currentScreen === 2) {
            const selectedChoice = selectedChoices[1];

            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.choicesTitle}>Here are your options</Text>

                                <View style={styles.choicesContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoice === 1 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleTryItOnChoiceSelect(1, 1)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoice === 1 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoice === 1 && styles.choiceTextSelected
                                            ]}>
                                                {currentScenario.question1?.choice1}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoice === 2 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleTryItOnChoiceSelect(1, 2)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoice === 2 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoice === 2 && styles.choiceTextSelected
                                            ]}>
                                                {currentScenario.question1?.choice2}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <PrimaryButton
                                    title="Continue"
                                    onPress={handleContinueRoleplay}
                                    disabled={selectedChoice === undefined}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 3: Response to first choice
        if (currentScreen === 3) {
            const selectedChoice = selectedChoices[1];
            const responseText = selectedChoice === 1 ? currentScenario.question1?.response1 : currentScenario.question1?.response2;

            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.responseTitle}>Here's where you're at</Text>

                                <Text style={styles.responseText}>{responseText}</Text>

                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 4: Second scenario question
        if (currentScreen === 4) {
            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.scenarioText}>{currentScenario.question2?.text}</Text>

                                <PrimaryButton title="What will you do?" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 5: Second set of choices
        if (currentScreen === 5) {
            const selectedChoice = selectedChoices[2];

            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.choicesTitle}>Here are your options</Text>

                                <View style={styles.choicesContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoice === 1 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleTryItOnChoiceSelect(2, 1)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoice === 1 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoice === 1 && styles.choiceTextSelected
                                            ]}>
                                                {currentScenario.question2?.choice1}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.choiceButton,
                                            selectedChoice === 2 && styles.choiceButtonSelected
                                        ]}
                                        onPress={() => handleTryItOnChoiceSelect(2, 2)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.choiceContent}>
                                            {selectedChoice === 2 && (
                                                <View style={styles.selectedIndicator}>
                                                    <Check size={16} color="#E2DED0" />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.choiceText,
                                                selectedChoice === 2 && styles.choiceTextSelected
                                            ]}>
                                                {currentScenario.question2?.choice2}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <PrimaryButton
                                    title="Continue"
                                    onPress={handleContinueRoleplay}
                                    disabled={selectedChoice === undefined}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 6: Response to second choice
        if (currentScreen === 6) {
            const selectedChoice = selectedChoices[2];
            const responseText = selectedChoice === 1 ? currentScenario.question2?.response1 : currentScenario.question2?.response2;

            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.responseTitle}>Here's where you're at</Text>

                                <Text style={styles.responseText}>{responseText}</Text>

                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 7: Scenario Reflection
        if (currentScreen === 7) {
            const AlternativeIconComponent = currentScenario.alternativeIcon;

            return (
                <View style={commonStyles.container}>
                    <StickyHeader
                        onBack={goBack}
                        title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                        progress={(currentScenarioIndex + 1) / scenarios.length}
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
                            <Card style={commonStyles.baseCard}>
                                {AlternativeIconComponent && (
                                    <View style={commonStyles.introIconContainer}>
                                        <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                            <AlternativeIconComponent size={32} color="#E2DED0" />
                                        </View>
                                    </View>
                                )}

                                <Text style={styles.alternativeTitle}>
                                    How did that feel?
                                </Text>

                                <Text style={styles.alternativeText}>
                                    {currentScenario.reflection}
                                </Text>

                                <PrimaryButton
                                    title={currentScenarioIndex < scenarios.length - 1 ? "Try Another Scenario" : "Continue to Final Reflection"}
                                    onPress={handleContinueRoleplay}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 8: Final reflection with journal prompts
        if (currentScreen === 8) {
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
                                        <Image
                                            source={{ uri: imageSource }}
                                            style={commonStyles.heroImage}
                                        />
                                    )}
                                </View>

                                <Text style={commonStyles.reflectionTitle}>How did that feel?</Text>

                                <Text style={commonStyles.reflectionDescription}>
                                    You just "tried on" your first week in a new role. When you put yourself in those shoes, which one felt most aligned? Perhaps that's a good place to start as you dive deeper into your exploration.
                                </Text>

                                <JournalEntrySection {...reflectionScreen.journalSectionProps} />

                                <View style={styles.mockInterviewCard}>
                                    <Text style={styles.mockInterviewTitle}>Ready to practice together?</Text>
                                    <Text style={styles.mockInterviewDescription}>
                                        Practice interviewing in a safe environment before the real thing. Reduce interview anxiety and increase your confidence through realistic simulation and expert guidance.
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.mockInterviewButton}
                                        onPress={handleMockInterviewOpen}
                                    >
                                        <View style={[styles.mockInterviewButtonContent, { backgroundColor: '#647C90' }]}>
                                            <Text style={styles.mockInterviewButtonText}>Learn More</Text>
                                            <ChevronRight size={16} color="#E2DED0" />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.alternativeClosing}>
                                    Meet you here again tomorrow.
                                </Text>

                                <PrimaryButton title="Mark As Complete" onPress={onComplete} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }

    // Reflection Screen (per scenario reflection)
    if (currentScreen === 2) {
        const currentScenarioData = scenarios[currentScenarioIndex];
        const youtubeVideoId = reflectionScreen.videoLink ? getVideoId(reflectionScreen.videoLink) : null;

        console.log('Reflection Screen - Video Link:', reflectionScreen.videoLink);
        console.log('Reflection Screen - Video ID:', youtubeVideoId);

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
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={commonStyles.reflectionTitle}>{reflectionScreen.title}</Text>
                            {reflectionScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.reflectionDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {/* FIXED: Proper text wrapping */}
                            {reflectionScreen.reflectionEmphasis && (
                                <Text style={[commonStyles.reflectionDescription, styles.reflectionEmphasis]}>
                                    ({reflectionScreen.reflectionEmphasis})
                                </Text>
                            )}

                            {/* YouTube Short */}
                            {youtubeVideoId ? (
                                <TouchableOpacity
                                    style={styles.videoThumbnailContainer}
                                    onPress={() => openYouTubeShort(reflectionScreen.videoLink!)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg` }}
                                        style={styles.videoThumbnail}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.playButtonOverlay}>
                                        <View style={styles.playButton}>
                                            <Text style={styles.playIcon}>▶</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ) : null}

                            {/* Journal section for scenario reflection */}
                            <Text style={styles.reflectionPromptText}>{currentScenarioData.reflectionPrompt}</Text>
                            <JournalEntrySection {...reflectionScreen.journalSectionProps} />

                            <PrimaryButton title={reflectionScreen.buttonText} onPress={handleContinueRoleplay} />
                        </Card>
                    </View>
                </ScrollView>

                {/* Modal for YouTube video */}
                {youtubeVideoId && (
                    <Modal
                        visible={showVideoModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={closeVideoModal}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={closeVideoModal}
                                    activeOpacity={0.8}
                                >
                                    <X size={28} color="#FFFFFF" />
                                </TouchableOpacity>

                                <View style={styles.videoPlayerContainer}>
                                    <YoutubePlayer
                                        height={height * 0.75}
                                        play={isPlaying}
                                        videoId={youtubeVideoId}
                                        webViewProps={{
                                            allowsFullscreenVideo: true,
                                        }}
                                        onChangeState={(state: string) => {
                                            console.log('Video state:', state);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
    // Final Screen
    if (currentScreen === 3) {
        const youtubeVideoId = finalScreen.videoLink ? getVideoId(finalScreen.videoLink) : null;

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
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                )}
                            </View>

                            <Text style={styles.conclusionTitle}>{finalScreen.title}</Text>

                            {finalScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={styles.conclusionText}>
                                    {desc}
                                </Text>
                            ))}

                            {finalScreen.videoLink && youtubeVideoId && (
                                <TouchableOpacity
                                    style={styles.videoThumbnailContainer}
                                    onPress={() => openYouTubeShort(finalScreen.videoLink!)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg` }}
                                        style={styles.videoThumbnail}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.playButtonOverlay}>
                                        <View style={styles.playButton}>
                                            <Text style={styles.playIcon}>▶</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {finalScreen.journalSectionProps && (
                                <>
                                    <JournalEntrySection {...finalScreen.journalSectionProps} />

                                    <View style={styles.journalCallout}>
                                        <Text style={styles.journalCalloutTitle}>
                                            {finalScreen.journalSectionProps.dayTitle || "Your Personal Space"}
                                        </Text>
                                        <Text style={styles.journalCalloutText}>
                                            {finalScreen.journalSectionProps.journalInstruction || "Remember, feel free to use the journal tab at any time to jot down your thoughts. This app is for you! Use it how you'd like to!"}
                                        </Text>
                                    </View>
                                </>
                            )}

                            {finalScreen.alternativeClosing && (
                                <Text style={styles.conclusionClosing}>
                                    {finalScreen.alternativeClosing}
                                </Text>
                            )}

                            <PrimaryButton title={finalScreen.buttonText} onPress={handleContinueRoleplay} />
                        </Card>
                    </View>
                </ScrollView>

                {finalScreen.videoLink && youtubeVideoId && (
                    <Modal
                        visible={showVideoModal}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={closeVideoModal}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={closeVideoModal}
                                    activeOpacity={0.8}
                                >
                                    <X size={28} color="#FFFFFF" />
                                </TouchableOpacity>

                                <View style={styles.videoPlayerContainer}>
                                    <YoutubePlayer
                                        height={height * 0.75}
                                        play={isPlaying}
                                        videoId={youtubeVideoId}
                                        webViewProps={{
                                            allowsFullscreenVideo: true,
                                        }}
                                        onChangeState={(state: string) => {
                                            console.log('Video state:', state);
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    }

    // Standard Roleplay Screen (Combines Scenario Intro, Choices, Response, Follow-up, Alternative)
    const currentScenarioData = scenarios[currentScenarioIndex];

    if (!currentScenarioData) {
        return <Text>Loading scenario...</Text>;
    }

    const AlternativeIconComponent = currentScenarioData.alternativeIcon;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                progress={(currentScenarioIndex + 1) / scenarios.length}
            />

            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                onContentSizeChange={() => scrollToTop()}
                onLayout={() => scrollToTop()}
            >
                <View style={styles.centeredContent}>
                    <Card style={commonStyles.baseCard}>
                        {/* Scenario Intro / Initial Choices */}
                        {roleplayStep === 0 && (
                            <>
                                <Text style={styles.scenarioTitle}>{currentScenarioData.scenarioTitle}</Text>
                                <Text style={styles.scenarioText}>{currentScenarioData.scenarioText}</Text>
                                {currentScenarioData.scenarioQuestion && (
                                    <Text style={styles.scenarioQuestion}>{currentScenarioData.scenarioQuestion}</Text>
                                )}
                                <Text style={styles.choicesTitle}>Your Options</Text>

                                <View style={styles.choicesContainer}>
                                    {currentScenarioData.choices?.map((option, index) => (
                                        <TouchableOpacity
                                            key={option.id || index}
                                            style={[
                                                styles.choiceButton,
                                                selectedChoiceIndex === index && styles.choiceButtonSelected
                                            ]}
                                            onPress={() => handleChoiceSelect(index)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.choiceContent}>
                                                {selectedChoiceIndex === index && (
                                                    <View style={styles.selectedIndicator}>
                                                        <Check size={16} color="#E2DED0" />
                                                    </View>
                                                )}
                                                <Text style={[
                                                    styles.choiceText,
                                                    selectedChoiceIndex === index && styles.choiceTextSelected
                                                ]}>
                                                    {option.text}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <PrimaryButton
                                    title="Continue"
                                    onPress={handleContinueRoleplay}
                                    disabled={selectedChoiceIndex === null}
                                />
                            </>
                        )}

                        {/* Response based on choice */}
                        {roleplayStep === 1 && selectedChoiceIndex !== null && (
                            <>
                                <Text style={styles.responseTitle}>
                                    {currentScenarioData.formula ? 'Your Choice Analysis' : 'Here\'s where you\'re at'}
                                </Text>
                                <Text style={styles.responseText}>
                                    {currentScenarioData.responses?.[selectedChoiceIndex]}
                                </Text>
                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </>
                        )}

                        {/* Follow-up / Formula Screen */}
                        {roleplayStep === 2 && currentScenarioData.formula && (
                            <>
                                <Text style={styles.formulaTitle}>{currentScenarioData.formula.title}</Text>
                                <Text style={styles.formulaText}>{currentScenarioData.formula.text}</Text>
                                <Text style={styles.formulaSubtitle}>The "{currentScenarioData.formula.title}" Formula:</Text>

                                <View>
                                    {currentScenarioData.formula.steps.map((step) => (
                                        <View key={step.number} style={styles.formulaStep}>
                                            <Text style={styles.formulaStepNumber}>{step.number}</Text>
                                            <Text style={styles.formulaStepText}>
                                                <Text style={styles.formulaStepTitle}>{step.title}:</Text> {step.text}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                {currentScenarioData.formula.note && (
                                    <Text style={styles.formulaNote}>{currentScenarioData.formula.note}</Text>
                                )}
                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </>
                        )}
                        {/* If no formula but there are follow-up texts (like in Generosity) */}
                        {roleplayStep === 2 && !currentScenarioData.formula && selectedChoiceIndex !== null && currentScenarioData.followUpTexts && (
                            <>
                                <Text style={styles.followUpTitle}>Here's your situation</Text>
                                <Text style={styles.followUpText}>
                                    {currentScenarioData.followUpTexts[selectedChoiceIndex]}
                                </Text>
                                <PrimaryButton title="See the Alternative" onPress={handleContinueRoleplay} />
                            </>
                        )}

                        {/* Alternative / Conclusion */}
                        {roleplayStep === 3 && (
                            <>
                                {AlternativeIconComponent && (
                                    <View style={commonStyles.introIconContainer}>
                                        <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                            <AlternativeIconComponent size={32} color="#E2DED0" />
                                        </View>
                                    </View>
                                )}
                                <Text style={styles.alternativeTitle}>
                                    {currentScenarioData.alternativeTitle || 'So, what\'s the alternative?'}
                                </Text>
                                <Text style={styles.alternativeText}>
                                    {currentScenarioData.alternativeText}
                                </Text>
                                <PrimaryButton
                                    title={currentScenarioIndex < scenarios.length - 1 ? 'Try another example' : 'Continue to Reflection'}
                                    onPress={handleContinueRoleplay}
                                />
                            </>
                        )}
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingBottom: 30,
    },
    // Welcome Screen Styles
    celebrationBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    celebrationTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    celebrationItem: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 24,
        marginBottom: 8,
    },
    welcomeFooter: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    // Engine General Styles
    engineTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '700',
    },
    engineInstructions: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
    },
    // Scenario Intro Styles
    scenarioTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '700',
    },
    scenarioText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 20,
    },
    scenarioQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 32,
        fontStyle: 'italic',
    },
    scenarioSubtitle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 24,
    },
    // Choices Styles
    choicesTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    choicesContainer: {
        gap: 16,
        marginBottom: 24,
    },
    choiceButton: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceContent: {
        padding: 20,
        paddingRight: 50,
    },
    choiceText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
        textAlign: 'center',
    },
    choiceTextSelected: {
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
    // Response Styles
    responseTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    responseText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Continue Prompt Styles (for simpleChoice)
    continuePrompt: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
    },
    // Formula Styles
    formulaTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    formulaText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    formulaSubtitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    formulaStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 15,
    },
    formulaStepNumber: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#928490',
        marginRight: 15,
        minWidth: 25,
    },
    formulaStepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        lineHeight: 20,
        flex: 1,
    },
    formulaStepTitle: {
        fontFamily: 'Montserrat-SemiBold',
    },
    formulaNote: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 32,
    },
    // Follow-up Styles
    followUpTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    followUpText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    // Alternative Styles
    alternativeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    alternativeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    alternativeIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    // Reflection Prompt Text
    reflectionPromptText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    reflectionEmphasis: {
        fontStyle: 'italic',
        color: '#928490',
    },
    // Conclusion Styles
    conclusionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    conclusionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    conclusionClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // Journal Callout
    journalCallout: {
        width: '100%',
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    journalCalloutTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '600',
    },
    journalCalloutText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 22,
    },
    // YouTube Thumbnail Styles
    videoThumbnailContainer: {
        width: '100%',
        marginBottom: 25,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: 200,
        borderRadius: 16,
    },
    playButtonOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    playButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF0000',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    playIcon: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.9,
        maxWidth: 500,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: -50,
        right: 0,
        zIndex: 10,
        padding: 10,
    },
    videoPlayerContainer: {
        width: '100%',
        aspectRatio: 9 / 16,
        backgroundColor: '#000',
        borderRadius: 16,
        overflow: 'hidden',
    },
    // TryItOn Specific Styles
    mockInterviewCard: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(100, 124, 144, 0.2)',
    },
    mockInterviewTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    mockInterviewDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    mockInterviewButton: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    mockInterviewButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#647C90',
    },
    mockInterviewButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#E2DED0',
        marginRight: 8,
        fontWeight: '600',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // MustHaves Specific Styles
    progressContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    progressText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        marginBottom: 10,
    },
    progressBar: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#928490',
        borderRadius: 3,
    },
    choiceTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '700',
    },
    overviewIconContainer: {
        marginBottom: 24,
    },
    overviewIconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    overviewTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '700',
    },
    resultTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    resultText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
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
        elevation: 5,
    },
    finalTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '700',
    },
    finalText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
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
        elevation: 5,
    },
});