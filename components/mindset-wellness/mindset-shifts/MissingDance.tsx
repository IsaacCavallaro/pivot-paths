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

interface DanceTip {
    id: number;
    title: string;
    description: string;
    buttonText: string;
}

const danceTips: DanceTip[] = [
    {
        id: 1,
        title: "Create a \"feels like me\" playlist",
        description: "Build a playlist of songs that light you up. They could be tunes from a show you loved or your favorite cast's backstage pump up song. Whenever you need a reminder, blast this playlist to remember, you're still that girl.",
        buttonText: "Cue the playlist!"
    },
    {
        id: 2,
        title: "Move your body!",
        description: "It might seem obvious, but as dancers, we feel best in motion. In your new job, you're likely not moving as much. So whether you take a dance class or find a new workout routine altogether, get moving to feel like yourself again.",
        buttonText: "Get moving!"
    },
    {
        id: 3,
        title: "Find a new creative outlet",
        description: "Obvious choices could be painting or writing, but there are so many ways to explore your creativity that are practical too. Gardening, cooking, and interior design are all new ways to tap into your creative side.",
        buttonText: "The juices are flowing!"
    },
    {
        id: 4,
        title: "Reconnect with dance friends",
        description: "There's no friends like dance friends and even if it feels isolating to pivot, you're really not alone. Schedule a coffee or call with a dance friend you haven't seen in a while.",
        buttonText: "Call her up!"
    },
    {
        id: 5,
        title: "Design a structured routine",
        description: "Former dancers often miss the structure of dance more than anything. Daily, repetitive movements ground us and comfort us. Create a short ritual like a warm-up routine or ballet barre that grounds you.",
        buttonText: "Create routine"
    },
    {
        id: 6,
        title: "Support the arts",
        description: "With your new salary and time off, you probably have more time to actually go support the arts. Warning: The first few times you're in the audience can be triggering. But instead of wishing you were up there, what if you allowed yourself to feel the joy of experiencing art?",
        buttonText: "Support arts"
    },
    {
        id: 7,
        title: "Just dance!",
        description: "It's easy to feel like if you're not dancing professionally that you can't still tap into your dancer side. Stay in class, drop in for a performance if you have time, create your own show.",
        buttonText: "Dance!"
    }
];

interface MissingDanceProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MissingDance({ onComplete, onBack }: MissingDanceProps) {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ tipIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('financial-futureproofing');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStart = () => {
        setScreenHistory([{ tipIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToTips = () => {
        setScreenHistory([{ tipIndex: -3 }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentTipIndex < danceTips.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newTipIndex = currentTipIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentTipIndex(newTipIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newTipIndex + 1) / danceTips.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { tipIndex: newTipIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { tipIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentTipIndex, fadeAnim, progressAnim, scrollToTop]);

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
            setCurrentTipIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.tipIndex === -1 || prevScreen.tipIndex === -2 || prevScreen.tipIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentTipIndex(prevScreen.tipIndex);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
            scrollToTop();
        });
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentTipIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentTipIndex + 1) / danceTips.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentTipIndex]);

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

                            <Text style={commonStyles.introTitle}>Missing Dance?</Text>
                            <Text style={commonStyles.introDescription}>
                                When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="6"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Missing Dance"
                                journalInstruction="Before we begin, take a moment to reflect: What do you miss most about dance, and how has that absence shown up in your life recently?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Begin" onPress={handleContinueToTips} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Tips Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.tipIndex === -3) {
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

                            <Text style={styles.introTitle}>Missing Dance?</Text>
                            <Text style={styles.introDescription}>
                                When you first step away from the stage, chances are, you're going to miss it. Tap through these easy ideas to tap back into your dancer side when you're feeling nostalgic.
                            </Text>

                            <PrimaryButton title="Start Exploring" onPress={handleStart} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen.tipIndex === -2) {
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
                                <Text style={styles.reflectionTitle}>You'll Always Be a Dancer</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    You don't need to abandon dance (even if it sometimes feels like it's abandoning you). You'll always be a dancer, and it's ok to prioritize those little things that help you feel like your dancer self again when you're missing the comforts of your first love.
                                </Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { tipIndex: -1 }]);
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
    if (currentScreen.tipIndex === -1) {
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
                                    Missing dance is a natural part of transitioning away from the stage. The connection you built with movement, creativity, and community doesn't disappear just because your career path has changed. These tips are tools you can return to whenever you need to reconnect with your dancer identity.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="6"
                                category="Mindset and Wellness"
                                pathTitle="Mindset Shifts"
                                dayTitle="Missing Dance"
                                journalInstruction="Reflect on today's practice. Which tip resonated most with you, and how will you incorporate it into your routine when you're missing dance?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for your final step.
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

    // Tip Screens
    const currentTip = danceTips[currentTipIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentTipIndex + 1} of ${danceTips.length}`}
                progress={(currentTipIndex + 1) / danceTips.length}
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
                    <Animated.View style={[styles.tipContainer, { opacity: fadeAnim, transform: [{ scale: cardScale }] }]}>
                        <Card style={styles.tipCard}>
                            <Text style={styles.tipTitle}>{currentTip.title}</Text>

                            <View style={styles.tipContent}>
                                <Text style={styles.tipText}>{currentTip.description}</Text>
                            </View>

                            <PrimaryButton
                                title={currentTip.buttonText}
                                onPress={handleContinue}
                            />
                        </Card>
                    </Animated.View>
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
    // Tip container and card styles
    tipContainer: {
        width: width * 0.85,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipCard: {
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
    },
    tipTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    tipContent: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    tipText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
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