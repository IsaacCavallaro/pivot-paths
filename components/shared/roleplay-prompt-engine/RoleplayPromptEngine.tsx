import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { X, Check, ChevronRight } from 'lucide-react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { RoleplayPromptEngineProps, RoleplayScenarioContent } from '@/types/roleplayPromptEngine';

const { width, height } = Dimensions.get('window');

// Screen flow constants
const SCREEN_WELCOME = 'welcome';
const SCREEN_INTRO = 'intro';
const SCREEN_SCENARIO = 'scenario';
const SCREEN_REFLECTION = 'reflection';
const SCREEN_FINAL = 'final';

export default function RoleplayPromptEngine({
    onComplete,
    onBack,
    imageSource,
    scenarios,
    welcomeScreen,
    engineIntroScreen,
    reflectionScreen,
    finalScreen,
    flowType = 'standard',
}: RoleplayPromptEngineProps) {
    const [currentScreen, setCurrentScreen] = useState<string>(SCREEN_WELCOME);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [scenarioStep, setScenarioStep] = useState(0);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
    const [selectedChoices, setSelectedChoices] = useState<{ [key: string]: number }>({});

    const [isPlaying, setIsPlaying] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    useEffect(() => {
        scrollToTop();
    }, [currentScreen, scenarioStep, currentScenarioIndex]);

    // Navigation helpers
    const goToNextScreen = () => {
        if (currentScreen === SCREEN_WELCOME) {
            setCurrentScreen(engineIntroScreen ? SCREEN_INTRO : SCREEN_SCENARIO);
        } else if (currentScreen === SCREEN_INTRO) {
            setCurrentScreen(SCREEN_SCENARIO);
        } else if (currentScreen === SCREEN_SCENARIO) {
            handleScenarioProgression();
        } else if (currentScreen === SCREEN_REFLECTION) {
            setCurrentScreen(SCREEN_FINAL);
        } else if (currentScreen === SCREEN_FINAL) {
            onComplete();
        }
        scrollToTop();
    };

    const goBack = () => {
        if (currentScreen === SCREEN_WELCOME) {
            onBack?.();
        } else if (currentScreen === SCREEN_INTRO) {
            setCurrentScreen(SCREEN_WELCOME);
        } else if (currentScreen === SCREEN_SCENARIO) {
            handleScenarioBack();
        } else if (currentScreen === SCREEN_REFLECTION) {
            // Go back to last scenario
            setCurrentScenarioIndex(scenarios.length - 1);
            setScenarioStep(getMaxScenarioSteps(scenarios[scenarios.length - 1]) - 1);
            setCurrentScreen(SCREEN_SCENARIO);
        } else if (currentScreen === SCREEN_FINAL) {
            setCurrentScreen(SCREEN_REFLECTION);
        }
        scrollToTop();
    };

    // Scenario-specific logic
    const getMaxScenarioSteps = (scenario: RoleplayScenarioContent): number => {
        if (flowType === 'tryItOn') {
            return 7; // scenario intro, choice1, response1, question2, choice2, response2, scenario reflection
        } else if (flowType === 'simpleChoice') {
            return 3; // scenario intro, choice, response
        }
        return 4; // standard: scenario intro, choice, response, alternative
    };

    const handleScenarioProgression = () => {
        const currentScenario = scenarios[currentScenarioIndex];
        const maxSteps = getMaxScenarioSteps(currentScenario);

        if (scenarioStep < maxSteps - 1) {
            setScenarioStep(prev => prev + 1);
        } else {
            // Scenario complete, move to next scenario or reflection
            if (currentScenarioIndex < scenarios.length - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
                setScenarioStep(0);
                setSelectedChoiceIndex(null);
                setSelectedChoices({});
            } else {
                // All scenarios complete
                setCurrentScreen(SCREEN_REFLECTION);
            }
        }
    };

    const handleScenarioBack = () => {
        if (scenarioStep > 0) {
            setScenarioStep(prev => prev - 1);
            if (scenarioStep === 1) {
                setSelectedChoiceIndex(null);
            }
        } else if (currentScenarioIndex > 0) {
            setCurrentScenarioIndex(prev => prev - 1);
            const prevScenario = scenarios[currentScenarioIndex - 1];
            setScenarioStep(getMaxScenarioSteps(prevScenario) - 1);
            setSelectedChoiceIndex(null);
        } else {
            setCurrentScreen(engineIntroScreen ? SCREEN_INTRO : SCREEN_WELCOME);
        }
    };

    const handleChoiceSelect = (choiceIndex: number) => {
        setSelectedChoiceIndex(choiceIndex);
        setSelectedChoices(prev => ({
            ...prev,
            [`scenario_${currentScenarioIndex}_step_${scenarioStep}`]: choiceIndex
        }));
    };

    // Video helpers
    const getVideoId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|youtube\.com\/(watch\?.*v=|embed\/|shorts\/|v\/))([^#&?]*).*/;
        const match = url.match(regExp);
        const candidate = match && match[3] ? match[3] : null;
        return candidate && candidate.length === 11 ? candidate : null;
    };

    const openVideoModal = useCallback(() => {
        setShowVideoModal(true);
        setIsPlaying(true);
    }, []);

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

    // Render helpers
    const renderVideoThumbnail = (videoLink: string) => {
        const videoId = getVideoId(videoLink);
        if (!videoId) return null;

        return (
            <>
                <TouchableOpacity
                    style={styles.videoThumbnailContainer}
                    onPress={() => openYouTubeShort(videoLink)}
                    activeOpacity={0.8}
                >
                    <Image
                        source={{ uri: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` }}
                        style={styles.videoThumbnail}
                        resizeMode="cover"
                    />
                    <View style={styles.playButtonOverlay}>
                        <View style={styles.playButton}>
                            <Text style={styles.playIcon}>▶</Text>
                        </View>
                    </View>
                </TouchableOpacity>

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
                                    videoId={videoId}
                                    webViewProps={{ allowsFullscreenVideo: true }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
    };

    // Screen Renderers
    const renderWelcomeScreen = () => (
        <View style={commonStyles.container}>
            <StickyHeader onBack={goBack} />
            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={commonStyles.centeredContent}>
                    <Card style={commonStyles.baseCard}>
                        {imageSource && (
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: imageSource }}
                                    style={commonStyles.heroImage}
                                />
                            </View>
                        )}

                        <Text style={commonStyles.introTitle}>{welcomeScreen.title}</Text>

                        {welcomeScreen.descriptions.map((desc, index) => (
                            <Text key={index} style={commonStyles.introDescription}>
                                {desc}
                            </Text>
                        ))}

                        {welcomeScreen.learningBox && (
                            <View style={styles.learningBox}>
                                <Text style={styles.learningBoxTitle}>
                                    {welcomeScreen.learningBox.title}
                                </Text>
                                {welcomeScreen.learningBox.items.map((item) => (
                                    <Text key={item.id} style={styles.learningBoxItem}>
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

                        {welcomeScreen.journalSectionProps && (
                            <JournalEntrySection {...welcomeScreen.journalSectionProps} />
                        )}

                        <PrimaryButton
                            title={welcomeScreen.buttonText}
                            onPress={goToNextScreen}
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );

    const renderIntroScreen = () => {
        if (!engineIntroScreen) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader onBack={goBack} />
                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            {imageSource && (
                                <View style={commonStyles.introIconContainer}>
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                </View>
                            )}

                            <Text style={commonStyles.introTitle}>
                                {engineIntroScreen.title}
                            </Text>

                            {engineIntroScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            <PrimaryButton
                                title={engineIntroScreen.buttonText}
                                onPress={goToNextScreen}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    };

    const renderScenarioScreen = () => {
        const currentScenario = scenarios[currentScenarioIndex];
        const progress = (currentScenarioIndex + 1) / scenarios.length;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`Scenario ${currentScenarioIndex + 1}/${scenarios.length}`}
                    progress={progress}
                />
                <ScrollView
                    ref={scrollViewRef}
                    style={commonStyles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={commonStyles.centeredContent}>
                        <Card style={commonStyles.baseCard}>
                            {renderScenarioContent(currentScenario)}
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    };

    const renderScenarioContent = (scenario: RoleplayScenarioContent) => {
        if (flowType === 'tryItOn') {
            return renderTryItOnScenario(scenario);
        } else if (flowType === 'simpleChoice') {
            return renderSimpleChoiceScenario(scenario);
        }
        return renderStandardScenario(scenario);
    };

    const renderStandardScenario = (scenario: RoleplayScenarioContent) => {
        // Step 0: Scenario intro + choices
        if (scenarioStep === 0) {
            return (
                <>
                    <Text style={styles.scenarioTitle}>{scenario.scenarioTitle}</Text>
                    <Text style={styles.scenarioText}>{scenario.scenarioText}</Text>
                    {scenario.scenarioQuestion && (
                        <Text style={styles.scenarioQuestion}>{scenario.scenarioQuestion}</Text>
                    )}
                    <Text style={styles.choicesTitle}>Your Options</Text>
                    <View style={styles.choicesContainer}>
                        {scenario.choices?.map((option, index) => (
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
                        onPress={goToNextScreen}
                        disabled={selectedChoiceIndex === null}
                    />
                </>
            );
        }

        // Step 1: Response to choice
        if (scenarioStep === 1 && selectedChoiceIndex !== null) {
            return (
                <>
                    <Text style={styles.responseTitle}>
                        {scenario.formula ? 'Your Choice Analysis' : 'Here\'s where you\'re at'}
                    </Text>
                    <Text style={styles.responseText}>
                        {scenario.responses?.[selectedChoiceIndex]}
                    </Text>
                    <PrimaryButton title="Continue" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 2: Follow-up (formula or follow-up text)
        if (scenarioStep === 2) {
            if (scenario.formula) {
                return (
                    <>
                        <Text style={styles.formulaTitle}>{scenario.formula.title}</Text>
                        <Text style={styles.formulaText}>{scenario.formula.text}</Text>
                        <Text style={styles.formulaSubtitle}>
                            The "{scenario.formula.title}" Formula:
                        </Text>
                        <View>
                            {scenario.formula.steps.map((step) => (
                                <View key={step.number} style={styles.formulaStep}>
                                    <Text style={styles.formulaStepNumber}>{step.number}</Text>
                                    <Text style={styles.formulaStepText}>
                                        <Text style={styles.formulaStepTitle}>{step.title}:</Text> {step.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        {scenario.formula.note && (
                            <Text style={styles.formulaNote}>{scenario.formula.note}</Text>
                        )}
                        <PrimaryButton title="Continue" onPress={goToNextScreen} />
                    </>
                );
            } else if (selectedChoiceIndex !== null && scenario.followUpTexts) {
                return (
                    <>
                        <Text style={styles.followUpTitle}>Here's your situation</Text>
                        <Text style={styles.followUpText}>
                            {scenario.followUpTexts[selectedChoiceIndex]}
                        </Text>
                        <PrimaryButton title="See the Alternative" onPress={goToNextScreen} />
                    </>
                );
            }
        }

        // Step 3: Alternative/Conclusion
        if (scenarioStep === 3) {
            const AlternativeIcon = scenario.alternativeIcon;
            return (
                <>
                    {AlternativeIcon && (
                        <View style={commonStyles.introIconContainer}>
                            <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                <AlternativeIcon size={32} color="#E2DED0" />
                            </View>
                        </View>
                    )}
                    <Text style={styles.alternativeTitle}>
                        {scenario.alternativeTitle || 'So, what\'s the alternative?'}
                    </Text>
                    <Text style={styles.alternativeText}>
                        {scenario.alternativeText}
                    </Text>
                    <PrimaryButton
                        title={currentScenarioIndex < scenarios.length - 1 ? 'Try another example' : 'Continue to Reflection'}
                        onPress={goToNextScreen}
                    />
                </>
            );
        }

        return null;
    };

    const renderTryItOnScenario = (scenario: RoleplayScenarioContent) => {
        // Step 0: Scenario intro
        if (scenarioStep === 0) {
            return (
                <>
                    <Text style={styles.scenarioTitle}>{scenario.scenarioTitle}</Text>
                    <Text style={styles.scenarioSubtitle}>({scenario.scenarioText})</Text>
                    <Text style={styles.scenarioText}>{scenario.question1?.text}</Text>
                    <PrimaryButton title="What will you do?" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 1: First choice
        if (scenarioStep === 1) {
            const selectedChoice = selectedChoices[`scenario_${currentScenarioIndex}_step_${scenarioStep}`];
            return (
                <>
                    <Text style={styles.choicesTitle}>Here are your options</Text>
                    <View style={styles.choicesContainer}>
                        <TouchableOpacity
                            style={[
                                styles.choiceButton,
                                selectedChoice === 0 && styles.choiceButtonSelected
                            ]}
                            onPress={() => handleChoiceSelect(0)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.choiceContent}>
                                {selectedChoice === 0 && (
                                    <View style={styles.selectedIndicator}>
                                        <Check size={16} color="#E2DED0" />
                                    </View>
                                )}
                                <Text style={[
                                    styles.choiceText,
                                    selectedChoice === 0 && styles.choiceTextSelected
                                ]}>
                                    {scenario.question1?.choice1}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.choiceButton,
                                selectedChoice === 1 && styles.choiceButtonSelected
                            ]}
                            onPress={() => handleChoiceSelect(1)}
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
                                    {scenario.question1?.choice2}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <PrimaryButton
                        title="Continue"
                        onPress={goToNextScreen}
                        disabled={selectedChoice === undefined}
                    />
                </>
            );
        }

        // Step 2: Response to first choice
        if (scenarioStep === 2) {
            const selectedChoice = selectedChoices[`scenario_${currentScenarioIndex}_step_1`];
            const responseText = selectedChoice === 0 ? scenario.question1?.response1 : scenario.question1?.response2;
            return (
                <>
                    <Text style={styles.responseTitle}>Here's where you're at</Text>
                    <Text style={styles.responseText}>{responseText}</Text>
                    <PrimaryButton title="Continue" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 3: Second question
        if (scenarioStep === 3) {
            return (
                <>
                    <Text style={styles.scenarioText}>{scenario.question2?.text}</Text>
                    <PrimaryButton title="What will you do?" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 4: Second choice
        if (scenarioStep === 4) {
            const selectedChoice = selectedChoices[`scenario_${currentScenarioIndex}_step_${scenarioStep}`];
            return (
                <>
                    <Text style={styles.choicesTitle}>Here are your options</Text>
                    <View style={styles.choicesContainer}>
                        <TouchableOpacity
                            style={[
                                styles.choiceButton,
                                selectedChoice === 0 && styles.choiceButtonSelected
                            ]}
                            onPress={() => handleChoiceSelect(0)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.choiceContent}>
                                {selectedChoice === 0 && (
                                    <View style={styles.selectedIndicator}>
                                        <Check size={16} color="#E2DED0" />
                                    </View>
                                )}
                                <Text style={[
                                    styles.choiceText,
                                    selectedChoice === 0 && styles.choiceTextSelected
                                ]}>
                                    {scenario.question2?.choice1}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.choiceButton,
                                selectedChoice === 1 && styles.choiceButtonSelected
                            ]}
                            onPress={() => handleChoiceSelect(1)}
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
                                    {scenario.question2?.choice2}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <PrimaryButton
                        title="Continue"
                        onPress={goToNextScreen}
                        disabled={selectedChoice === undefined}
                    />
                </>
            );
        }

        // Step 5: Response to second choice
        if (scenarioStep === 5) {
            const selectedChoice = selectedChoices[`scenario_${currentScenarioIndex}_step_4`];
            const responseText = selectedChoice === 0 ? scenario.question2?.response1 : scenario.question2?.response2;
            return (
                <>
                    <Text style={styles.responseTitle}>Here's where you're at</Text>
                    <Text style={styles.responseText}>{responseText}</Text>
                    <PrimaryButton title="Continue" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 6: Scenario reflection
        if (scenarioStep === 6) {
            const AlternativeIcon = scenario.alternativeIcon;
            return (
                <>
                    {AlternativeIcon && (
                        <View style={commonStyles.introIconContainer}>
                            <View style={[styles.alternativeIconGradient, { backgroundColor: '#928490' }]}>
                                <AlternativeIcon size={32} color="#E2DED0" />
                            </View>
                        </View>
                    )}
                    <Text style={styles.alternativeTitle}>How did that feel?</Text>
                    <Text style={styles.alternativeText}>{scenario.reflection}</Text>
                    <PrimaryButton
                        title={currentScenarioIndex < scenarios.length - 1 ? "Try Another Scenario" : "Continue to Final Reflection"}
                        onPress={goToNextScreen}
                    />
                </>
            );
        }

        return null;
    };

    const renderSimpleChoiceScenario = (scenario: RoleplayScenarioContent) => {
        // Step 0: Scenario intro + choices
        if (scenarioStep === 0) {
            return (
                <>
                    <Text style={styles.scenarioTitle}>
                        Scenario {currentScenarioIndex + 1} of {scenarios.length}
                    </Text>
                    <Text style={styles.scenarioText}>{scenario.scenarioText}</Text>
                    <Text style={styles.choicesTitle}>Who would you hire?</Text>
                    <View style={styles.choicesContainer}>
                        {scenario.choices?.map((option, index) => (
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
                        onPress={goToNextScreen}
                        disabled={selectedChoiceIndex === null}
                    />
                </>
            );
        }

        // Step 1: Response
        if (scenarioStep === 1 && selectedChoiceIndex !== null) {
            return (
                <>
                    <Text style={styles.responseTitle}>Here's our take</Text>
                    <Text style={styles.responseText}>
                        {scenario.responses?.[selectedChoiceIndex]}
                    </Text>
                    <Text style={styles.continuePrompt}>
                        {currentScenarioIndex < scenarios.length - 1
                            ? "Let's try another one."
                            : "Ready for the final thoughts?"}
                    </Text>
                    <PrimaryButton title="Continue" onPress={goToNextScreen} />
                </>
            );
        }

        // Step 2: Alternative (if exists)
        if (scenarioStep === 2 && scenario.alternativeText) {
            return (
                <>
                    <Text style={styles.alternativeTitle}>Consider this</Text>
                    <Text style={styles.alternativeText}>{scenario.alternativeText}</Text>
                    <PrimaryButton
                        title={currentScenarioIndex < scenarios.length - 1 ? "Next Scenario" : "Continue to Reflection"}
                        onPress={goToNextScreen}
                    />
                </>
            );
        }

        return null;
    };

    const renderReflectionScreen = () => (
        <View style={commonStyles.container}>
            <StickyHeader onBack={goBack} />
            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={commonStyles.centeredContent}>
                    <Card style={commonStyles.baseCard}>
                        {imageSource && (
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: imageSource }}
                                    style={commonStyles.heroImage}
                                />
                            </View>
                        )}

                        <Text style={commonStyles.reflectionTitle}>
                            {reflectionScreen.title}
                        </Text>

                        {reflectionScreen.descriptions.map((desc, index) => (
                            <Text key={index} style={commonStyles.reflectionDescription}>
                                {desc}
                            </Text>
                        ))}

                        {reflectionScreen.reflectionEmphasis && (
                            <Text style={[commonStyles.reflectionDescription, styles.reflectionEmphasis]}>
                                ({reflectionScreen.reflectionEmphasis})
                            </Text>
                        )}

                        {reflectionScreen.videoLink && renderVideoThumbnail(reflectionScreen.videoLink)}

                        {reflectionScreen.journalSectionProps && (
                            <JournalEntrySection {...reflectionScreen.journalSectionProps} />
                        )}

                        <PrimaryButton
                            title={reflectionScreen.buttonText}
                            onPress={goToNextScreen}
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );

    const renderFinalScreen = () => (
        <View style={commonStyles.container}>
            <StickyHeader onBack={goBack} />
            <ScrollView
                ref={scrollViewRef}
                style={commonStyles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={commonStyles.centeredContent}>
                    <Card style={commonStyles.baseCard}>
                        {imageSource && (
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: imageSource }}
                                    style={commonStyles.heroImage}
                                />
                            </View>
                        )}

                        <Text style={styles.conclusionTitle}>{finalScreen.title}</Text>

                        {finalScreen.descriptions.map((desc, index) => (
                            <Text key={index} style={styles.conclusionText}>
                                {desc}
                            </Text>
                        ))}

                        {finalScreen.videoLink && renderVideoThumbnail(finalScreen.videoLink)}

                        {finalScreen.journalSectionProps && (
                            <>
                                <JournalEntrySection {...finalScreen.journalSectionProps} />
                                <View style={styles.journalCallout}>
                                    <Text style={styles.journalCalloutTitle}>Your Personal Space</Text>
                                    <Text style={styles.journalCalloutText}>
                                        Remember, feel free to use the journal tab at any time to jot down your thoughts.
                                        This app is for you! Use it how you'd like to!
                                    </Text>
                                </View>
                            </>
                        )}

                        {finalScreen.alternativeClosing && (
                            <Text style={styles.conclusionClosing}>
                                {finalScreen.alternativeClosing}
                            </Text>
                        )}

                        <PrimaryButton
                            title={finalScreen.buttonText}
                            onPress={goToNextScreen}
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );

    // Main render
    switch (currentScreen) {
        case SCREEN_WELCOME:
            return renderWelcomeScreen();
        case SCREEN_INTRO:
            return renderIntroScreen();
        case SCREEN_SCENARIO:
            return renderScenarioScreen();
        case SCREEN_REFLECTION:
            return renderReflectionScreen();
        case SCREEN_FINAL:
            return renderFinalScreen();
        default:
            return renderWelcomeScreen();
    }
}

const styles = StyleSheet.create({
    // Learning Box Styles
    learningBox: {
        width: '100%',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(146, 132, 144, 0.2)',
    },
    learningBoxTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        marginBottom: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    learningBoxItem: {
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
    // Scenario Styles
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
    // Choice Styles
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
    // Video Styles
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
});