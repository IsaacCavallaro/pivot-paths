import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Check, Sparkles, Target, TrendingUp, Users } from 'lucide-react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { ThisOrThatEngineProps } from '@/types/thisOrThatPromptEngine';

const { width, height } = Dimensions.get('window');

export default function ThisOrThatEngine({
    onComplete,
    onBack,
    gameTitle,
    gameDescription,
    choices,
    totalChoices,
    pathTag,
    day,
    category,
    pathTitle,
    dayTitle,
    morningJournalPrompt,
    introButtonText = "Start dreaming",
    introScreenDescription,
    morningIntroText,
    reflectionTitle,
    reflectionDescription,
    finalReflectionPrompt,
    finalJournalPrompt,
    getStoryText,
    storyStartScreen,
    storyEndScreen,
    ebookTitle,
    ebookDescription,
    ebookLink,
    alternativeClosing,
    customFinalHeader,
    customFinalContent,
    skipStoryScreens = false,
    showEbookCallout = true
}: ThisOrThatEngineProps) {
    const [currentScreen, setCurrentScreen] = useState(-1);
    const [randomizedChoices, setRandomizedChoices] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [gameChoices, setGameChoices] = useState<{ [key: string]: string }>({});

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling(pathTag);
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling(pathTag);

    useEffect(() => {
        if (choices && choices.length > 0) {
            const shuffled = [...choices].sort(() => Math.random() - 0.5);
            setRandomizedChoices(shuffled);
        }
    }, [choices]);

    const handleStartGame = () => {
        setCurrentScreen(0);
        scrollToTop();
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    };

    const goBack = () => {
        if (currentScreen === -1) {
            if (onBack) onBack();
        } else if (currentScreen === 0) {
            setCurrentScreen(-1);
        } else if (currentScreen === 1) {
            setCurrentScreen(0);
        } else if (currentScreen > 1 && currentScreen <= totalChoices) {
            setCurrentScreen(currentScreen - 1);
        } else if (currentScreen > totalChoices) {
            setCurrentScreen(currentScreen - 1);
        }
        scrollToTop();
    };

    const handleContinue = async () => {
        if (selectedOption === null || isTransitioning) return;

        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 150));

        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (currentChoice) {
            const newChoices = { ...gameChoices, [currentChoice.storyKey]: selectedOption };
            setGameChoices(newChoices);
        }

        if (currentScreen < totalChoices) {
            setCurrentScreen(currentScreen + 1);
            setSelectedOption(null);
        } else {
            // Handle different flow patterns based on component needs
            if (skipStoryScreens) {
                // For components like DecisionMaking that go directly to final screen
                setCurrentScreen(storyEndScreen + 1);
            } else {
                setCurrentScreen(storyStartScreen);
            }
        }
        scrollToTop();
        setIsTransitioning(false);
    };

    const handleContinueStory = () => {
        if (currentScreen < storyEndScreen) {
            setCurrentScreen(currentScreen + 1);
        } else if (currentScreen === storyEndScreen) {
            setCurrentScreen(storyEndScreen + 1);
        } else if (currentScreen === storyEndScreen + 1) {
            setCurrentScreen(storyEndScreen + 2);
        } else {
            onComplete();
        }
        scrollToTop();
    };

    const handleOpenEbook = () => {
        Linking.openURL(ebookLink);
    };

    // Helper to render text as array or string
    const renderTextContent = (content: string | string[], styleKey: string) => {
        const textStyle = styleKey === 'reflection' ? commonStyles.reflectionDescription : styles.storyText;

        if (Array.isArray(content)) {
            return content.map((paragraph, index) => (
                <Text key={index} style={textStyle}>
                    {paragraph}
                </Text>
            ));
        }
        return <Text style={textStyle}>{content}</Text>;
    };

    // Helper to render custom final header with icons
    const renderCustomFinalHeader = () => {
        if (!customFinalHeader) return null;

        const { icon: IconComponent, title } = customFinalHeader;
        return (
            <View style={styles.finalHeader}>
                <IconComponent size={24} color="#928490" />
                <Text style={styles.finalHeading}>{title}</Text>
                <IconComponent size={24} color="#928490" />
            </View>
        );
    };

    // Morning Journal Screen (screen -1)
    if (currentScreen === -1) {
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

                            <Text style={commonStyles.introTitle}>{gameTitle}</Text>

                            <Text style={commonStyles.introDescription}>
                                {morningIntroText || "You're back for more! This is where we're diving deeper into becoming the Expansive Dreamer we talked about on Day 1."}
                            </Text>

                            <Text style={commonStyles.introDescription}>
                                {gameDescription}
                            </Text>

                            <JournalEntrySection
                                pathTag={pathTag}
                                day={day}
                                category={category}
                                pathTitle={pathTitle}
                                dayTitle={dayTitle}
                                journalInstruction={morningJournalPrompt}
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Game Intro Screen (screen 0)
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
                            <View style={commonStyles.introIconContainer}>
                                <Image
                                    source={{ uri: 'https://pivotfordancers.com/assets/logo.png' }}
                                    style={commonStyles.heroImage}
                                />
                            </View>

                            <Text style={commonStyles.introTitle}>{gameTitle}</Text>

                            <Text style={commonStyles.introDescription}>
                                {introScreenDescription || "This is a game of instincts. Choose the answer that you resonate with the most to help you dream bigger about what life after dance can be. Don't think too much! There's no right or wrong. Let's see what you can dream up."}
                            </Text>

                            <PrimaryButton title={introButtonText} onPress={() => setCurrentScreen(1)} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Choice Screens (1 to totalChoices)
    if (currentScreen >= 1 && currentScreen <= totalChoices) {
        const choiceIndex = currentScreen - 1;
        const currentChoice = randomizedChoices[choiceIndex];

        if (!currentChoice) return null;

        return (
            <View style={commonStyles.container}>
                <StickyHeader
                    onBack={goBack}
                    title={`${currentScreen} of ${totalChoices}`}
                    progress={currentScreen / totalChoices}
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
                            <View style={styles.choiceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentChoice.option1 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentChoice.option1)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentChoice.option1 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentChoice.option1 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentChoice.option1}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.choiceButton,
                                        selectedOption === currentChoice.option2 && styles.choiceButtonSelected
                                    ]}
                                    onPress={() => setSelectedOption(currentChoice.option2)}
                                    activeOpacity={0.8}
                                    disabled={isTransitioning}
                                >
                                    <View style={styles.optionContent}>
                                        {selectedOption === currentChoice.option2 && (
                                            <View style={styles.selectedIndicator}>
                                                <Check size={16} color="#E2DED0" />
                                            </View>
                                        )}
                                        <Text style={[
                                            styles.choiceButtonText,
                                            selectedOption === currentChoice.option2 && styles.choiceButtonTextSelected
                                        ]}>
                                            {currentChoice.option2}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={handleContinue}
                                disabled={selectedOption === null || isTransitioning}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Story Screens (including transition screens)
    if (currentScreen >= storyStartScreen && currentScreen <= storyEndScreen) {
        const storyText = getStoryText(currentScreen, gameChoices);
        const isTitle = currentScreen === storyStartScreen;
        const isFinalStory = currentScreen === storyEndScreen;

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
                            {isTitle ? (
                                <View style={styles.storyTitleContainer}>
                                    <Text style={styles.storyTitle}>{storyText}</Text>
                                    <View style={styles.titleUnderline} />
                                </View>
                            ) : (
                                <View style={styles.storyTextContainer}>
                                    {isFinalStory && customFinalHeader && renderCustomFinalHeader()}
                                    <Text style={styles.storyText}>{storyText}</Text>
                                </View>
                            )}

                            <PrimaryButton
                                title={isFinalStory ? 'Continue' : 'Continue'}
                                onPress={handleContinueStory}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen === storyEndScreen + 1) {
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

                            <Text style={commonStyles.reflectionTitle}>{reflectionTitle}</Text>

                            {renderTextContent(reflectionDescription, 'reflection')}

                            <PrimaryButton title="Continue" onPress={handleContinueStory} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with End of Day Journal
    if (currentScreen === storyEndScreen + 2) {
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

                            {customFinalContent ? (
                                <View style={styles.storyTextContainer}>
                                    {renderCustomFinalHeader()}
                                    {renderTextContent(customFinalContent, 'story')}
                                </View>
                            ) : (
                                <View style={styles.storyTextContainer}>
                                    {renderTextContent(finalReflectionPrompt, 'story')}
                                </View>
                            )}

                            {/* Ebook Callout */}
                            {showEbookCallout && ebookTitle && ebookDescription && (
                                <View style={styles.ebookCard}>
                                    <Text style={styles.ebookTitle}>{ebookTitle}</Text>
                                    <Text style={styles.ebookDescription}>
                                        {ebookDescription}
                                    </Text>
                                    <PrimaryButton
                                        title="Learn More"
                                        onPress={handleOpenEbook}
                                        style={styles.ebookButton}
                                    />
                                </View>
                            )}

                            <JournalEntrySection
                                pathTag={pathTag}
                                journalInstruction={finalJournalPrompt || "Before we bring today's session to a close, let's take a moment to check in with yourself again. How are you feeling after today's journey?"}
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                {alternativeClosing}
                            </Text>

                            <PrimaryButton
                                title="Mark As Complete"
                                onPress={onComplete}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    choiceButtons: {
        gap: 20,
    },
    choiceButton: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 80,
        justifyContent: 'center',
    },
    choiceButtonSelected: {
        backgroundColor: 'rgba(146, 132, 144, 0.3)',
        borderColor: '#928490',
        borderWidth: 2,
    },
    choiceButtonText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
    },
    choiceButtonTextSelected: {
        color: '#4E4F50',
        fontWeight: '600',
    },
    optionContent: {
        paddingRight: 40,
    },
    selectedIndicator: {
        position: 'absolute',
        top: '50%',
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -12 }],
    },
    storyTitleContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    storyTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 32,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 38,
        fontWeight: '700',
    },
    titleUnderline: {
        height: 4,
        width: 60,
        backgroundColor: '#928490',
        borderRadius: 2,
        marginTop: 16,
        opacity: 0.6,
    },
    storyTextContainer: {
        width: '100%',
        marginBottom: 32,
    },
    storyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 28,
        marginTop: 10,
    },
    finalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 12,
    },
    finalHeading: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    ebookCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    ebookTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    ebookDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    ebookButton: {
        alignSelf: 'center',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 32,
        marginTop: 0,
        fontWeight: '600',
    },
});