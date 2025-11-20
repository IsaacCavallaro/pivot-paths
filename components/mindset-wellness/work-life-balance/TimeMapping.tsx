import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView, Image } from 'react-native';

import { useScrollToTop } from '@/utils/hooks/useScrollToTop';
import { useJournaling } from '@/utils/hooks/useJournaling';
import { StickyHeader } from '@/utils/ui-components/StickyHeader';
import { PrimaryButton } from '@/utils/ui-components/PrimaryButton';
import { JournalEntrySection } from '@/utils/ui-components/JournalEntrySection';
import { Card } from '@/utils/ui-components/Card';
import { commonStyles } from '@/utils/styles/commonStyles';

const { width } = Dimensions.get('window');

interface TimeChoice {
    id: number;
    question: string;
    option1: string;
    option2: string;
    resultKey: string;
}

interface TimeMappingProps {
    onComplete: () => void;
    onBack?: () => void;
}

const timeChoices: TimeChoice[] = [
    {
        id: 1,
        question: 'I feel most focused…',
        option1: 'In the morning',
        option2: 'In the evening',
        resultKey: 'focusTime'
    },
    {
        id: 2,
        question: 'I prefer to move by doing…',
        option1: 'A structured workout',
        option2: 'A walk or casual activity',
        resultKey: 'movement'
    },
    {
        id: 3,
        question: 'When it comes to hobbies, I like…',
        option1: 'Creative, expressive things',
        option2: 'Quiet, reflective things',
        resultKey: 'hobbies'
    },
    {
        id: 4,
        question: 'For social time, I prefer…',
        option1: 'Small group / 1:1 connections',
        option2: 'Larger gatherings & events',
        resultKey: 'social'
    },
    {
        id: 5,
        question: 'On weekends, I want…',
        option1: 'Rest + reset',
        option2: 'Adventure + activities',
        resultKey: 'weekends'
    },
    {
        id: 6,
        question: 'For winding down at night, I\'d rather…',
        option1: 'Something calming (journaling, stretching)',
        option2: 'Something light (knitting, games)',
        resultKey: 'windDown'
    }
];

