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

interface CuriosityCard {
    id: number;
    prompt: string;
    buttonText: string;
}

const curiosityCards: CuriosityCard[] = [
    {
        id: 1,
        prompt: "Think of a career you've admired from afar. What is it about this role that catches your attention?",
        buttonText: "Write it down"
    },
    {
        id: 2,
        prompt: "If you could spend one day in someone else's job, who would it be and why?",
        buttonText: "Think about it"
    },
    {
        id: 3,
        prompt: "What tasks or activities make time fly for you? Could these appear in a career?",
        buttonText: "Let's reflect"
    },
    {
        id: 4,
        prompt: "Imagine a time when you felt fully confident. What environment, people, and responsibilities helped create that confidence?",
        buttonText: "Hmm… interesting"
    },
    {
        id: 5,
        prompt: "Pick an industry you know nothing about. What's one question you'd ask someone working there to learn more?",
        buttonText: "Start asking"
    },
    {
        id: 6,
        prompt: "Think about a problem you enjoyed solving in your dance career. Could that same mindset apply in another context?",
        buttonText: "Do some reflection"
    },
    {
        id: 7,
        prompt: "Who do you know with a career you're curious about? What would you want to ask them if you had 15 minutes?",
        buttonText: "Get thinking"
    },
    {
        id: 8,
        prompt: "If you had unlimited time for learning, what skill or craft would you dive into next?",
        buttonText: "Let's learn"
    },
    {
        id: 9,
        prompt: "Picture your ideal workday five years from now. What are three things you'd do that excite you most?",
        buttonText: "Sounds good!"
    }
];

interface SparkCuriosityProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function SparkCuriosity({ onComplete, onBack }: SparkCuriosityProps) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ cardIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry } = useJournaling('spark-curiosity');

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

    const handleContinueToCuriosity = () => {
        setScreenHistory([{ cardIndex: -3, showNew: false }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        if (currentCardIndex < curiosityCards.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newCardIndex = currentCardIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentCardIndex(newCardIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newCardIndex + 1) / curiosityCards.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { cardIndex: newCardIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to reflection screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { cardIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentCardIndex, fadeAnim, progressAnim, scrollToTop]);

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
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.cardIndex === -1 || prevScreen.cardIndex === -2 || prevScreen.cardIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
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
            toValue: (currentCardIndex + 1) / curiosityCards.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentCardIndex]);

    // Intro Screen with Journal
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

                            <Text style={commonStyles.introTitle}>Welcome to Your Curiosity Journey</Text>
                            <Text style={commonStyles.introDescription}>
                                Before we begin exploring new possibilities, let's check in with where you are right now. This will help us track your progress and reflections.
                            </Text>

                            <JournalEntrySection
                                pathTag="spark-curiosity"
                                journalInstruction="How are you feeling about exploring new career possibilities right now? What hopes or concerns come to mind?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Continue to Curiosity" onPress={handleContinueToCuriosity} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Curiosity Intro Screen
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

                            <Text style={styles.introTitle}>Spark Curiosity</Text>
                            <Text style={styles.introDescription}>
                                Curiosity is the engine of your pivot. Today we're here to spark new ideas, help you explore untapped careers, and uncover possibilities you might not have considered.
                            </Text>
                            <Text style={styles.introDescription}>
                                Swipe through each card, reflect, and take note of what excites you.
                            </Text>

                            <PrimaryButton title="Let's go" onPress={handleStartGame} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen
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
                                <Text style={styles.reflectionTitle}>Cultivating Your Curiosity</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    You've taken an important step by exploring these curiosity prompts. The questions that resonated with you today are clues to what might truly excite you in your next chapter.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="spark-curiosity"
                                journalInstruction="Which curiosity prompts stood out to you the most? What new possibilities or ideas did they spark?"
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

    // Final Screen
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
                                <Text style={commonStyles.finalHeading}>It's Time to Reflect</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Exploring your curiosity doesn't mean you have to have all the answers right now. Each question is a doorway to possibilities, and the more you engage with them, the clearer your path becomes.
                                </Text>
                                <Text style={commonStyles.finalText}>
                                    Take note of anything that excites you. You'll come back to it as you explore career options in the coming days.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="spark-curiosity"
                                journalInstruction="Based on today's exploration, what's one small step you could take to follow your curiosity this week?"
                                moodLabel=""
                                saveButtonText="Save Action Step"
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

    // Card Screens
    const currentCard = curiosityCards[currentCardIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentCardIndex + 1} of ${curiosityCards.length}`}
                progress={(currentCardIndex + 1) / curiosityCards.length}
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
                            styles.choiceCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: cardScale }]
                            }
                        ]}
                    >
                        <View style={styles.curiosityCard}>
                            <Text style={styles.curiosityText}>
                                "{currentCard.prompt}"
                            </Text>
                        </View>

                        <PrimaryButton
                            title={currentCard.buttonText}
                            onPress={handleContinue}
                        />
                    </Animated.View>
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
        marginBottom: 16,
    },
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
    curiosityCard: {
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
    curiosityText: {
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