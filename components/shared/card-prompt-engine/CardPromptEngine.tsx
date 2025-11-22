import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';
import { CardPromptEngineProps } from '@/types/cardPromptEngine';

const { width } = Dimensions.get('window');

export default function CardPromptEngine({
    onComplete,
    onBack,
    cardType,
    primaryButtonText,
    imageSource,
    iconComponent,
    introScreen,
    secondaryIntroScreen,
    cards,
    selectionScreen,
    reflectionScreen,
    finalScreen,
}: CardPromptEngineProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showNewBelief, setShowNewBelief] = useState(false);
    const [showSecondPhase, setShowSecondPhase] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [screenHistory, setScreenHistory] = useState<Array<{ index: number, showNew?: boolean, showPhase2?: boolean }>>([]);
    const [choices, setChoices] = useState<{ [key: string]: string }>({}); // NEW: For choice card type

    const { scrollViewRef, scrollToTop } = useScrollToTop();

    // Animation values
    const flipAnim = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBackPress = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartCards = () => {
        setScreenHistory([{ index: 0, showNew: false, showPhase2: false }]);
        setCurrentIndex(0);
        scrollToTop();
    };

    const handleContinueToSecondaryIntro = () => {
        setScreenHistory([{ index: -3, showNew: false, showPhase2: false }]);
        scrollToTop();
    };

    // NEW: Handle choice selection for choice card type
    const handleChoice = useCallback((choiceKey: string, selectedOption: string) => {
        const newChoices = { ...choices, [choiceKey]: selectedOption };
        setChoices(newChoices);

        const isLastCard = currentIndex === cards.length - 1;

        if (isLastCard) {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { index: -2, showNew: false, showPhase2: false }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        } else {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newIndex = currentIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentIndex(newIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newIndex + 1) / cards.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { index: newIndex, showNew: false, showPhase2: false }]);
                scrollToTop();
            });
        }
    }, [currentIndex, choices, cards.length, fadeAnim, progressAnim, scrollToTop]);

    const flipCard = useCallback(() => {
        flipAnim.setValue(0);
        cardScale.setValue(1);
        fadeAnim.setValue(1);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(cardScale, {
                    toValue: 0.95,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.8,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]),
            Animated.parallel([
                Animated.timing(flipAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(cardScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ])
        ]).start(() => {
            setShowNewBelief(true);
            setScreenHistory(prev => [...prev, { index: currentIndex, showNew: true, showPhase2: false }]);
        });
    }, [currentIndex, flipAnim, cardScale, fadeAnim]);

    const handleContinue = useCallback(() => {
        const isLastCard = currentIndex === cards.length - 1;

        // Handle flip card type
        if (cardType === "flip" && !showNewBelief) {
            flipCard();
            return;
        }

        // Handle method card type (two-phase display)
        if (cardType === "method" && !showSecondPhase) {
            setShowSecondPhase(true);
            setScreenHistory(prev => [...prev, { index: currentIndex, showNew: false, showPhase2: true }]);
            scrollToTop();
            return;
        }

        if (isLastCard) {
            // Smooth transition to selection or reflection screen
            const nextScreen = selectionScreen ? -4 : -2; // -4 for selection, -2 for reflection
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { index: nextScreen, showNew: false, showPhase2: false }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        } else {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newIndex = currentIndex + 1;

                // Reset all animations BEFORE updating state
                flipAnim.setValue(0);
                fadeAnim.setValue(0);
                cardScale.setValue(1);

                // Update state
                setCurrentIndex(newIndex);
                setShowNewBelief(false);
                setShowSecondPhase(false);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newIndex + 1) / cards.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { index: newIndex, showNew: false, showPhase2: false }]);
                scrollToTop();
            });
        }
    }, [cardType, showNewBelief, showSecondPhase, currentIndex, cards.length, selectionScreen, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

    const handleSelectOption = (id: number) => {
        setSelectedOption(id);
    };

    const handleConfirmSelection = (optionId?: number) => {
        const selectedId = optionId || selectedOption;
        if (!selectedId) return;

        setSelectedOption(selectedId);

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            setScreenHistory(prev => [...prev, { index: -1, showNew: false, showPhase2: false }]);
            fadeAnim.setValue(1);
            scrollToTop();
        });
    };

    const handleComplete = () => {
        Animated.sequence([
            Animated.timing(cardScale, {
                toValue: 1.02,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            onComplete();
        });
    };

    const goBack = () => {
        if (screenHistory.length <= 1) {
            setScreenHistory([]);
            setCurrentIndex(0);
            setShowNewBelief(false);
            setShowSecondPhase(false);
            setSelectedOption(null);
            setChoices({}); // NEW: Reset choices
            flipAnim.setValue(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.index === -1 || prevScreen.index === -2 || prevScreen.index === -3 || prevScreen.index === -4) {
            setShowNewBelief(false);
            setShowSecondPhase(false);
        } else {
            setCurrentIndex(prevScreen.index);
            setShowNewBelief(prevScreen.showNew || false);
            setShowSecondPhase(prevScreen.showPhase2 || false);
            if (cardType === "flip") {
                flipAnim.setValue(prevScreen.showNew ? 1 : 0);
            }
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Enhanced flip animation interpolations with perspective
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
        transform: [
            { perspective: 1000 },
            { rotateY: frontInterpolate },
            { scale: cardScale }
        ],
        opacity: fadeAnim
    };

    const backAnimatedStyle = {
        transform: [
            { perspective: 1000 },
            { rotateY: backInterpolate },
            { scale: cardScale }
        ],
        opacity: fadeAnim
    };

    // Update progress when currentIndex changes
    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentIndex + 1) / cards.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentIndex, cards.length, progressAnim]);

    // Current screen determination
    const currentHistoryScreen = screenHistory[screenHistory.length - 1];
    const screenIdentifier = currentHistoryScreen ? currentHistoryScreen.index : null;

    // NEW: Custom content for reflection screen with choices data
    const renderCustomReflectionContent = () => {
        if (reflectionScreen?.customContent && typeof reflectionScreen.customContent === 'function') {
            return reflectionScreen.customContent(choices);
        }
        return reflectionScreen?.customContent;
    };

    // Intro Screen (with Journal)
    if (screenHistory.length === 0) {
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
                                {iconComponent || (imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                ))}
                            </View>

                            <Text style={commonStyles.introTitle}>{introScreen.title}</Text>
                            {introScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={commonStyles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            {/* Render subtext if provided */}
                            {introScreen.subtext && (
                                <Text style={styles.subtext}>
                                    {introScreen.subtext}
                                </Text>
                            )}

                            <JournalEntrySection {...introScreen.journalSectionProps} />

                            <PrimaryButton title={introScreen.buttonText} onPress={secondaryIntroScreen ? handleContinueToSecondaryIntro : handleStartCards} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Secondary Intro Screen (if provided)
    if (screenIdentifier === -3 && secondaryIntroScreen) {
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
                                {iconComponent || (imageSource && (
                                    <Image
                                        source={{ uri: imageSource }}
                                        style={commonStyles.heroImage}
                                    />
                                ))}
                            </View>

                            <Text style={styles.introTitle}>{secondaryIntroScreen.title}</Text>
                            {secondaryIntroScreen.descriptions.map((desc, index) => (
                                <Text key={index} style={styles.introDescription}>
                                    {desc}
                                </Text>
                            ))}

                            <PrimaryButton title={secondaryIntroScreen.buttonText} onPress={handleStartCards} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Selection Screen (for challenge selection flow)
    if (screenIdentifier === -4 && selectionScreen) {
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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                {selectionScreen.title && (
                                    <Text style={styles.selectionTitle}>{selectionScreen.title}</Text>
                                )}
                                <Text style={styles.selectionDescription}>
                                    {selectionScreen.description}
                                </Text>

                                {selectionScreen.useButtons ? (
                                    // Button-based selection (for debt methods)
                                    <View style={styles.methodButtonsContainer}>
                                        {selectionScreen.options.map((option) => (
                                            <PrimaryButton
                                                key={option.id}
                                                title={option.title}
                                                onPress={() => handleConfirmSelection(option.id)}
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    // Card-based selection (for savings challenges)
                                    <>
                                        {selectionScreen.options.map((option) => (
                                            <TouchableOpacity
                                                key={option.id}
                                                style={[
                                                    styles.selectionOption,
                                                    selectedOption === option.id && styles.selectionOptionSelected
                                                ]}
                                                onPress={() => handleSelectOption(option.id)}
                                            >
                                                {option.icon && (
                                                    <View style={styles.selectionOptionIcon}>
                                                        {option.icon}
                                                    </View>
                                                )}
                                                <View style={styles.selectionOptionText}>
                                                    <Text style={styles.selectionOptionTitle}>
                                                        {option.title}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}

                                        {selectionScreen.footer && (
                                            <Text style={styles.selectionFooter}>
                                                {selectionScreen.footer}
                                            </Text>
                                        )}

                                        <PrimaryButton
                                            title={selectionScreen.buttonText || "Confirm Selection"}
                                            onPress={() => handleConfirmSelection()}
                                            disabled={!selectedOption}
                                        />
                                    </>
                                )}
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (screenIdentifier === -2 && reflectionScreen) {
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
                            <View style={commonStyles.reflectionHeader}>
                                <Text style={styles.reflectionTitle}>{reflectionScreen.title}</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                {reflectionScreen.description && (
                                    <Text style={commonStyles.reflectionDescription}>
                                        {reflectionScreen.description}
                                    </Text>
                                )}
                            </View>

                            {renderCustomReflectionContent()}

                            {reflectionScreen.journalSectionProps && (
                                <JournalEntrySection {...reflectionScreen.journalSectionProps} />
                            )}

                            <PrimaryButton
                                title={reflectionScreen.buttonText}
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { index: -1 }]);
                                    scrollToTop();
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen (with Journal)
    if (screenIdentifier === -1) {
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
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <View style={commonStyles.introIconContainer}>
                                    {iconComponent || (imageSource && (
                                        <Image
                                            source={{ uri: imageSource }}
                                            style={commonStyles.heroImage}
                                        />
                                    ))}
                                </View>

                                <View style={commonStyles.finalHeader}>
                                    <Text style={commonStyles.finalHeading}>{finalScreen.title}</Text>
                                </View>

                                <View style={commonStyles.finalTextContainer}>
                                    {finalScreen.descriptions.map((desc, index) => (
                                        <Text key={index} style={commonStyles.finalText}>
                                            {desc}
                                        </Text>
                                    ))}
                                </View>

                                {finalScreen.customContent}

                                <JournalEntrySection {...finalScreen.journalSectionProps} />

                                {finalScreen.alternativeClosing && (
                                    <Text style={styles.alternativeClosing}>
                                        {finalScreen.alternativeClosing}
                                    </Text>
                                )}

                                <View style={commonStyles.finalButtonContainer}>
                                    <PrimaryButton
                                        title={finalScreen.buttonText}
                                        onPress={handleComplete}
                                    />
                                </View>
                            </Card>
                        </Animated.View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Card Screens (Flip, Swipe, Method, Challenge, Benefit, or Choice)
    const currentCard = cards[currentIndex];

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const titleText = cardType === 'method' || cardType === 'challenge' || cardType === 'benefit'
        ? `${cardType === 'method' ? 'Method' : cardType === 'benefit' ? 'Benefit' : ''} ${currentIndex + 1} of ${cards.length}`.trim()
        : cardType === 'choice'
            ? `${currentIndex + 1} of ${cards.length} choices`
            : `${currentIndex + 1} of ${cards.length} ${cardType === 'swipe' ? 'activities' : 'validations'}`;

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={titleText}
                progress={progressWidth}
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
                    {cardType === "flip" ? (
                        <View style={styles.flipContainer}>
                            <Animated.View style={[styles.choiceCard, styles.cardFace, frontAnimatedStyle]}>
                                <Text style={styles.beliefLabel}>What I used to believe:</Text>
                                <View style={styles.beliefCard}>
                                    <View style={styles.oldBeliefCard}>
                                        <Text style={styles.oldBeliefText}>"{currentCard.oldBelief}"</Text>
                                    </View>
                                </View>
                                <PrimaryButton title="See the alternative" onPress={handleContinue} />
                            </Animated.View>

                            <Animated.View style={[styles.choiceCard, styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                                <Text style={styles.beliefLabel}>What I can say instead:</Text>
                                <View style={styles.beliefCard}>
                                    <View style={styles.newBeliefCard}>
                                        <Text style={styles.newBeliefText}>"{currentCard.newBelief}"</Text>
                                    </View>
                                </View>
                                <PrimaryButton title={currentCard.buttonText} onPress={handleContinue} />
                            </Animated.View>
                        </View>
                    ) : cardType === "method" ? (
                        <Animated.View style={[styles.methodContainer, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
                            <Card style={commonStyles.baseCard}>
                                {!showSecondPhase ? (
                                    <>
                                        <Text style={styles.methodTitle}>{currentCard.title}</Text>
                                        <Text style={styles.methodDescription}>{currentCard.description}</Text>

                                        {currentCard.breakdown && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>The Breakdown:</Text>
                                                <Text style={styles.sectionContent}>{currentCard.breakdown}</Text>
                                            </View>
                                        )}

                                        {currentCard.strategy && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>The Strategy:</Text>
                                                <Text style={styles.sectionContent}>{currentCard.strategy}</Text>
                                            </View>
                                        )}

                                        {currentCard.why && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>The Why:</Text>
                                                <Text style={styles.sectionContent}>{currentCard.why}</Text>
                                            </View>
                                        )}

                                        {currentCard.result && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>The Result:</Text>
                                                <Text style={styles.sectionContent}>{currentCard.result}</Text>
                                            </View>
                                        )}

                                        {currentCard.bestFor && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Best for:</Text>
                                                <Text style={styles.sectionContent}>{currentCard.bestFor}</Text>
                                            </View>
                                        )}

                                        <PrimaryButton title="How to start" onPress={handleContinue} />
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.howToTitle}>How to Start {currentCard.title}</Text>

                                        {currentCard.steps && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Do this:</Text>
                                                {currentCard.steps.map((step, index) => (
                                                    <Text key={index} style={styles.stepText}>
                                                        {index + 1}. {step}
                                                    </Text>
                                                ))}
                                            </View>
                                        )}

                                        {currentCard.proTip && (
                                            <View style={styles.section}>
                                                <Text style={styles.sectionTitle}>Pro Tip:</Text>
                                                <Text style={styles.proTipText}>{currentCard.proTip}</Text>
                                            </View>
                                        )}

                                        <PrimaryButton
                                            title={currentIndex < cards.length - 1 ? 'Next Method' : (selectionScreen ? 'Choose Strategy' : 'See All Methods')}
                                            onPress={handleContinue}
                                        />
                                    </>
                                )}
                            </Card>
                        </Animated.View>
                    ) : cardType === "challenge" ? (
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.challengeTitle}>{currentCard.title}</Text>
                                <Text style={styles.challengeDescription}>{currentCard.description}</Text>

                                <View style={styles.infoCard}>
                                    {currentCard.goal && (
                                        <>
                                            <Text style={styles.infoLabel}>The Goal:</Text>
                                            <Text style={styles.infoText}>{currentCard.goal}</Text>
                                        </>
                                    )}

                                    {currentCard.target && (
                                        <>
                                            <Text style={styles.infoLabel}>The Target:</Text>
                                            <Text style={styles.infoText}>{currentCard.target}</Text>
                                        </>
                                    )}

                                    {currentCard.result && (
                                        <>
                                            <Text style={styles.infoLabel}>The Result:</Text>
                                            <Text style={styles.infoText}>{currentCard.result}</Text>
                                        </>
                                    )}

                                    {currentCard.bestFor && (
                                        <>
                                            <Text style={styles.infoLabel}>Best for:</Text>
                                            <Text style={styles.infoText}>{currentCard.bestFor}</Text>
                                        </>
                                    )}
                                </View>

                                {currentCard.steps && currentCard.steps.length > 0 && (
                                    <>
                                        <Text style={styles.sectionTitle}>How to Do It</Text>
                                        <View style={styles.stepsContainer}>
                                            {currentCard.steps.map((step, index) => (
                                                <View key={index} style={styles.stepRow}>
                                                    <View style={styles.stepNumber}>
                                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                                    </View>
                                                    <Text style={styles.stepRowText}>{step}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}

                                {currentCard.proTip && (
                                    <View style={styles.proTipContainer}>
                                        <Text style={styles.proTipContainerText}>Pro Tip: {currentCard.proTip}</Text>
                                    </View>
                                )}

                                <PrimaryButton
                                    title={currentIndex < cards.length - 1 ? 'Next Challenge' : 'Choose Your Challenge'}
                                    onPress={handleContinue}
                                />
                            </Card>
                        </Animated.View>
                    ) : cardType === "benefit" ? (
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: cardScale }] }}>
                            <Card style={commonStyles.baseCard}>
                                <Text style={styles.benefitTitle}>{currentCard.title}</Text>
                                <Text style={styles.benefitDescription}>{currentCard.description}</Text>

                                <View style={styles.benefitSections}>
                                    {currentCard.whatItIs && (
                                        <View style={styles.benefitSection}>
                                            <Text style={styles.benefitSectionTitle}>What it is:</Text>
                                            <Text style={styles.benefitSectionContent}>{currentCard.whatItIs}</Text>
                                        </View>
                                    )}

                                    {currentCard.whyValuable && (
                                        <View style={styles.benefitSection}>
                                            <Text style={styles.benefitSectionTitle}>Why it's valuable:</Text>
                                            <Text style={styles.benefitSectionContent}>{currentCard.whyValuable}</Text>
                                        </View>
                                    )}

                                    {currentCard.howToAsk && (
                                        <View style={styles.benefitSection}>
                                            <Text style={styles.benefitSectionTitle}>How to ask for it:</Text>
                                            <Text style={styles.benefitSectionContent}>{currentCard.howToAsk}</Text>
                                        </View>
                                    )}

                                    {currentCard.bestFor && (
                                        <View style={styles.benefitSection}>
                                            <Text style={styles.benefitSectionTitle}>Best for:</Text>
                                            <Text style={styles.benefitSectionContent}>{currentCard.bestFor}</Text>
                                        </View>
                                    )}
                                </View>

                                <PrimaryButton
                                    title={currentCard.buttonText}
                                    onPress={handleContinue}
                                />
                            </Card>
                        </Animated.View>
                    ) : cardType === "choice" ? (
                        // NEW: Choice card type
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: cardScale }]
                                }
                            ]}
                        >
                            <Text style={styles.choiceQuestion}>{currentCard.question}</Text>

                            <View style={styles.choiceButtons}>
                                <PrimaryButton
                                    title={currentCard.option1 || ''}
                                    onPress={() => handleChoice(currentCard.resultKey || '', currentCard.option1 || '')}
                                    variant="secondary"
                                    style={styles.choiceButton}
                                />

                                <PrimaryButton
                                    title={currentCard.option2 || ''}
                                    onPress={() => handleChoice(currentCard.resultKey || '', currentCard.option2 || '')}
                                    variant="secondary"
                                    style={styles.choiceButton}
                                />
                            </View>
                        </Animated.View>
                    ) : (
                        <Animated.View style={[styles.choiceCard, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
                            <View style={styles.swipeCard}>
                                <Text style={styles.swipeText}>"{currentCard.prompt}"</Text>
                            </View>
                            <PrimaryButton title={currentCard.buttonText} onPress={handleContinue} />
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    introTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    introDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    subtext: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#647C90',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 0,
        fontWeight: '600',
    },
    // Card styles
    choiceCard: {
        width: width * 0.85,
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    // NEW: Choice card specific styles
    choiceQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
        fontWeight: '700',
    },
    choiceButtons: {
        gap: 16,
        width: '100%',
    },
    choiceButton: {
        minHeight: 60,
    },
    // Flip Card Styles
    flipContainer: {
        width: width * 0.85,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardFace: {
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    cardBack: {
        transform: [{ rotateY: '180deg' }],
    },
    beliefLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    beliefCard: {
        width: '100%',
        height: 180,
        marginBottom: 40,
    },
    oldBeliefCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oldBeliefText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    newBeliefCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newBeliefText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    // Swipe Card Styles
    swipeCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
        minHeight: 200,
        justifyContent: 'center',
    },
    swipeText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
    },
    // Method Card Styles
    methodContainer: {
        width: width * 0.85,
    },
    methodTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    howToTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    methodDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    section: {
        marginBottom: 30,
        alignSelf: 'stretch',
    },
    sectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        marginBottom: 12,
    },
    sectionContent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 22,
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 22,
        marginBottom: 8,
    },
    proTipText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 16,
        color: '#647C90',
        lineHeight: 22,
    },
    // Challenge Card Styles
    challengeTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    challengeDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        width: '100%',
    },
    infoLabel: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
        marginBottom: 5,
    },
    infoText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#746C70',
        marginBottom: 15,
        lineHeight: 22,
    },
    stepsContainer: {
        marginBottom: 20,
        width: '100%',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    stepNumber: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#928490',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 2,
    },
    stepNumberText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: '#E2DED0',
    },
    stepRowText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#4E4F50',
        flex: 1,
        lineHeight: 22,
    },
    proTipContainer: {
        backgroundColor: 'rgba(90, 125, 123, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 30,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    proTipContainerText: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#4E4F50',
        lineHeight: 22,
    },
    // Benefit Card Styles
    benefitTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 16,
    },
    benefitDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    benefitSections: {
        width: '100%',
        marginBottom: 30,
    },
    benefitSection: {
        marginBottom: 25,
    },
    benefitSectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#4E4F50',
        marginBottom: 8,
    },
    benefitSectionContent: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        lineHeight: 22,
    },
    // Selection Screen Styles
    selectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 10,
    },
    selectionDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        marginBottom: 30,
    },
    selectionOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(146, 132, 144, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        width: '100%',
    },
    selectionOptionSelected: {
        backgroundColor: 'rgba(90, 125, 123, 0.2)',
        borderWidth: 2,
        borderColor: '#928490',
    },
    selectionOptionIcon: {
        marginRight: 15,
    },
    selectionOptionText: {
        flex: 1,
    },
    selectionOptionTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#4E4F50',
    },
    selectionFooter: {
        fontFamily: 'Montserrat-Italic',
        fontSize: 15,
        color: '#746C70',
        textAlign: 'center',
        marginVertical: 20,
    },
    methodButtonsContainer: {
        gap: 20,
        marginBottom: 40,
        width: '100%',
    },
});