export default function TimeMapping({ onComplete, onBack }: TimeMappingProps) {
    const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
    const [screenHistory, setScreenHistory] = useState<Array<{ choiceIndex: number }>>([]);
    const [choices, setChoices] = useState<{ [key: string]: string }>({});

    const { scrollViewRef, scrollToTop } = useScrollToTop();
    const { addJournalEntry: addMorningJournalEntry } = useJournaling('work-life-balance');
    const { addJournalEntry: addEndOfDayJournalEntry } = useJournaling('work-life-balance');

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        }
    }, [onBack]);

    const handleStartPlanning = () => {
        setScreenHistory([{ choiceIndex: 0 }]);
        scrollToTop();
    };

    const handleContinueToChoices = () => {
        setScreenHistory([{ choiceIndex: -3 }]);
        scrollToTop();
    };

    const handleChoice = useCallback((choiceKey: string, selectedOption: string) => {
        const newChoices = { ...choices, [choiceKey]: selectedOption };
        setChoices(newChoices);

        if (currentChoiceIndex < timeChoices.length - 1) {
            // Fade out current card
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                const newChoiceIndex = currentChoiceIndex + 1;

                // Reset animations BEFORE updating state
                fadeAnim.setValue(0);

                // Update state
                setCurrentChoiceIndex(newChoiceIndex);

                // Animate in the next card with a slight delay
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(progressAnim, {
                            toValue: (newChoiceIndex + 1) / timeChoices.length,
                            tension: 50,
                            friction: 7,
                            useNativeDriver: false,
                        })
                    ]).start();
                }, 50);

                setScreenHistory(prev => [...prev, { choiceIndex: newChoiceIndex }]);
                scrollToTop();
            });
        } else {
            // Smooth transition to results screen
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setScreenHistory(prev => [...prev, { choiceIndex: -2 }]);
                fadeAnim.setValue(1);
                scrollToTop();
            });
        }
    }, [currentChoiceIndex, choices, fadeAnim, progressAnim, scrollToTop]);

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
            setCurrentChoiceIndex(0);
            fadeAnim.setValue(1);
            cardScale.setValue(1);
            scrollToTop();
            return;
        }

        const newHistory = [...screenHistory];
        newHistory.pop();
        setScreenHistory(newHistory);

        const prevScreen = newHistory[newHistory.length - 1];
        if (prevScreen.choiceIndex === -1 || prevScreen.choiceIndex === -2 || prevScreen.choiceIndex === -3) {
            return;
        }

        // Animate the transition back
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setCurrentChoiceIndex(prevScreen.choiceIndex);
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

    // Update progress when currentChoiceIndex changes
    React.useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentChoiceIndex + 1) / timeChoices.length,
            tension: 50,
            friction: 7,
            useNativeDriver: false,
        }).start();
    }, [currentChoiceIndex]);

    const getResultText = () => {
        const focusTime = choices.focusTime;
        const movement = choices.movement;
        const hobbies = choices.hobbies;
        const social = choices.social;
        const weekends = choices.weekends;
        const windDown = choices.windDown;

        return {
            weekdayMorning: focusTime === 'In the morning'
                ? 'Deep-focus work, project planning, or study'
                : 'Slow start with coffee, errands, and admin tasks',
            weekdayMidday: movement === 'A structured workout'
                ? 'Quick 30-min workout'
                : 'Go for a walk or do a quick stretch',
            weekdayAfternoon: focusTime === 'In the morning'
                ? 'Team meetings or admin work'
                : 'Deep-focus work, creative projects, or study',
            weekdayEvening: hobbies === 'Creative, expressive things'
                ? 'Hobbies like painting or music practice'
                : 'Hobbies like journaling or reading',
            weekdayBed: windDown === 'Something calming (journaling, stretching)'
                ? 'Calming wind-down routine with yoga or reading'
                : 'Light wind down activities like board games or knitting',
            weekendMorning: focusTime === 'In the morning'
                ? 'Light movement like a pilates/barre class'
                : 'Sleep in for a relaxed start',
            weekendDaytime: weekends === 'Rest + reset'
                ? 'Errands, creative time, or coffee with a close friend'
                : 'Hiking, a day trip, or exploring a new cafe',
            weekendEvening: social === 'Small group / 1:1 connections'
                ? 'Movie or a quiet dinner'
                : 'Dinner out with friends',
            weekendNight: focusTime === 'In the morning'
                ? 'Early wind-down to recharge'
                : 'Flexible bed time, riding the energy wave'
        };
    };

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

                            <Text style={commonStyles.introTitle}>Plan Your Ideal Week</Text>
                            <Text style={commonStyles.introDescription}>
                                Choose the option that feels best to you and create a balanced schedule for work, hobbies, and rest.
                            </Text>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="5"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Time Mapping"
                                journalInstruction="Before we begin, take a moment to reflect: What does your ideal week look like currently? What would you like to change?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <PrimaryButton title="Let's Start Planning" onPress={handleContinueToChoices} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Planning Intro Screen
    const currentScreen = screenHistory[screenHistory.length - 1];
    if (currentScreen.choiceIndex === -3) {
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

                            <Text style={styles.introTitle}>Design Your Weekly Rhythm</Text>
                            <Text style={styles.introDescription}>
                                Let's create a schedule that works with your natural energy patterns and personal preferences. You'll answer a few questions about your ideal timing for different activities.
                            </Text>

                            <PrimaryButton title="Begin Planning" onPress={handleStartPlanning} />
                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }

    // Results Screen
    if (currentScreen.choiceIndex === -2) {
        const results = getResultText();

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
                                <Text style={styles.resultsTitle}>Your Ideal Weekly Rhythm</Text>
                            </View>

                            <View style={commonStyles.reflectionIntro}>
                                <Text style={commonStyles.reflectionDescription}>
                                    Based on your preferences, here's a suggested weekly schedule that aligns with your natural energy patterns and personal style.
                                </Text>
                            </View>

                            <View style={styles.scheduleSection}>
                                <Text style={styles.scheduleHeading}>Monday–Friday</Text>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Morning:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekdayMorning}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Midday:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekdayMidday}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Afternoon:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekdayAfternoon}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Evening:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekdayEvening}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Before Bed:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekdayBed}</Text>
                                </View>
                            </View>

                            <View style={styles.scheduleSection}>
                                <Text style={styles.scheduleHeading}>Saturday–Sunday</Text>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Morning:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekendMorning}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Daytime:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekendDaytime}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Evening:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekendEvening}</Text>
                                </View>
                                <View style={styles.scheduleItem}>
                                    <Text style={styles.scheduleTime}>Night:</Text>
                                    <Text style={styles.scheduleActivity}>{results.weekendNight}</Text>
                                </View>
                            </View>

                            <PrimaryButton
                                title="Continue"
                                onPress={() => {
                                    setScreenHistory(prev => [...prev, { choiceIndex: -1 }]);
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
    if (currentScreen.choiceIndex === -1) {
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
                                <Text style={commonStyles.finalHeading}>Your Day, Your Terms</Text>
                            </View>

                            <View style={commonStyles.finalTextContainer}>
                                <Text style={commonStyles.finalText}>
                                    One of the best parts of stepping away from dance is finally gaining control of your day.
                                    But there's no perfect schedule. What matters is that it reflects you… your energy,
                                    your priorities, and your personality.
                                </Text>

                                <Text style={commonStyles.finalText}>
                                    Even small shifts can make your days feel more aligned. Keep experimenting until your
                                    week feels like it's working for you… not the other way around.
                                </Text>
                            </View>

                            <JournalEntrySection
                                pathTag="work-life-balance"
                                day="5"
                                category="Mindset and Wellness"
                                pathTitle="Work Life Balance"
                                dayTitle="Time Mapping"
                                journalInstruction="Reflect on your ideal schedule. What feels most aligned with your natural rhythms? What adjustments will you make to your current routine?"
                                moodLabel=""
                                saveButtonText="Save Entry"
                            />

                            <Text style={styles.alternativeClosing}>
                                See you tomorrow for the next step!
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

    // Choice Screens
    const currentChoice = timeChoices[currentChoiceIndex];

    return (
        <View style={commonStyles.container}>
            <StickyHeader
                onBack={goBack}
                title={`${currentChoiceIndex + 1} of ${timeChoices.length}`}
                progress={(currentChoiceIndex + 1) / timeChoices.length}
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
                        <Text style={styles.choiceQuestion}>{currentChoice.question}</Text>

                        <View style={styles.choiceButtons}>
                            <PrimaryButton
                                title={currentChoice.option1}
                                onPress={() => handleChoice(currentChoice.resultKey, currentChoice.option1)}
                                variant="secondary"
                                style={styles.choiceButton}
                            />

                            <PrimaryButton
                                title={currentChoice.option2}
                                onPress={() => handleChoice(currentChoice.resultKey, currentChoice.option2)}
                                variant="secondary"
                                style={styles.choiceButton}
                            />
                        </View>
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
    // Choice card styles
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
    // Results styles
    resultsTitle: {
        fontFamily: 'Merriweather-Bold',
        fontSize: 28,
        color: '#647C90',
        textAlign: 'center',
        fontWeight: '700',
    },
    scheduleSection: {
        marginBottom: 30,
        width: '100%',
    },
    scheduleHeading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: '#4E4F50',
        marginBottom: 16,
    },
    scheduleItem: {
        marginBottom: 16,
    },
    scheduleTime: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: '#647C90',
        marginBottom: 4,
    },
    scheduleActivity: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#4E4F50',
        lineHeight: 22,
    },
    // Icon styles
    planningIcon: {
        fontSize: 48,
        textAlign: 'center',
    },
    finalIcon: {
        fontSize: 56,
        textAlign: 'center',
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
});