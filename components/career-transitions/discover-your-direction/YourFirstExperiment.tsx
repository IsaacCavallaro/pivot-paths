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

interface ExperimentStep {
    id: number;
    title: string;
    description: string;
    buttonText: string;
}

const experimentSteps: ExperimentStep[] = [
    {
        id: 1,
        title: "Step 1: Choose Your Focus",
        description: "Pick one career idea from your exploration so far. Don't overthink it. Choose the one that excites you most right now.",
        buttonText: "I've chosen my focus"
    },
    {
        id: 2,
        title: "Step 2: Find a Resource",
        description: "Find one free way to step into that world:\n\n• Go down a rabbit hole on YouTube for 30 minutes\n• Read 10 blogs or articles on the role\n• Listen to a podcast by someone in that field",
        buttonText: "I found my resource"
    },
    {
        id: 3,
        title: "Step 3: Set a Small Goal",
        description: "Decide on one tangible thing you will do today:\n\n• Write down 3 job titles in that industry\n• List 3 questions you want answered by an expert\n• Identify one skill you want to try",
        buttonText: "Goal set!"
    },
    {
        id: 4,
        title: "Step 4: Connect With Someone",
        description: "Reach out to one person connected to that career:\n\n• Send a short message to a friend, mentor, or LinkedIn contact\n• Ask about their experience or for a tip to get started",
        buttonText: "Connection made"
    },
    {
        id: 5,
        title: "Step 5: Reflect",
        description: "After completing your experiment, ask yourself:\n\n• What surprised me?\n• What felt exciting or energizing?\n• What felt challenging or uncomfortable?\n\nTake a few minutes to write your observations.",
        buttonText: "I've reflected"
    },
    {
        id: 6,
        title: "Step 6: Decide Next Move",
        description: "Based on what you learned, pick your next small step:\n\n• Repeat a similar experiment (we're building on momentum here!)\n• This time, try a different career idea\n• Or reach deeper into this field with a workshop, class, or volunteer opportunity",
        buttonText: "Next move decided"
    }
];

interface YourFirstExperimentProps {
    onComplete: () => void;
    onBack?: () => void;
}

export default function YourFirstExperiment({ onComplete, onBack }: YourFirstExperimentProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ stepIndex: number }>>([]);

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('your-first-experiment');
    const { addJournalEntry: addReflectionJournalEntry } = useJournaling('your-first-experiment');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartExperiment = () => {
        setScreenHistory([{ stepIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToSteps = () => {
        setScreenHistory([{ stepIndex: -2 }]);
        scrollToTop();
    };

    const handleContinue = useCallback(() => {
        // Fade out current card
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (currentStepIndex < experimentSteps.length - 1) {
                // Move to next step
                const newStepIndex = currentStepIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);
                cardScale.setValue(1);

                // Update state
                setCurrentStepIndex(newStepIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newStepIndex + 1) / experimentSteps.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { stepIndex: newStepIndex }]);
                scrollToTop();
            } else {
                // All steps completed, go to reflection screen
                setScreenHistory(prev => [...prev, { stepIndex: -1 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            }
        });
    }, [currentStepIndex, fadeAnim, cardScale, progressAnim, scrollToTop]);

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
            setCurrentStepIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.stepIndex === -1 || prevScreen.stepIndex === -2) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentStepIndex(prevScreen.stepIndex);
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

    const handleOpenMentorship = () => {
        Linking.openURL('https://pivotfordancers.com/services/mentorship/');
    };

    // Progress animation interpolation
    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // Update progress when currentStepIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentStepIndex + 1) / experimentSteps.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentStepIndex]);

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

                            <Text style={commonStyles.introTitle}>Take the Leap: Your First Career Experiment</Text>
                            <Text style={commonStyles.introDescription}>
                                It's time to put ideas into action. Today, you're going to try one small experiment to explore a career you're curious about. The goal isn't perfection… it's discovery.
                            </Text>

                            <JournalEntrySection
                                pathTag="map-your-direction"
                                day="7"
                                category="Career Transitions"
                                pathTitle="Map Your Direction"
                                dayTitle="Your First Experiment"
                                journalInstruction="Before we begin, what career ideas are you most excited to explore through this experiment?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's experiment" onPress={handleContinueToSteps} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Experiment Steps Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.stepIndex === -2) {
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

                            <Text style={styles.stepsIntroTitle}>Your Experiment Journey</Text>
                            <Text style={styles.stepsIntroDescription}>
                                Follow these 6 simple steps to conduct your first career experiment. Each step is designed to be completed in a day or less. Remember, the goal is learning, not perfection!
                            </Text>

                            <PrimaryButton title="Start Step 1" onPress={handleStartExperiment} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Reflection Screen (after completing all steps)
    if (currentScreen.stepIndex === -1) {
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
                                <Text style={commonStyles.finalHeading}>Make Progress Every Day</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    Every big career change starts with small daily experiments. You don't need to know everything today. The goal is to learn, test, and explore, one step at a time.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="your-first-experiment"
                                journalInstruction="Reflect on your experiment experience. What did you learn? What surprised you? What would you do differently next time?"
                                moodLabel=""
                                saveButtonText="Save Reflection"
                            />

                            {/* Mentorship CTA */}
                            <View style={styles.mentorshipCard}>
                                <Text style={styles.mentorshipTitle}>Want more Support?</Text>
                                <Text style={styles.mentorshipDescription}>
                                    Our mentorship program provides personalized guidance from experienced former professional dancers who understand your unique journey.
                                </Text>
                                <PrimaryButton
                                    title="Learn More"
                                    onPress={handleOpenMentorship}
                                    variant="secondary"
                                />
                            </View>

                            <Text style={styles.alternativeClosing}>
                                Great work on completing your first experiment!
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

    // Step Screens
    const currentStep = experimentSteps[currentStepIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`Step ${currentStepIndex + 1} of ${experimentSteps.length}`}
                progress={(currentStepIndex + 1) / experimentSteps.length}
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
                            styles.stepCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: cardScale }]
                            }
                        ]}
                    >
                        <Text style={styles.scriptLabel}>{currentStep.title}</Text>

                        <View style={styles.stepContentCard}>
                            <Text style={styles.stepText}>{currentStep.description}</Text>
                        </View>

                        <PrimaryButton
                            title={currentStep.buttonText}
                            onPress={handleContinue}
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    stepCard: {
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
        marginVertical: 20,
    },
    stepsIntroTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 34,
    },
    stepsIntroDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#746C70',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    scriptLabel: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 20,
        color: '#4E4F50',
        textAlign: 'center',
        marginBottom: 30,
    },
    stepContentCard: {
        backgroundColor: 'rgba(146,132,144,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 40,
        borderLeftWidth: 4,
        borderLeftColor: '#928490',
        width: '100%',
    },
    stepText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 24,
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
    mentorshipCard: {
        backgroundColor: 'rgba(100, 124, 144, 0.1)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        borderLeftWidth: 4,
        borderLeftColor: '#647C90',
        width: '100%',
        alignItems: 'center',
    },
    mentorshipTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 18,
        color: '#647C90',
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '700',
    },
    mentorshipDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#4E4F50',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
});