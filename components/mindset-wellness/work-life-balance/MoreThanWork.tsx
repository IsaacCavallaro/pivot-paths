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

interface Activity {
    id: number;
    question: string;
    buttonText: string;
}

const activities: Activity[] = [
    {
        id: 1,
        question: "Who's someone you've shown up for recently, or who's shown up for you?",
        buttonText: "Send them a 'thinking of you' message"
    },
    {
        id: 2,
        question: "Where do you feel a sense of belonging outside of work?",
        buttonText: "Show up in that space this week"
    },
    {
        id: 3,
        question: "How do you move your body now that feels good… not to perform, but for just you?",
        buttonText: "Schedule it in"
    },
    {
        id: 4,
        question: "Dance let you tell stories. How else can you share your perspective?",
        buttonText: "Write down 5 ideas"
    },
    {
        id: 5,
        question: "What's the last thing you made that wasn't work-related?",
        buttonText: "Block out 30 minutes to create something"
    },
    {
        id: 6,
        question: "What topic or skill excites your curiosity right now?",
        buttonText: "Find a podcast to explore it today"
    },
    {
        id: 7,
        question: "What vision or idea has been floating around in your mind lately?",
        buttonText: "Map it out"
    },
    {
        id: 8,
        question: "When was the last time you tried something brand new?",
        buttonText: "Pick a new hobby to try this week"
    }
];

interface MoreThanWorkProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function MoreThanWork({ onComplete, onBack }: MoreThanWorkProps) {
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ activityIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('financial-futureproofing');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('financial-futureproofing');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartActivity = () => {
        setScreenHistory([{ activityIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToActivities = () => {
        setScreenHistory([{ activityIndex: -3 }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentActivityIndex < activities.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newActivityIndex = currentActivityIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentActivityIndex(newActivityIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newActivityIndex + 1) / activities.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { activityIndex: newActivityIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { activityIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentActivityIndex, fadeAnim, progressAnim, scrollToTop]);

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
            setCurrentActivityIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.activityIndex === -1 || prevScreen.activityIndex === -2 || prevScreen.activityIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentActivityIndex(prevScreen.activityIndex);
            // Reset animations
            fadeAnim.setValue(0);
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

    // Update progress when currentActivityIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentActivityIndex + 1) / activities.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentActivityIndex]);

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

                            <Text style={commonStyles.introTitle}>More Than Your Work</Text>
                            <Text style={commonStyles.introDescription}>
                                As a dancer, you lived and breathed it. We all did! But now, we're going to do things differently. Of course, we hope you find meaningful work off the stage. But we also want to make sure you're still *you,* in ways that have nothing to do with your job. Here are some action ideas to remind you that you're more than work.
                            </Text>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="3"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="More Than Work"
                                journalInstruction="Before we begin, take a moment to reflect: How do you currently define yourself outside of your work identity?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Start" onPress={handleContinueToActivities} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Activities Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.activityIndex === -3) {
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

                            <Text style={styles.introTitle}>Discover Your Whole Self</Text>
                            <Text style={styles.introDescription}>
                                Let's explore the many facets that make you who you are beyond your professional identity. These activities will help you reconnect with the parts of yourself that exist outside of work.
                            </Text>

                            <PrimaryButton title="Begin Activities" onPress={handleStartActivity} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
    if (currentScreen.activityIndex === -2) {
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
                                <Text style={styles.reflectionTitle}>You're So Much More</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    You're more than a dancer and you're more than the work you do next. You're a friend, a learner, a dreamer, an explorer, and so much more. Let these roles remind you that balance is about honoring *all parts of you*.
                                </Text>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { activityIndex: -1 }]);
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
    if (currentScreen.activityIndex === -1) {
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
                                <Text style={commonStyles.finalHeading}>Honor All Parts of You</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Remember that your worth isn't tied to your productivity or job title. The activities you explored today are reminders that you contain multitudes - each one a valuable part of your complete identity.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="financial-futureproofing"
                                day="3"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="More Than Work"
                                journalInstruction="Reflect on today's activities. Which parts of yourself felt most alive? How can you continue to nurture these aspects of your identity?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow.
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

    // Activity Screens
    const currentActivity = activities[currentActivityIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentActivityIndex + 1} of ${activities.length} activities`}
                progress={(currentActivityIndex + 1) / activities.length}
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
                    <Animated.View
                        style={[
                            styles.activityCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: cardScale }]
                            }
                        ]}
                    >
                        <Text style={styles.activityQuestion}>{currentActivity.question}</Text>

                        <PrimaryButton
                            title={currentActivity.buttonText}
                            onPress={handleContinue}
                        />
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
    // Activity card styles
    activityCard: {
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
    activityQuestion: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 24,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 32,
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
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
});