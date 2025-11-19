import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Animated } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width, height } = Dimensions.get('window');

interface ActionCard {
    id: number;
    action: string;
    buttonText: string;
}

const actionCards: ActionCard[] = [
    {
        id: 1,
        action: "Send one LinkedIn connection request to someone you admire",
        buttonText: "Sent!"
    },
    {
        id: 2,
        action: "Research one course, workshop, or webinar in a field that interests you",
        buttonText: "Done!"
    },
    {
        id: 3,
        action: "Write a 3-line elevator pitch about your skills and experience",
        buttonText: "Nailed it!"
    },
    {
        id: 4,
        action: "Reach out to a friend or former colleague to ask about their career path",
        buttonText: "Sent!"
    },
    {
        id: 5,
        action: "Ask someone for a small feedback or advice session",
        buttonText: "Asked!"
    },
    {
        id: 6,
        action: "Volunteer for a project in your community",
        buttonText: "Done!"
    },
    {
        id: 7,
        action: "Make a list of 3 potential roles or industries you'd like to explore",
        buttonText: "Got it!"
    },
    {
        id: 8,
        action: "Comment on a LinkedIn post or join a discussion in an online community",
        buttonText: "Posted!"
    },
    {
        id: 9,
        action: "Spend 15 minutes practicing or trying a new skill",
        buttonText: "Yes!"
    },
    {
        id: 10,
        action: "Reflect for 5 minutes: what's one small step you can take right now?",
        buttonText: "Start now"
    }
];

interface JustStartProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function JustStart({ onComplete, onBack }: JustStartProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);
    const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('upskilling-pathfindner');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartGame = () => {
        setScreenHistory([{ cardIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToActions = () => {
        setScreenHistory([{ cardIndex: -3 }]);
        scrollToTop();
    };

    const handleCardComplete = useCallback(() => {
        const newCompletedCards = new Set(completedCards);
        newCompletedCards.add(currentCardIndex);
        setCompletedCards(newCompletedCards);

        // Fade out animation
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (currentCardIndex < actionCards.length - 1) {
                // Move to next card
                const newCardIndex = currentCardIndex + 1;

                // Reset animations before updating state
                fadeAnim.setValue(0);
                cardScale.setValue(1);

                // Update state
                setCurrentCardIndex(newCardIndex);
                setScreenHistory(prev => [...prev, { cardIndex: newCardIndex }]);

                // Animate in the next card
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newCardIndex + 1) / actionCards.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                scrollToTop();
            } else {
                // All cards completed, go to final screen
                setScreenHistory(prev => [...prev, { cardIndex: -1 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            }
        });
    }, [currentCardIndex, completedCards, fadeAnim, cardScale, progressAnim, scrollToTop]);

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
            setCurrentCardIndex(0);
            setCompletedCards(new Set());
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        // Remove current screen from history
        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        // Get previous screen state
        const prevScreen = newHistory[newHistory.length - 1];

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (prevScreen.cardIndex === -1 || prevScreen.cardIndex === -2 || prevScreen.cardIndex === -3) {
                return;
            }

            setCurrentCardIndex(prevScreen.cardIndex);
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

    // Update progress when currentCardIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentCardIndex + 1) / actionCards.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentCardIndex]);

    // NEW: Intro Screen with Journal
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

                            <Text style={commonStyles.introTitle}>You're Almost There!</Text>
                            <Text style={commonStyles.introDescription}>
                                You've made it to the final day of this path! Today is all about taking action - no matter how small. Each step forward builds momentum and brings you closer to your goals.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfindner"
                                day="7"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Just Start"
                                journalInstruction="Before we begin, what's one thing you're excited to explore or learn more about?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's begin" onPress={handleContinueToActions} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Just Start Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.cardIndex === -3) {
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

                            <Text style={styles.introTitle}>Just Start</Text>
                            <Text style={styles.introDescription}>
                                Swipe through each card and commit to doing it today. Even small actions count. The goal isn't perfection - it's momentum. Pick what feels achievable and take that first step.
                            </Text>

                            <PrimaryButton title="Get started" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // NEW: Reflection Screen
    if (currentScreen.cardIndex === -2) {
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
                                <Text style={styles.reflectionTitle}>Building Momentum</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Taking consistent action, no matter how small, creates momentum that carries you forward. Remember that every expert was once a beginner, and every successful career transition started with a single step.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="upskilling-pathfindner"
                                day="7"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Just Start"
                                journalInstruction="Reflect on your progress this week. What's one insight you've gained about yourself and your career goals?"
                                moodLabel=""
                                saveButtonText="Save Reflection"
                            />

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { cardIndex: -1 }]);
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
    if (currentScreen.cardIndex === -1) {
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
                                <Text style={commonStyles.finalHeading}>The Time Is Now</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Stop waiting for tomorrow to make a change. Each small action builds momentum toward your pivot. Keep taking steps, even tiny ones, because progress compounds over time. It won't be perfect, it won't be linear, but it can be done.
                                </Text>
                            </View>

                            <Text style={styles.finalClosing}>
                                This is your life. Start now.
                            </Text>

                            <JournalEntrySection
                                pathTag="upskilling-pathfindner"
                                day="7"
                                category="Career Transitions"
                                pathTitle="Upskilling Pathfinder"
                                dayTitle="Just Start"
                                journalInstruction="What's one action you'll commit to taking in the next 24 hours to continue your momentum?"
                                moodLabel=""
                                saveButtonText="Save Commitment"
                            />

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

    // Card Screens
    const currentCard = actionCards[currentCardIndex];
    const isCompleted = completedCards.has(currentCardIndex);

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentCardIndex + 1} of ${actionCards.length}`}
                progress={(currentCardIndex + 1) / actionCards.length}
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
                            styles.cardContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: cardScale }]
                            }
                        ]}
                    >
                        <Card style={commonStyles.baseCard}>
                            <View style={[
                                styles.actionCard,
                                isCompleted && styles.completedCard
                            ]}>
                                <Text style={styles.actionText}>
                                    {currentCard.action}
                                </Text>
                            </View>

                            <View style={styles.navigationDots}>
                                {actionCards.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            index === currentCardIndex && styles.activeDot,
                                            completedCards.has(index) && styles.completedDot
                                        ]}
                                    />
                                ))}
                            </View>

                            <PrimaryButton
                                title={isCompleted ? '✓ ' + currentCard.buttonText : currentCard.buttonText}
                                onPress={handleCardComplete}
                                variant={isCompleted ? 'secondary' : 'primary'}
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
    // Card container
    cardContainer: {
        width: width * 0.85,
    },
    // Action card styles
    actionCard: {
        backgroundColor: 'rgba(146, 132, 144, 0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    completedCard: {
        backgroundColor: 'rgba(90, 125, 123, 0.15)',
        borderLeftColor: '#5A7D7B',
    },
    actionText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 26,
    },
    // Navigation dots
    navigationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(100, 124, 144, 0.3)',
        marginHorizontal: 4,
        marginVertical: 2,
    },
    activeDot: {
        backgroundColor: '#928490',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    completedDot: {
        backgroundColor: '#5A7D7B',
    },
    // Final screen styles
    finalClosing: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    reflectionTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
});