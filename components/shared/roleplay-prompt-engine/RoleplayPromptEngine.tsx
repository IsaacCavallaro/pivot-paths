import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { X, Check, Users, Award, Gift, ChevronRight } from 'lucide-react-native';
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
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= 6) {
            setCurrentScreen(currentScreen - 1);
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
        scrollToTop();
    };

    const handleTryItOnChoiceSelect = (questionNumber: number, choiceNumber: number) => {
        setSelectedChoices(prev => ({
            ...prev,
            [questionNumber]: choiceNumber
        }));
        scrollToTop();
    };

    const handleContinueRoleplay = () => {
        if (flowType === 'tryItOn') {
            handleTryItOnContinue();
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
            setCurrentScreen(0);
        } else if (currentScreen === 0) {
            setCurrentScreen(1);
        } else if (currentScreen === 1) {
            setCurrentScreen(2);
        } else if (currentScreen === 2) {
            setCurrentScreen(3);
        } else if (currentScreen === 3) {
            setCurrentScreen(4);
        } else if (currentScreen === 4) {
            setCurrentScreen(5);
        } else if (currentScreen === 5) {
            if (currentScenarioIndex < scenarios.length - 1) {
                setCurrentScenarioIndex(prev => prev + 1);
                setCurrentScreen(0);
                setSelectedChoices({});
            } else {
                setCurrentScreen(6);
            }
        } else if (currentScreen === 6) {
            onComplete();
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

    // TryItOn Specific Screens
    if (flowType === 'tryItOn') {
        const currentScenario = scenarios[currentScenarioIndex];

        // Screen 0: Scenario Intro
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

        // Screen 1: First Choice
        if (currentScreen === 1) {
            const selectedChoice = selectedChoices[1];

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

        // Screen 2: Response to first choice
        if (currentScreen === 2) {
            const selectedChoice = selectedChoices[1];
            const responseText = selectedChoice === 1 ? currentScenario.question1?.response1 : currentScenario.question1?.response2;

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
                                <Text style={styles.responseTitle}>Here's where you're at</Text>

                                <Text style={styles.responseText}>{responseText}</Text>

                                <PrimaryButton title="Continue" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 3: Second scenario question
        if (currentScreen === 3) {
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
                                <Text style={styles.scenarioText}>{currentScenario.question2?.text}</Text>

                                <PrimaryButton title="What will you do?" onPress={handleContinueRoleplay} />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 4: Second set of choices
        if (currentScreen === 4) {
            const selectedChoice = selectedChoices[2];

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

        // Screen 5: Response to second choice + Reflection
        if (currentScreen === 5) {
            const selectedChoice = selectedChoices[2];
            const responseText = selectedChoice === 1 ? currentScenario.question2?.response1 : currentScenario.question2?.response2;

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
                                <Text style={styles.responseTitle}>Here's where you're at</Text>

                                <Text style={styles.responseText}>{responseText}</Text>
                                <Text style={styles.responseText}>{currentScenario.reflection}</Text>

                                <PrimaryButton
                                    title={currentScenarioIndex < scenarios.length - 1 ? "Next Scenario" : "Continue to Final Reflection"}
                                    onPress={handleContinueRoleplay}
                                />
                            </Card>
                        </View>
                    </ScrollView>
                </View>
            );
        }

        // Screen 6: Final reflection with journal prompts
        if (currentScreen === 6) {
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
                                        onPress={() => Linking.openURL('https://pivotfordancers.com/services/mock-interviews/')}
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
                                <View style={styles.journalCallout}>
                                    <Text style={styles.journalCalloutTitle}>{finalScreen.journalSectionProps.dayTitle}</Text>
                                    <Text style={styles.journalCalloutText}>{finalScreen.journalSectionProps.journalInstruction}</Text>
                                </View>
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
});