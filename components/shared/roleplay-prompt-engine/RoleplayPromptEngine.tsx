import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { X, Check, Users, Award, Gift } from 'lucide-react-native'; // Added Lucide icons for alternativeIcon
import YoutubePlayer from 'react-native-youtube-iframe';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { RoleplayPromptEngineProps, RoleplayScenarioContent } from '@/types/roleplayPromptEngine'; // Updated import

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
}: RoleplayPromptEngineProps) {
    const [currentScreen, setCurrentScreen] = useState(-1); // -1: Welcome, 0: Engine Intro, 1: Roleplay, 2: Reflection, 3: Final
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null); // To store the selected choice index for sequential display
    const [roleplayStep, setRoleplayStep] = useState(0); // 0: Scenario/Choices, 1: Response, 2: Follow-up/Formula, 3: Alternative

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
        if (currentScreen === 0 && welcomeScreen) {
            setCurrentScreen(-1); // Go back to welcome screen
        } else if (currentScreen === 1) { // Within Roleplay steps
            if (roleplayStep > 0) {
                setRoleplayStep(prev => prev - 1); // Go back within roleplay steps
                if (roleplayStep === 1) { // If going back to choices, deselect choice
                    setSelectedChoiceIndex(null);
                }
            } else if (currentScenarioIndex > 0) {
                setCurrentScenarioIndex(prev => prev - 1);
                setRoleplayStep(3); // Go back to the alternative screen of the *previous* scenario
                setSelectedChoiceIndex(null); // Reset choice for previous scenario
            } else if (engineIntroScreen) {
                setCurrentScreen(0); // Go back to engine intro
            } else {
                setCurrentScreen(-1); // Go back to welcome
            }
        } else if (currentScreen === 2) { // From Reflection to last roleplay step
            setCurrentScreen(1);
            setRoleplayStep(3); // Set to alternative step
        } else if (currentScreen === 3) { // From Final to Reflection
            setCurrentScreen(2);
        } else if (currentScreen === -1) {
            handleBackPress(); // Use external onBack if on welcome screen
        }
        scrollToTop();
    };

    const startRoleplay = () => {
        setCurrentScreen(1);
        setCurrentScenarioIndex(0);
        setRoleplayStep(0);
        setSelectedChoiceIndex(null);
    };

    const handleChoiceSelect = (choiceIndex: number) => {
        setSelectedChoiceIndex(choiceIndex);
        scrollToTop();
    };

    const handleContinueRoleplay = () => {
        const currentScenario = scenarios[currentScenarioIndex];

        if (currentScreen === 1) { // In Roleplay Screen
            if (roleplayStep === 0) { // After selecting choice, move to response
                if (selectedChoiceIndex !== null) {
                    setRoleplayStep(1);
                }
            } else if (roleplayStep === 1) { // After response, move to follow-up/formula
                setRoleplayStep(2);
            } else if (roleplayStep === 2) { // After follow-up/formula, move to alternative
                setRoleplayStep(3);
            } else if (roleplayStep === 3) { // After alternative, move to next scenario or reflection
                if (currentScenarioIndex < scenarios.length - 1) {
                    setCurrentScenarioIndex(prev => prev + 1);
                    setRoleplayStep(0); // Reset for next scenario
                    setSelectedChoiceIndex(null);
                } else {
                    setCurrentScreen(2); // All scenarios complete, go to reflection
                }
            }
        } else { // Handle screens outside roleplay flow (Welcome, Intro, Reflection, Final)
            if (currentScreen === -1 && (engineIntroScreen || currentScenarioIndex >= 0)) {
                setCurrentScreen(engineIntroScreen ? 0 : 1);
            } else if (currentScreen === 0 && engineIntroScreen) {
                startRoleplay();
            } else if (currentScreen === 2) { // From Reflection to Final
                setCurrentScreen(3);
            } else if (currentScreen === 3) { // From Final to complete
                onComplete();
            }
        }
        scrollToTop();
    };

    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const openVideoModal = useCallback(() => {
        if (finalScreen.videoLink) {
            setShowVideoModal(true);
            setIsPlaying(true);
        }
    }, [finalScreen.videoLink]);

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

    // Reflection Screen (per scenario reflection)
    if (currentScreen === 2) {
        const currentScenarioData = scenarios[currentScenarioIndex];

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

                            {reflectionScreen.reflectionEmphasis && (
                                <Text style={commonStyles.reflectionDescription}>
                                    <Text style={styles.reflectionEmphasis}>({reflectionScreen.reflectionEmphasis})</Text>
                                </Text>
                            )}

                            {/* Journal section for scenario reflection */}
                            <Text style={styles.reflectionPromptText}>{currentScenarioData.reflectionPrompt}</Text>
                            <JournalEntrySection {...reflectionScreen.journalSectionProps} />

                            <PrimaryButton title={reflectionScreen.buttonText} onPress={handleContinueRoleplay} />
                        </Card>
                    </View>
                </ScrollView>
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

                            <Text style={styles.conclusionTitle}>{finalScreen.title}</Text> {/* Using conclusionTitle for consistency */}

                            {finalScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={styles.conclusionText}> {/* Using conclusionText */}
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
                                <View style={styles.journalCallout}> {/* Applying journalCallout style */}
                                    <Text style={styles.journalCalloutTitle}>{finalScreen.journalSectionProps.dayTitle}</Text>
                                    <Text style={styles.journalCalloutText}>{finalScreen.journalSectionProps.journalInstruction}</Text>
                                    {/* Additional journal info if needed, but keeping it simple like original */}
                                </View>
                            )}

                            {finalScreen.alternativeClosing && (
                                <Text style={styles.conclusionClosing}> {/* Using conclusionClosing */}
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
                                        onChangeState={(state) => {
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

    // Roleplay Screen (Combines Scenario Intro, Choices, Response, Follow-up, Alternative)
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
                <View style={commonStyles.centeredContent}>
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
                                    {currentScenarioData.choices.map((option, index) => (
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
                                    {currentScenarioData.responses[selectedChoiceIndex]}
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
    baseCard: { // Overrides commonStyles.baseCard to fit the game layout better
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
        width: '90%', // Ensure it fits content
    },
    // Welcome Screen Styles (adapted from original RoleplayScenario.tsx)
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
    // Engine General Styles (from MatchGameEngine, kept for consistency)
    engineTitle: { // Used for engineTitle in roleplay screen
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '700',
    },
    engineInstructions: { // Used for engineInstructions in roleplay screen
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: '#928490',
        textAlign: 'center',
        marginBottom: 30,
    },
    // Scenario Intro Styles (from original RoleplayScenario.tsx & AskForMore)
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
        marginBottom: 20, // Adjusted from 32 to 20 for consistency
    },
    scenarioQuestion: { // From AskForMore
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 32,
        fontStyle: 'italic',
    },
    // Choices Styles (from original RoleplayScenario.tsx & AskForMore)
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
    // Response Styles (from original RoleplayScenario.tsx & AskForMore)
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
    // Formula Styles (from AskForMore.tsx)
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
    // Follow-up Styles (from Generosity.tsx)
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
    // Alternative Styles (from original RoleplayScenario.tsx & Generosity.tsx)
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
    alternativeIconGradient: { // From Generosity.tsx and WhoWouldYouHire.tsx
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
    // Reflection Prompt Text (similar to original Journal Callout Title)
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
    // Conclusion Styles (from AskForMore.tsx & WhoWouldYouHire.tsx)
    conclusionTitle: { // Used for Final Screen Title
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '700',
    },
    conclusionText: { // Used for Final Screen Descriptions
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    conclusionClosing: { // Used for Final Screen alternativeClosing
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '600',
    },
    // Journal Callout (from original RoleplayScenario.tsx & AskForMore)
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
    // YouTube Thumbnail Styles (from original RoleplayScenario.tsx & AskForMore)
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
    // Modal Styles (from original RoleplayScenario.tsx & AskForMore)
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
