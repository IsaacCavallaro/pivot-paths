import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface ValidationPair {
    id: number;
    oldBelief: string;
    newBelief: string;
    buttonText: string;
}

const validationPairs: ValidationPair[] = [
    {
        id: 1,
        oldBelief: "I need applause to feel accomplished.",
        newBelief: "I celebrate myself when I show up, try, and grow.",
        buttonText: "That's better!"
    },
    {
        id: 2,
        oldBelief: "I only know I'm good enough when others say it.",
        newBelief: "I decide what's enough for me.",
        buttonText: "Ok strong inner monologue!"
    },
    {
        id: 3,
        oldBelief: "My resume proves my worth.",
        newBelief: "I'm worthy, no matter what I've booked.",
        buttonText: "Unshakable confidence!"
    },
    {
        id: 4,
        oldBelief: "Other people's approval keeps me going.",
        newBelief: "I'm giving myself permission to feel joy and fulfillment.",
        buttonText: "Yes, that's sustainable!"
    },
    {
        id: 5,
        oldBelief: "I'll never measure up to their expectations.",
        newBelief: "I set my own standards and only need to be better than yesterday.",
        buttonText: "Growth mindset unlocked!"
    }
];

interface LettingGoOfValidationProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function LettingGoOfValidation({ onComplete, onBack }: LettingGoOfValidationProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewBelief, setShowNewBelief] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('mindset-shifts');

    // Animation values
    const flipAnim = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ pairIndex: 0, showNew: false }]);
        scrollToTop();
    };

    const handleContinueToValidation = () => {
        setScreenHistory([{ pairIndex: -3, showNew: false }]);
        scrollToTop();
    };

    const flipCard = useCallback(() => {
        // Reset animations first
        flipAnim.setValue(0);
        cardScale.setValue(1);
        fadeAnim.setValue(1);

        // Scale down slightly before flip for more natural feel
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
            setScreenHistory(prev => [...prev, { pairIndex: currentPairIndex, showNew: true }]);
        });
    }, [currentPairIndex, flipAnim, cardScale, fadeAnim]);

    const handleContinue = useCallback(() => {
        if (showNewBelief) {
            if (currentPairIndex < validationPairs.length - 1) {
                // Fade out current card
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    const newPairIndex = currentPairIndex + 1;

                    // Reset all animations BEFORE updating state
                    flipAnim.setValue(0);
                    fadeAnim.setValue(0);
                    cardScale.setValue(1);

                    // Update state
                    setCurrentPairIndex(newPairIndex);
                    setShowNewBelief(false);

                    // Animate in the next card with a slight delay
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.spring(progressAnim, {
                                toValue: (newPairIndex + 1) / validationPairs.length,
                                tension: 50,
                                friction: 7,
                                useNativeDriver: false,
                            })
                        ]).start();
                    }, 50);

                    setScreenHistory(prev => [...prev, { pairIndex: newPairIndex, showNew: false }]);
                    scrollToTop();
                });
            } else {
                // Smooth transition to reflection screen
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setScreenHistory(prev => [...prev, { pairIndex: -2, showNew: false }]);
                    fadeAnim.setValue(1);
                    scrollToTop();
                });
            }
        } else {
            flipCard();
        }
    }, [showNewBelief, currentPairIndex, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

    const handleComplete = () => {
        // Add a subtle scale animation on complete
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
            setCurrentPairIndex(0);
            setShowNewBelief(false);
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
        if (prevScreen.pairIndex === -1 || prevScreen.pairIndex === -2 || prevScreen.pairIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentPairIndex(prevScreen.pairIndex);
            setShowNewBelief(prevScreen.showNew);
            // Reset flip animation based on whether we're going back to new or old belief
            flipAnim.setValue(prevScreen.showNew ? 1 : 0);
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

    // Add perspective for more realistic 3D effect
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

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentPairIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentPairIndex + 1) / validationPairs.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentPairIndex]);

    // Intro Screen with Morning Journal
    if (screenHistory.length === 0) {
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

                            <Text style={commonStyles.introTitle}>Letting Go of Validation</Text>
                            <Text style={commonStyles.introDescription}>
                                As dancers, we're used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet? Let's practice rewriting validation so it comes from you.
                            </Text>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="2"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Letting Go Of Validation"
                                journalInstruction="Before we begin, take a moment to reflect: Where do you currently seek validation in your life and career?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Start" onPress={handleContinueToValidation} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Validation Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.pairIndex === -3) {
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

                            <Text style={styles.introTitle}>Letting Go of Validation</Text>
                            <Text style={styles.introDescription}>
                                As dancers, we're used to applause, casting lists, and approval from teachers and directors. But what happens when those voices go quiet? Let's practice rewriting validation so it comes from you.
                            </Text>

                            <PrimaryButton title="Start Rewriting" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen.pairIndex === -2) {
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
                                <Text style={styles.reflectionTitle}>Internal vs External Validation</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Validation feels different when it comes from within. Practice these reframes out loud, and notice how it shifts your energy. When you validate yourself, external praise becomes extra, not essential.
                                </Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { pairIndex: -1, showNew: false }]);
                                    scrollToTop();
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Final Screen with End of Day Journal
    if (currentScreen.pairIndex === -1) {
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

                            <View style={commonStyles.finalHeader}>
                                <Text style={commonStyles.finalHeading}>Now It's Your Turn</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    It's not easy to let go of external validation, especially when it's been the primary measure of success throughout your dance career. But as challenging as it is, learning to validate yourself is the key to lasting confidence and fulfillment.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="mindset-shifts"
                                day="2"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Letting Go Of Validation"
                                journalInstruction="Reflect on today's practice. Which validation reframe resonated most with you, and how can you apply it in your daily life?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for the next step.
                            </Text>

                            <View style={commonStyles.finalButtonContainer}>
                                <PrimaryButton
                                    title="Mark As Complete"
                                    onPress={handleComplete}
                                />
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Belief Screens
    const currentPair = validationPairs[currentPairIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentPairIndex + 1} of ${validationPairs.length}`}
                progress={(currentPairIndex + 1) / validationPairs.length}
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
                    <View style={styles.flipContainer}>
                        {/* Front of card (old belief view) */}
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                styles.cardFace,
                                frontAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.beliefLabel}>
                                What I used to believe:
                            </Text>

                            <View style={styles.beliefCard}>
                                <View style={styles.oldBeliefCard}>
                                    <Text style={styles.oldBeliefText}>
                                        "{currentPair.oldBelief}"
                                    </Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title="See the alternative"
                                onPress={handleContinue}
                            />
                        </Animated.View>

                        {/* Back of card (new belief view) */}
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                styles.cardFace,
                                styles.cardBack,
                                backAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.beliefLabel}>
                                What I can say instead:
                            </Text>

                            <View style={styles.beliefCard}>
                                <View style={styles.newBeliefCard}>
                                    <Text style={styles.newBeliefText}>
                                        "{currentPair.newBelief}"
                                    </Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title={currentPair.buttonText}
                                onPress={handleContinue}
                            />
                        </Animated.View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Intro screen styles
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
    // Flip container and card styles for entire card flip
    flipContainer: {
        width: width * 0.85,
        height: 400, // Fixed height to prevent layout shift during flip
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceCard: {
        width: '100%',
        borderRadius: 24,
        backgroundColor: '#F5F5F5',
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        position: 'absolute',
        top: 0,
        left: 0,
        backfaceVisibility: 'hidden',
    },
    cardFace: {
        width: '100%',
        height: '100%',
    },
    cardBack: {
        position: 'absolute',
        top: 0,
        left: 0,
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
    alternativeClosing: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 0,
        fontWeight: '600',
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
});