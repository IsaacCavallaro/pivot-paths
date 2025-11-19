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

interface ScriptPair {
    id: number;
    oldScript: string;
    newScript: string;
    buttonText: string;
}

const scriptPairs: ScriptPair[] = [
    {
        id: 1,
        oldScript: "I've spent my whole life training and performing as a dancer.",
        newScript: "I worked in the highly competitive dance industry where discipline, teamwork, and constant feedback are part of the job. It's taught me how to perform under pressure and deliver results consistently.",
        buttonText: "See the difference?"
    },
    {
        id: 2,
        oldScript: "I'm used to memorizing choreography quickly.",
        newScript: "I'm a fast learner who can absorb complex information and apply it immediately, whether that's a new system, process, or way of working.",
        buttonText: "Nice!"
    },
    {
        id: 3,
        oldScript: "I'm comfortable performing on stage.",
        newScript: "I'm confident presenting ideas, speaking in front of groups, and adapting to high-stakes situations with professionalism.",
        buttonText: "Look at those transferable skills!"
    },
    {
        id: 4,
        oldScript: "I've done a lot of auditions, so I'm used to rejection.",
        newScript: "I'm resilient. I can take feedback, stay motivated, and keep improving… qualities that help me persist through challenges at work.",
        buttonText: "Ok, she's evolving!"
    },
    {
        id: 5,
        oldScript: "I've always worked in dance companies.",
        newScript: "In the dance companies I performed with, collaboration, trust, and communication were essential for success.",
        buttonText: "Look at you!"
    },
    {
        id: 6,
        oldScript: "I'm totally dedicated to dance.",
        newScript: "I'm committed and passionate. When I take on a role or a project, I give it my complete focus and follow through until it's done.",
        buttonText: "You're in your growth era!"
    },
    {
        id: 7,
        oldScript: "I was a dance teacher while performing.",
        newScript: "I have experience leading groups, explaining complex concepts in simple ways, and motivating people to reach their goals. These skills translate directly into leadership and communication in any setting.",
        buttonText: "We love that skill translation!"
    }
];

interface TalkTheTalkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function TalkTheTalk({ onComplete, onBack }: TalkTheTalkProps) {
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNewScript, setShowNewScript] = useState(false);
    const [screenHistory, setScreenHistory] = useState<Array<{ pairIndex: number, showNew: boolean }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('prep-your-pivot');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('prep-your-pivot');

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

    const handleContinueToTalkTheTalk = () => {
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
            setShowNewScript(true);
            // FIX: Use functional update to get the current value
            setScreenHistory(prev => [...prev, { pairIndex: currentPairIndex, showNew: true }]);
        });
    }, [currentPairIndex, flipAnim, cardScale, fadeAnim]);

    const handleContinue = useCallback(() => {
        if (showNewScript) {
            if (currentPairIndex < scriptPairs.length - 1) {
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
                    setShowNewScript(false);

                    // Animate in the next card with a slight delay
                    setTimeout(() => {
                        Animated.parallel([
                            Animated.timing(fadeAnim, {
                                toValue: 1,
                                duration: 300,
                                useNativeDriver: true,
                            }),
                            Animated.spring(progressAnim, {
                                toValue: (newPairIndex + 1) / scriptPairs.length,
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
    }, [showNewScript, currentPairIndex, flipCard, fadeAnim, flipAnim, cardScale, progressAnim, scrollToTop]);

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
            setShowNewScript(false);
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
            setShowNewScript(prevScreen.showNew);
            // Reset flip animation based on whether we're going back to new or old script
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
            toValue: (currentPairIndex + 1) / scriptPairs.length,
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

                            <Text style={commonStyles.introTitle}>Talk the Talk</Text>
                            <Text style={commonStyles.introDescription}>
                                When it comes to interviewing and networking, it can come down to learning how to "talk the talk" in a way the outside world understands. Capitalize on your dance experience by talking about it in muggle terms.
                            </Text>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="3"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Talk The Talk"
                                journalInstruction="Before we begin, let's take a moment to check in with yourself. How are you feeling about learning to translate your dance experience?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's go" onPress={handleContinueToTalkTheTalk} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Talk the Talk Intro Screen
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

                            <Text style={styles.introTitle}>Talk the Talk</Text>
                            <Text style={styles.introDescription}>
                                Employers and hiring managers are looking for transferable strengths they can immediately recognize. The more you learn to "speak their language", the more doors you open.
                            </Text>

                            <PrimaryButton title="Start Learning" onPress={handleStartGame} />
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
                                <Text style={styles.reflectionTitle}>Mastering Interview Language</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Learning to translate your dance experience into business language is a skill that takes practice. Remember that every interview and networking conversation is an opportunity to refine your message.
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
                                <Text style={commonStyles.finalHeading}>Can you "talk the talk"?</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Employers and hiring managers are looking for transferable strengths they can immediately recognize. The more you learn to "speak their language", the more doors you open.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="prep-your-pivot"
                                day="3"
                                category="Career Transitions"
                                pathTitle="Prep Your Pivot"
                                dayTitle="Talk The Talk"
                                journalInstruction="Write down your own translations for your dance experience. What specific skills from your dance career can you articulate in business terms?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                Let's keep going. See you here again tomorrow.
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

    // Script Screens
    const currentPair = scriptPairs[currentPairIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentPairIndex + 1} of ${scriptPairs.length}`}
                progress={(currentPairIndex + 1) / scriptPairs.length}
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
                        {/* Front of card (old script view) */}
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
                                        "{currentPair.oldScript}"
                                    </Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title="See the alternative"
                                onPress={handleContinue}
                            />
                        </Animated.View>

                        {/* Back of card (new script view) */}
                        <Animated.View
                            style={[
                                styles.choiceCard,
                                styles.cardFace,
                                styles.cardBack,
                                backAnimatedStyle,
                            ]}
                        >
                            <Text style={styles.scriptLabel}>
                                What I could say instead:
                            </Text>

                            <View style={styles.scriptCard}>
                                <View style={styles.newScriptCard}>
                                    <Text style={styles.newScriptText}>
                                        "{currentPair.newScript}"
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
});