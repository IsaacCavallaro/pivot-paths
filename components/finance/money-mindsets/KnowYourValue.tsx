import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Linking, Animated, ScrollView } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface ValuePair {
    id: number;
    oldStatement: string;
    newStatement: string;
    buttonText: string;
}

const valuePairs: ValuePair[] = [
    {
        id: 1,
        oldStatement: "I don't want to seem greedy if I ask for more.",
        newStatement: "Asking for fair pay is respecting myself, not being greedy.",
        buttonText: "Exactly!"
    },
    {
        id: 2,
        oldStatement: "I should be grateful for any opportunity.",
        newStatement: "Gratitude doesn't mean undercutting myself. I can be thankful and well-compensated.",
        buttonText: "So true!"
    },
    {
        id: 3,
        oldStatement: "I can't negotiate. I might lose the job.",
        newStatement: "Negotiation shows confidence. The right opportunity won't disappear just because I ask.",
        buttonText: "Totally!"
    },
    {
        id: 4,
        oldStatement: "Money doesn't matter if I love what I do.",
        newStatement: "Loving what I do and earning well is possible. Passion and pay can co-exist.",
        buttonText: "Amen!"
    },
    {
        id: 5,
        oldStatement: "I should just take what's offered.",
        newStatement: "Taking what's offered keeps me stuck. Asking for more raises the bar, for me and for others.",
        buttonText: "So good!"
    },
    {
        id: 6,
        oldStatement: "I'm not experienced enough to charge more.",
        newStatement: "Experience isn't just years on paper. My unique background already adds value.",
        buttonText: "Yes ma'am!"
    },
    {
        id: 7,
        oldStatement: "I don't see myself in a high-paying role.",
        newStatement: "Undervaluing myself was part of the dance world's culture. That doesn't have to be my future.",
        buttonText: "Onwards and upwards!"
    }
];

interface KnowYourValueProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function KnowYourValue({ onComplete, onBack }: KnowYourValueProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewStatement, setShowNewStatement] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('money-mindsets');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('money-mindsets');

    // Enhanced animation values with useRef for better performance
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

    const handleContinueToKnowYourValue = () => {
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
            setShowNewStatement(true);
            // FIX: Use functional update to get the current value
            setScreenHistory(prev => [...prev, { pairIndex: currentPairIndex, showNew: true }]);
        });
    }, [currentPairIndex, flipAnim, cardScale, fadeAnim]);

    const handleContinue = useCallback(() => {
        if (showNewStatement) {
            if (currentPairIndex < valuePairs.length - 1) {
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
                    setShowNewStatement(false);

                    // Animate in the next card with a slight delay
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.spring(progressAnim, {
                                toValue: (newPairIndex + 1) / valuePairs.length,
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
    }, [showNewStatement, currentPairIndex, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

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
            setShowNewStatement(false);
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
            setShowNewStatement(prevScreen.showNew);
            // Reset flip animation based on whether we're going back to new or old statement
            flipAnim.setValue(prevScreen.showNew ? 1 : 0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    const handleOpenEbook = () => {
        Linking.openURL('https://pivotfordancers.com/products/how-to-pivot/');
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
            toValue: (currentPairIndex + 1) / valuePairs.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentPairIndex]);

    // NEW: Intro Screen with Morning Journal
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

                            <Text style={commonStyles.introTitle}>Know Your Value</Text>
                            <Text style={commonStyles.introDescription}>
                                You're doing incredible work digging into your money mindset. This isn't easy, but you're showing up and doing the work. Let's continue building that foundation of self-worth.
                            </Text>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Know Your Value"
                                journalInstruction="Before we begin, take a moment to reflect on your current relationship with money and self-worth. What comes up for you?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's go" onPress={handleContinueToKnowYourValue} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Know Your Value Intro Screen
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

                            <Text style={styles.introTitle}>Know Your Value</Text>
                            <Text style={styles.introDescription}>
                                In dance, it's common to be underpaid or told you should "do it for exposure". That conditioning sticks. But your skills are worth real money and you deserve to ask for it.
                            </Text>

                            <PrimaryButton title="Rewrite the story" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Reflection Screen
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
                                <Text style={styles.reflectionTitle}>You Deserve It</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    You've spent years (and maybe decades) delivering excellence for less than you're worth. That doesn't mean you're 'worthless', it means the system was broken.
                                </Text>
                                <Text style={commonStyles.reflectionDescription}>
                                    From here on, you get to set new standards for yourself. Advocate, negotiate, and expect more. You deserve it.
                                </Text>
                            </View>

                            <View style={styles.ebookCard}>
                                <Text style={styles.ebookTitle}>Hungry for more?</Text>
                                <Text style={styles.ebookDescription}>
                                    Our How to Pivot eBook dives into psychological and philosophical concepts that can guide you through a career change, merging academic insights with real-world experience.
                                </Text>
                                <PrimaryButton
                                    title="Learn More"
                                    onPress={handleOpenEbook}
                                    variant="secondary"
                                />
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

    // Final Screen (Updated with End of Day Journal)
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
                                <Text style={commonStyles.finalHeading}>Own Your Worth</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    You've taken powerful steps today to rewrite your money story and recognize your true value. This foundation will serve you in every negotiation and career decision moving forward.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="money-mindsets"
                                day="2"
                                category="finance"
                                pathTitle="Money Mindsets"
                                dayTitle="Know Your Value"
                                journalInstruction="Reflect on today's exercise. What new insights do you have about your worth? How will you carry this forward?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for more money mindset work!
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

    // Statement Screens
    const currentPair = valuePairs[currentPairIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentPairIndex + 1} of ${valuePairs.length}`}
                progress={(currentPairIndex + 1) / valuePairs.length}
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
                        {/* Front of card (old statement view) */}
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                styles.cardFace,
                                frontAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.scriptLabel}>
                                What I used to say:
                            </Text>

                            <View style={styles.scriptCard}>
                                <View style={styles.oldScriptCard}>
                                    <Text style={styles.oldScriptText}>
                                        "{currentPair.oldStatement}"
                                    </Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title="See the alternative"
                                onPress={handleContinue}
                            />
                        </Animated.View>

                        {/* Back of card (new statement view) */}
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                styles.cardFace,
                                styles.cardBack,
                                backAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.scriptLabel}>
                                What I could say now:
                            </Text>

                            <View style={styles.scriptCard}>
                                <View style={styles.newScriptCard}>
                                    <Text style={styles.newScriptText}>
                                        "{currentPair.newStatement}"
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
    // NEW: Styles for the intro screen
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
    // UPDATED: Flip container and card styles for entire card flip
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
    scriptLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    scriptCard: {
        width: '100%',
        height: 180,
        marginBottom: 40,
    },
    oldScriptCard: {
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
    oldScriptText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 26,
        fontStyle: 'italic',
    },
    newScriptCard: {
        backgroundColor: 'rgba(100,124,144,0.15)',
        borderRadius: 16,
        padding: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newScriptText: {
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
    ebookCard: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
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
});